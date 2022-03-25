/**
 * Palm Database Format
 * https://wiki.mobileread.com/wiki/PDB
 */
export type PDBHeader = {
  name: string
  attr: number
  version: number
  ctime: number
  mtime: number
  btime: number
  mod_num: number
  appinfo_offset: number
  sortinfo_offset: number // 56 - 4
  type: string
  creator: string
  uid: number
  next_rec: number
  record_num: number
}

/**
 * Record Info at end of Palm Database Format (Record Info List)
 * https://wiki.mobileread.com/wiki/PDB
 */
export type RecordInfo = {
  offset: number
  attr: number
}

/**
 * PalmDOC Header
 * https://wiki.mobileread.com/wiki/MOBI#PalmDOC_Header
 */

export type PalmDOCHeader = {
  compression: number
  text_length: number
  record_count: number
  record_size: number
  encryption_type: number
}

export type MOBIHeader = {
  identifier: number
  header_length: number
  mobi_type: number
  text_encoding: number
  uid: number
  generator_version: number
  first_nonbook_index: number
  full_name_offset: number
  full_name_length: number
  language: number
  input_language: number
  output_language: number
  min_version: number
  first_image_idx: number
  huff_rec_index: number
  huff_rec_count: number
  datp_rec_index: number
  datp_rec_count: number
  exth_flags: number
  drm_offset: number
  drm_count: number
  drm_size: number
  drm_flags: number
  extra_flags: number
}
