const { tmpdir } = require('os')
const fs = require('fs')
const path = require('path')

const getFilePath = name => path.join(
  tmpdir(),
  name
)

const getBeatsPath = _ => path.join(
  process.cwd(),
  'audios'
)

const getBeatPath = name => path.join(
  getBeatsPath(),
  name
)

const getBinariePatch = () => path.join(
  process.cwd(),
  'binaries',
  'ffmpeg',
  'ffmpeg'
)

const getFileBuffer = filePath =>
  fs.readFileSync(filePath)

module.exports = {
  getBeatPath,
  getFilePath,
  getBinariePatch,
  getFileBuffer,
  getBeatsPath
}
