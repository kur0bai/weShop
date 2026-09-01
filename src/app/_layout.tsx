import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'nativewind';
import { View } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import '@/global.css';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { colorScheme } = useColorScheme();

  return (
    <View className={`flex-1 ${colorScheme === 'dark' ? 'dark' : ''}`}>
      <AnimatedSplashOverlay />

      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' },
        }}
      >
        {/* Pantalla inicial: Login */}
        <Stack.Screen name="index" />

        {/* Grupo con AppTabs */}
        <Stack.Screen name="(tabs)" />

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