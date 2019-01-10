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

module.exports.getNextDomain = async () => {
  const reposRef = db.collection("domains");
  const latestQuery = reposRef.orderBy("updatedAt", "asc").limit(1);
  const latestCollection = await latestQuery.get();
  let latest = [];
  latestCollection.forEach(r => latest.push(r.data()));
  return latest[0];
};

module.exports.saveToFirestore = async (payload, table) => {
  payload["updatedAt"] = Date.now();
  const key = new url.URL(payload.url).hostname;

  return db
    .collection(table)
    .doc(key)
    .set(payload, { merge: true })
    .then(resp => true);
};
