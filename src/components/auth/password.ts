import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore"
import { db } from "@/firebase"

/* ================================
   TYPES
================================ */
export interface PasswordHistory {
  password: string
  updatedAt: Date
}

export interface PasswordEntry {
  id: string
  siteName: string
  siteUrl?: string   // ✅ THIS MUST EXIST
  username: string
  email?: string
  password: string
  createdAt: Date
  updatedAt?: Date
  history: PasswordHistory[]
}


/* ================================
   ➕ ADD PASSWORD
================================ */
export const addPassword = async(
  uid: string,
  data: {
    siteName: string
    siteUrl?:string
    username: string
    email: string
    password: string
  }
) => {
  if (!data.siteName.trim()) {
    throw new Error("Site name is required")
  }

  await addDoc(collection(db, "users", uid, "passwords"), {
    siteName: data.siteName.trim(),
    siteUrl:data.siteUrl || "",
    username: data.username || "",
    email: data.email || "", // NEVER undefined
    password: data.password,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    history: [],
  })
}

/* ================================
   📥 GET PASSWORDS
================================ */
export const getPasswords = async(uid: string) => {
  const snapshot = await getDocs(
    collection(db, "users", uid, "passwords")
  )

  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data()

    return {
      id: docSnap.id,
      siteName: data.siteName || "",
      username: data.username || "",
      email: data.email || "",
      password: data.password || "",
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      history: Array.isArray(data.history) ? data.history : [],
    }
  })
}

/* ================================
   ✏️ EDIT PASSWORD
================================ */
export const editPassword = async(
  userId: string,
  passwordId: string,
  update: {
    siteName: string
    username: string
    siteUrl?:string
    email: string
    password: string
    history: PasswordHistory[]
  }
) => {
  const ref = doc(db, "users", userId, "passwords", passwordId)

  await updateDoc(ref, {
    siteName: update.siteName,
    siteUrl: update.siteUrl || "",
    username: update.username || "",
    email: update.email || "",
    password: update.password,
    history: update.history,
    updatedAt: serverTimestamp(),
  })
}

/* ================================
   🗑 DELETE PASSWORD
================================ */
export const deletePassword = async(
  uid: string,
  passwordId: string
) => {
  await deleteDoc(
    doc(db, "users", uid, "passwords", passwordId)
  )
}
