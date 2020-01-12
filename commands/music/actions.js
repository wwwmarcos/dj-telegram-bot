const { avaibleBeats } = require('./avaibleBeats')

const {
  getFilePath,
  getFileBuffer
} = require('../../lib/path')

const {
  mergeAudios
} = require('../../lib/ffmpeg')

const {
  saveFileLocal,
  getFileInfo,
  sendFile
} = require('../../lib/file')

const resolve = async ({ ctx, bot, info }) => {
  const beat = info.actionName

  const { fileId, fileType } = getFileInfo(ctx)
  const filePath = getFilePath(fileId)

  await ctx.editMessageText('saving original')
  await saveFileLocal({ filePath, bot, fileId })

  await ctx.editMessageText('mixing audios')
  const outputPath = await mergeAudios({ filePath, fileType, beat })

  await ctx.editMessageText('getting result')
  const file = getFileBuffer(outputPath)

  await ctx.editMessageText('sending mix result')
  await sendFile({ fileType, file, ctx })

  await ctx.editMessageText('ok')
}

const actions = avaibleBeats.map(beat => ({
  action: {
    name: beat,
    resolve
  }
}))

module.exports = {
  actions
}
