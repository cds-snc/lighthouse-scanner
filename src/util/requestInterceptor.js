import { RequestInterceptor, ResponseFaker } from "puppeteer-request-spy";
import { getFile } from "../lib/getFile";
import path from "path";

const matcher = (testee, keyword) => {
  return testee.indexOf(keyword) > -1;
};

export const createRequestInterceptor = async (
  domain,
  file = "default-landing.html"
) => {
  const htmlPath = path.resolve(__dirname, `../__mocks__/${file}`);
  const fileResult = await getFile(htmlPath);
  const htmlResponseFaker = new ResponseFaker(domain, {
    status: 200,
    contentType: "text/html",
    body: fileResult.toString("utf8")
  });

  const requestInterceptor = new RequestInterceptor(matcher);
  requestInterceptor.addFaker(htmlResponseFaker);

  return requestInterceptor;
};
