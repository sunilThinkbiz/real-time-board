import React, { createContext, useState, useEffect, useContext } from "react";
import { auth, database } from "../firebase/firebaseConfig";
import { onAuthStateChanged, User } from "firebase/auth";
import { ref, set } from "firebase/database";

type AuthContextType = {
  user: User | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const saveUserData = async (user: User) => {
    const userRef = ref(database, `users/${user.uid}`);
    try {
      await set(userRef, {
        name: user.displayName,
        email: user.email,
        avatar: user.photoURL,
        online: true,
      });
    } catch (error) {
      console.error("Error saving user data", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
      if (firebaseUser) {
        saveUserData(firebaseUser);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
