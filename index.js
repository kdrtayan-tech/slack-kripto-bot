const express = require("express");
const app = express();

// Slack, slash command verisini form-data (x-www-form-urlencoded) olarak gönderir:
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Basit health check
app.get("/", (req, res) => {
  res.send("Slack kripto bot ayakta ✅");
});

// Slash command endpointi
app.post("/slack/events", (req, res) => {
  console.log("Gelen slash command:", req.body);

  const { command, text, user_name } = req.body;

  // Yanlış komut gelirse
  if (command !== "/kripto_teyit") {
    return res.json({
      response_type: "ephemeral",
      text: "Bu endpoint sadece `/kripto_teyit` için ayarlandı."
    });
  }

  const wallet = (text || "").trim();

  if (!wallet) {
    return res.json({
      response_type: "ephemeral",
      text:
        "❗ Cüzdan adresi girmediniz.\n" +
        "Lütfen şu formatta kullanın:\n`/kripto_teyit 0xAdresiniz`"
    });
  }

  // Şimdilik format kontrolü yapmıyoruz (C seçmiştin)
  return res.json({
    response_type: "ephemeral", // sadece komutu yazan kişi görür
    text: `✅ ${user_name}, cüzdan adresin şudur:\n\`${wallet}\``
  });
});

// Render portu
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda dinliyor 🚀`);
});
