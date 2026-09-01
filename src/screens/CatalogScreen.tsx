import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getProducts } from '@/services/api';
import type { Product } from '@/utils/types';

type UIProduct = Product & {
  image?: string;
  subtitle?: string;
};

// Galería de imágenes Pexels de respaldo en caso de que el backend solo envíe id, name y price
const FALLBACK_IMAGES = [
  'https://images.pexels.com/photos/3780104/pexels-photo-3780104.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/1772123/pexels-photo-1772123.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/1279107/pexels-photo-1279107.jpeg?auto=compress&cs=tinysrgb&w=600',
];

export default function CatalogScreen() {
  const router = useRouter();
  const [products, setProducts] = useState<UIProduct[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [cart, setCart] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCatalog();
  }, []);

  const filteredProducts = products.filter((item) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      item.name.toLowerCase().includes(query) ||
      (item.subtitle && item.subtitle.toLowerCase().includes(query))
    );
  });

  async function fetchCatalog() {
    try {
      setLoading(true);
      setError(null);
      const data = await getProducts();

      if (Array.isArray(data)) {
        // Asigna imagen y subtítulo si el backend no los provee directamente
        const mapped: UIProduct[] = data.map((item, idx) => ({
          ...item,
          subtitle: item.subtitle || 'Tech Gadget',
          image: item.image || FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length],
        }));
        setProducts(mapped);
      }
    } catch (err: any) {
      setError(err.message || 'No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  }

  function addToCart(product: Product) {
    setCart((prev) => [...prev, product]);
  }

  function toggleFavorite(id: string) {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function goToCheckout() {
    router.push({
      pathname: '/checkout',
      params: { cartCount: cart.length },
    });
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F2F3F5]">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 pt-2 pb-4">
        <Pressable 
          onPress={() => router.back()} 
          className="h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
        >
          <Text className="text-base font-bold text-neutral-800">‹</Text>
        </Pressable>
        <Text className="text-base font-semibold text-neutral-800">Catálogo VulnStore</Text>
        <Pressable 
          onPress={() => router.push('/tabs/profile')} 
          className="h-10 w-10 overflow-hidden rounded-full border border-white"
        >
          <Image
            source={{ uri: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150' }}
            className="h-full w-full"
          />
        </Pressable>
      </View>

      {/* Barra de Búsqueda */}
      {/* Barra de Búsqueda Conectada */}
      <View className="flex-row items-center gap-x-3 px-6 mb-4">
        <View className="flex-1 flex-row items-center rounded-2xl bg-white px-4 py-3 shadow-sm border border-neutral-100">
          <Text className="mr-2 text-neutral-400">🔍</Text>
          <TextInput
            placeholder="Buscar productos..."
            placeholderTextColor="#A3A3A3"
            className="flex-1 text-sm text-neutral-800"
            value={searchQuery}
            onChangeText={setSearchQuery} // <-- Conectado
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')}>
              <Text className="text-neutral-400 font-bold text-xs">✕</Text>
            </Pressable>
          )}
        </View>
        <Pressable className="h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm border border-neutral-100">
          <Text className="text-neutral-700 font-bold">⚙️</Text>
        </Pressable>
      </View>

     <View className="px-6 mb-4">
        <Text className="text-2xl font-bold text-neutral-900">Encontrados</Text>
        <Text className="text-2xl font-bold text-neutral-900">{filteredProducts.length} Productos</Text>
      </View>

      {/* Indicador de Carga o Error de Conexión */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#000000" />
          <Text className="mt-2 text-xs text-neutral-400">Cargando API local...</Text>
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-center text-sm text-red-500 mb-4">{error}</Text>
          <Pressable 
            onPress={fetchCatalog}
            className="rounded-full bg-black px-6 py-3 shadow-sm"
          >
            <Text className="text-xs font-semibold text-white">Reintentar</Text>
          </Pressable>
        </View>
      ) : (
        /* Grid de Productos */
        <FlatList
          data={filteredProducts}
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
              <View className="h-36 w-full items-center justify-center rounded-2xl bg-neutral-50 mb-3 overflow-hidden">
                <Image 
                  source={{ uri: item.image }} 
                  className="h-full w-full"
                  resizeMode="cover"
                />
              </View>

              <Text className="text-sm font-bold text-neutral-900" numberOfLines={1}>
                {item.name}
              </Text>
              <Text className="text-[10px] text-neutral-400 mb-2" numberOfLines={1}>
                {item.subtitle}
              </Text>

              <View className="flex-row items-center justify-between mt-auto">
                <Text className="text-xs font-bold text-neutral-900">
                  ${item.price.toLocaleString('es-CO')}
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
      )}

      {/* Bar Flotante de Checkout */}
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