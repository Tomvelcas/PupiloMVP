import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Animated, Dimensions, TouchableOpacity } from 'react-native';

const { width, height } = Dimensions.get('window');

interface Bubble {
  id: number;
  x: Animated.Value;
  y: Animated.Value;
  size: number;
  emoji: string;
  dx: number; // velocidad horizontal
  dy: number; // velocidad vertical
}

export default function InteractiveBackground() {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  const oceanEmojis = ['🐠', '🐙', '🦀', '🐚', '⭐', '🌊', '🫧', '🪸', '🦈', '🐢'];

  useEffect(() => {
    const newBubbles: Bubble[] = [];

    for (let i = 0; i < 20; i++) {
      newBubbles.push({
        id: i,
        x: new Animated.Value(Math.random() * width),
        y: new Animated.Value(Math.random() * height),
        size: Math.random() * 40 + 20,
        emoji: oceanEmojis[Math.floor(Math.random() * oceanEmojis.length)],
        dx: (Math.random() - 0.5) * 2, // velocidad horizontal
        dy: (Math.random() - 0.5) * 2, // velocidad vertical
      });
    }

    setBubbles(newBubbles);

    newBubbles.forEach((bubble) => animateBubble(bubble));
  }, []);

  const animateBubble = (bubble: Bubble) => {
    const step = () => {
      bubble.x.setValue(bubble.x.__getValue() + bubble.dx * 3);
      bubble.y.setValue(bubble.y.__getValue() + bubble.dy * 3);

      // Rebote horizontal
      if (bubble.x.__getValue() < 0 || bubble.x.__getValue() > width - bubble.size) {
        bubble.dx *= -1;
      }
      // Rebote vertical
      if (bubble.y.__getValue() < 0 || bubble.y.__getValue() > height - bubble.size) {
        bubble.dy *= -1;
      }

      requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  const handleBubblePress = (bubble: Bubble) => {
    // Pequeña animación de "pop" al tocar
    Animated.sequence([
      Animated.timing(bubble.x, {
        toValue: bubble.x.__getValue() + 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(bubble.x, {
        toValue: bubble.x.__getValue() - 10,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View style={styles.container} pointerEvents="box-none">
      {bubbles.map((bubble) => (
        <TouchableOpacity
          key={bubble.id}
          onPress={() => handleBubblePress(bubble)}
          style={styles.touchable}
          activeOpacity={0.8}
        >
          <Animated.View
            style={[
              styles.bubble,
              {
                width: bubble.size,
                height: bubble.size,
                borderRadius: bubble.size / 2,
                transform: [{ translateX: bubble.x }, { translateY: bubble.y }],
              },
            ]}
          >
            <Animated.Text style={[styles.emoji, { fontSize: bubble.size * 0.6 }]}>
              {bubble.emoji}
            </Animated.Text>
          </Animated.View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  touchable: {
    position: 'absolute',
  },
  bubble: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  emoji: {
    textAlign: 'center',
  },
});
