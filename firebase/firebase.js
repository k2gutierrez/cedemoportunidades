import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {

  apiKey: "AIzaSyD5mRUV08gkotpiTMoigFJd9Bfb9O8_hgQ",
  authDomain: "cedem-db.firebaseapp.com",
  databaseURL: "https://cedem-db-default-rtdb.firebaseio.com",
  projectId: "cedem-db",
  storageBucket: "cedem-db.appspot.com",
  messagingSenderId: "272607335771",
  appId: "1:272607335771:web:dff8951eb8e08f8eef367e",
  measurementId: "G-ZT3V8MY4NC"

};


// Initialize Firebase

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)
export const db = getDatabase(app)