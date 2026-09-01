/**
 * api.ts
 * -----------------------------------------------------------------------
 * VULNERABILIDAD SEMBRADA: MASVS-NETWORK-1 / MASTG-TEST-0301 (sin cert
 * pinning -> interceptable con Burp/mitmproxy montando un CA de usuario)
 * y una API key de servicio hardcodeada en el cliente.
 *
 * Cómo explotarla en el lab:
 *   1. Configurar proxy Burp en el emulador + instalar el CA de Burp
 *      como confiable en el sistema (sin pinning, esto basta).
 *   2. Interceptar cualquier request y ver X-Api-Key en claro.
 *
 * Fix esperado:
 *   - Certificate/public-key pinning (expo-network + config nativa, o
 *     eas build con un dev client que soporte pinning).
 *   - Ninguna key de servicio en el cliente: todo login/checkout firma
 *     server-side, el cliente solo maneja tokens de sesión de corta vida.
 * -----------------------------------------------------------------------
 */
import type { Product, SavedCard } from '../utils/types';

// VULNERABLE: API key de "partner" embebida en el cliente
const API_KEY = 'vs_live_9f8a7d6c5b4e3f2a1d0c';
const BASE_URL = 'https://api.vulnstore.example.com';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': API_KEY,
      ...(options.headers ?? {}),
    },
  });
  return response.json() as Promise<T>;
}

export function getProducts(): Promise<Product[]> {
  return request<Product[]>('/products');
}

export function login(email: string, password: string): Promise<{ token: string }> {
  return request<{ token: string }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function checkout(cart: Product[], card: SavedCard): Promise<{ orderId: string }> {
  return request<{ orderId: string }>('/checkout', {
    method: 'POST',
    body: JSON.stringify({ cart, card }),
  });
}
