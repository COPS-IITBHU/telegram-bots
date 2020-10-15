# Telegram Bots
This repository contains the source code of the telegram bots developed and used by the COPS Dev Group.


## Setting Up

### Clone the repository
- `git clone https://github.com/COPS-IITBHU/telegram-bots.git`
- `cd telegram-bots`

### Create a new telegram bot
- Follow instructions on [this page](https://core.telegram.org/bots) to create a
new bot and obtain a token.

### Local development

#### Install dependencies
- `npm install -ci`

#### Set env varaibles in nodemon.json
- Add your bot token to the `nodemon.json` file.
- CHATID and PASSWORD aren't necessary and are needed for deployment purpose only.

#### Running the bot
- `npm run lucy-bot`

### Deploying the bot

#### Get vercel CLI
- `npm i -g vercel`

#### Deploying the bot
- `vercel --prod`

#### Go to your vercel dashboard and set the env variable
- Set an env variable with key `LUCY_BOT_TOKEN` equal to your bot token.

**NOTE** - You may need to deploy your bot again after setting the env variables.

#### Setup Webhooks
You need to setup webhooks so that every update could be sent to that url as a post request. You can do that by this query.

https://api.telegram.org/bot"BOT_TOKEN"/setWebhook?url="DEPLOYED_URL"

- Replace the "BOT_TOKEN" (Including the quotes) with the TOKEN of your bot.
- Replace the "DEPLOYED_URL" (Including the quotes) with the production url of your serverless function. If you followed the instructions above correctly, It would look something like -> `https://telegram-bots-khaki.vercel.app/api/lucy-bot.ts`.

**NOTE** - If you have executed the command `npm run lucy-bot` after deploying you'll need to set the webhooks again.
