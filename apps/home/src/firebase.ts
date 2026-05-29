import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAaavXiWtyRk2ZxBHKks1NYVv6ggAmzAH4",
  authDomain: "layerforge-platform.firebaseapp.com",
  projectId: "layerforge-platform",
  storageBucket: "layerforge-platform.firebasestorage.app",
  messagingSenderId: "604075361442",
  appId: "1:604075361442:web:441e03b7f58861bfb503fb",
  measurementId: "G-R97WR753Z4",
};

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
