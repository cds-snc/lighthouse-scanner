import { deleteCollection } from "./lib/";

export const deleteAllCollections = async () => {
  console.log("Deleting scans ...");
  await deleteCollection("scans", 10);
  console.log("Deleting domains ...");
  await deleteCollection("domains", 10);
  console.log("Done");
};
