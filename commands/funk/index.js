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

const mergeAudios = ({ filePath }) =>
  new Promise((resolve, reject) => {
    const outputDirectory = `${filePath}.mp3`

    const args = [
      '-y',
      '-i',
      filePath,
      '-i',
      getBeatPath('funk1'),
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

const getFileId = ctx => ctx.message &&
  ctx.message &&
  ctx.message.voice &&
  ctx.message.voice.file_id

const resolve = async ({ ctx, bot }) => {
  const fileId = getFileId(ctx)

  if (!fileId) {
    return ctx.reply('faltou o audio')
  }

  const filePath = getFilePath(fileId)
  await saveFileLocal({ filePath, bot, fileId })
  const outputPath = await mergeAudios({ filePath })
  const audio = getAudioBuffer(outputPath)

  return ctx.replyWithVoice({ source: audio })
}

module.exports = {
  resolve,
  on: 'voice'
}
