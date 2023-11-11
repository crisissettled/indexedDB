const DB_VERSION = {
  current: 1,
  v1: 1,
  v2: 2,
};
const DB_NAME = "chat";
const TABLE_MESSAGE = "message";

let openRequest = indexedDB.open(DB_NAME, DB_VERSION.current);

openRequest.onupgradeneeded = function (event) {
  let db = openRequest.result;

  switch (event.oldVersion) {
    case 0:
      //init schema
      if (!db.objectStoreNames.contains(TABLE_MESSAGE)) {
        db.createObjectStore(TABLE_MESSAGE, { keyPath: "id" });
      }

      break;
    case DB_VERSION.v1:
      //update schema
      break;
    default:
      console.warn("un-supported version");
  }
};

openRequest.onsuccess = function () {
  let db = openRequest.result;

  db.onversionchange = function () {
    db.close();
    alert("Database is outdated, please reload the page.");
  };
};

openRequest.onerror = function () {
  let db = openRequest.result;
  if (db.version !== DB_VERSION.current) {
    alert("your page is outdated,please reload");
  }
};
