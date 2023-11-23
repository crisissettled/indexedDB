const DB_CURRENT_VERSION = 1;

const DB_NAME = "chat";
const STORE_MESSAGE = "message";

//init indexedDB
const initIdxedDB = () => {
  const request = indexedDB.open(DB_NAME, DB_CURRENT_VERSION);

  request.onupgradeneeded = function (event) {
    let db = event.target.result;
    console.log(event, "old version");
    if (event.oldVersion > 0) {
      if (db.objectStoreNames.contains(STORE_MESSAGE)) {
        db.deleteObjectStore(STORE_MESSAGE);
      }
    }

    //init / update schema based on version
    if (!db.objectStoreNames.contains(STORE_MESSAGE)) {
      db.createObjectStore(STORE_MESSAGE, {
        autoIncrement: true,
      });
    }
  };

  request.onsuccess = function (event) {
    let db = event.target.result;
    console.log(db, "request.onsuccess -init");
    db.onversionchange = function () {
      db.close();
      alert("Database is outdated, please reload the page.");
    };
  };

  request.onerror = function (event) {
    console.log(event, "request.onerror Init");
    const request = event.target;
    alert(request.error);
  };
};

//add data
const addData = (data) => {
  let request = indexedDB.open(DB_NAME, DB_CURRENT_VERSION);
  request.onsuccess = function (event) {
    console.log(event, "request.onsuccess");
    let db = event.target.result;

    const transaction = db.transaction(STORE_MESSAGE, "readwrite");

    // report on the success of opening the transaction
    transaction.oncomplete = (event) => {
      console.log(event, "transaction.oncomplete -add");
    };

    // create an object store on the transaction
    const objectStore = transaction.objectStore(STORE_MESSAGE);

    // add our newItem object to the object store
    const objectStoreRequest = objectStore.put(data);

    objectStoreRequest.onsuccess = (event) => {
      // report the success of the request (this does not mean the item
      // has been stored successfully in the DB - for that you need transaction.oncomplete)
      console.log(event, "objectStoreRequest.onsuccess -add");
    };
  };

  request.onerror = function (event) {
    const request = event.target;
    alert(request.error);
  };
};

//read data
const readData = () => {
  return new Promise((resolve, reject) => {
    let request = indexedDB.open(DB_NAME, DB_CURRENT_VERSION);
    request.onsuccess = function (event) {
      let db = event.target.result;

      const transaction = db.transaction(STORE_MESSAGE, "readonly");

      // report on the success of opening the transaction
      transaction.oncomplete = (event) => {
        console.log(event, "transaction.oncomplete -read");
      };

      // create an object store on the transaction
      const objectStore = transaction.objectStore(STORE_MESSAGE);

      // add our newItem object to the object store
      const objectStoreRequest = objectStore.getAll();

      objectStoreRequest.onsuccess = (event) => {
        // report the success of the request (this does not mean the item
        // has been stored successfully in the DB - for that you need transaction.oncomplete)
        console.log(event, "objectStoreRequest.onsuccess -read");
        resolve(event.target.result);
      };
    };

    request.onerror = function (event) {
      const request = event.target;
      reject(request.error);
    };
  });
};

initIdxedDB();

document.querySelector("#addMessage").addEventListener("click", function () {
  let message = {
    price: 10,
    created: new Date(),
  };

  addData(message);
});

document
  .querySelector("#readMessage")
  .addEventListener("click", async function () {
    const data = await readData();
    let formattedJson = "";
    for (let dataItem of data) {
      console.log(dataItem);
      formattedJson += `${JSON.stringify(dataItem, null, 2)}\r\n\r\n`;
    }
    document.querySelector("#txtContent").value = formattedJson;
  });
