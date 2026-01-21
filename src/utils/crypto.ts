import CryptoJS from "crypto-js";

const SECRET = import.meta.env.VITE_SECRET_KEY;

export function encryptPassword(text: string) {
  return CryptoJS.AES.encrypt(text, SECRET).toString();
}

export function decryptPassword(cipher: string) {
  try {
    // If it doesn't look encrypted, return as-is
    if (!cipher.startsWith("U2FsdGVk")) {
      return cipher;
    }

    const bytes = CryptoJS.AES.decrypt(cipher, SECRET);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);

    return decrypted || cipher;
  } catch {
    return cipher;
  }
}
