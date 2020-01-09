const { Markup, Extra } = require('telegraf')
const { avaibleBeats } = require('./avaibleBeats')

const resolve = async ({ ctx }) => {
  const callBacks = avaibleBeats.map(beat =>
    Markup.callbackButton(beat, beat)
  )

  const inlineMessageRatingKeyboard = Markup
    .inlineKeyboard(callBacks).extra(
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
