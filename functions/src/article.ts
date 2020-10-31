import axios from 'axios';
import { ExtraEditMessage } from 'telegraf/typings/telegram-types';
import Telegraf, { ContextMessageUpdate, Extra } from 'telegraf';
import * as functions from 'firebase-functions';

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

interface Article {
  title: string;
  url: string;
  description: string;
  user: string;
  coverImage?: string;
  userId?: string;
}

export const fetchArticles = async (): Promise<Article[]> => {
  const response = await axios.get('https://dev.to/api/articles', {
    params: {
      top: 7,
      per_page: 7,
    },
  });
  const data: Article[] = [];
  response.data.forEach((element) => {
    data.push({
      title: element.title,
      url: element.url,
      description: element.description,
      user: element.user.name,
      userId:
        `https://github.com/${element.user.github_username}` || `https://twitter.com/${element.user.twitter_username}`,
    });
  });
  return data;
};

export const markdownArticles = (artices: Article[]): string[] => {
  return artices.map((e) => `[${e.title}](${e.url}) by [${e.user}](${e.userId})\n${e.description}`);
};

export const article = functions.https.onRequest(
  async (req: functions.Request, res: functions.Response): Promise<void> => {
    const password: string | undefined = req.headers.authorization;
    if (password === functions.config().telegram?.password) {
      const replyList = await fetchArticles().then(markdownArticles);
      await bot.telegram
        .sendMessage(
          `${functions.config().telegram?.chatid}`,
          `Hey Devs here are week's top blogs :)\n\n${replyList.join('\n\n')}`,
          <ExtraEditMessage>Extra.markdown().webPreview(false),
        )
        .catch((e) => console.error(e));

      res.status(200).send('Article Sent');
    }

    res.status(200).send('Invalid password!');
  },
);
