import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Session } from '../utils/types';

let currentSession: Session | null = null;
const STORAGE_KEY = '@vulnstore_session';


function decodeJwtPayload(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return {};
  }
}


export async function establishSession(jwtToken: string): Promise<Session> {
  const payload = decodeJwtPayload(jwtToken);

  currentSession = {
    token: jwtToken,
    role: payload.role || 'user',
    userId: payload.sub || '',
    // VULNERABLE: No se valida ni almacena 'exp', la sesión persiste indefinidamente
  };

  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(currentSession));
  return currentSession;
}


export async function getStoredSession(): Promise<Session | null> {
  if (currentSession) return currentSession;

  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (raw) {
    currentSession = JSON.parse(raw);
    return currentSession;
  }

  return null;
}

export async function clearSession(): Promise<void> {
  currentSession = null;
  await AsyncStorage.removeItem(STORAGE_KEY);
}

export function isSessionValid(): boolean {
  return currentSession !== null;
}

export function getCurrentRole(): string {
  return currentSession?.role ?? 'guest';
}
