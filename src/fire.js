import firebase from 'firebase'
var config = { /* COPY THE ACTUAL CONFIG FROM FIREBASE CONSOLE */
  apiKey: "AIzaSyC61UtmrEMa2Sg9cleZhxun7hcmMHpGBfY",
  authDomain: "react-chat-6391.firebaseapp.com",
  databaseURL: "https://react-chat-6391.firebaseio.com",
  storageBucket: "gs://react-chat-6391.appspot.com/",
  messagingSenderId: "766080202178"
};
var fire = firebase.initializeApp(config);
export default fire;
