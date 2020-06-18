const availableEffects = [
  {
    name: 'vibrato',
    buildArgs: ({
      filePath,
      outputDirectory
    }) => ['-y', '-i', filePath, '-filter_complex', 'vibrato=f=10', outputDirectory]
  },
  {
    name: 'mountains',
    buildArgs: ({
      filePath,
      outputDirectory
    }) => [
      '-y', '-i', filePath, '-filter_complex', 'aecho=0.8:0.9:500|1000:0.2|0.1', outputDirectory
    ]
  },
  {
    name: 'reverse',
    buildArgs: ({
      filePath,
      outputDirectory
    }) => [
      '-y', '-i', filePath, '-filter_complex', 'areverse', outputDirectory
    ]
  }
]

module.exports = {
  availableEffects
}
