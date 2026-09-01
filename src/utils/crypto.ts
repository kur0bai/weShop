/**
 * crypto.ts
 * -----------------------------------------------------------------------
 * VULNERABILIDAD SEMBRADA: MASVS-CRYPTO-1 / MASTG-TEST-0207 (algoritmos
 * débiles) y MASTG-TEST-0208 (claves hardcodeadas).
 *
 * Tres fallos clásicos, cada uno visible con solo descomprimir el bundle
 * JS (con Expo/Hermes, extraer el bytecode y desensamblarlo con hermes-dec
 * o similar sigue siendo viable si no hay hardening adicional):
 *
 *   1. MD5 para "hashear" contraseñas -> trivialmente crackeable
 *      (rainbow tables, sin salt).
 *   2. AES en modo ECB -> patrones visibles en el ciphertext, no hay IV.
 *   3. Clave simétrica hardcodeada en el código fuente/bundle.
 *
 * Cómo explotarla en el lab:
 *   - Generar el bundle de producción y buscar "API_SECRET_KEY" en el
 *     resultado, o extraer el .hbc (Hermes bytecode) del APK/IPA.
 *
 * Fix esperado:
 *   - bcrypt/argon2 en backend (nunca hashear password-equivalent en cliente).
 *   - AES-GCM con IV aleatorio por operación, clave derivada vía
 *     expo-secure-store, nunca embebida en el bundle.
 * -----------------------------------------------------------------------
 */
import CryptoJS from 'crypto-js';

// VULNERABLE: clave estática embebida en el bundle JS
const API_SECRET_KEY = 'VulnStore-2024-Secret-Key!';

export function weakHashPassword(password: string): string {
  // VULNERABLE: MD5 sin salt
  return CryptoJS.MD5(password).toString();
}

export function encryptPayload(plainText: string): string {
  // VULNERABLE: AES-ECB, sin IV, con clave hardcodeada
  const key = CryptoJS.enc.Utf8.parse(API_SECRET_KEY.padEnd(16, '0').slice(0, 16));
  const encrypted = CryptoJS.AES.encrypt(plainText, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString();
}
