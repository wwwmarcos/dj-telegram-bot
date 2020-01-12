const { avaibleBeats } = require('./avaibleBeats')
const { spawn } = require('child_process')
const { tmpdir } = require('os')
const axios = require('axios')
const fs = require('fs')
const path = require('path')

const getFilePath = name => path.join(
  tmpdir(),
  name
)

const getBeatPath = name => path.join(
  process.cwd(),
  'audios',
  name
)

const getBinariePatch = () => path.join(
  process.cwd(),
  'binaries',
  'ffmpeg',
  'ffmpeg'
)

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

const getMergeParams = ({ fileType, filePath, beat }) => {
  const outputExt = fileType === 'audio' ? 'mp3' : 'mp4'
  const outputDirectory = `${filePath}.${outputExt}`
  const beatPath = getBeatPath(beat)

  const audioArgs = [
    '-y',
    '-i',
    filePath,
    '-i',
    beatPath,
    '-filter_complex',
    'amerge=inputs=2',
    '-ac',
    '2',
    outputDirectory
  ]

  const videoArgs = [
    '-y',
    '-i',
    filePath,
    '-i',
    beatPath,
    '-filter_complex',
    '[1:0] apad',
    '-shortest',
    outputDirectory
  ]

  const args = fileType === 'audio' ? audioArgs : videoArgs

  return {
    args,
    outputDirectory
  }
}

const mergeAudios = ({ filePath, fileType, beat = 'funk1' }) =>
  new Promise((resolve, reject) => {
    const { args, outputDirectory } = getMergeParams({
      fileType,
      filePath,
      beat
    })

    const binariePatch = getBinariePatch()

    const { stdout, stderr } = spawn(binariePatch, args, {})
      .on('error', reject)
      .on('close', () => resolve(outputDirectory))

    stdout.on('data', data => process.stdout.write(data))
    stderr.on('data', data => process.stdout.write(data))
  })

const getFileBuffer = filePath =>
  fs.readFileSync(filePath)

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

  if (fileType === 'audio') {
    await ctx.replyWithAudio({ source: file })
  }

  if (fileType === 'video') {
    await ctx.replyWithVideo({ source: file })
  }

  if (fileType === 'video_note') {
    await ctx.replyWithVideoNote({ source: file })
  }

  console.log('ok')
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
