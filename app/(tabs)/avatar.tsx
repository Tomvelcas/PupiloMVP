// app/(tabs)/avatar.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FloatingAvatar, { AvatarCustomization } from '@/components/FloatingAvatar';

const PALETTE = {
  mint: '#87d4a3',
  powderBlue: '#b0e0e6',
  lightPink: '#ffb6c1',
  lightYellow: '#fae470'
};

const eyeOptions = [['variant01'], ['variant02'], ['variant03']];
const mouthOptions = [['smile01'], ['smile02'], ['smile03']];
const skinOptions = [['b6e3f4'], ['d1d4f9'], ['c0aede'], ['ffdfbf']];

export default function AvatarScreen() {
  const [avatar, setAvatar] = useState<AvatarCustomization>({
    seed: 'mi-avatar',
    eyes: ['variant01'],
    mouth: ['smile01'],
    skinColor: ['b6e3f4'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>✨ ¡Personaliza tu Avatar! ✨</Text>

        {/* Avatar Preview */}
        <View style={styles.avatarPreview}>
          <FloatingAvatar avatar={avatar} size={250} /> {/* Tamaño incrementado */}
        </View>

        {/* Opciones: ojos */}
        <Text style={styles.subtitle}>👀 Ojos</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {eyeOptions.map((opt) => (
            <TouchableOpacity
              key={opt[0]}
              style={[
                styles.option,
                avatar.eyes?.[0] === opt[0] && styles.selectedOption,
              ]}
              onPress={() => setAvatar((prev) => ({ ...prev, eyes: opt }))}
            >
              <Text>{opt[0]}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Opciones: boca */}
        <Text style={styles.subtitle}>👄 Boca</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {mouthOptions.map((opt) => (
            <TouchableOpacity
              key={opt[0]}
              style={[
                styles.option,
                avatar.mouth?.[0] === opt[0] && styles.selectedOption,
              ]}
              onPress={() => setAvatar((prev) => ({ ...prev, mouth: opt }))}
            >
              <Text>{opt[0]}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Opciones: piel */}
        <Text style={styles.subtitle}>🎨 Color de piel</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {skinOptions.map((opt) => (
            <TouchableOpacity
              key={opt[0]}
              style={[
                styles.colorOption,
                { backgroundColor: `#${opt[0]}` },
                avatar.skinColor?.[0] === opt[0] && styles.selectedColor,
              ]}
              onPress={() => setAvatar((prev) => ({ ...prev, skinColor: opt }))}
            />
          ))}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: PALETTE.powderBlue // Fondo azul polvo
  },
  scrollContent: { 
    padding: 25, 
    alignItems: 'center'
  },
  title: { 
    fontSize: 28, // Texto más grande
    fontWeight: '800', // Más bold
    marginBottom: 25,
    color: '#333333', // Color más oscuro para mejor legibilidad
    textAlign: 'center',
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  avatarPreview: {
    marginBottom: 30,
    backgroundColor: PALETTE.lightPink, // Fondo rosa claro
    borderRadius: 200,
    padding: 15,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    borderWidth: 3,
    borderColor: '#fff'
  },
  subtitle: { 
    fontSize: 22, // Texto más grande
    fontWeight: '700', // Más bold
    marginBottom: 12,
    marginTop: 20,
    color: '#333333', // Color más oscuro para mejor legibilidad
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  option: {
    backgroundColor: PALETTE.lightYellow, // Fondo amarillo claro
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 25,
    marginRight: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  selectedOption: { 
    backgroundColor: PALETTE.mint, // Verde menta para selección
    transform: [{ scale: 1.05 }], // Ligero incremento de tamaño
    borderWidth: 2,
    borderColor: '#fff'
  },
  colorOption: {
    width: 50, // Más grandes
    height: 50, // Más grandes
    borderRadius: 25,
    marginRight: 15,
    borderWidth: 3,
    borderColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  selectedColor: {
    borderColor: PALETTE.mint, // Verde menta para el borde de selección
    borderWidth: 4,
    transform: [{ scale: 1.1 }], // Ligero incremento de tamaño
  },
});
