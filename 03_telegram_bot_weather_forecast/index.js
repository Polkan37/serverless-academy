const axios = require("axios");
const city = "Kyiv";
const weatherApiRequestUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=2b387d56a3a890b72f295f70051506c6`;

process.env.NTBA_FIX_350 = "1";
const token = "5627300950:AAFbBlPgE4AEr0DaMdEmrYjSQhCu887f4cs";
const chatId = "247856090";

const TelegramBot = require("node-telegram-bot-api");
const bot = new TelegramBot(token, { polling: true });

bot.sendMessage(chatId, `Do you wanna check the weather in ${city}?`, {
  reply_markup: {
    keyboard: [[`Forecast in ${city}`]],
    resize_keyboard: true,
    one_time_keyboard: true,
    force_reply: true,
  },
});

// bot.onText(`Forecast in ${city}`, (msg) => {
//     bot.sendMessage(chatId, {
//         'reply_markup': {
//             'keyboard': [['Sample text', 'Second sample']],
//             resize_keyboard: true,
//             one_time_keyboard: true,
//             force_reply: true,
//         }
//     });
//  }); 


// axios({
//   method: "GET",
//   url: weatherApiRequestUrl,
// })
//   .then((response) => {
//     console.log(response);
//   })
//   .catch((error) => {
//     console.log(error);
//   });
