import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Pressable, Switch, Text, TextInput, View } from 'react-native';
import { checkout } from '../services/api';
import { saveCardForCheckout } from '../services/storage';
import type { RootStackParamList } from '../utils/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Checkout'>;

export default function CheckoutScreen({ route }: Props) {
  const { cart } = route.params;
  const [cardNumber, setCardNumber] = useState('');
  const [cvv, setCvv] = useState('');
  const [expiry, setExpiry] = useState('');
  const [saveCard, setSaveCard] = useState(true);
  const [confirmed, setConfirmed] = useState(false);

  async function handlePay() {
    const card = { number: cardNumber, cvv, expiry };

    if (saveCard) {
      // VULNERABLE: ver services/storage.ts -> PAN + CVV en claro
      await saveCardForCheckout(card);
    }

    await checkout(cart, card);
    setConfirmed(true);
  }

  if (confirmed) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Text className="text-xl font-semibold">¡Pedido confirmado!</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white px-6 pt-4">
      <Text className="mb-4 text-2xl font-bold">Pago</Text>
      <TextInput
        className="mb-3 rounded-lg border border-gray-300 px-4 py-3"
        placeholder="Número de tarjeta"
        keyboardType="number-pad"
        value={cardNumber}
        onChangeText={setCardNumber}
      />
      <TextInput
        className="mb-3 rounded-lg border border-gray-300 px-4 py-3"
        placeholder="MM/AA"
        value={expiry}
        onChangeText={setExpiry}
      />
      <TextInput
        className="mb-3 rounded-lg border border-gray-300 px-4 py-3"
        placeholder="CVV"
        keyboardType="number-pad"
        secureTextEntry
        value={cvv}
        onChangeText={setCvv}
      />
      <View className="mb-5 flex-row items-center justify-between">
        <Text>Guardar tarjeta para próxima vez</Text>
        <Switch value={saveCard} onValueChange={setSaveCard} />
      </View>
      <Pressable className="rounded-lg bg-brand py-3" onPress={handlePay}>
        <Text className="text-center font-semibold text-white">Pagar</Text>
      </Pressable>
    </View>
  );
}
