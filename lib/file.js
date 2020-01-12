const axios = require('axios')
const fs = require('fs')

const buildFileInfo = ({ fileId, type }) => ({
  fileId,
  fileType: type
})

const getFileInfo = ctx => {
  const reply = ctx
    .update
    .callback_query
    .message
    .reply_to_message

  if (reply.voice) {
    return buildFileInfo({
      fileId: reply.voice.file_id,
      type: 'audio'
    })
  }

  if (reply.audio) {
    return buildFileInfo({
      fileId: reply.audio.file_id,
      type: 'audio'
    })
  }

  if (reply.video_note) {
    return buildFileInfo({
      fileId: reply.video_note.file_id,
      type: 'video_note'
    })
  }

  if (reply.video) {
    return buildFileInfo({
      fileId: reply.video.file_id,
      type: 'video'
    })
  }

  return null
}

const sendFile = async ({ fileType, file, ctx }) => {
  if (fileType === 'audio') {
    await ctx.replyWithAudio({ source: file })
  }

  if (fileType === 'video') {
    await ctx.replyWithVideo({ source: file })
  }

  if (fileType === 'video_note') {
    await ctx.replyWithVideoNote({ source: file })
  }
}

const saveFileLocal = async ({ filePath, bot, fileId }) => {
  const fileLink = await bot.telegram.getFileLink(fileId)

  const { data: fileStream } = await axios({
    url: fileLink,
    responseType: 'stream'
  })

  const writeFileStream = fs.createWriteStream(filePath)

  return new Promise((resolve, reject) => {
    writeFileStream.on('finish', resolve)
    writeFileStream.on('error', reject)

    fileStream
      .pipe(writeFileStream)
  })
}

module.exports = {
  saveFileLocal,
  sendFile,
  getFileInfo
}
