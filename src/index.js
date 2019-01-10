require = require("esm")(module); // eslint-disable-line no-global-assign
require("dotenv-safe").config({ allowEmptyValues: true });

const handle = require("./handler").handle;
const local = require("./handler").local;
const loadUrls = require("./loader").loadUrls;

const scanDomain = async (request, response) => {
  await handle(request);
  response.status(200).send("Done");
};

// used for local testing
(async () => {
  const argv = require("minimist")(process.argv.slice(2));
  const { mockPayload, urls } = argv;
  if (mockPayload) {
    const result = await local();
    console.log(result);
  }
  if (urls) {
    const result = await loadUrls();
    console.log(result);
  }
})();

module.exports.scanDomain = scanDomain;
