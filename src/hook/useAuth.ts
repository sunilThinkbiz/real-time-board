import { useAuth as useAuthContext } from '../context/AuthContext';
import { signInWithGoogle, logOut } from '../firebase/auth';

export const useAuth = () => {
  const { user, loading } = useAuthContext();
  return {
    user,
    loading,
    signInWithGoogle,
    logOut
  };
};