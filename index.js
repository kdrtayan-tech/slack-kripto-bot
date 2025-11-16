const express = require("express");
const bodyParser = require("body-parser");
const { google } = require("googleapis");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// --- GOOGLE AUTH ---
console.log("🔑 GOOGLE_CREDS okunuyor...");
const creds = JSON.parse(process.env.GOOGLE_CREDS);

const auth = new google.auth.GoogleAuth({
  credentials: creds,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

app.post("/slack/command", async (req, res) => {
  console.log("====================================");
  console.log("🚀 Slack komutu endpoint'e ulaştı");
  console.log("Request Body:", req.body);

  try {
    const walletAddress = req.body.text;
    const user = req.body.user_name || "unknown";
    const timestamp = new Date().toISOString();

    console.log("➡️ Wallet:", walletAddress);
    console.log("➡️ User:", user);
    console.log("➡️ Timestamp:", timestamp);

    // Google Sheets Bağlantısı
    console.log("🔐 Google Auth client alınıyor...");
    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });

    const sheetId = process.env.SHEET_ID;
    const sheetName = process.env.SHEET_NAME;

    console.log("📄 Sheet ID:", sheetId);
    console.log("📄 Sheet Name:", sheetName);

    console.log("📌 Google Sheets'e yazma işlemi başlıyor...");

    // ASIL KRİTİK NOKTA — append işlemi
    const result = await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: `${sheetName}!A:C`,   // <-- Burası düzeltilmiş HALİ
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[walletAddress, user, timestamp]],
      },
    });

    console.log("✅ Google Sheets append SUCCESS");
    console.log("Google Response:", result.data);

    // Slack'e başarı mesajı
    return res.json({
      response_type: "in_channel",
      text: `✅ ${user}, cüzdan adresin kaydedildi:\n\`${walletAddress}\``,
    });

  } catch (err) {
    console.log("❌ Google Sheets Append FAILED!");
    console.error(err);

    return res.json({
      response_type: "ephemeral",
      text: `❌ Hata oluştu: ${err.message}`,
    });
  }
});

// Sunucu
app.listen(10000, () => console.log("🚀 Bot 10000 portunda çalışıyor"));
