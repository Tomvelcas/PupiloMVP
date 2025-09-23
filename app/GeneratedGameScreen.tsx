import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';

// mismo tipo que en openai.ts
type GameImage = {
  url: string;
  isOdd: boolean;
};

export default function GeneratedGameScreen() {
  const { title, instructions, description, images, target } = useLocalSearchParams();

  // --- Parsear lista de imágenes con metadata ---
  let imageList: GameImage[] = [];
  if (typeof images === 'string') {
    try {
      const parsed = JSON.parse(images);
      if (Array.isArray(parsed)) {
        imageList = parsed as GameImage[];
      }
    } catch {
      imageList = [];
    }
  }

  // --- Estado local ---
  const [shuffledCards, setShuffledCards] = useState<GameImage[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // --- Mezclar imágenes al montar ---
  useEffect(() => {
    if (imageList.length === 0) {
      setShuffledCards([]);
      return;
    }

    const arr = [...imageList];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setShuffledCards(arr);
    setSelectedIndex(null);
    setIsCorrect(null);
  }, [images]);

  return (
    <LinearGradient colors={['#87CEEB', '#4682B4', '#1E90FF']} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Título */}
        <LinearGradient colors={['#FFD700', '#FFA500', '#FF6347']} style={styles.titleGradient}>
          <Text style={styles.title}>{title ? `✨ ${title} ✨` : '✨ Título del juego ✨'}</Text>
        </LinearGradient>

        {/* Target */}
        {target && (
          <View style={styles.targetBox}>
            <Text style={styles.targetText}>{target}</Text>
          </View>
        )}

        {/* Instrucciones */}
        {(description || instructions) && (
          <View style={styles.instructionsBox}>
            <Text style={styles.instructions}>{description || instructions}</Text>
          </View>
        )}

        {/* Cuadrícula de imágenes */}
        <View style={styles.imagesGrid}>
          {shuffledCards.length > 0
            ? shuffledCards.map((card, i) => {
                const selected = selectedIndex === i;
                const borderColor = selected
                  ? isCorrect
                    ? '#4CAF50'
                    : '#F44336'
                  : '#FF8E9B';

                return (
                  <TouchableOpacity
                    key={i}
                    onPress={() => {
                      setSelectedIndex(i);
                      const correct = card.isOdd; // 👈 usamos metadata
                      setIsCorrect(correct);

                      setTimeout(() => {
                        Alert.alert(
                          correct ? '¡Correcto! 🎉' : 'Intenta de nuevo',
                          correct
                            ? 'Has encontrado la imagen diferente.'
                            : 'Esa imagen no coincide con la descripción.'
                        );
                      }, 100);
                    }}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={['#FF6B9D', '#FF8E9B']}
                      style={[
                        styles.imageSquare,
                        { borderColor: borderColor, borderWidth: selected ? 6 : 2 },
                      ]}
                    >
                      <Image
                        source={{ uri: card.url }}
                        style={{ width: 150, height: 150, borderRadius: 20 }}
                      />
                    </LinearGradient>
                  </TouchableOpacity>
                );
              })
            : [0, 1, 2, 3].map((i) => (
                <LinearGradient
                  key={i}
                  colors={['#FF6B9D', '#FF8E9B']}
                  style={styles.imageSquare}
                />
              ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleGradient: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    marginTop: 40,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  instructionsBox: {
    marginBottom: 32,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  instructions: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.95,
    fontWeight: '600',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  targetBox: {
    marginBottom: 16,
    paddingHorizontal: 18,
    paddingVertical: 12,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 20,
    elevation: 6,
  },
  targetText: {
    fontSize: 22,
    color: '#fff',
    fontWeight: '700',
    textAlign: 'center',
  },
  imagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 16,
    gap: 16,
  },
  imageSquare: {
    width: 170,
    height: 170,
    borderRadius: 24,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
});
