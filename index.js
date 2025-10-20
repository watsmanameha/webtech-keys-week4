import express from "express";          // <— дефолтный импорт, не { express }
import multer from "multer";
import forge from "node-forge";

const app = express();
const LOGIN = "edzhulaj";

// Простейший CORS на всё
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

app.get("/login", (req, res) => res.type("text/plain; charset=UTF-8").send(LOGIN));

app.post("/decypher", upload.fields([{ name: "key", maxCount: 1 }, { name: "secret", maxCount: 1 }]), (req, res) => {
  try {
    if (!req.files?.key?.[0] || !req.files?.secret?.[0]) return res.status(400).type("text/plain").send("Отсутствуют key/secret");
    const privateKeyPem = req.files.key[0].buffer.toString("utf8");
    const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
    const encryptedBytes = forge.util.binary.raw.encode(req.files.secret[0].buffer);
    // Если шифровали OAEP-SHA256, раскомментируй md: forge.md.sha256.create()
    const decrypted = privateKey.decrypt(encryptedBytes, "RSA-OAEP"); // , { md: forge.md.sha256.create() }
    res.type("text/plain; charset=UTF-8").send(decrypted);
  } catch (e) {
    console.error(e);
    res.status(400).type("text/plain; charset=UTF-8").send(`Ошибка расшифровки: ${e.message}`);
  }
});

app.get("/", (req, res) => res.type("text/plain; charset=UTF-8").send("ok"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
