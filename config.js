const config = {
  botToken: process.env.BOT_TOKEN,
  currentHost: process.env.VERCEL_URL,
  isDevelopment: process.env.NODE_ENV === 'dev'
}

module.exports = {
  config
}
