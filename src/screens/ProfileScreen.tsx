import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { getSavedCard, getUserProfile, saveUserProfile } from '../services/storage';
import type { RootStackParamList, SavedCard, UserProfile } from '../utils/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

const EMPTY_PROFILE: UserProfile = {
  nombre: '',
  cedula: '',
  direccion: '',
  telefono: '',
};

export default function ProfileScreen(_props: Props) {
  const [profile, setProfile] = useState<UserProfile>(EMPTY_PROFILE);
  const [savedCard, setSavedCard] = useState<SavedCard | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // VULNERABLE: ver services/storage.ts -> lee PII en claro desde AsyncStorage
    getUserProfile().then((p) => p && setProfile(p));
    // VULNERABLE: si hay tarjeta guardada del checkout, también se puede leer
    // aquí en claro (PAN + CVV) — útil para demostrar el impacto combinado
    // de STORAGE-1/STORAGE-2 entre pantallas.
    getSavedCard().then(setSavedCard);
  }, []);

  function update<K extends keyof UserProfile>(field: K, value: string) {
    setProfile((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  }

  async function handleSave() {
    await saveUserProfile(profile);
    setSaved(true);
  }

  return (
    <ScrollView className="flex-1 bg-white" contentContainerClassName="p-4">
      <Text className="mb-4 text-2xl font-bold">Mi perfil</Text>

      <TextInput
        className="mb-3 rounded-lg border border-gray-300 px-4 py-3"
        placeholder="Nombre completo"
        value={profile.nombre}
        onChangeText={(v) => update('nombre', v)}
      />
      <TextInput
        className="mb-3 rounded-lg border border-gray-300 px-4 py-3"
        placeholder="Cédula / documento"
        keyboardType="number-pad"
        value={profile.cedula}
        onChangeText={(v) => update('cedula', v)}
      />
      <TextInput
        className="mb-3 rounded-lg border border-gray-300 px-4 py-3"
        placeholder="Dirección de envío"
        value={profile.direccion}
        onChangeText={(v) => update('direccion', v)}
      />
      <TextInput
        className="mb-3 rounded-lg border border-gray-300 px-4 py-3"
        placeholder="Teléfono"
        keyboardType="phone-pad"
        value={profile.telefono}
        onChangeText={(v) => update('telefono', v)}
      />

      <Pressable className="rounded-lg bg-brand py-3" onPress={handleSave}>
        <Text className="text-center font-semibold text-white">Guardar</Text>
      </Pressable>
      {saved && <Text className="mt-2 text-green-600">Perfil guardado</Text>}

      {savedCard && (
        <View className="mt-5 rounded-lg border border-gray-100 p-3">
          <Text className="mb-1 font-semibold">Tarjeta guardada</Text>
          {/* VULNERABLE: se muestra el PAN completo en UI, reforzando que
              nunca debió persistirse así en primer lugar. */}
          <Text>Número: {savedCard.number}</Text>
          <Text>Vence: {savedCard.expiry}</Text>
        </View>
      )}
    </ScrollView>
  );
}
