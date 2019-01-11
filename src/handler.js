"use strict";
import { getNextDomain, saveToFirestore, scanURL } from "./lib/";

export const handle = async () => {
  const domain = await getNextDomain();

  let prot = domain.prot || "https://";
  const data = await scanURL(`${prot}${domain.url}`);

  switch (data.runtimeError.code) {
    case "FAILED_DOCUMENT_REQUEST":
      prot = "http://";
      break;
    default:
      break;
  }

  const updatePayload = {
    prot: prot,
    url: domain.url
  };

  await saveToFirestore(updatePayload, "domains");

  const payload = {
    url: domain.url,
    data: data
  };

  await saveToFirestore(payload, "scans");

  return true;
};
