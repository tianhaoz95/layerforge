import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, connectAuthEmulator } from 'firebase/auth'
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions'

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY            ?? 'demo-key',
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN        ?? 'demo-layerforge.firebaseapp.com',
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID         ?? 'demo-layerforge',
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET     ?? 'demo-layerforge.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '000000000000',
  appId:             import.meta.env.VITE_FIREBASE_APP_ID             ?? '1:000000000000:web:000000000000000000000000',
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
export const functions = getFunctions(app)

if (import.meta.env.DEV) {
  connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true })
  connectFunctionsEmulator(functions, '127.0.0.1', 5001)
}

