const express = require("express");
const bodyParser = require("body-parser");
const { google } = require("googleapis");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// --- GOOGLE AUTH ---
const creds = JSON.parse(process.env.GOOGLE_CREDS);

const auth = new google.auth.GoogleAuth({
  credentials: creds,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

app.post("/slack/command", async (req, res) => {
  try {
    console.log("=== Slash command geldi ===");
    console.log(req.body);

    const walletAddress = req.body.text;
    const user = req.body.user_name || "unknown";
    const timestamp = new Date().toISOString();

    console.log("Wallet:", walletAddress);
    console.log("User:", user);
    console.log("Timestamp:", timestamp);

    // Google Sheets bağlan
    console.log("Google Auth başlıyor...");
    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });

    const sheetId = process.env.SHEET_ID;
    const sheetName = process.env.SHEET_NAME;

    console.log("Sheets appendRow'a gidiyor...");

    // --- KRİTİK NOKTA: BURAYA GELİYOR MU GÖRECEĞİZ ---
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: `${sheetName}!A1:C1`,
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [[walletAddress, user, timestamp]],
      },
    });

    console.log("Sheets appendRow OK:", response.status);

    // Slack'e mesaj dön
    res.json({
      response_type: "in_channel",
      text: `✅ ${user}, cüzdan adresin kaydedildi:\n\`${walletAddress}\``,
    });

  } catch (err) {
    console.error("HATA OLDU:", err);

    // Slack'e hata mesajı
    res.json({
      response_type: "ephemeral",
      text: `❌ Hata: ${err.message}`,
    });
  }
});

app.listen(10000, () => console.log("Bot 10000 portunda çalışıyor"));
