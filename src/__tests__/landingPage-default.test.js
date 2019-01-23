import { isLandingPage } from "../lib/isLandingPage";
import { createRequestInterceptor } from "../util/requestInterceptor";

it.skip("Can detect a landing page", async () => {
  const domain = "https://wet-boew.github.io/themes-dist/GCWeb/splashpage.html";
  const requestInterceptor = await createRequestInterceptor(
    domain,
    "default-landing.html"
  );

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
