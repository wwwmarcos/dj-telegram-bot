const config = {
  botToken: process.env.BOT_TOKEN,
  currentHost: 'https://djproducerbot.eptaccio1.now.sh',
  isDevelopment: process.env.NODE_ENV === 'dev'
}

module.exports = {
  config
}
