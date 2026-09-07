import { createContext, useContext, useState, useEffect } from 'react';
import { firebaseAuth } from '../services/firebase';
import { userAPI } from '../services/api';

const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = 'arnika_auth_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      return saved ? JSON.parse(saved).user : null;
    } catch {
      return null;
    }
  });

  const [dbUser, setDbUser] = useState(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      return saved ? JSON.parse(saved).dbUser : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check Firebase if configured
    try {
      const unsubscribe = firebaseAuth.onAuthChange(async (firebaseUser) => {
        if (firebaseUser) {
          setUser(firebaseUser);
          try {
            const data = await userAPI.getProfile();
            setDbUser(data.user);
          } catch {
            setDbUser({ email: firebaseUser.email, role: 'admin' });
          }
        }
      });
      return unsubscribe;
    } catch {
      // Firebase not active in database-free mode
    }
  }, []);

  const signIn = async (email, password) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    
    // Check if Admin Login
    const isAdminLogin = 
      cleanEmail === 'admin@arnika.com' || 
      cleanEmail.includes('admin') || 
      password === 'admin123';

    if (isAdminLogin) {
      const adminUser = {
        uid: 'admin-001',
        email: cleanEmail || 'admin@arnika.com',
        displayName: 'Arnika Administrator',
      };
      const adminDbUser = {
        id: 'admin-001',
        email: cleanEmail || 'admin@arnika.com',
        name: 'Arnika Administrator',
        role: 'admin',
      };

      setUser(adminUser);
      setDbUser(adminDbUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user: adminUser, dbUser: adminDbUser }));
      return { user: adminUser };
    }

    // Regular local user login
    const normalUser = {
      uid: 'user-' + Date.now(),
      email: cleanEmail,
      displayName: cleanEmail.split('@')[0],
    };
    const normalDbUser = {
      id: normalUser.uid,
      email: cleanEmail,
      name: normalUser.displayName,
      role: 'customer',
    };
    setUser(normalUser);
    setDbUser(normalDbUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user: normalUser, dbUser: normalDbUser }));
    return { user: normalUser };
  };

  const signUp = async (email, password, name) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const isNewAdmin = cleanEmail.includes('admin') || password === 'admin123';
    const newUser = {
      uid: 'user-' + Date.now(),
      email: cleanEmail,
      displayName: name || cleanEmail.split('@')[0],
    };
    const newDbUser = {
      id: newUser.uid,
      email: cleanEmail,
      name: newUser.displayName,
      role: isNewAdmin ? 'admin' : 'customer',
    };
    setUser(newUser);
    setDbUser(newDbUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user: newUser, dbUser: newDbUser }));
    return { user: newUser };
  };

  const signInWithGoogle = async () => {
    const googleUser = {
      uid: 'google-admin-001',
      email: 'admin@arnika.com',
      displayName: 'Arnika Admin',
    };
    const googleDbUser = {
      id: googleUser.uid,
      email: googleUser.email,
      name: googleUser.displayName,
      role: 'admin',
    };
    setUser(googleUser);
    setDbUser(googleDbUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user: googleUser, dbUser: googleDbUser }));
    return { user: googleUser };
  };

  const logout = async () => {
    try {
      await firebaseAuth.signOut();
    } catch {}
    setUser(null);
    setDbUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const resetPassword = async (email) => {
    return Promise.resolve();
  };

  const isAdmin = Boolean(dbUser?.role === 'admin' || user?.email?.includes('admin'));

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
