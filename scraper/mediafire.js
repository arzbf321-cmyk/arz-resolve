// file: scrapers/mediafire.js
const axios = require("axios");
const cheerio = require("cheerio");

const DEFAULT_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

async function scrape(url) {
  try {
    const cleanUrl = url.match(/https?:\/\/[^\s]+/i) ? url.match(/https?:\/\/[^\s]+/i)[0] : url;
    const res = await axios.get(cleanUrl, {
      headers: { "User-Agent": DEFAULT_UA },
      timeout: 15000,
    });

    const html = res.data;
    if (html.includes("error.php?errno=")) throw new Error("File tidak ditemukan.");

    const $ = cheerio.load(html);
    let directUrl = $("#downloadButton").attr("href");
    
    if (!directUrl) {
      directUrl = html.match(/href=["'](https?:\/\/download\d*\.mediafire\.com\/[^"']+)["']/i)?.[1];
    }
    if (!directUrl) throw new Error("Gagal mendapatkan direct link.");

    let filename = $(".filename").text().trim() || "MediaFire File";
    let size = $("ul.details li:contains('File size:') span").text().trim() || "Unknown";

    return {
      status: true,
      result: { title: filename, filename, size, url: directUrl }
    };
  } catch (error) {
    return { status: false, message: error.message };
  }
}

module.exports = { scrape };