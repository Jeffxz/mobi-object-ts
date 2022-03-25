import { Command } from 'commander'
import * as fs from 'fs'
import * as path from 'path'
import MobiFile from '../../src/MobiFile'

const program = new Command()
program.option('-f, --file <epub>', 'convert a single epub file')

program.parse(process.argv)

const options = program.opts()
if (options.file) {
  const fileName = options.file
  console.log(`loading file ${fileName}`)
  try {
    fs.readFile(fileName, (error, data) => {
      const mobi = new MobiFile(data.buffer)
      mobi.load()
      console.log(mobi)
      const text = mobi.read_text()
      console.log(text)
    })
  } catch (error) {
    console.error(error)
  }
} else {
  console.error('Usage: yarn load -f <mobi file path>')
}
