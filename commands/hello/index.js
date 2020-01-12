const { config } = require('../../config')

const resolve = ({ ctx }) => {
  const stage = config.isDevelopment ? 'dev' : 'prod'
  ctx.reply(`hello from ${stage}`)
}

module.exports = {
  resolve,
  command: 'hello'
}
