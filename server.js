// file: server.js
const express = require("express");
const path = require("path");

const mediafire = require("./scrapers/mediafire");
const safelinku = require("./scrapers/safelinku");
const krakenfiles = require("./scrapers/krakenfiles");
const sfile = require("./scrapers/sfile");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/resolve", async (req, res) => {
  const { url } = req.body;

  if (!url || typeof url !== "string") {
    return res.status(400).json({ status: false, message: "URL tidak valid." });
  }

  try {
    let result;

    // Deteksi domain dan lempar ke scraper masing-masing
    if (url.includes("mediafire.com")) {
      result = await mediafire.scrape(url);
    } else if (url.includes("safelinku")) {
      result = await safelinku.scrape(url);
    } else if (url.includes("krakenfiles.com")) {
      result = await krakenfiles.scrape(url);
    } else if (url.includes("sfile.co") || url.includes("sfile.mobi")) {
      result = await sfile.scrape(url);
    } else {
      return res.status(400).json({ status: false, message: "Domain tidak dikenali." });
    }

    return res.json(result);
  } catch (err) {
    return res.status(500).json({ status: false, message: "Gagal resolve link." });
  }
});

app.listen(PORT, () => {
  console.log(`[+] Server jalan di http://localhost:${PORT}`);
});