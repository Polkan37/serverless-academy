const axios = require("axios");
const city = "Kyiv";
let intervalId;
const token = TELEGRAM_API_TOKEN;

process.env.NTBA_FIX_350 = "1";
const TelegramBot = require("node-telegram-bot-api");
const bot = new TelegramBot(token, { polling: true });

bot.on("message", (msg) => {
  if (msg.text == "/start") {
    showStartButtonsInTg(msg, "Вітаю! Оберіть опцію нижче");
  }
});

bot.onText(/\/Погода/, async (msg) => {
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
  clearInterval(intervalId);
  showStartButtonsInTg(msg, "Оберіть опцію нижче");
});

bot.onText(/Кожні 3 годин/, async (msg) => {
  const forecast = await getForecast('all');
  bot.sendMessage(msg.chat.id, forecast.join(""), {
    reply_markup: {
      resize_keyboard: true,
      force_reply: true,
      keyboard: [["В попереднє меню"]],
    },
  });
});

bot.onText(/Кожні 6 годин/, async (msg) => {
  const forecast = await getForecast('nth');

  bot.sendMessage(msg.chat.id, forecast.join(""), {
    reply_markup: {
      resize_keyboard: true,
      force_reply: true,
      keyboard: [["В попереднє меню"]],
    },
  });
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

async function getForecast(param) {

  const forecast = await getWeather(city);
  const forecastMessage = [];
  
  if(param == 'all'){
    forecast.data.list.map((currentWeatherPoint) => {
    const nowTimeMark = new Date(currentWeatherPoint.dt_txt);
      forecastMessage.push({
        date: `${nowTimeMark.toLocaleDateString("uk-UA")}`,
        time: `${nowTimeMark.getHours()}:${
          nowTimeMark.getMinutes().toString.length == 1
            ? "0" + nowTimeMark.getMinutes()
            : nowTimeMark.getMinutes()
        }`,
        temperature: `${kelvinToCelsius(
          currentWeatherPoint.main.temp
        )} °C відчувається ${kelvinToCelsius(
          currentWeatherPoint.main.feels_like
        )} °C`,
        details: `${currentWeatherPoint.weather[0].description}, вітер ${currentWeatherPoint.wind.speed} м/c, `,
      });
    });
  }
  if(param == 'nth'){
    const workFlow = forecast.data.list.filter( (el,index) => index % 2 === 0)
    
    workFlow.map((currentWeatherPoint) => {
    const nowTimeMark = new Date(currentWeatherPoint.dt_txt);
      forecastMessage.push({
        date: `${nowTimeMark.toLocaleDateString("uk-UA")}`,
        time: `${nowTimeMark.getHours()}:${
          nowTimeMark.getMinutes().toString.length == 1
            ? "0" + nowTimeMark.getMinutes()
            : nowTimeMark.getMinutes()
        }`,
        temperature: `${kelvinToCelsius(
          currentWeatherPoint.main.temp
        )} °C відчувається ${kelvinToCelsius(
          currentWeatherPoint.main.feels_like
        )} °C`,
        details: `${currentWeatherPoint.weather[0].description}, вітер ${currentWeatherPoint.wind.speed} м/c, `,
      });
    });

  }

  let currentDate = new Date().toLocaleDateString("uk-UA");
  const message = [currentDate, "\n"];
  forecastMessage.forEach((el) => {
    if (el.date !== currentDate) {
      message.push("\n", el.date, "\n");
      currentDate = el.date;
    }
    message.push(`${el.time}: ${el.temperature}, ${el.details}\n`);
  });

  return message;
}

function getWeather(cityName) {
  const apiRequestUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&lang=ua&appid=${process.env.OPENWEATHER_APPID}`;

  const weather = axios({
    method: "GET",
    url: apiRequestUrl,
  })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });

  return weather;
}

function kelvinToCelsius(temperature) {
  return (temperature - 273.15).toFixed();
}
