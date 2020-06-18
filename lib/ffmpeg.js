const { spawn } = require('child_process')
const {
  getBeatPath,
  getBinariePatch
} = require('../lib/path')

const getMergeParams = ({ fileType, filePath, beat }) => {
  const isVideo = fileType !== 'audio'
  const outputExt = isVideo ? 'mp4' : 'mp3'
  const outputDirectory = `${filePath}.${outputExt}`
  const beatPath = getBeatPath(beat)

  const mergeArgs = [
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

  if (isVideo) {
    return {
      args: videoArgs,
      outputDirectory
    }
  }

  return {
    args: mergeArgs,
    outputDirectory
  }
}

const mergeAudios = ({ filePath, fileType, beat }) =>
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

module.exports = {
  mergeAudios
}
