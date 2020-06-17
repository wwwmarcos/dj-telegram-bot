const music = require('./music')
const musicActions = require('./music/actions')

const createResolver = ({ resolving, resolve, bot, info }) => async ctx => {
  try {
    console.log(`RESOLVING /${resolving}`)
    await resolve({ ctx, bot, info })
  } catch (error) {
    console.error(error)

    const id = ctx.message.from.id
    const text = `fail executing /${resolving}`
    await bot.telegram.sendMessage(id, text)
  }
}

const configure = bot => {
  const commands = [
    music,
    ...musicActions.actions
  ]

  for (const { command, resolve, on, action } of commands) {
    if (command) {
      console.log(`registering command ${command}`)
      bot.command(command, createResolver({
        resolving: command,
        resolve,
        bot
      }))
    }

    if (on) {
      console.log(`registering listener ${on}`)
      bot.on(on, createResolver({
        resolving: on,
        resolve,
        bot
      }))
    }

    if (action) {
      console.log(`registering action ${action.name}`)
      bot.action(action.name, createResolver({
        resolving: action.name,
        resolve: action.resolve,
        bot,
        info: {
          actionName: action.name
        }
      }))
    }
  }
}

module.exports = {
  configure
}
