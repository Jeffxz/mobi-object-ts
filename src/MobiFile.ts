/**
 * copied and modified from
 * https://github.com/woshifyz/mobi_reader/blob/master/mobi.js
 */
import MobiBuffer from './MobiBuffer'
import { MOBIHeader, PalmDOCHeader, PDBHeader, RecordInfo } from './Types'

const ab2str = (buf: ArrayBuffer | Uint8Array) => {
  if (buf instanceof ArrayBuffer) {
    buf = new Uint8Array(buf)
  }
  return new TextDecoder('utf-8').decode(buf)
}

const combine_uint8array = (buffers: Uint8Array[]) => {
  let total_size = 0
  for (let i = 0; i < buffers.length; i++) {
    const buffer = buffers[i]
    total_size += buffer.length
  }
  const total_buffer = new Uint8Array(total_size)
  let offset = 0
  for (let i = 0; i < buffers.length; i++) {
    const buffer = buffers[i]
    total_buffer.set(buffer, offset)
    offset += buffer.length
  }
  return total_buffer
}

const uncompression_lz77 = (data: Uint8Array) => {
  const length = data.length
  let offset = 0
  const buffer = new MobiBuffer(data.length)

  while (offset < length) {
    const char = data[offset]
    offset += 1

    if (char == 0) {
      buffer.write(char)
    } else if (char <= 8) {
      for (let i = offset; i < offset + char; i++) {
        buffer.write(data[i])
      }
      offset += char
    } else if (char <= 0x7f) {
      buffer.write(char)
    } else if (char <= 0xbf) {
      const next = data[offset]
      offset += 1
      const distance = (((char << 8) | next) >> 3) & 0x7ff
      const lz_length = (next & 0x7) + 3

      let buffer_size = buffer.size()
      for (let i = 0; i < lz_length; i++) {
        const bufData = buffer.get(buffer_size - distance)
        if (bufData) {
          buffer.write(bufData)
          buffer_size += 1
        }
      }
    } else {
      buffer.write(32)
      buffer.write(char ^ 0x80)
    }
  }
  return buffer
}

class MobiFile {
  view: DataView
  buffer: ArrayBuffer
  offset: number
  header: PDBHeader | null = null
  palm_header: PalmDOCHeader | null = null
  mobi_header: MOBIHeader | null = null
  reclist: RecordInfo[] = []

  constructor(data: ArrayBuffer) {
    this.view = new DataView(data)
    this.buffer = this.view.buffer
    this.offset = 0
  }

  getUint8(): number {
    const v = this.view.getUint8(this.offset)
    this.offset += 1
    return v
  }

  getUint16(): number {
    const v = this.view.getUint16(this.offset)
    this.offset += 2
    return v
  }

  getUint32(): number {
    const v = this.view.getUint32(this.offset)
    this.offset += 4
    return v
  }

  getStr(size: number): string {
    const v = ab2str(this.buffer.slice(this.offset, this.offset + size))
    this.offset += size
    return v
  }

  skip(size: number): void {
    this.offset += size
  }

  setoffset(_of: number): void {
    this.offset = _of
  }

  get_record_extrasize(data: Uint8Array, flags: number): number {
    let pos = data.length - 1
    let extra = 0
    for (let i = 15; i > 0; i--) {
      if (flags & (1 << i)) {
        const res = this.buffer_get_varlen(data, pos)
        const size = res[0]
        const l = res[1]
        pos = res[2]
        pos -= size - l
        extra += size
      }
    }
    if (flags & 1) {
      const a = data[pos]
      extra += (a & 0x3) + 1
    }
    return extra
  }

  buffer_get_varlen(data: Uint8Array, pos: number): [number, number, number] {
    let l = 0
    let size = 0
    let byte_count = 0
    const mask = 0x7f
    const stop_flag = 0x80
    let shift = 0
    for (let i = 0; ; i++) {
      const byte = data[pos]
      size |= (byte & mask) << shift
      shift += 7
      l += 1
      byte_count += 1
      pos -= 1

      const to_stop = byte & stop_flag
      if (byte_count >= 4 || to_stop > 0) {
        break
      }
    }
    return [size, l, pos]
  }

  read_text(): string {
    if (this.palm_header) {
      const text_end = this.palm_header.record_count
      const buffers = []
      for (let i = 1; i <= text_end; i++) {
        buffers.push(this.read_text_record(i))
      }
      const all = combine_uint8array(buffers)
      return ab2str(all)
    } else {
      return ''
    }
  }

  read_text_record(i: number): Uint8Array {
    if (this.mobi_header && this.palm_header) {
      const flags = this.mobi_header.extra_flags
      const begin = this.reclist[i].offset
      const end = this.reclist[++i].offset

      let data = new Uint8Array(this.buffer.slice(begin, end))
      const ex = this.get_record_extrasize(data, flags)

      data = new Uint8Array(this.buffer.slice(begin, end - ex))
      if (this.palm_header.compression === 2) {
        const buffer = uncompression_lz77(data)
        return buffer.shrink()
      } else {
        return data
      }
    } else {
      return new Uint8Array()
    }
  }

  read_image(idx: number): Blob {
    if (this.mobi_header) {
      const first_image_idx = this.mobi_header.first_image_idx
      const begin = this.reclist[first_image_idx + idx].offset
      const end = this.reclist[first_image_idx + idx + 1].offset
      const data = new Uint8Array(this.buffer.slice(begin, end))
      return new Blob([data.buffer])
    } else {
      return new Blob()
    }
  }

  load(): void {
    this.header = this.load_pdbheader()
    this.reclist = this.load_reclist()
    this.load_record0()
  }

  load_pdbheader(): PDBHeader {
    const header: PDBHeader = {
      name: this.getStr(32).replace(/\x00/g, ''),
      attr: this.getUint16(),
      version: this.getUint16(),
      ctime: this.getUint32(),
      mtime: this.getUint32(),
      btime: this.getUint32(),
      mod_num: this.getUint32(),
      appinfo_offset: this.getUint32(),
      sortinfo_offset: this.getUint32(),
      type: this.getStr(4),
      creator: this.getStr(4),
      uid: this.getUint32(),
      next_rec: this.getUint32(),
      record_num: this.getUint16(),
    }
    return header
  }

  load_reclist(): RecordInfo[] {
    const reclist = []
    if (this.header) {
      for (let i = 0; i < this.header.record_num; i++) {
        const record: RecordInfo = {
          offset: this.getUint32(),
          attr: this.getUint32(),
        }
        reclist.push(record)
      }
    }
    return reclist
  }

  load_record0(): void {
    this.palm_header = this.load_record0_header()
    this.mobi_header = this.load_mobi_header()
  }

  load_record0_header(): PalmDOCHeader {
    const p_header = {} as PalmDOCHeader
    const first_record = this.reclist[0]
    this.setoffset(first_record.offset)

    p_header.compression = this.getUint16()
    this.skip(2)
    p_header.text_length = this.getUint32()
    p_header.record_count = this.getUint16()
    p_header.record_size = this.getUint16()
    p_header.encryption_type = this.getUint16()
    this.skip(2)

    return p_header
  }

  load_mobi_header(): MOBIHeader {
    const mobi_header = {} as MOBIHeader
    const start_offset = this.offset
    mobi_header.identifier = this.getUint32()
    mobi_header.header_length = this.getUint32()
    mobi_header.mobi_type = this.getUint32()
    mobi_header.text_encoding = this.getUint32()
    mobi_header.uid = this.getUint32()
    mobi_header.generator_version = this.getUint32()
    this.skip(40)
    mobi_header.first_nonbook_index = this.getUint32()
    mobi_header.full_name_offset = this.getUint32()
    mobi_header.full_name_length = this.getUint32()
    mobi_header.language = this.getUint32()
    mobi_header.input_language = this.getUint32()
    mobi_header.output_language = this.getUint32()
    mobi_header.min_version = this.getUint32()
    mobi_header.first_image_idx = this.getUint32()
    mobi_header.huff_rec_index = this.getUint32()
    mobi_header.huff_rec_count = this.getUint32()
    mobi_header.datp_rec_index = this.getUint32()
    mobi_header.datp_rec_count = this.getUint32()
    mobi_header.exth_flags = this.getUint32()
    this.skip(36)
    mobi_header.drm_offset = this.getUint32()
    mobi_header.drm_count = this.getUint32()
    mobi_header.drm_size = this.getUint32()
    mobi_header.drm_flags = this.getUint32()
    this.skip(8)
    this.skip(4)
    this.skip(46)
    mobi_header.extra_flags = this.getUint16()
    this.setoffset(start_offset + mobi_header.header_length)
    return mobi_header
  }
}

export default MobiFile
