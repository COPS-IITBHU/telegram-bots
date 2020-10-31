import * as functions from 'firebase-functions';
import { Response, Request } from 'firebase-functions';
import { Octokit } from '@octokit/rest';
import Telegraf, { ContextMessageUpdate, Extra } from 'telegraf';
import { ExtraEditMessage } from 'telegraf/typings/telegram-types';
import { article } from './article';

const PROD_ENV = functions.config().telegram?.node_env === 'production';
const bot = new Telegraf(functions.config().telegram?.lucy_bot_token);

bot.use(Telegraf.log());
bot.use(async (ctx: ContextMessageUpdate, next) => {
  const start = new Date();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  await next();
  const ms = new Date().getTime() - start.getTime();
  console.log('Response time: %sms', ms);
});

bot.on(
  'new_chat_members',
  async (ctx: ContextMessageUpdate): Promise<void> => {
    if (ctx.message?.new_chat_members) {
      const names = ctx.message?.new_chat_members?.map((val) => val.first_name || val.username || 'Fellow Nerd');
      await Promise.all(
        names?.map((name) =>
          ctx.reply(`Hey ${name}! I'm really interested in you, so can you please introduce yourself?`),
        ),
      );
    }
  },
);

bot.on(
  'left_chat_member',
  async (ctx: ContextMessageUpdate): Promise<void> => {
    if (ctx.message?.left_chat_member) {
      const name = ctx.message.left_chat_member.first_name || ctx.message.left_chat_member.username || 'Fellow Nerd';
      await ctx.reply(`${name} left`);
    }
  },
);

bot.command(
  'DevTalks',
  async (ctx: ContextMessageUpdate): Promise<void> => {
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

    await ctx.replyWithMarkdown(msgList.join('\n\n'), <ExtraEditMessage>Extra.webPreview(false));
  },
);

if (!PROD_ENV) {
  bot.launch();
}

exports.lucy_bot = functions.https.onRequest((req: Request, resp: Response) => {
  if (req.method === 'POST') bot.handleUpdate(req.body, resp);
  else resp.status(200).send('Use POST to use Telegram bot!');
});

exports.article = article;

process.on('unhandledRejection', (err) => console.log(err));
