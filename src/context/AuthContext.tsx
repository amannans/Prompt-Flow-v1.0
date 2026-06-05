import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  onSnapshot, 
  serverTimestamp 
} from 'firebase/firestore';
import { 
  auth, 
  db, 
  loginWithGoogle, 
  loginWithEmail,
  registerWithEmail,
  logoutUser, 
  handleFirestoreError, 
  OperationType 
} from '../lib/firebase';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  website?: string;
  goal?: string;
  selectedPackage?: string;
  paymentStatus: 'unpaid' | 'paid';
  createdAt: any;
  updatedAt: any;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  needsProfileSetup: boolean;
  isAdmin: boolean;
  isAuthModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  login: () => Promise<User>;
  triggerGoogleLogin: () => Promise<User>;
  triggerEmailLogin: (email: string, password: string) => Promise<User>;
  triggerEmailRegister: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  createProfile: (details: Omit<UserProfile, 'uid' | 'email' | 'paymentStatus' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProfile: (details: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsProfileSetup, setNeedsProfileSetup] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Custom dialog state and promise resolution
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [authResolve, setAuthResolve] = useState<((user: User) => void) | null>(null);

  useEffect(() => {
    let unsubscribeProfile: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (unsubscribeProfile) {
        unsubscribeProfile();
        unsubscribeProfile = null;
      }

      if (currentUser) {
        setUser(currentUser);
        // Is admin check (using metadata email or direct check)
        const checkIsAdmin = currentUser.email === 'abdulmannansaqib@gmail.com';
        setIsAdmin(checkIsAdmin);

        // Resolve pending login promise if someone was awaiting login()
        if (authResolve) {
          authResolve(currentUser);
          setAuthResolve(null);
        }
        setAuthModalOpen(false);

        const profileRef = doc(db, 'users', currentUser.uid);
        
        // Use real-time subscription for profile updates (e.g., when payment gets approved)
        try {
          unsubscribeProfile = onSnapshot(profileRef, (docSnap) => {
            if (docSnap.exists()) {
              setUserProfile(docSnap.data() as UserProfile);
              setNeedsProfileSetup(false);
            } else {
              setUserProfile(null);
              setNeedsProfileSetup(true);
            }
            setLoading(false);
          }, (error) => {
            handleFirestoreError(error, OperationType.GET, `users/${currentUser.uid}`);
            setLoading(false);
          });
        } catch (error) {
          console.error("Error setting up client profile listener:", error);
          setLoading(false);
        }
      } else {
        setUser(null);
        setUserProfile(null);
        setIsAdmin(false);
        setNeedsProfileSetup(false);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) {
        unsubscribeProfile();
      }
    };
  }, [authResolve]);

  // Open multi-provider authentication select modal
  const login = () => {
    setAuthModalOpen(true);
    return new Promise<User>((resolve) => {
      setAuthResolve(() => resolve);
    });
  };

  const triggerGoogleLogin = async () => {
    const loggedUser = await loginWithGoogle();
    return loggedUser;
  };

  const triggerEmailLogin = async (email: string, password: string) => {
    const loggedUser = await loginWithEmail(email, password);
    return loggedUser;
  };

  const triggerEmailRegister = async (email: string, password: string) => {
    const loggedUser = await registerWithEmail(email, password);
    return loggedUser;
  };

  const logout = async () => {
    return await logoutUser();
  };

  const createProfile = async (details: Omit<UserProfile, 'uid' | 'email' | 'paymentStatus' | 'createdAt' | 'updatedAt'>) => {
    const activeUser = user || auth.currentUser;
    if (!activeUser) throw new Error("No authenticated user.");
    
    const profilePath = `users/${activeUser.uid}`;
    try {
      const newProfile: UserProfile = {
        uid: activeUser.uid,
        email: activeUser.email || '',
        name: details.name,
        phone: details.phone,
        company: details.company || '',
        website: details.website || '',
        goal: details.goal || 'Increase ROI (Paid Social/PPC)',
        selectedPackage: details.selectedPackage || 'Startup Core',
        paymentStatus: 'unpaid',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      
      await setDoc(doc(db, 'users', activeUser.uid), newProfile);
      setNeedsProfileSetup(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, profilePath);
    }
  };

  const updateProfile = async (details: Partial<UserProfile>) => {
    if (!user) throw new Error("No authenticated user.");
    const profilePath = `users/${user.uid}`;
    try {
      const updateData = {
        ...details,
        updatedAt: serverTimestamp()
      };
      await updateDoc(doc(db, 'users', user.uid), updateData);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, profilePath);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      userProfile,
      loading,
      needsProfileSetup,
      isAdmin,
      isAuthModalOpen,
      setAuthModalOpen,
      login,
      triggerGoogleLogin,
      triggerEmailLogin,
      triggerEmailRegister,
      logout,
      createProfile,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
