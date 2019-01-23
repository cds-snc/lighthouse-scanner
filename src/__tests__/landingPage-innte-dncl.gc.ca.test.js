import { isLandingPage } from "../lib/isLandingPage";
import { createRequestInterceptor } from "../util/requestInterceptor";

it("Can detect lnnte-dncl.gc.ca landing page", async () => {
  const domain = "https://lnnte-dncl.gc.ca";
  const requestInterceptor = await createRequestInterceptor(
    domain,
    "innte-dncl.html"
  );

  page.setRequestInterception(true);
  page.on("request", requestInterceptor.intercept.bind(requestInterceptor));

  const result = await isLandingPage(domain, {
    browser,
    page
  });

  expect(result).toEqual("https://lnnte-dncl.gc.ca");
});
