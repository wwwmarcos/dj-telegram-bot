const hello = require('./hello')
const funk = require('./funk')

const configure = bot => {
  const commands = [
    funk,
    hello
  ]

  commands.forEach(({ command, resolve }) => {
    bot.command(command, ctx => resolve({ ctx, bot }))
  })
}

module.exports = {
  configure
}
