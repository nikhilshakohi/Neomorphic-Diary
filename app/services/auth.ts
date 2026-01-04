import { FirebaseError } from "firebase/app";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
} from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

const googleProvider = new GoogleAuthProvider();

export async function loginWithEmail(email: string, password: string) {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    throw new Error("Please enter a valid email");
  }
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    await setDoc(
      doc(db, "users", cred.user.uid),
      {
        email: cred.user.email,
        pinStatus: "NEW",
        lastLoginAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (err: unknown) {
    throw mapAuthError(err);
  }
}

export async function signupWithEmail(
  name: string,
  email: string,
  password: string
) {
  if (!name || !email || !password) {
    throw new Error("All fields are required");
  }
  if (name.trim().length < 2) {
    throw new Error("Name must be at least 2 characters");
  }

  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    // Set display name
    await updateProfile(cred.user, { displayName: name });
    await setDoc(
      doc(db, "users", cred.user.uid),
      {
        email: cred.user.email,
        pinStatus: "NEW",
        createdAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (err: unknown) {
    throw mapAuthError(err);
  }
}

export async function loginWithGoogle() {
  const cred = await signInWithPopup(auth, googleProvider);

  await setDoc(
    doc(db, "users", cred.user.uid),
    {
      email: cred.user.email,
      lastLoginAt: serverTimestamp(),
    },
    { merge: true }
  );
}

function mapAuthError(err: unknown): Error {
  if (err instanceof FirebaseError) {
    switch (err.code) {
      case "auth/user-not-found":
      case "auth/wrong-password":
        return new Error("Invalid email or password");
      case "auth/too-many-requests":
        return new Error("Too many attempts. Try again later");
      case "auth/email-already-in-use":
        return new Error("Email already in use");
      case "auth/weak-password":
        return new Error("Password should be at least 6 characters");
      default:
        return new Error("Authentication failed");
    }
  }
  return new Error("Something went wrong");
}
