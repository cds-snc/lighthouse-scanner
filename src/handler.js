"use strict";
import { getNextDomain, saveToFirestore, scanURL } from "./lib/";
import isURL from "isurl";
const URL = require("url").URL;

export const handle = async () => {
  const document = await getNextDomain();
  const { url } = document.data();

  let failed = false;
  let data = {};
  let startUrl = url;
  let prot = "http://";

  try {
    data = await scanURL(`${prot}${url}`);

    if (data && data.finalUrl && isURL(new URL(data.finalUrl))) {
      const parsedURL = new URL(data.finalUrl);
      startUrl = `${parsedURL.hostname}${parsedURL.pathname}`;
    }

    console.log("Ran: ", startUrl);
  } catch (e) {
    console.error(e);
    failed = true;
  }

  const updatePayload = {
    failed: failed,
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
