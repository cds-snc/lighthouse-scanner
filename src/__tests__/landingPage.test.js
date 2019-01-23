import { isLandingPage } from "../lib/isLandingPage";
import { RequestInterceptor, ResponseFaker } from "puppeteer-request-spy";
import { getFile } from "../lib/getFile";
import path from "path";

const matcher = (testee, keyword) => {
  return testee.indexOf(keyword) > -1;
};

it("Can detect a landing page", async () => {
  const domain = "https://wet-boew.github.io/themes-dist/GCWeb/splashpage.html";
  const htmlPath = path.resolve(__dirname, "../__mocks__/default-landing.html");
  const fileResult = await getFile(htmlPath);
  const htmlResponseFaker = new ResponseFaker(domain, {
    status: 200,
    contentType: "text/html",
    body: fileResult.toString("utf8")
  });

  const requestInterceptor = new RequestInterceptor(matcher);
  requestInterceptor.addFaker(htmlResponseFaker);
  page.setRequestInterception(true);
  page.on("request", requestInterceptor.intercept.bind(requestInterceptor));

  const result = await isLandingPage(domain, {
    browser,
    page
  });

  expect(result).toEqual(
    "https://wet-boew.github.io/themes-dist/GCWeb/index-en.html"
  );
});
