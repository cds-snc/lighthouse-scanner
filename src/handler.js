"use strict";
import { getNextDomain, saveToFirestore, scanURL } from "./lib/";

export const handle = async () => {
  const domain = await getNextDomain();
  const data = await scanURL(domain.url);

  const payload = {
    url: domain.url,
    data: data
  };

  await saveToFirestore(payload, "scans");

  const updatePayload = {
    url: domain.url
  };

  await saveToFirestore(updatePayload, "domains");

  return true;
};
