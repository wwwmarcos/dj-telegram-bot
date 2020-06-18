const { Markup, Extra } = require('telegraf')
const { availableBeats } = require('./availableBeats')
const { availableEffects } = require('./availableEffects')

const CALLBACKS = {
  MUSIC: 'music mix',
  EFFECT: 'voice effect'
}

const buildCallback = () => {
  const beatsCallback = availableBeats.map(beat =>
    [Markup.callbackButton(beat, beat)]
  )

  const effectsCallback = availableEffects.map(effect =>
    [Markup.callbackButton(effect.name, effect.name)]
  )

  return {
    beatsCallback,
    effectsCallback
  }
}

const use = bot => {
  bot.on([
    'voice',
    'audio',
    'video_note',
    'video'
  ], ctx => resolve({ ctx, bot }))

  const { beatsCallback, effectsCallback } = buildCallback()

  bot.action(
    CALLBACKS.MUSIC,
    editMessage(beatsCallback, 'Select a style')
  )

  bot.action(
    CALLBACKS.EFFECT,
    editMessage(effectsCallback, 'Select a Effect')
  )
}

const editMessage = (beatsCallback, message) => async ctx => {
  await ctx.editMessageText(
    message,
    Extra.markup(
      Markup.inlineKeyboard(beatsCallback)
    )
  )
}

const resolve = async ({ ctx }) => {
  const inlineMessageRatingKeyboard = Markup
    .inlineKeyboard([
      Markup.callbackButton(CALLBACKS.MUSIC, CALLBACKS.MUSIC),
      Markup.callbackButton(CALLBACKS.EFFECT, CALLBACKS.EFFECT)
    ]).extra(
      Extra.inReplyTo(ctx.message.message_id)
    )

  return ctx.reply(
    'wow',
    inlineMessageRatingKeyboard
  )
}

module.exports = {
  use
}
