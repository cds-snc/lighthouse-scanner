const lighthouse = require("lighthouse");
const chromeLauncher = require("chrome-launcher");
const path = require("path");
const BrowserFetcher = require("puppeteer/lib/BrowserFetcher");
const isLandingPage = require("./isLandingPage").isLandingPage;

const browserFetcher = new BrowserFetcher(
  path.join(__dirname, "../../node_modules/puppeteer/")
);
const packageJson = require("puppeteer/package.json");
const revision = packageJson.puppeteer.chromium_revision;
const revisionInfo = browserFetcher.revisionInfo(revision);

let opts = {
  lighthouseFlags: {
    output: "json",
    disableDeviceEmulation: true,
    port: ""
  },
  chromeFlags: ["--headless", "--no-sandbox"],
  writeTo: "./",
  sortByDate: true
};

export const scanURL = async url => {
  const chrome = await chromeLauncher.launch({
    chromeFlags: opts.chromeFlags,
    chromePath: revisionInfo.executablePath
  });

  opts.lighthouseFlags.port = chrome.port;

  let startUrl = "";

  startUrl = await isLandingPage(url);
  const res = await lighthouse(startUrl, opts.lighthouseFlags);
  await chrome.kill();
  return JSON.parse(res.report);
};
