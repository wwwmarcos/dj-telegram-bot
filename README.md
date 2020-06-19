# dj-telegram-bot

## How to add more beats?
Just create a audio file in the [/audios](https://github.com/eptaccio/dj-telegram-bot/tree/master/audios) folder without the extension. The bot will use the file name in the beats menu.

## Development
`BOT_TOKEN=<bot-token> NODE_ENV=dev node index.js`

_[You can get a token creating a new bot](https://core.telegram.org/bots#3-how-do-i-create-a-bot)_

## Deployment
`now -e BOT_TOKEN=<bot-token> --prod`

## Configuring WebHook
GET `http:<url>/start`
