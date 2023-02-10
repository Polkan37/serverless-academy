const axios = require("axios");
const city = "Kyiv";
let intervalId;
const token = "5627300950:AAFbBlPgE4AEr0DaMdEmrYjSQhCu887f4cs";

const TelegramBot = require("node-telegram-bot-api");
const bot = new TelegramBot(token, { polling: true });

bot.on("message", (msg) => {
  if (msg.text == "/start") {
    showStartButtonsInTg(msg, "Вітаю! Оберіть опцію нижче");
  }
});

bot.onText(/\/Погода/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "Добре, що вас цікавить погода в Києві. \n Як часто оновлювати погоду?",
    {
      reply_markup: {
        resize_keyboard: true,
        force_reply: true,
        keyboard: [["Кожні 3 години", "Кожні 6 годин"], ["В попереднє меню"]],
      },
    }
  );
});

bot.onText(/В попереднє меню/, (msg) => {
  console.log("back to enter");
  clearInterval(intervalId);
  console.log("intervalId", intervalId);
  showStartButtonsInTg(msg, "Оберіть опцію нижче");
});

bot.onText(/Кожні ([0-9]{1}) годин/, async (msg) => {
  const updateEveryInHours = msg.text.match(/\d+/).map(Number).toString();
  const options = ["3", "6"];

  if (options.includes(updateEveryInHours)) {
    getForecast(msg).then((result) => {
      bot.sendMessage(msg.chat.id, result, {
        reply_markup: {
          resize_keyboard: true,
          force_reply: true,
          keyboard: [["В попереднє меню"]],
        },
      });
      intervalId = setInterval(() => {
        getForecast(msg).then((result) => bot.sendMessage(msg.chat.id, result));
      }, getHoursInMiliseconds(updateEveryInHours));
    });
  }
});

bot.onText(/\/stop/, (msg) => {
  stopBot(msg);
});

function stopBot(msg) {
  bot
    .sendMessage(
      msg.chat.id,
      "До побачення! \n\n *щоб почати спочатку перезапустіть бота"
    )
    .then(() => {
      clearInterval(intervalId);
      bot.stopPolling();
    });
}

function showStartButtonsInTg(msg, message) {
  bot.sendMessage(msg.chat.id, message, {
    reply_markup: {
      keyboard: [["/Погода"]],
      resize_keyboard: true,
      force_reply: true,
    },
  });
}

function getHoursInMiliseconds(hours) {
  return hours * 10800;
}

async function getForecast(msg) {
  const weather = await getWeather(city);
  const message = `В Києві зараз ${weather.temperature} °C \n відчувається як ${weather.tempFeelsLike} °C \nВологість: ${weather.humidity} % \nШвидкість вітру: ${weather.windSpeed} метрів за секунду \nХмарність: ${weather.cloudiness} %`;
  
  return message;
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
