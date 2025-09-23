// app/(tabs)/avatar.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FloatingAvatar, { AvatarCustomization } from '@/components/FloatingAvatar';

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
        <Text style={styles.title}>🎨 ¡Crea tu Avatar con DiceBear!</Text>

        {/* Avatar Preview */}
        <View style={styles.avatarPreview}>
          <FloatingAvatar avatar={avatar} size={220} />
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
  container: { flex: 1, backgroundColor: '#87CEEB' },
  scrollContent: { padding: 20, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#fff' },
  avatarPreview: {
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 200,
    padding: 12,
    elevation: 5,
  },
  subtitle: { fontSize: 18, fontWeight: '600', marginBottom: 8, color: '#fff' },
  option: {
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  selectedOption: { backgroundColor: '#FFD700', fontWeight: 'bold' },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#fff',
  },
  selectedColor: {
    borderColor: '#FFD700',
    borderWidth: 3,
  },
});
