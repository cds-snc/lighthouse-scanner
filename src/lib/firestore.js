const admin = require("firebase-admin");
const url = require("url");

let db;

switch (process.env.NODE_ENV) {
  case "dev":
    const serviceAccount = require("../../../lighthouse-scanner-firebase-adminsdk.json");

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.FIRESTORE_URL
    });
    db = admin.firestore();
    break;

  case "test":
    const MockCloudFirestore = require("mock-cloud-firestore");
    const { fixtureData } = require("../__mocks__/firestore.js");
    let firebase = new MockCloudFirestore(fixtureData);
    db = firebase.firestore();
    break;

  default:
    const functions = require("firebase-functions");
    admin.initializeApp(functions.config().firebase);
    db = admin.firestore();
}

module.exports.saveToFirestore = async (payload, table) => {
  payload["updatedAt"] = Date.now();
  const key = new url.URL(payload.url).hostname;

  return db
    .collection(table)
    .doc(key)
    .set(payload, { merge: true })
    .then(resp => true);
};
