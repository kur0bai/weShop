import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'nativewind';
import { useEffect } from 'react';
import { View } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import '@/global.css';

// Previene que se oculte automáticamente al arrancar
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { colorScheme } = useColorScheme();

  useEffect(() => {
    // Oculta el Splash Screen nativo una vez que el Layout inicial se monta
    SplashScreen.hideAsync().catch(() => {
      /* Ignorar si ya estaba oculto */
    });
  }, []);

  return (
    <View className={`flex-1 ${colorScheme === 'dark' ? 'dark' : ''}`}>
      <AnimatedSplashOverlay />

      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' },
        }}
      >
        {/* Pantalla inicial: Login (index.tsx) */}
        <Stack.Screen name="index" />

        {/* Grupo con AppTabs (carpeta /app/tabs) */}
        <Stack.Screen name="tabs" />

        {/* Pantalla de Checkout fuera de tabs */}
        <Stack.Screen
          name="checkout"
          options={{
            headerShown: true,
            title: 'Pago',
            headerStyle: {
              backgroundColor: colorScheme === 'dark' ? '#09090b' : '#ffffff',
            },
            headerTintColor: colorScheme === 'dark' ? '#ffffff' : '#000000',
          }}
        />
      </Stack>
    </View>
  );
}