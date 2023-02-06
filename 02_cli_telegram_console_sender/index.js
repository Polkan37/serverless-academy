const { Command } = require("commander");
const program = new Command();

process.env.NTBA_FIX_350 = '1'
const token = "5204989571:AAEp9p9YX4nWDzS5CMubY1snqc9SqBBFjVo";
const chatId = "247856090";

const TelegramBot = require("node-telegram-bot-api");
const bot = new TelegramBot(token, { polling: true });

program
  .version("0.1.0")
  .command("message <message>")
  .alias("m")
  .description("Send message to Telegram Bot")
  .action(async function (message) {
    await bot.sendMessage(chatId, message);
    process.exit();
  });

program
  .command("photo <path>")
  .alias("p")
  .description(
    "Send photo to telegram Bot. Just drag and drop it console after p-flag"
  )
  .action(async function (photoPath) {
    console.log("photoPath", photoPath);
    const url = photoPath;
    await bot.sendPhoto(chatId, url);
    process.exit();

  });

program.parse(process.argv);