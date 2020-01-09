const fs = require('fs')
const path = require('path')

const getBeatsPath = _ => path.join(
  process.cwd(),
  'audios'
)

const avaibleBeats = fs.readdirSync(getBeatsPath())

module.exports = {
  avaibleBeats
}
