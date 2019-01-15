const puppeteer = require("puppeteer");
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
  console.log("isLandingPage => ", startUrl);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  let langs = null;
  await page.goto(startUrl);
  langs = await hrefLinks(page);

  if (langs.length === 2) {
    console.log("is link landing page = true");
    return langs[0];
  }

  await page.goto(startUrl);
  // await page.screenshot({ path: "example.png" });

  langs = await formLinks(page);

  if (langs.length === 2) {
    console.log("is form landing = true");
    return langs[0].link;
  }

  return startUrl;
};
