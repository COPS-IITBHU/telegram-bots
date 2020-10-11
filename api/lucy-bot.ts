import { NowRequest, NowResponse } from '@now/node';
import { Octokit } from '@octokit/rest';
import Telegraf, { ContextMessageUpdate, Extra } from 'telegraf';
import { ExtraEditMessage } from 'telegraf/typings/telegram-types';

const PROD_ENV = process.env.NODE_ENV === 'production';

if (!PROD_ENV) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('dotenv').config();
}

const bot = new Telegraf(process.env.LUCY_BOT_TOKEN || '');

bot.use(async (ctx: ContextMessageUpdate, next) => {
  const start = new Date();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  await next();
  const ms = new Date().getTime() - start.getTime();
  console.log('Response time: %sms', ms);
});

bot.on('new_chat_members', async (ctx: ContextMessageUpdate) => {
  const name = ctx.from ? ctx.from.first_name : 'fellow nerd';
  ctx.reply(`Hey ${name}! I'm really interested in you, so can you please introduce yourself?`);
});

bot.command('AddEvent', async (ctx: ContextMessageUpdate, startInfo) => {
  //let eventLink: string = ``;
  console.log(ctx.message);
  ctx.reply(
    `https://calendar.google.com/calendar/r/eventedit?text=COPS+Meeting&dates=20190920T160000/20190920T180000&details=COPS+dev+group+meeting&location=IIT(BHU)`,
  );
});

bot.command('DevTalks', async (ctx: ContextMessageUpdate) => {
  const octokit = new Octokit();
  const { data } = await octokit.issues.listForRepo({
    owner: 'COPS-IITBHU',
    repo: 'DevTalks',
  });

  if (data.length == 0) {
    ctx.reply('No upcoming dev talks.');
  }

  const msgList = data.map(
    (element) => `[${element.title}](${element.html_url}) by [${element.user.login}](${element.user.html_url})`,
  );

  ctx.replyWithMarkdown(msgList.join('\n\n'), <ExtraEditMessage>Extra.webPreview(false));
});

if (!PROD_ENV) {
  bot.launch();
}

module.exports = (req: NowRequest, resp: NowResponse) => {
  if (req.method === 'POST') bot.handleUpdate(req.body, resp);
  else resp.status(200).send('Use POST to use Telegram bot!');
};
