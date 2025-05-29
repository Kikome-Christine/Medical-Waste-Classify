import  {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

type AppUser = User & { isAdmin?: boolean };

interface AuthContextType {
  /** the logged-in user (or null) */
  user: AppUser | null;
  /** convenient alias so callers can do const { currentUser } = useAuth() */
  currentUser: AppUser | null;
  /** true only for the hard-coded admin */
  isAdmin: boolean;
  /** auth state fetching */
  loading: boolean;
  /** login */
  signIn: (email: string, password: string) => Promise<{ error: any } | void>;
  /** signup */
  signUp: (email: string, password: string) => Promise<{ error: any } | void>;
  /** logout */
  signOut: () => Promise<void>;
}

/* ------------------------------------------------------------------ */
/*  Context                                                           */
/* ------------------------------------------------------------------ */

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser]     = useState<AppUser | null>(null);
  const [isAdmin, setAdmin] = useState(false);
  const [loading, setLoad]  = useState(true);

  /* -------------------------------------------------------------- */
  /*  Session bootstrap + listener                                 */
  /* -------------------------------------------------------------- */
// useEffect(() => {
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       setUser(session?.user ?? null);
//       setLoad(false);
//     });
    

//     const { data: { subscription } } = supabase.auth.onAuthStateChange(
//       (_evt, session) => setUser(session?.user ?? null)
//     );

//     return () => subscription.unsubscribe();
//   }, []);
useEffect(() => {
  const fetchSession = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    setUser(session?.user ?? null);
    setLoad(false);
  };

  fetchSession();

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    setUser(session?.user ?? null);
  });

  return () => {
    subscription?.unsubscribe?.(); // Safely unsubscribe
  };
}, []);



  /* -------------------------------------------------------------- */
  /*  Auth helpers                                                  */
  /* -------------------------------------------------------------- */

  const ADMIN = { email: 'admin@gmail.com', password: 'admin' };

  /** LOGIN ------------------------------------------------------- */
  const signIn = async (email: string, password: string) => {
    if (email === ADMIN.email && password === ADMIN.password) {
      const fakeAdmin = { id: 'local-admin', email, isAdmin: true } as AppUser;
      setUser(fakeAdmin);
      setAdmin(true);
      return;                      // no Supabase call
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    setUser(data.user as AppUser);
    setAdmin(false);
    return { error: null };
  };

  /** SIGNUP ------------------------------------------------------ */
  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return { error: null };
  };

  /** LOGOUT ------------------------------------------------------ */
  const signOut = async () => {
    // clear fake admin
    if (isAdmin) {
      setUser(null);
      setAdmin(false);
      return;
    }
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
  };

  /* -------------------------------------------------------------- */
  /*  Provide context                                              */
  /* -------------------------------------------------------------- */
  const value: AuthContextType = {
    user,
    currentUser: user,   // alias
    isAdmin,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

/* ------------------------------------------------------------------ */
/*  Hook                                                              */
/* ------------------------------------------------------------------ */

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};

// import React, { createContext, useContext, useEffect, useState } from 'react';
// import { User } from '@supabase/supabase-js';
// import { supabase } from '../lib/supabase';

// interface AuthContextType {
//   user: User | null;
//   loading: boolean;
//   signIn: (email: string, password: string) => Promise<void>;
//   signUp: (email: string, password: string) => Promise<void>;
//   signOut: () => Promise<void>;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Check active sessions and sets the user
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       setUser(session?.user ?? null);
//       setLoading(false);
//     });

//     // Listen for changes on auth state
//     const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
//       setUser(session?.user ?? null);
//     });

//     return () => subscription.unsubscribe();
//   }, []);

  

//   const signIn = async (email: string, password: string) => {
//     const { error } = await supabase.auth.signInWithPassword({ email, password });
//     if (error) throw error;
//   };

//   const signUp = async (email: string, password: string) => {
//     const { error } = await supabase.auth.signUp({ email, password });
//     if (error) throw error;
//   };

//   const signOut = async () => {
//     const { error } = await supabase.auth.signOut();
//     if (error) throw error;
//   };

//   return (
//     <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };