require = require("esm")(module); // eslint-disable-line no-global-assign
require("dotenv-safe").config({ allowEmptyValues: true });

const deleteAllCollections = require("./delete").deleteAllCollections;
const handle = require("./handler").handle;
const loadUrls = require("./loader").loadUrls;

const scanDomain = async (request, response) => {
  await handle();
  return response.status(200).send("Done");
};

// used for local testing
(async () => {
  const argv = require("minimist")(process.argv.slice(2));
  const { deleteAll, mockPayload, urls } = argv;
  if (deleteAll) {
    await deleteAllCollections();
  }
  if (mockPayload) {
    const result = await handle();
    console.log(result);
    return;
  }
  if (urls) {
    const result = await loadUrls();
    console.log(result);
  }
})();

module.exports.scanDomain = scanDomain;
