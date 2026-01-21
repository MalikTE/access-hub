import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  User,
} from "firebase/auth";
import { auth } from "../../firebase";

const googleProvider = new GoogleAuthProvider();

/* Google Login */
export const loginWithGoogle = async (): Promise<User | null> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Google login error:", error);
    return null;
  }
};

/* Email & Password Login */
export const loginWithEmail = async (email: string, password: string): Promise<User | null> => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.error("Email login error:", error);
    return null;
  }
};

/* Email & Password Signup */
export const signupWithEmail = async (email: string, password: string): Promise<User | null> => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.error("Signup error:", error);
    return null;
  }
};
