import path from "path";
import { getFile } from "./lib/getFile";
import { saveToFirestore } from "./lib/";

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

export const loadUrls = async () => {
  const file = path.resolve(__dirname, `../urls.json`);
  const result = await getFile(file);
  try {
    const urls = JSON.parse(result);
    asyncForEach(urls, async url => {
      const payload = {
        url: url
      };
      await saveToFirestore(payload, "domains");
      console.log(`Added ${url} to domains list`);
    });
  } catch (e) {
    console.log(e.message);
    return {};
  }
};
