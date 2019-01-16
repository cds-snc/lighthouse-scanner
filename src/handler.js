"use strict";
import { getNextDomain, saveToFirestore, scanURL } from "./lib/";
import isURL from "isurl";
const URL = require("url").URL;

export const handle = async () => {
  const domain = await getNextDomain();

  let prot = "http://";
  const data = await scanURL(`${prot}${domain.url}`);

  let startUrl = domain.url;

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
    originalKey: domain.id,
    url: startUrl
  };

  await saveToFirestore(updatePayload, "domains");

  const payload = {
    originalKey: domain.id,
    url: domain.url,
    data: data
  };

  await saveToFirestore(payload, "scans");

  return true;
};
