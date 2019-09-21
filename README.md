# Contributing

----
## Clone this repo
- `git clone https://github.com/COPS-IITBHU/telegram-bots.git`
- `cd telegram-bots`

## Create a new telegram bot
- Follow instructions on [this page](https://core.telegram.org/bots) to create a 
new bot and obtain a token.
----
## Get now CLI
- `npm i -g now`

----
## Setting Secret Key
- `now secrets add cops_helloworld_token.key "YOUR-BOT-KEY"`

----
## Deploy To Now.sh
- `now --prod`

----
## Setup Webhooks
> You need to setup webhooks so that every update could be sent to that url as a post request.

You can do that by this query.

https://api.telegram.org/bot<bot-key>/setWebhook?url=<deployed-url>
