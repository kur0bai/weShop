export interface Product {
  id: string;
  name: string;
  price: number;
}

export interface UserProfile {
  nombre: string;
  cedula: string;
  direccion: string;
  telefono: string;
}

export interface SavedCard {
  number: string;
  cvv: string;
  expiry: string;
}

export interface Session {
  token: string;
  role: string;
  userId: string;
}

export type RootStackParamList = {
  Login: undefined;
  Catalog: undefined;
  Profile: undefined;
  Checkout: { cart: Product[] };
};
