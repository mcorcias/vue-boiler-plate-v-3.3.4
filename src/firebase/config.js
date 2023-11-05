import { initializeApp,getApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth,RecaptchaVerifier,signInWithPhoneNumber,signOut } from 'firebase/auth'
import { collection, doc, getDocs,setDoc,deleteDoc,Timestamp,writeBatch,updateDoc } from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator,httpsCallable } from 'firebase/functions';
import { getStorage } from 'firebase/storage'; // Import getStorage

const firebaseConfig = {
  
}

// init firebase
const app = initializeApp(firebaseConfig)

// init services
const db = getFirestore()

const auth = getAuth(app)

auth.languageCode = 'he';

const functions = getFunctions(getApp(),'europe-west2');
const storage = getStorage(app); // Initialize storage

connectFunctionsEmulator(functions, "127.0.0.1", 5001);

export { 
    db, auth,collection,doc, getDocs,setDoc,deleteDoc,
    Timestamp,writeBatch,functions,httpsCallable,RecaptchaVerifier,
    signInWithPhoneNumber,signOut,storage,updateDoc
}