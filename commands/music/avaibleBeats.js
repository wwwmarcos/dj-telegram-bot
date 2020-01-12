const { getBeatsPath } = require('../../lib/path')
const fs = require('fs')

const avaibleBeats = fs.readdirSync(getBeatsPath())

module.exports = {
  avaibleBeats
}
