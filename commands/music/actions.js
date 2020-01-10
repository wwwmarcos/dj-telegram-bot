const { spawn } = require('child_process')
const { tmpdir } = require('os')
const axios = require('axios')
const fs = require('fs')
const path = require('path')
const { avaibleBeats } = require('./avaibleBeats')

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

const mergeAudios = ({ filePath, beat = 'funk1' }) =>
  new Promise((resolve, reject) => {
    const outputDirectory = `${filePath}.mp3`

    const args = [
      '-y',
      '-i',
      filePath,
      '-i',
      getBeatPath(beat),
      '-filter_complex',
      'amerge=inputs=2',
      '-ac',
      '2',
      outputDirectory
    ]

    const binariePatch = getBinariePatch()

    const { stdout, stderr } = spawn(binariePatch, args, {})
      .on('error', reject)
      .on('close', () => resolve(outputDirectory))

    stdout.on('data', data => process.stdout.write(data))
    stderr.on('data', data => process.stdout.write(data))
  })

const getAudioBuffer = filePath =>
  fs.readFileSync(filePath)

const getFileId = ctx => ctx
  .update
  .callback_query
  .message
  .reply_to_message
  .voice
  .file_id

const resolve = async ({ ctx, bot, info }) => {
  const fileId = getFileId(ctx)
  const beat = info.actionName
  const filePath = getFilePath(fileId)

  await ctx.editMessageText('saving original')
  await saveFileLocal({ filePath, bot, fileId })

  await ctx.editMessageText('mixing audios')
  const outputPath = await mergeAudios({ filePath, beat })

  await ctx.editMessageText('getting result')
  const audio = getAudioBuffer(outputPath)

  await ctx.editMessageText('sending mix result')
  await ctx.replyWithAudio({ source: audio })

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
