import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getAuth, GoogleAuthProvider, connectAuthEmulator } from 'firebase/auth'
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions'
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check'

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY            ?? 'demo-key',
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN        ?? 'demo-layerforge.firebaseapp.com',
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID         ?? 'demo-layerforge',
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET     ?? 'demo-layerforge.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '000000000000',
  appId:             import.meta.env.VITE_FIREBASE_APP_ID             ?? '1:000000000000:web:000000000000000000000000',
  measurementId:     import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

const app = initializeApp(firebaseConfig)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
export const functions = getFunctions(app)

// In dev, App Check runs in debug mode — a token is logged to the console on first run.
// Register that token once in Firebase Console → App Check → Apps → Manage debug tokens.
if (import.meta.env.DEV) {
  (self as unknown as Record<string, unknown>).FIREBASE_APPCHECK_DEBUG_TOKEN = true
}

initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider(
    import.meta.env.VITE_RECAPTCHA_SITE_KEY ?? '6LfV6gItAAAAAJJ6yjVIJYyo1aQ4Wa8foQqWSVNQ',
  ),
  isTokenAutoRefreshEnabled: true,
})

if (import.meta.env.DEV) {
  connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true })
  connectFunctionsEmulator(functions, '127.0.0.1', 5001)
}

