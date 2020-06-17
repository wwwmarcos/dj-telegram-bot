const { getBeatsPath } = require('../../lib/path')

const fs = require('fs')

const availableBeats = fs.readdirSync(getBeatsPath())

module.exports = {
  availableBeats
}
