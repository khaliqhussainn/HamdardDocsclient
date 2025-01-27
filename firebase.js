import { initializeApp, getApps } from "@firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "@firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyDaKUlMrVl5jcvdSXM2VtOiyuQcYeuqIkM",
  authDomain: "notesapp-1cf66.firebaseapp.com",
  projectId: "notesapp-1cf66",
  storageBucket: "notesapp-1cf66.appspot.com",
  messagingSenderId: "829586813569",
  appId: "1:829586813569:web:5558667e891b498214d380",
  measurementId: "G-ZCBMBC4X3E",
  databaseURL: "https://notesapp-1cf66-default-rtdb.firebaseio.com"
};

let app;
let auth;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} else {
  app = getApps()[0];
  auth = getAuth(app);
}

export { auth };
