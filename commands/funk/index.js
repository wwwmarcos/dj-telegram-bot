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

  const fileStream = await axios({
    url: fileLink,
    responseType: 'stream'
  })

  return new Promise((resolve, reject) => {
    const writeStream = fs.createWriteStream(filePath)

    writeStream.on('finish', resolve)
    writeStream.on('error', reject)

    fileStream
      .data
      .pipe(writeStream)
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

    spawn(binariePatch, args, {})
      .on('error', reject)
      .on('close', () => resolve(outputDirectory))
  })

const getAudioBuffer = (filePath) =>

  fs.readFileSync(filePath)

const resolve = async ({ ctx, bot }) => {
  const fileId = ctx.message &&
    ctx.message.reply_to_message &&
    ctx.message.reply_to_message.voice &&
    ctx.message.reply_to_message.voice.file_id

  if (!fileId) {
    return ctx.reply(JSON.stringify(
      ctx.message.reply_to_message, null, 2
    ))
  }

  const filePath = getFilePath(fileId)

  try {
    await saveFileLocal({ filePath, bot, fileId })
    const outputPath = await mergeAudios({ filePath })
    const audio = getAudioBuffer(outputPath)

    return ctx.replyWithAudio({ source: audio })
  } catch (error) {
    console.log(error)
    return ctx.reply('fail')
  }
}

module.exports = {
  resolve,
  command: 'funk'
}
