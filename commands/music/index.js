const { Markup, Extra } = require('telegraf')
const { availableBeats } = require('./availableBeats')

const resolve = async ({ ctx }) => {
  const callBacks = availableBeats.map(beat =>
    [Markup.callbackButton(beat, beat)]
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
  on: ['voice', 'audio', 'video_note', 'video']
}
