console.log("Merhaba, bu proje Slack kripto botu için hazırlanıyor.");
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Slack kripto bot çalışıyor.");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server çalışıyor → Port: ${PORT}`);
});
