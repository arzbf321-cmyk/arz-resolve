// file: netlify/functions/resolve.js
const mediafire = require("../../scrapers/mediafire");
const safelinku = require("../../scrapers/safelinku");
const krakenfiles = require("../../scrapers/krakenfiles");
const sfile = require("../../scrapers/sfile");

exports.handler = async (event, context) => {
    // Cuma nerima POST
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const { url } = JSON.parse(event.body);
        if (!url) return { statusCode: 400, body: JSON.stringify({ status: false, message: "URL kosong" }) };

        let result;
        if (url.includes("mediafire.com")) result = await mediafire.scrape(url);
        else if (url.includes("safelinku")) result = await safelinku.scrape(url);
        else if (url.includes("krakenfiles.com")) result = await krakenfiles.scrape(url);
        else if (url.includes("sfile")) result = await sfile.scrape(url);
        else result = { status: false, message: "Domain tidak didukung" };

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(result)
        };
    } catch (err) {
        return { statusCode: 500, body: JSON.stringify({ status: false, message: err.message }) };
    }
};
