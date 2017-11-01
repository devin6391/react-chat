var db, chatObjectStore, canUse = false;
var request = window.indexedDB.open("chatDb", 1);
var dbReadyEvent = new Event('dbReady');

request.onerror = function(event) {
  console.log("cannot open chat db");
};
request.onsuccess = function(event) {
  db = event.target.result;
  canUse = true;
  document.dispatchEvent(dbReadyEvent);
};
request.onupgradeneeded = function(event) {
  var db = event.target.result;

  // Create an objectStore for this database
  var objectStore = db.createObjectStore("chatHistory", { autoIncrement : true });
  // objectStore.createIndex("time", "time", { unique: true });
  // objectStore.createIndex("uid", "uid", { unique: false });
  // objectStore.createIndex("msg", "msg", { unique: false });
  // objectStore.createIndex("photoURL", "photoURL", { unique: false });
  // objectStore.createIndex("displayName", "displayName", { unique: false });

  objectStore.transaction.oncomplete = function(event) {
    // Store values in the newly created objectStore.
  };
};

const canBeUsed = function() {
  return canUse;
}

export function addDataToDb(data) {
  return new Promise((resolve, reject) => {
    if(!canUse) {
      reject("Database is not yet ready for transaction");
    }
    try{
      var msgData = Object.assign({}, data);
      var msgDataText = Object.assign({}, msgData.text);
      msgDataText.photoURL = null;
      msgData.text = msgDataText;
      let chatObjectStore = db.transaction(["chatHistory"], "readwrite").objectStore("chatHistory");
      var request = chatObjectStore.add(msgData);
      request.onsuccess = function(event) {
        resolve(event.target.result)
      }
    } catch(e) {
      reject(e);
    }
  });
}

export function addFullData(datas) {

}

export function getAllDataFromDb() {
  return new Promise((resolve, reject) => {
    if(!canUse) {
      reject("Database is not yet ready for transaction");
    }
    try {
      let chatObjectStore = db.transaction(["chatHistory"], "readwrite").objectStore("chatHistory");
      var request = chatObjectStore.getAll();
      request.onsuccess = function(event) {
        resolve(event.target.result);
      }
    } catch(e) {
      reject(e);
    }
  })
}

export function clearAllDbData() {
  return new Promise((resolve, reject) => {
    if(!canUse) {
      reject("Database is not yet ready for transaction");
    }
    try {
      let chatObjectStore = db.transaction(["chatHistory"], "readwrite").objectStore("chatHistory");
      var request = chatObjectStore.clear();
      request.onsuccess = function(event) {
        resolve("Successfully deleted all data");
      }
    } catch(e) {
      reject(e);
    }
  });
}
