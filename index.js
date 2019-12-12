const Telegraf = require('telegraf')
const express = require('express')
const { config } = require('./config')
const commands = require('./commands')

const app = express()
const bot = new Telegraf(config.botToken)

commands.configure(bot)
app.use(bot.webhookCallback('/callback'))

app.get('/', (req, res) => {
  res.send('ok')
})

app.get('/start', (req, res) => {
  const url = `${config.currentHost}/callback`
  bot.telegram.setWebhook(url)
  res.send(url)
})

app.listen(3000, () => {
  console.log('app running on 3000')
})
