"use strict";
import { getNextDomain, saveToFirestore, scanURL } from "./lib/";
import isURL from "isurl";
const URL = require("url").URL;

export const handle = async () => {
  const document = await getNextDomain();
  const { url } = document.data();

  let prot = "http://";
  const data = await scanURL(`${prot}${url}`);
  let startUrl = url;

  if (data && data.finalUrl && isURL(new URL(data.finalUrl))) {
    const parsedURL = new URL(data.finalUrl);
    startUrl = `${parsedURL.hostname}${parsedURL.pathname}`;
  }

  console.log("save", startUrl);

  switch (data.runtimeError.code) {
    case "FAILED_DOCUMENT_REQUEST":
      prot = "http://";
      break;
    default:
      break;
  }

  const updatePayload = {
    prot: prot,
    url: startUrl
  };

  await saveToFirestore(document, updatePayload, "domains");

  const payload = {
    url: startUrl,
    data: data
  };

  await saveToFirestore(document, payload, "scans");

  return true;
};
