import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { login } from '@/services/api';
import { establishSession } from '@/services/auth';
import { weakHashPassword } from '@/utils/crypto';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      setError('Por favor ingresa correo y contraseña');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const hashed = weakHashPassword(password);
      const result = await login(email, hashed);
      if (result?.token) {
        await establishSession(result.token);
        router.replace('/tabs/catalog');
      } else {
        setError('Credenciales inválidas');
      }
    } catch (err: any) {
      setError(err.message || 'Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F2F3F5]">
      <View className="flex-1 justify-between px-8 py-12">
        {/* Cabecera / Branding */}
        <View className="items-center mt-8">
          <View className="h-16 w-16 items-center justify-center rounded-2xl bg-black mb-4 shadow-sm">
            <Text className="text-2xl font-bold text-white">V</Text>
          </View>
          <Text className="text-3xl font-bold text-neutral-900 tracking-tight">VulnStore</Text>
          <Text className="text-xs text-neutral-400 mt-1">AppSec E-Commerce Lab</Text>
        </View>

        {/* Formulario */}
        <View className="gap-y-4">
          <View>
            <Text className="mb-2 ml-1 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Correo electrónico
            </Text>
            <TextInput
              className="rounded-2xl bg-white px-5 py-4 text-base text-neutral-800 shadow-sm border border-neutral-100 focus:border-neutral-900"
              placeholder="admin@vulnstore.com"
              placeholderTextColor="#A3A3A3"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View>
            <Text className="mb-2 ml-1 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Contraseña
            </Text>
            <TextInput
              className="rounded-2xl bg-white px-5 py-4 text-base text-neutral-800 shadow-sm border border-neutral-100 focus:border-neutral-900"
              placeholder="••••••••"
              placeholderTextColor="#A3A3A3"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {error && (
            <Text className="mt-1 text-center text-sm font-medium text-red-500">
              {error}
            </Text>
          )}
        </View>

        {/* Acciones */}
        <View className="gap-y-3">
          <Pressable
            className={`rounded-full bg-black py-4 active:opacity-90 shadow-md ${
              loading ? 'opacity-70' : ''
            }`}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className="text-center text-base font-semibold text-white">
                Sign In
              </Text>
            )}
          </Pressable>

          <Pressable
            onPress={() => router.push('/tabs/catalog')}
            className="py-2 active:opacity-60"
          >
            <Text className="text-center text-xs font-semibold text-neutral-400">
              Ingresar como invitado
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}