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

  const isAdmin = dbUser?.role === 'admin';
  console.log('Auth Debug:', { hasUser: !!user, role: dbUser?.role, isAdmin });

  return (
    <AuthContext.Provider value={{
      user,
      dbUser,
      loading,
      signUp,
      signIn,
      signInWithGoogle,
      logout,
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
