const hello = require('./hello')
const funk = require('./funk')

const configure = bot => {
  const commands = [
    funk,
    hello
  ]

  for (const { command, resolve, on } of commands) {
    const genericResolve = async ctx => {
      const resolving = command || on

      try {
        console.log(`RESOLVING /${resolving}`)
        await resolve({ ctx, bot })
      } catch (error) {
        console.error(error)

        const id = ctx.message.from.id
        const text = `fail executing /${resolving}`
        await bot.telegram.sendMessage(id, text)
      }
    }

    if (command) {
      console.log(`registering command ${command}`)
      bot.command(command, genericResolve)
    }

    if (on) {
      console.log(`registering listener ${on}`)
      bot.on(on, genericResolve)
    }
  }
}

module.exports = {
  configure
}
