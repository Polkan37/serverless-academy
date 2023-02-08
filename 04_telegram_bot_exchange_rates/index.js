process.env.NTBA_FIX_350 = "1";
const token = "5627300950:AAFbBlPgE4AEr0DaMdEmrYjSQhCu887f4cs";
const chatId = "247856090";

const TelegramBot = require("node-telegram-bot-api");
const bot = new TelegramBot(token, { polling: true });

bot.on("message", (msg) => {
  bot.sendMessage(chatId, `Вітаю! Оберіть опцію нижче`, {
    reply_markup: {
      keyboard: [["/Погода"], ["/Курс валют"]],
      resize_keyboard: true,
      one_time_keyboard: true,
      force_reply: true,
    },
  });
});
