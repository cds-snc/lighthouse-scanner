const admin = require("firebase-admin");
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

module.exports.deleteCollection = async (collectionPath, batchSize) => {
  var collectionRef = db.collection(collectionPath);
  var query = collectionRef.orderBy("__name__").limit(batchSize);

  return new Promise((resolve, reject) => {
    deleteQueryBatch(db, query, batchSize, resolve, reject);
  });
};

function deleteQueryBatch(db, query, batchSize, resolve, reject) {
  query
    .get()
    .then(snapshot => {
      // When there are no documents left, we are done
      if (snapshot.size === 0) {
        return 0;
      }

      // Delete documents in a batch
      var batch = db.batch();
      snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });

      return batch.commit().then(() => {
        return snapshot.size;
      });
    })
    .then(numDeleted => {
      if (numDeleted === 0) {
        resolve();
        return;
      }

      // Recurse on the next process tick, to avoid
      // exploding the stack.
      process.nextTick(() => {
        deleteQueryBatch(db, query, batchSize, resolve, reject);
      });
    })
    .catch(reject);
}
module.exports.getNextDomain = async () => {
  const reposRef = db.collection("domains");
  const latestQuery = reposRef.orderBy("updatedAt", "asc").limit(1);
  const latestCollection = await latestQuery.get();
  let latest = [];
  latestCollection.forEach(r => latest.push(r));
  return latest.length > 0 ? latest[0] : false;
};

module.exports.saveToFirestore = async (document, payload, table) => {
  payload["updatedAt"] = Date.now();
  return db
    .collection(table)
    .doc(document.id)
    .set(payload, { merge: true })
    .then(resp => true)
    .catch(e => {
      console.log(e.message);
    });
};
