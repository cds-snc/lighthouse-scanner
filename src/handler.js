"use strict";
import { getNextDomain, saveToFirestore, scanURL } from "./lib/";
import isURL from "isurl";

export const handle = async () => {
  const domain = await getNextDomain();

  let prot = domain.prot || "https://";
  const data = await scanURL(`${prot}${domain.url}`);

  let startUrl = domain.url;

  if (data && data.finalUrl && isURL(data.finalUrl)) {
    const url = new URL(data.finalUrl);
    startUrl = `${url.hostname}${url.pathname}`;
  }

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

  await saveToFirestore(updatePayload, "domains");

  const payload = {
    url: domain.url,
    data: data
  };

  await saveToFirestore(payload, "scans");

  return true;
};
