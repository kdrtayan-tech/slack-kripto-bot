console.log("Merhaba, bu proje Slack kripto botu için hazırlanıyor.");
const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Slack Crypto Bot Çalışıyor!");
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
