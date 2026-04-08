import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import { auth, db } from '../services/firebase';
import { doc, setDoc, getDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  async function signup(email, password, displayName) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName });
    
    // Initialize Firestore user document
    const userDoc = {
      uid: userCredential.user.uid,
      email,
      displayName,
      createdAt: serverTimestamp(),
      weight: '',
      height: '',
      age: '',
      goalCalories: '2000',
      goalWorkouts: '4',
    };
    
    await setDoc(doc(db, 'users', userCredential.user.uid), userDoc);
    setUserData(userDoc);
    
    return userCredential;
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  useEffect(() => {
    let unsubscribeDoc;
    
    const unsubscribeAuth = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      
      if (user) {
        // Listen to user document changes
        unsubscribeDoc = onSnapshot(doc(db, 'users', user.uid), (doc) => {
          if (doc.exists()) {
            setUserData(doc.data());
          }
          setLoading(false);
        }, (err) => {
          console.error("Error fetching user data", err);
          setLoading(false);
        });
      } else {
        setUserData(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeDoc) unsubscribeDoc();
    };
  }, []);

  const googleLogin = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    // Check if user exists in Firestore
    const docRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      const newUser = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          createdAt: serverTimestamp(),
          weight: '',
          height: '',
          age: '',
          goalCalories: '2000',
          goalWorkouts: '4'
      };
      await setDoc(docRef, newUser);
      setUserData(newUser);
    } else {
      setUserData(docSnap.data());
    }
    return result;
  };

  const value = {
    currentUser,
    userData,
    signup,
    login,
    logout,
    googleLogin
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
