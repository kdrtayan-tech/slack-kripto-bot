const { App } = require("@slack/bolt");
require("dotenv").config();

// Slack uygulamasını başlat
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: false,
  appToken: undefined
});

// Slash command: /kripto_teyit
app.command("/kripto_teyit", async ({ command, ack, respond }) => {
  await ack();

  const wallet = command.text?.trim();

  if (!wallet) {
    return respond("❗ Lütfen bir cüzdan adresi girin. Örnek: `/kripto_teyit 0xABC123`");
  }

  // Basit örnek doğrulama (gerçekte burada API kontrolü yapılacak)
  if (wallet.length < 20) {
    return respond(`❌ **Geçersiz cüzdan adresi**: \`${wallet}\``);
  }

  return respond(`✅ Cüzdan adresi geçerli görünüyor: \`${wallet}\``);
});

// Express sunucusunu aç
const express = require("express");
const server = express();

server.get("/", (req, res) => {
  res.send("Slack Kripto Bot Çalışıyor!");
});

server.listen(process.env.PORT || 3000, async () => {
  console.log("Server started");

  await app.start();
  console.log("Slack bot aktif!");
});
