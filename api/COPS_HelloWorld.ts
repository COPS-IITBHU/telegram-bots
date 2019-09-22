import { NowRequest, NowResponse } from '@now/node'
import Telegraf, { ContextMessageUpdate, Middleware } from 'telegraf';
import axios from "axios"

const bot = new Telegraf(process.env.COPS_HelloWorld_BOT_TOKEN || "");

bot.use((ctx: ContextMessageUpdate, next) => {
    const start = new Date()
    return next(ctx).then(() => {
        const ms = new Date().getTime() - start.getTime()
        console.log('Response time %sms', ms)
    })
})
bot.on('new_chat_members', (ctx: ContextMessageUpdate) => {
    const name = ctx.from ? ctx.from.first_name : "fellow nerd"
    return ctx.reply(`Hey ${name}! I'm really interested in you, so can you please introduce yourself?`)
})

bot.command('DevTalks', (ctx: ContextMessageUpdate) => {
    axios.get(`https://api.github.com/repos/COPS-IITBHU/DevTalks/issues`).then(function (response) {
        const result = response.data
        if (result.length == 0) {
            ctx.reply("No upcoming dev talks.")
        }
        result.forEach((element) => {
            ctx.replyWithMarkdown(`[${element.title}](${element.html_url}) by [${element.user.login}](${element.user.html_url})`)
        })
    }).catch(function (error){
        return ctx.reply(`Some error fetching the upcoming dev talks.`)
    })
})

bot.on('text', (ctx: ContextMessageUpdate) => {
    return ctx.reply("Hmmm... Interesting 😁")
})

module.exports = (req: NowRequest, resp: NowResponse) => {
    if (req.method === 'POST') bot.handleUpdate(req.body, resp)
    else resp.status(200).send('Use POST to use Telegram bot!')
}