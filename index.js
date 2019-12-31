const { config } = require('./config')
const commands = require('./commands')
const express = require('express')
const Telegraf = require('telegraf')

const app = express()

const bot = new Telegraf(config.botToken)

commands.configure(bot)
app.use(bot.webhookCallback('/callback'))

app.get('/', (req, res) => {
  res.send('ok')
})

app.get('/start', async (req, res) => {
  const url = `${config.currentHost}/callback`
  await bot.telegram.setWebhook(url)
  res.send(url)
})

if (config.isDevelopment) {
  console.log('listening local')
  bot.launch()
}

app.listen(3000, () =>
  console.log('app running on 3000'))
