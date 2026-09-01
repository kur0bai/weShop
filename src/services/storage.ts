/**
 * =======================================================================
 * SECURE STORAGE MODULE (REMEDIATED VERSION)
 * =======================================================================
 * Implementación alineada a MASVS-STORAGE-1:
 * - Uso de Hardware-backed Storage (Keystore / Keychain via Expo SecureStore).
 * - Minimización de datos: Eliminación de CVV y truncado de PAN (solo últimos 4 dígitos).
 * =======================================================================
 */

import * as SecureStore from 'expo-secure-store';
import type { UserProfile } from '../utils/types';

const SECURE_KEYS = {
  USER_PROFILE: 'sec_user_profile',
  CARD_TOKEN: 'sec_card_token',
} as const;

// Tipo seguro que NO incluye datos vulnerables de la tarjeta
export type MaskedSavedCard = {
  cardHolder: string;
  lastFourDigits: string;
  gatewayToken: string; // Token devuelto por Stripe/MercadoPago
  expiryDate: string;
};

export async function saveUserProfileSecured(profile: UserProfile): Promise<void> {
  await SecureStore.setItemAsync(
    SECURE_KEYS.USER_PROFILE, 
    JSON.stringify(profile),
    { keychainAccessible: SecureStore.WHEN_UNLOCKED }
  );
}

export async function getUserProfileSecured(): Promise<UserProfile | null> {
  const raw = await SecureStore.getItemAsync(SECURE_KEYS.USER_PROFILE);
  return raw ? (JSON.parse(raw) as UserProfile) : null;
}

/**
 * FIX PCI-DSS: NUNCA se persiste el CVV ni el PAN completo.
 * Se almacena solo un token y los últimos 4 dígitos cifrados en Keystore.
 */
export async function saveCardTokenSecured(cardData: MaskedSavedCard): Promise<void> {
  await SecureStore.setItemAsync(
    SECURE_KEYS.CARD_TOKEN,
    JSON.stringify(cardData),
    { keychainAccessible: SecureStore.WHEN_UNLOCKED }
  );
}

export async function getSavedCardTokenSecured(): Promise<MaskedSavedCard | null> {
  const raw = await SecureStore.getItemAsync(SECURE_KEYS.CARD_TOKEN);
  return raw ? (JSON.parse(raw) as MaskedSavedCard) : null;
}