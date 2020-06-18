const mixing = require('./mixing')
const musicActions = require('./mixing/actions')

const configure = bot => {
  const commands = [
    mixing,
    musicActions
  ]

  for (const { use } of commands) {
    use(bot)
  }
}

module.exports = {
  configure
}
