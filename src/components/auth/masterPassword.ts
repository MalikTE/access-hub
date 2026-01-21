import { doc, getDoc, updateDoc } from "firebase/firestore"
import { db } from "@/firebase"
import bcrypt from "bcryptjs"

/* 🔐 Set Master Password */
export async function setMasterPassword(uid: string, password: string) {
  const hash = await bcrypt.hash(password, 10)

  await updateDoc(doc(db, "users", uid), {
    masterPasswordHash: hash,
  })
}

/* 🔎 Verify Master Password */
export async function verifyMasterPassword(
  uid: string,
  input: string
): Promise<boolean> {
  const snap = await getDoc(doc(db, "users", uid))

  if (!snap.exists()) return false

  const hash = snap.data().masterPasswordHash
  if (!hash) return false

  return bcrypt.compare(input, hash)
}
