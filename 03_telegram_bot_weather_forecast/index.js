const axios = require("axios");
const city = "Kyiv";

process.env.NTBA_FIX_350 = "1";
const token = "5627300950:AAFbBlPgE4AEr0DaMdEmrYjSQhCu887f4cs";
const chatId = "247856090";

const TelegramBot = require("node-telegram-bot-api");
const bot = new TelegramBot(token, { polling: true });

bot.sendMessage(chatId, `Вітаю! Оберіть опцію нижче`, {
  reply_markup: {
    keyboard: [["/Погода"]],
    resize_keyboard: true,
    one_time_keyboard: true,
    force_reply: true,
  },
});

bot.onText(/\/Погода/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "Добре, що вас цікавить погода в Києві. \n Як часто оновлювати погоду?",
    {
      parse_mode: "Markdown",
      reply_markup: {
        resize_keyboard: true,
        one_time_keyboard: true,
        keyboard: [["Кожні 3 години", "Кожні 6 годин"]],
      },
    }
  );
});

bot.onText(/Кожні 3 години/, async (msg) => {
  showWeather(msg).then(setInterval(async () => showWeather(msg), 10800000));
});

bot.onText(/Кожні 6 годин/, async (msg) => {
  showWeather(msg).then(setInterval(async () => showWeather(msg), 1080000000));
});

async function showWeather(msg) {
  const weather = await getWeather(city);
  const message = `В Києві зараз ${weather.temperature} °C \n відчувається як ${weather.tempFeelsLike} °C \nВологість: ${weather.humidity} % \nШвидкість вітру: ${weather.windSpeed} метрів за секунду \nХмарність: ${weather.cloudiness} %`;

  bot.sendMessage(msg.chat.id, message);
}

async function getWeather(cityName) {
  const apiRequestUrl = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&APPID=2b387d56a3a890b72f295f70051506c6`;

  const weather = await axios({
    method: "GET",
    url: apiRequestUrl,
  })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });

  const result = {
    temperature: kelvinToCelsius(weather.data.main.temp),
    tempFeelsLike: kelvinToCelsius(weather.data.main.feels_like),
    humidity: weather.data.main.humidity,
    windSpeed: weather.data.wind.speed,
    cloudiness: weather.data.clouds.all,
  };
  return result;
}

function kelvinToCelsius(temperature) {
  return (temperature - 273.15).toFixed();
}
