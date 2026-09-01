import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Image, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getProducts } from '@/services/api';
import type { Product } from '@/utils/types';

// Extendemos la interfaz temporalmente para soportar imágenes e información visual
type UIProduct = Product & {
  image: string;
  subtitle?: string;
};

const FALLBACK_PRODUCTS: UIProduct[] = [
  {
    id: '1',
    name: 'Facial Cleanser',
    subtitle: 'Citrus refreshes senses',
    price: 9.99,
    image: 'https://images.pexels.com/photos/3735657/pexels-photo-3735657.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    id: '2',
    name: 'Moisturiser',
    subtitle: 'Oil balancing mask',
    price: 11.99,
    image: 'https://images.pexels.com/photos/4041391/pexels-photo-4041391.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    id: '3',
    name: 'Cleansing Oil',
    subtitle: 'Super greens',
    price: 12.99,
    image: 'https://images.pexels.com/photos/4465124/pexels-photo-4465124.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    id: '4',
    name: 'Micellar Cleansing',
    subtitle: 'Signature water',
    price: 10.99,
    image: 'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
];

export default function CatalogScreen() {
  const router = useRouter();
  const [products, setProducts] = useState<UIProduct[]>(FALLBACK_PRODUCTS);
  const [cart, setCart] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  useEffect(() => {
    getProducts()
      .then((data) => {
        if (Array.isArray(data) && data.length) {
          // Fusionamos la data del API con imágenes por defecto si la API no entrega URLs
          const mapped = data.map((item, idx) => ({
            ...item,
            image: FALLBACK_PRODUCTS[idx % FALLBACK_PRODUCTS.length].image,
            subtitle: 'VulnStore Product',
          }));
          setProducts(mapped);
        }
      })
      .catch(() => {
        // Mantiene FALLBACK_PRODUCTS
      });
  }, []);

  function addToCart(product: Product) {
    setCart((prev) => [...prev, product]);
  }

  function toggleFavorite(id: string) {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function goToCheckout() {
    // Redirección directa mandando el total de items a checkout via params de Expo Router
    router.push({
      pathname: '/checkout',
      params: { cartCount: cart.length },
    });
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F2F3F5]">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 pt-2 pb-4">
        <Pressable onPress={() => router.back()} className="h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
          <Text className="text-base font-bold text-neutral-800">‹</Text>
        </Pressable>
        <Text className="text-base font-semibold text-neutral-800">Search Product</Text>
        <Pressable onPress={() => router.push('/(tabs)/profile')} className="h-10 w-10 overflow-hidden rounded-full border border-white">
          <Image
            source={{ uri: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150' }}
            className="h-full w-full"
          />
        </Pressable>
      </View>

      {/* Barra de Búsqueda */}
      <View className="flex-row items-center gap-x-3 px-6 mb-4">
        <View className="flex-1 flex-row items-center rounded-2xl bg-white px-4 py-3 shadow-sm border border-neutral-100">
          <Text className="mr-2 text-neutral-400">🔍</Text>
          <TextInput
            placeholder="Cleansers"
            placeholderTextColor="#A3A3A3"
            className="flex-1 text-sm text-neutral-800"
          />
        </View>
        <Pressable className="h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm border border-neutral-100">
          <Text className="text-neutral-700 font-bold">⚙️</Text>
        </Pressable>
      </View>

      {/* Título de Resultados */}
      <View className="px-6 mb-4">
        <Text className="text-2xl font-bold text-neutral-900">Found</Text>
        <Text className="text-2xl font-bold text-neutral-900">{products.length} Results</Text>
      </View>

      {/* Grid de Productos (2 Columnas) */}
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 24 }}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Pressable 
            onPress={() => addToCart(item)}
            className="mb-4 w-[47%] rounded-3xl bg-white p-3 shadow-sm border border-neutral-100"
          >
            {/* Imagen del producto de Pexels */}
            <View className="h-36 w-full items-center justify-center rounded-2xl bg-neutral-50 mb-3 overflow-hidden">
              <Image 
                source={{ uri: item.image }} 
                className="h-full w-full"
                resizeMode="cover"
              />
            </View>

            {/* Información del Producto */}
            <Text className="text-sm font-bold text-neutral-900" numberOfLines={1}>
              {item.name}
            </Text>
            <Text className="text-[10px] text-neutral-400 mb-2" numberOfLines={1}>
              {item.subtitle}
            </Text>

            {/* Precio y Botón Corazón / Favorito */}
            <View className="flex-row items-center justify-between mt-auto">
              <Text className="text-sm font-bold text-neutral-900">
                ${item.price.toFixed(2)}
              </Text>
              <Pressable
                onPress={() => toggleFavorite(item.id)}
                className={`h-7 w-7 items-center justify-center rounded-full ${
                  favorites[item.id] ? 'bg-black' : 'bg-neutral-100'
                }`}
              >
                <Text className={`text-[10px] ${favorites[item.id] ? 'text-white' : 'text-neutral-600'}`}>
                  ♥
                </Text>
              </Pressable>
            </View>
          </Pressable>
        )}
      />

      {/* Floating Checkout Bar */}
      {cart.length > 0 && (
        <View className="absolute bottom-6 left-6 right-6 flex-row items-center justify-between rounded-full bg-black p-2 pl-6 shadow-lg">
          <Text className="text-sm font-semibold text-white">
            {cart.length} item(s) agregado(s)
          </Text>
          <Pressable
            className="rounded-full bg-white px-6 py-3 active:opacity-90"
            onPress={goToCheckout}
          >
            <Text className="text-xs font-bold text-black">Ir a pagar</Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}