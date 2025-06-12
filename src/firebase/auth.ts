// src/firebase/auth.ts
import { auth, database } from "./firebaseConfig";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { ref, set } from "firebase/database";

const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Automatically use user.uid as boardId
    const boardId = user.uid;

    await set(ref(database, `boards/${boardId}/users/${user.uid}`), {
      uid: user.uid,
      displayName: user.displayName || "",
      photoURL: user.photoURL || "",
      email: user.email || "",
      online: true, // Optional: Mark as online
    });

    return result;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out", error);
  }
};
