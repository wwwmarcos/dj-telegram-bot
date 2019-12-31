const resolve = ({ ctx }) => {
  ctx.reply('oi')
}

module.exports = {
  resolve,
  command: 'hello'
}
