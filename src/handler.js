"use strict";
import { saveToFirestore, scanURL } from "./lib/";

import { webhook } from "./__mocks__/webhook";

export const local = async () => {
  const event = await webhook;
  return handle(event);
};

export const handle = async event => {
  const { url } = event.query;
  const data = await scanURL(url);

  const payload = {
    url: url,
    data: data
  };
  saveToFirestore(payload, "scans");
  return true;
};
