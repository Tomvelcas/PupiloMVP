import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import FloatingAvatar from './FloatingAvatar';

interface AvatarCustomization {
  body: string;
  eyes: string;
  mouth: string;
  accessory: string;
  color: string;
}

interface GameAvatarProps {
  avatar: AvatarCustomization;
  emotion: 'happy' | 'excited' | 'thinking' | 'celebrating';
  size?: number;
  position?: 'top-right' | 'bottom-left' | 'center';
}

export default function GameAvatar({ 
  avatar, 
  emotion, 
  size = 60, 
  position = 'top-right' 
}: GameAvatarProps) {
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const wiggleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    switch (emotion) {
      case 'happy':
        Animated.loop(
          Animated.sequence([
            Animated.timing(bounceAnim, {
              toValue: -5,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(bounceAnim, {
              toValue: 0,
              duration: 1000,
              useNativeDriver: true,
            }),
          ])
        ).start();
        break;
      
      case 'excited':
        Animated.loop(
          Animated.sequence([
            Animated.timing(bounceAnim, {
              toValue: -10,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(bounceAnim, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
          ])
        ).start();
        break;
      
      case 'thinking':
        Animated.loop(
          Animated.sequence([
            Animated.timing(wiggleAnim, {
              toValue: 5,
              duration: 800,
              useNativeDriver: true,
            }),
            Animated.timing(wiggleAnim, {
              toValue: -5,
              duration: 800,
              useNativeDriver: true,
            }),
            Animated.timing(wiggleAnim, {
              toValue: 0,
              duration: 800,
              useNativeDriver: true,
            }),
          ])
        ).start();
        break;
      
      case 'celebrating':
        Animated.loop(
          Animated.sequence([
            Animated.timing(bounceAnim, {
              toValue: -15,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(bounceAnim, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }),
          ]),
          { iterations: 5 }
        ).start();
        break;
    }
  }, [emotion]);

  const getPositionStyle = () => {
    switch (position) {
      case 'top-right':
        return { position: 'absolute', top: 20, right: 20, zIndex: 10 };
      case 'bottom-left':
        return { position: 'absolute', bottom: 20, left: 20, zIndex: 10 };
      case 'center':
        return { alignSelf: 'center', zIndex: 10 };
      default:
        return { position: 'absolute', top: 20, right: 20, zIndex: 10 };
    }
  };

  const getAvatarWithEmotion = () => {
    const emotionMap = {
      happy: { eyes: '😊', mouth: '😀' },
      excited: { eyes: '🤩', mouth: '😆' },
      thinking: { eyes: '🤔', mouth: '😐' },
      celebrating: { eyes: '🥳', mouth: '😄' },
    };

    return {
      ...avatar,
      ...emotionMap[emotion],
    };
  };

  return (
    <Animated.View
      style={[
        getPositionStyle(),
        {
          transform: [
            { translateY: bounceAnim },
            { translateX: wiggleAnim },
          ],
        },
      ]}
    >
      <View style={styles.avatarContainer}>
        <FloatingAvatar 
          avatar={getAvatarWithEmotion()} 
          size={size} 
          animated={true}
          celebration={emotion === 'celebrating'}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  avatarContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 50,
    padding: 10,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
});