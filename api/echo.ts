import { NowRequest, NowResponse } from '@now/node'
import Telegraf from 'telegraf';
import Extra from 'telegraf/extra';
import Markup from 'telegraf/markup';

const keyboard = Markup.inlineKeyboard([
  Markup.urlButton('❤️', 'http://telegraf.js.org'),
  Markup.callbackButton('Delete', 'delete')
])

const bot = new Telegraf(process.env.COPS_HelloWorld_BOT_TOKEN || '')

bot.start((ctx) => ctx.reply('Hello'))
bot.help((ctx) => ctx.reply('Help message'))
bot.on('message', (ctx) => ctx.telegram.sendCopy(ctx.from.id, ctx.message, Extra.markup(keyboard)))
bot.action('delete', ({ deleteMessage }) => deleteMessage())

module.exports = (req: NowRequest, resp: NowResponse) => {
    if (req.method === 'POST') bot.handleUpdate(req.body, resp)
    else resp.status(200).send('Use POST to use Telegram bot!')
}
