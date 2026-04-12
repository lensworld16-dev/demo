import { createContext, useContext, useState, useEffect } from 'react';
import { firebaseAuth } from '../services/firebase';
import { userAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthChange(async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const data = await userAPI.getProfile();
          setDbUser(data.user);
        } catch {
          setDbUser(null);
        }
      } else {
        setDbUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signUp = async (email, password, name) => {
    const cred = await firebaseAuth.signUp(email, password);
    if (name) await firebaseAuth.updateProfile(cred.user, { displayName: name });
    return cred;
  };

  const signIn = (email, password) => firebaseAuth.signIn(email, password);
  const signInWithGoogle = () => firebaseAuth.signInWithGoogle();
  const logout = () => firebaseAuth.signOut();

  const resetPassword = (email) => firebaseAuth.resetPassword(email);

  const isAdmin = dbUser?.role === 'admin';
  
  useEffect(() => {
    if (dbUser) {
      console.log(`%c 🛡️ AUTH STATUS: User=${dbUser.email} | Role=${dbUser.role} | isAdmin=${isAdmin}`, 'background: #222; color: #ffeb3b; padding: 5px; font-weight: bold;');
    }
  }, [dbUser, isAdmin]);

  return (
    <AuthContext.Provider value={{
      user,
      dbUser,
      loading,
      signUp,
      signIn,
      signInWithGoogle,
      logout,
      resetPassword,
      isAdmin,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
