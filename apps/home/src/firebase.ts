import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

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

if (import.meta.env.DEV) {
  (self as unknown as Record<string, unknown>).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
}

initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider("6LfV6gItAAAAAJJ6yjVIJYyo1aQ4Wa8foQqWSVNQ"),
  isTokenAutoRefreshEnabled: true,
});
