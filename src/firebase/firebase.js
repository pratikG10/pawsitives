import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBJgcpXPq-RxBoWWOJ94Qbzom5xIkgoVP8",
  authDomain: "dogo-4f318.firebaseapp.com",
  projectId: "dogo-4f318",
  storageBucket: "dogo-4f318.appspot.com",
  messagingSenderId: "164646890888",
  appId: "1:164646890888:web:da6c687b7ecde6c023de3d",
  measurementId: "G-MKXNFCMJD9",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

export { app, auth, firestore, storage };
