import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

interface Bubble {
  id: number;
  x: Animated.Value;
  y: Animated.Value;
  size: number;
  color: string;
  duration: number;
}

export default function BubbleBackground() {
  const bubbles = useRef<Bubble[]>([]);
  const animationRefs = useRef<Animated.CompositeAnimation[]>([]);

  useEffect(() => {
    // Create bubbles
    for (let i = 0; i < 15; i++) {
      const bubble: Bubble = {
        id: i,
        x: new Animated.Value(Math.random() * width),
        y: new Animated.Value(height + 100),
        size: Math.random() * 60 + 20,
        color: getBubbleColor(),
        duration: Math.random() * 8000 + 6000,
      };
      bubbles.current.push(bubble);
    }

    // Start animations
    bubbles.current.forEach((bubble, index) => {
      const animateBubble = () => {
        // Reset position
        bubble.y.setValue(height + 100);
        bubble.x.setValue(Math.random() * width);

        const animation = Animated.parallel([
          Animated.timing(bubble.y, {
            toValue: -100,
            duration: bubble.duration,
            useNativeDriver: true,
          }),
          Animated.timing(bubble.x, {
            toValue: bubble.x._value + (Math.random() - 0.5) * 200,
            duration: bubble.duration,
            useNativeDriver: true,
          }),
        ]);

        animation.start(() => {
          // Restart animation
          setTimeout(() => animateBubble(), Math.random() * 2000);
        });

        animationRefs.current[index] = animation;
      };

      // Start with random delay
      setTimeout(() => animateBubble(), Math.random() * 5000);
    });

    return () => {
      animationRefs.current.forEach(animation => animation?.stop());
    };
  }, []);

  const getBubbleColor = () => {
    const colors = [
      'rgba(255, 255, 255, 0.3)',
      'rgba(135, 206, 235, 0.4)',
      'rgba(173, 216, 230, 0.3)',
      'rgba(176, 224, 230, 0.4)',
      'rgba(240, 248, 255, 0.3)',
      'rgba(0, 191, 255, 0.2)',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <View style={styles.container} pointerEvents="none">
      {bubbles.current.map((bubble) => (
        <Animated.View
          key={bubble.id}
          style={[
            styles.bubble,
            {
              width: bubble.size,
              height: bubble.size,
              borderRadius: bubble.size / 2,
              backgroundColor: bubble.color,
              transform: [
                { translateX: bubble.x },
                { translateY: bubble.y },
              ],
            },
          ]}
        />
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
  bubble: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
});