const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const { Client, LocalAuth } = require("whatsapp-web.js");
const QRCode = require("qrcode");
const crypto = require("crypto");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY || "49bd13bd";
const API_SECRET = process.env.API_SECRET || "DliY4fiDOrvBBCDo";
const SITE_PASSWORD = "Barry-MD";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const db = new sqlite3.Database("bot.db");

function initDatabase() {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS codes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT NOT NULL,
        number TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS sent_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT NOT NULL,
        number TEXT NOT NULL,
        repeat_count INTEGER DEFAULT 1,
        sent_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  });
}

function validateApi(req, res, next) {
  const key = req.headers["x-api-key"];
  const secret = req.headers["x-api-secret"];

  if (key !== API_KEY || secret !== API_SECRET) {
    return res.status(401).json({ error: "Accès refusé" });
  }

  next();
}

function validateAuth(req, res, next) {
  const password = req.headers["x-password"] || req.body.password || req.query.password;
  
  if (password !== SITE_PASSWORD) {
    return res.status(401).json({ error: "Mot de passe incorrect" });
  }

  next();
}

function normalizePhone(number) {
  if (!number) return "";
  const cleaned = number.toString().replace(/\D/g, "");
  if (!cleaned) return "";
  return `${cleaned}@c.us`;
}

app.post("/api/login", (req, res) => {
  const { password } = req.body;

  if (password !== SITE_PASSWORD) {
    return res.status(401).json({ error: "Mot de passe incorrect" });
  }

  const token = crypto.randomBytes(32).toString("hex");
  global.sessions = global.sessions || {};
  global.sessions[token] = Date.now() + 24 * 60 * 60 * 1000;

  res.json({ success: true, token, message: "Authentification réussie" });
});

function checkSession(req, res, next) {
  const token = req.headers["x-token"] || req.body.token || req.query.token;
  global.sessions = global.sessions || {};

  if (!token || !global.sessions[token] || global.sessions[token] < Date.now()) {
    return res.status(401).json({ error: "Session expirée ou invalide" });
  }

  next();
}

app.get("/api/status", (req, res) => {
  res.json({ status: "OK", service: "whatsapp-code-bot" });
});

app.post("/api/add-code", checkSession, validateApi, (req, res) => {
  const { code, number } = req.body;

  if (!code || !number) {
    return res.status(400).json({ error: "Le code et le numéro sont requis." });
  }

  db.run(
    "INSERT INTO codes (code, number) VALUES (?, ?)",
    [String(code).trim(), String(number).trim()],
    function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Erreur lors de l'ajout du code." });
      }

      res.json({ success: true, message: "Code ajouté avec succès.", id: this.lastID });
    }
  );
});

app.get("/api/codes", checkSession, validateApi, (req, res) => {
  db.all("SELECT * FROM codes ORDER BY id DESC", (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Erreur de lecture des codes." });
    }

    res.json(rows);
  });
});

app.post("/api/send-code", checkSession, validateApi, async (req, res) => {
  const { code, number, repeatCount = 1 } = req.body;

  if (!code || !number) {
    return res.status(400).json({ error: "Le code et le numéro sont requis." });
  }

  const client = global.whatsappClient;
  if (!client) {
    return res.status(503).json({ error: "Le client WhatsApp n'est pas encore connecté." });
  }

  const repeatTimes = Number(repeatCount) || 1;
  const target = normalizePhone(number);

  if (!target) {
    return res.status(400).json({ error: "Le numéro est invalide." });
  }

  try {
    for (let i = 0; i < repeatTimes; i++) {
      await client.sendMessage(target, `Votre code est : ${code}`);
      db.run(
        "INSERT INTO sent_logs (code, number, repeat_count) VALUES (?, ?, ?)",
        [String(code).trim(), String(number).trim(), repeatTimes]
      );
    }

    res.json({
      success: true,
      message: `Code envoyé ${repeatTimes} fois à ${number}.`
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Échec lors de l'envoi du message." });
  }
});

app.get("/api/qr", checkSession, (req, res) => {
  if (global.qrCode) {
    return res.json({ qr: global.qrCode });
  }

  res.json({ qr: null, message: "QR non encore généré." });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const client = new Client({
  authStrategy: new LocalAuth({ dataPath: "./session" }),
  puppeteer: {
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  }
});

client.on("qr", async (qr) => {
  const qrDataUrl = await QRCode.toDataURL(qr);
  global.qrCode = qrDataUrl;
  console.log("Scannez ce QR code dans WhatsApp Web.");
});

client.on("ready", () => {
  console.log("WhatsApp connecté avec succès.");
  global.whatsappClient = client;
});

client.on("auth_failure", (message) => {
  console.error("Échec d'authentification :", message);
});

client.on("disconnected", (reason) => {
  console.log("Déconnecté de WhatsApp :", reason);
});

client.initialize();
initDatabase();

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
