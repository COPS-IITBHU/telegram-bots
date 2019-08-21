import { NowRequest, NowResponse } from '@now/node'
import Telegraf, { ContextMessageUpdate, Middleware } from 'telegraf';

const bot = new Telegraf(process.env.COPS_HelloWorld_BOT_TOKEN || "")

bot.use((ctx: ContextMessageUpdate, next) => {
    const start = new Date()
    return next(ctx).then(() => {
        const ms = new Date().getTime() - start.getTime()
        console.log('Response time %sms', ms)
    })
})

bot.on('new_chat_members', (ctx: ContextMessageUpdate) => {
    return ctx.reply("Hey fellow nerd! I'm really interested in you, so can you please introduce yourself?")
})

bot.on('text', (ctx: ContextMessageUpdate) => {
    return ctx.reply((ctx.message) ? ctx.message.text || "" : "")
})

module.exports = (req: NowRequest, resp: NowResponse) => {
    if (req.method === 'POST') bot.handleUpdate(req.body, resp)
    else resp.status(200).send('Use POST to use Telegram bot!')
}