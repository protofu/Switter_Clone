import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBLsoMMXa2yhIdEon2rpZunK-sBxdBidbs",
  authDomain: "switter-bbeaa.firebaseapp.com",
  projectId: "switter-bbeaa",
  storageBucket: "switter-bbeaa.appspot.com",
  messagingSenderId: "323888346984",
  appId: "1:323888346984:web:fde8dc0d742320a52748dd"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const storage = getStorage(app);

export const db = getFirestore(app);