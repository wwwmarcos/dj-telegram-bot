const { Markup, Extra } = require('telegraf')

const resolve = async ({ ctx, bot }) => {
  const inlineMessageRatingKeyboard = Markup.inlineKeyboard([
    Markup.callbackButton('FUNKBR', 'funk'),
    Markup.callbackButton('HIP-HOP', 'rap')
  ]).extra(
    Extra.inReplyTo(ctx.message.message_id)
  )

  return ctx.reply(
    'Select a style',
    inlineMessageRatingKeyboard
  )
}

module.exports = {
  resolve,
  on: 'voice'
}
