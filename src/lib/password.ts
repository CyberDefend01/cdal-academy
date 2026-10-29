import "server-only";
import { randomInt } from "node:crypto";

// No look-alike characters (0/O, 1/l/I) so the password is easy to read out.
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%*";

// Cryptographically secure temporary password with upper, lower, digit and symbol.
export function generateTemporaryPassword(length = 16): string {
  while (true) {
    let password = "";
    for (let i = 0; i < length; i++) {
      password += ALPHABET[randomInt(ALPHABET.length)];
    }
    if (/[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password) && /[!@#$%*]/.test(password)) {
      return password;
    }
  }
}
