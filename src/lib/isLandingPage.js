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

export const isLandingPage = async startUrl => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  let langs = null;
  await page.goto(startUrl);
  langs = await hrefLinks(page);
  langs = [...new Set(langs)]; // unique

  if (langs.length === 2) {
    if (isURL(langs[0])) {
      console.log("is link landing page = true");
      return langs[0];
    } else {
      return startUrl;
    }
  }

  await page.goto(startUrl);
  // await page.screenshot({ path: "example.png" });

  langs = await formLinks(page);
  langs = [...new Set(langs)]; // unique

  if (langs.length === 2) {
    if (isURL(langs[0])) {
      console.log("is form landing = true");
      return langs[0];
    } else {
      return startUrl;
    }
  }

  browser.close();

  return startUrl;
};
