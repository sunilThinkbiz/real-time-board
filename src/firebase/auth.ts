
import { auth, database } from "./firebaseConfig";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { ref, get, set } from "firebase/database";

const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  const globalRef = ref(database, `global/activeBoardId`);
  let boardId: string;

  const snapshot = await get(globalRef);
  if (!snapshot.exists()) {
    boardId = user.uid; // First user creates the board
    await set(globalRef, boardId);
  } else {
    boardId = snapshot.val(); // All others join
  }

  // Add user under the board
  await set(ref(database, `boards/${boardId}/users/${user.uid}`), {
    uid: user.uid,
    displayName: user.displayName || "",
    email: user.email || "",
    photoURL: user.photoURL || "",
    online: true
  });

  return { result, boardId };
};

export const logOut = async () => {
  await signOut(auth);
};
