"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/firebase/config";
import LoadingOverlay from "@/components/custom/loading-overlay";
import toast from "react-hot-toast";
import {
  User,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

const provider = new GoogleAuthProvider();

interface AuthContextType {
  user: User | null;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });
    return () => {
      unsubscribe();
    };
  }, []);
  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      await signInWithPopup(auth, provider);
      toast.success("Signed in successfully!");
    } catch (error) {
      console.log(error);
      toast.error("Sign in failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await signOut(auth);
      toast.success("Signed out successfully!");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const AuthCtx = {
    user: user,
    isLoading,
    signInWithGoogle,
    logout,
  };
  return (
    <AuthContext.Provider value={AuthCtx}>
      {isLoading ? <LoadingOverlay /> : children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("use Auth must be used inside AuthProvider.");
  return context;
};
export default AuthProvider;
