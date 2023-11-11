const DB_VERSION = {
  current: 2,
  v1: 1,
  v2: 2,
};
const DB_NAME = "chat";
const STORE_MESSAGE = "message";

let dbOpenRequest = indexedDB.open(DB_NAME, DB_VERSION.current);

dbOpenRequest.onupgradeneeded = function (event) {
  let db = dbOpenRequest.result;
  console.log(event.oldVersion, "old version");
  if (event.oldVersion === 0) {
    //init schema
    if (!db.objectStoreNames.contains(STORE_MESSAGE)) {
      db.createObjectStore(STORE_MESSAGE, {
        keyPath: "id",
      });
    }
  } else {
    if (db.objectStoreNames.contains(STORE_MESSAGE)) {
      db.deleteObjectStore(STORE_MESSAGE);
    }
  }

  //update schema based on version
  if (DB_VERSION.current === DB_VERSION.v2) {
    if (!db.objectStoreNames.contains(STORE_MESSAGE)) {
      db.createObjectStore(STORE_MESSAGE, {
        autoIncrement: true,
      });
    }
  }
};

dbOpenRequest.onsuccess = function () {
  let db = dbOpenRequest.result;
  console.log(db, "db object");
  db.onversionchange = function () {
    db.close();
    alert("Database is outdated, please reload the page.");
  };
};

dbOpenRequest.onerror = function () {
  let db = dbOpenRequest;
  alert(db.error);
};

document.querySelector("#addMessage").addEventListener("click", function () {
  let db = dbOpenRequest.result;
  let transaction = db.transaction(STORE_MESSAGE, "readwrite");
  let storeMessage = transaction.objectStore(STORE_MESSAGE);
  let message = {
    id: 1,
    price: 10,
    created: new Date(),
  };

  storeMessage.add(message);
});
