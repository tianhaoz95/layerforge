import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check'

const firebaseConfig = {
  apiKey: 'AIzaSyAaavXiWtyRk2ZxBHKks1NYVv6ggAmzAH4',
  authDomain: 'layerforge-platform.firebaseapp.com',
  projectId: 'layerforge-platform',
  storageBucket: 'layerforge-platform.firebasestorage.app',
  messagingSenderId: '604075361442',
  appId: '1:604075361442:web:e8d2353508f77ab4b503fb',
  measurementId: 'G-PMEH3KZZET',
}

const app = initializeApp(firebaseConfig)
export const analytics = getAnalytics(app)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const googleProvider = new GoogleAuthProvider()

// In dev, App Check runs in debug mode — log the token printed to the console
// and register it once in Firebase Console → App Check → Apps → Manage debug tokens.
if (import.meta.env.DEV) {
  (self as unknown as Record<string, unknown>).FIREBASE_APPCHECK_DEBUG_TOKEN = true
}

initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider('6LfV6gItAAAAAJJ6yjVIJYyo1aQ4Wa8foQqWSVNQ'),
  isTokenAutoRefreshEnabled: true,
})
