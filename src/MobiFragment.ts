class MobiFragment {
  buffer: Uint8Array
  capacity: number
  size = 0

  constructor(capacity: number) {
    this.buffer = new Uint8Array(capacity)
    this.capacity = capacity
  }

  write(byte: number): boolean {
    if (this.size >= this.capacity) {
      return false
    }
    this.buffer[this.size] = byte
    this.size += 1
    return true
  }

  full(): boolean {
    return this.size === this.capacity
  }

  get(idx: number): number {
    return this.buffer[idx]
  }
}

export default MobiFragment
