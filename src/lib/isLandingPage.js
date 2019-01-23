const URL = require("url").URL;
const puppeteer = require("puppeteer");
const isURL = require("isurl");
const langText = ["english", "français"];

const hasLang = node => {
  if (node.indexOf(langText[0]) !== -1 || node.indexOf(langText[1]) !== -1) {
    return true;
  }
  return false;
};

const hrefLinks = async page => {
  const hrefs = await page.$$eval("a", as =>
    as.map(a => {
      return { text: a.innerHTML.toLowerCase(), link: a.href };
    })
  );

  let langs = [];
  hrefs.map(item => {
    if (hasLang(item.text)) {
      langs.push(item.link);
    }
  });

  return langs;
};

const formLinks = async page => {
  let forms = await page.$$eval("form", forms => {
    return forms.map(form => {
      const html = form.outerHTML.toLowerCase();
      return { text: html, link: form.action };
    });
  });

  let langs = forms.filter(form => {
    return hasLang(form.text);
  });

  return langs;
};

const pageOptions = { waitUntil: ["domcontentloaded", "networkidle2"] };

export const isLandingPage = async (startUrl, useGlobalPuppeteer = false) => {
  /*
  const options = {
    headless: false,
    slowMo: 3000
  };
  */

  const browser = !useGlobalPuppeteer
    ? await puppeteer.launch()
    : useGlobalPuppeteer.browser;
  const page = !useGlobalPuppeteer
    ? await browser.newPage()
    : useGlobalPuppeteer.page;

  let langs = null;
  await page.goto(startUrl, pageOptions);
  langs = await hrefLinks(page);
  langs = [...new Set(langs)]; // unique

  if (langs.length >= 2) {
    if (isURL(new URL(langs[0]))) {
      console.log("is link landing page = true");

      if (!useGlobalPuppeteer) {
        await browser.close();
      }
      return langs[0];
    } else {
      if (!useGlobalPuppeteer) {
        await browser.close();
      }
      return startUrl;
    }
  }

  await page.goto(startUrl, pageOptions);
  // await page.screenshot({ path: "example.png" });

  langs = await formLinks(page);
  langs = [...new Set(langs)]; // unique

  if (langs.length >= 2) {
    if (isURL(new URL(langs[0]))) {
      console.log("is form landing = true");
      return langs[0];
    } else {
      return startUrl;
    }
  }

  if (!useGlobalPuppeteer) {
    await browser.close();
  }

  return startUrl;
};
