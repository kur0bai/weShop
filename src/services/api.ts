import { Platform } from 'react-native';
import type { Product, SavedCard } from '../utils/types';

// VULNERABLE: API key de servicio embebida en el cliente (MASVS-NETWORK-1)
const API_KEY = 'vs_live_9f8a7d6c5b4e3f2a1d0c';

const getBaseUrl = () => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000';
  }
  return 'http://localhost:3000';
};

export const BASE_URL = getBaseUrl();

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': API_KEY, // Se adjunta en todas las peticiones
      ...(options.headers ?? {}),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Error en la petición');
  }

  return data as T;
}

export function getProducts(): Promise<Product[]> {
  return request<Product[]>('/products');
}

export function login(email: string, passwordMd5: string) {
  return request<{ token: string; user: any }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password: passwordMd5,
    }),
  });
}

export function checkout(cart: Product[], card: SavedCard): Promise<{ orderId: string }> {
  return request<{ orderId: string }>('/checkout', {
    method: 'POST',
    body: JSON.stringify({ cart, card }),
  });
}