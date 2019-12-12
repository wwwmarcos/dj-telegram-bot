const hello = require('./hello')

const configure = bot => {
  bot.command(hello.command, hello.resolve)
}

module.exports = {
  configure
}
