import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight } from 'lucide-react-native';
import BubbleBackground from '@/components/BubbleBackground';

export default function SettingsScreen() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const [parentalControls, setParentalControls] = useState(false);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');

  const handleDifficultyChange = () => {
    const levels: ('easy' | 'medium' | 'hard')[] = ['easy', 'medium', 'hard'];
    const currentIndex = levels.indexOf(difficulty);
    const nextIndex = (currentIndex + 1) % levels.length;
    setDifficulty(levels[nextIndex]);
  };

  const showInfo = (title: string, message: string) => {
    Alert.alert(title, message, [{ text: 'OK' }]);
  };

  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'easy':
        return '#10B981';
      case 'medium':
        return '#F59E0B';
      case 'hard':
        return '#EF4444';
      default:
        return '#9E9E9E';
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#87CEEB', '#4682B4', '#1E90FF']} style={styles.gradient}>
        <BubbleBackground />
        <SafeAreaView style={styles.safeArea}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <LinearGradient colors={['#FFD700', '#FFA500']} style={styles.logoGradient}>
                  <Text style={styles.logoText}>PUPILO</Text>
                </LinearGradient>
              </View>
              <Text style={styles.headerTitle}>Configuración</Text>
              <Text style={styles.headerSubtitle}>Personaliza tu aventura oceánica</Text>
            </View>

            {/* Game Settings */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionEmoji}>⚙️</Text>
                <Text style={styles.sectionTitle}>Configuración del Juego</Text>
              </View>

              <View style={styles.settingCard}>
                <View style={styles.settingRow}>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingEmoji}>
                      {soundEnabled ? '🔊' : '🔇'}
                    </Text>
                    <View style={styles.settingText}>
                      <Text style={styles.settingTitle}>Efectos de Sonido</Text>
                      <Text style={styles.settingDescription}>
                        Reproduce sonidos para respuestas correctas e incorrectas
                      </Text>
                    </View>
                  </View>
                  <Switch
                    value={soundEnabled}
                    onValueChange={setSoundEnabled}
                    trackColor={{ false: '#E0E0E0', true: '#10B981' }}
                    thumbColor={soundEnabled ? '#FFFFFF' : '#FFFFFF'}
                  />
                </View>
              </View>

              <View style={styles.settingCard}>
                <View style={styles.settingRow}>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingEmoji}>
                      {hapticEnabled ? '📳' : '📴'}
                    </Text>
                    <View style={styles.settingText}>
                      <Text style={styles.settingTitle}>Vibración</Text>
                      <Text style={styles.settingDescription}>
                        Siente vibraciones al tocar botones
                      </Text>
                    </View>
                  </View>
                  <Switch
                    value={hapticEnabled}
                    onValueChange={setHapticEnabled}
                    trackColor={{ false: '#E0E0E0', true: '#10B981' }}
                    thumbColor={hapticEnabled ? '#FFFFFF' : '#FFFFFF'}
                  />
                </View>
              </View>

              <TouchableOpacity style={styles.settingCard} onPress={handleDifficultyChange}>
                <View style={styles.settingRow}>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingEmoji}>
                      {difficulty === 'easy' ? '🟢' : difficulty === 'medium' ? '🟡' : '🔴'}
                    </Text>
                    <View style={styles.settingText}>
                      <Text style={styles.settingTitle}>Nivel de Dificultad</Text>
                      <Text style={styles.settingDescription}>
                        Actual: {difficulty === 'easy' ? 'Fácil' : difficulty === 'medium' ? 'Medio' : 'Difícil'}
                      </Text>
                    </View>
                  </View>
                  <ChevronRight size={24} color="#666" />
                </View>
              </TouchableOpacity>
            </View>

            {/* Parental Controls */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionEmoji}>🛡️</Text>
                <Text style={styles.sectionTitle}>Control Parental</Text>
              </View>

              <View style={styles.settingCard}>
                <View style={styles.settingRow}>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingEmoji}>
                      {parentalControls ? '🔒' : '🔓'}
                    </Text>
                    <View style={styles.settingText}>
                      <Text style={styles.settingTitle}>Restringir Juegos Personalizados</Text>
                      <Text style={styles.settingDescription}>
                        Limita el acceso a contenido generado por IA
                      </Text>
                    </View>
                  </View>
                  <Switch
                    value={parentalControls}
                    onValueChange={setParentalControls}
                    trackColor={{ false: '#E0E0E0', true: '#10B981' }}
                    thumbColor={parentalControls ? '#FFFFFF' : '#FFFFFF'}
                  />
                </View>
              </View>

              <TouchableOpacity
                style={styles.settingCard}
                onPress={() =>
                  showInfo(
                    'Control Parental',
                    'Cuando está activado, los niños no pueden crear juegos personalizados usando IA. Solo estarán disponibles las categorías pre-aprobadas.'
                  )
                }
              >
                <View style={styles.settingRow}>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingEmoji}>❓</Text>
                    <View style={styles.settingText}>
                      <Text style={styles.settingTitle}>Acerca del Control Parental</Text>
                      <Text style={styles.settingDescription}>Aprende más</Text>
                    </View>
                  </View>
                  <ChevronRight size={24} color="#666" />
                </View>
              </TouchableOpacity>
            </View>

            {/* App Info */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionEmoji}>ℹ️</Text>
                <Text style={styles.sectionTitle}>Acerca de</Text>
              </View>

              <TouchableOpacity
                style={styles.settingCard}
                onPress={() =>
                  showInfo(
                    'Pupilo',
                    'Versión 1.0\n\n¡Sumérgete en juegos educativos divertidos que ayudan a los niños a desarrollar pensamiento crítico, reconocimiento de patrones y habilidades de resolución de problemas. ¡Creado con cariño para jóvenes exploradores del océano! 🌊'
                  )
                }
              >
                <View style={styles.settingRow}>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingEmoji}>🌊</Text>
                    <View style={styles.settingText}>
                      <Text style={styles.settingTitle}>Pupilo</Text>
                      <Text style={styles.settingDescription}>Versión 1.0</Text>
                    </View>
                  </View>
                  <ChevronRight size={24} color="#666" />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.settingCard}
                onPress={() =>
                  showInfo(
                    'Cómo Jugar',
                    '🌊 Juegos de Pupilo:\n\n🔍 Encuentra el Diferente: Busca lo que no pertenece\n🖼️ Busca Objetos: Encuentra elementos en las imágenes\n🧠 Analogías: Completa las oraciones\n\n¡Consejo: Piensa como un explorador del océano - busca patrones y conexiones!'
                  )
                }
              >
                <View style={styles.settingRow}>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingEmoji}>❓</Text>
                    <View style={styles.settingText}>
                      <Text style={styles.settingTitle}>Cómo Jugar</Text>
                      <Text style={styles.settingDescription}>Instrucciones del juego</Text>
                    </View>
                  </View>
                  <ChevronRight size={24} color="#666" />
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoContainer: {
    marginBottom: 15,
  },
  logoGradient: {
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 20,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionEmoji: {
    fontSize: 24,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  settingCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    marginBottom: 12,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingEmoji: {
    fontSize: 24,
    marginRight: 16,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 15,
    color: '#666',
    lineHeight: 20,
  },
});