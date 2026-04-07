import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCwVhXZ_yY16ei4Yz2i1dPjd5E0md6pSoM",
  authDomain: "makemefit-7eea2.firebaseapp.com",
  projectId: "makemefit-7eea2",
  storageBucket: "makemefit-7eea2.firebasestorage.app",
  messagingSenderId: "920904019114",
  appId: "1:920904019114:web:26a1400f343f42bb1af4d3",
  measurementId: "G-MBBWMDJS0D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
