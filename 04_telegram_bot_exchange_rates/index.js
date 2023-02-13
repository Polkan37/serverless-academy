const axios = require("axios");
const city = "Kyiv";
let intervalId;
const token = process.env.TELEGRAM_API_TOKEN;

process.env.NTBA_FIX_350 = "1";
const TelegramBot = require("node-telegram-bot-api");
const bot = new TelegramBot(token, { polling: true });

const NodeCache = require("node-cache");
const myCache = new NodeCache();

//currencyCodes array of codes in ISO 4217 format usd=840, eur=978 for Monobank API
const currencies = [840, 978];

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

bot.onText(/\/Курс Валют/, async (msg) => {
  bot.sendMessage(msg.chat.id, "Оберіть валюту", {
    reply_markup: {
      resize_keyboard: true,
      force_reply: true,
      keyboard: [["USD", "EUR"], ["В попереднє меню"]],
    },
  });
  if (!myCache.has("monoCurrencyRate")) cacheCurrencyData();
  if (!myCache.has("privatCurrencyRate")) getPrivatbankCurrencyRate();
});

bot.onText(/USD/, async (msg) => {
  const monoRate = myCache.has("monoCurrencyRate")
    ? myCache.get("monoCurrencyRate")
    : undefined;
  const privatRate = myCache.has("privatCurrencyRate")
    ? myCache.get("privatCurrencyRate")
    : undefined;

  if (monoRate && privatRate) {
    const monoUSDsell = monoRate
      .find((el) => el.currencyCodeA == 840)
      .rateSell.toFixed(2);
    const monoUSDbuy = monoRate
      .find((el) => el.currencyCodeA == 840)
      .rateBuy.toFixed(2);
    const privatUSDsell = Number(
      privatRate.find((el) => el.ccy == "USD").sale
    ).toFixed(2);
    const privatUSDbuy = Number(
      privatRate.find((el) => el.ccy == "USD").buy
    ).toFixed(2);

    bot.sendMessage(
      msg.chat.id,
      `USD - UAH
    *Monobank*
    sell: ${monoUSDsell} ₴
    buy: ${monoUSDbuy} ₴
    *Privatbank*
    sell: ${privatUSDsell} ₴
    buy: ${privatUSDbuy} ₴  
      `
    );
  }
});

bot.onText(/EUR/, (msg) => {
  const monoRate = myCache.has("monoCurrencyRate")
    ? myCache.get("monoCurrencyRate")
    : undefined;
  const privatRate = myCache.has("privatCurrencyRate")
    ? myCache.get("privatCurrencyRate")
    : undefined;

  if (monoRate && privatRate) {
    const monoEURsell = monoRate
      .find((el) => el.currencyCodeA == 978)
      .rateSell.toFixed(2);
    const monoEURbuy = monoRate
      .find((el) => el.currencyCodeA == 978)
      .rateBuy.toFixed(2);
    const privatEURsell = Number(
      privatRate.find((el) => el.ccy == "EUR").sale
    ).toFixed(2);
    const privatEURbuy = Number(
      privatRate.find((el) => el.ccy == "EUR").buy
    ).toFixed(2);

    bot.sendMessage(
      msg.chat.id,
      `EUR - UAH
    *Monobank*
    sell: ${monoEURsell} ₴
    buy: ${monoEURbuy} ₴
    *Privatbank*
    sell: ${privatEURsell} ₴
    buy: ${privatEURbuy} ₴  
      `
    );
  }
});

bot.onText(/Кожні 3 годин/, async (msg) => {
  const forecast = await getForecast("all");
  bot.sendMessage(msg.chat.id, forecast.join(""), {
    reply_markup: {
      resize_keyboard: true,
      force_reply: true,
      keyboard: [["В попереднє меню"]],
    },
  });
});

bot.onText(/Кожні 6 годин/, async (msg) => {
  const forecast = await getForecast("nth");

  bot.sendMessage(msg.chat.id, forecast.join(""), {
    reply_markup: {
      resize_keyboard: true,
      force_reply: true,
      keyboard: [["В попереднє меню"]],
    },
  });
});

bot.onText(/В попереднє меню/, (msg) => {
  clearInterval(intervalId);
  showStartButtonsInTg(msg, "Оберіть опцію нижче");
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
      keyboard: [["/Погода"], ["/Курс Валют"]],
      resize_keyboard: true,
      force_reply: true,
    },
  });
}

async function cacheCurrencyData() {
  const dataMono = await getMonobankCurrencyRate(currencies);
  const dataPrivat = await getPrivatbankCurrencyRate();
  myCache.mset([{ key: "monoCurrencyRate", val: dataMono, ttl: 1200 }]);
  myCache.mset([{ key: "privatCurrencyRate", val: dataPrivat, ttl: 1200 }]);
}

async function getMonobankCurrencyRate(currencyCodes) {
  //currencyCodes array of codes in ISO 4217 format usd=840, eur=978

  const data = await axios({
    method: "get",
    url: "https://api.monobank.ua/bank/currency",
  });

  const result = [];
  currencyCodes.forEach((code) => {
    result.push(data.data.find((el) => el.currencyCodeA == code));
  });
  return result;
}

async function getPrivatbankCurrencyRate() {
  const data = await axios({
    method: "get",
    url: "https://api.privatbank.ua/p24api/pubinfo?exchange&json&coursid=11",
  });

  const result = [];
  result.push(data.data.find((el) => el.ccy == "USD"));
  result.push(data.data.find((el) => el.ccy == "EUR"));

  return result;
}

async function getForecast(param) {
  const forecast = await getWeather(city);
  const forecastMessage = [];

  if (param == "all") {
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
  if (param == "nth") {
    const workFlow = forecast.data.list.filter((el, index) => index % 2 === 0);

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
  const apiRequestUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&lang=ua&appid=2b387d56a3a890b72f295f70051506c6`;

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
