import MobiFragment from './MobiFragment'

class MobiBuffer {
  capacity: number
  fragment_list: MobiFragment[]
  cur_fragment: MobiFragment

  constructor(capacity: number) {
    this.capacity = capacity
    this.fragment_list = []
    this.cur_fragment = new MobiFragment(capacity)
    this.fragment_list.push(this.cur_fragment)
  }

  write(byte: number): void {
    const result = this.cur_fragment.write(byte)
    if (!result) {
      this.cur_fragment = new MobiFragment(this.capacity)
      this.fragment_list.push(this.cur_fragment)
      this.cur_fragment.write(byte)
    }
  }

  get(idx: number): number | null {
    let fi = 0
    while (fi < this.fragment_list.length) {
      const frag = this.fragment_list[fi]
      if (idx < frag.size) {
        return frag.get(idx)
      }
      idx -= frag.size
      fi += 1
    }
    return null
  }

  size(): number {
    let s = 0
    for (let i = 0; i < this.fragment_list.length; i++) {
      s += this.fragment_list[i].size
    }
    return s
  }

  shrink(): Uint8Array {
    const total_buffer = new Uint8Array(this.size())
    let offset = 0
    for (let i = 0; i < this.fragment_list.length; i++) {
      const frag = this.fragment_list[i]
      if (frag.full()) {
        total_buffer.set(frag.buffer, offset)
      } else {
        total_buffer.set(frag.buffer.slice(0, frag.size), offset)
      }
      offset += frag.size
    }
    return total_buffer
  }
}

export default MobiBuffer
