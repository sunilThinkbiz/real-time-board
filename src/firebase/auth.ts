import {auth} from './firebaseConfig';
import { GoogleAuthProvider, signInWithPopup,signOut } from 'firebase/auth';

const provider = new GoogleAuthProvider();

export const signInWithGoogle = async()=>{
    try{
        await signInWithPopup(auth, provider);
    }catch(error){
        console.log('Error signing in with Google', error);
        throw error;
    }
}
export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out", error);
  }
};