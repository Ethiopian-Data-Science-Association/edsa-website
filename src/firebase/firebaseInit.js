// Import the necessary Firebase functions
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { firebaseConfig } from './firebaseConfig'

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig)

// Initialize Firestore
export const db = getFirestore(firebaseApp)
