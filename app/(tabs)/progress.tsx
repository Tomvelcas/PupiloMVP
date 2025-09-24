import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import BubbleBackground from '@/components/BubbleBackground';

const { width } = Dimensions.get('window');

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
}

interface CategoryProgress {
  name: string;
  icon: string;
  gamesPlayed: number;
  accuracy: number;
  color: string;
}

// Primero, definimos la paleta de colores
const PALETTE = {
  mint: '#87d4a3',
  powderBlue: '#b0e0e6',
  lightPink: '#ffb6c1',
  lightYellow: '#fae470'
};

// Actualizamos las categorías para usar la nueva paleta
const categoryProgress: CategoryProgress[] = [
  { name: 'Animals', icon: '🐾', gamesPlayed: 15, accuracy: 87, color: PALETTE.lightPink },
  { name: 'Food', icon: '🍎', gamesPlayed: 12, accuracy: 92, color: PALETTE.mint },
  { name: 'Transport', icon: '🚗', gamesPlayed: 8, accuracy: 75, color: PALETTE.powderBlue },
  { name: 'Shapes', icon: '⭕', gamesPlayed: 6, accuracy: 95, color: PALETTE.lightYellow },
  { name: 'Colors', icon: '🌈', gamesPlayed: 4, accuracy: 88, color: PALETTE.lightPink },
];

const achievements: Achievement[] = [
  {
    id: '1',
    title: 'First Step',
    description: 'Complete your first game',
    icon: '🎯',
    unlocked: true,
    progress: 1,
    maxProgress: 1,
  },
  {
    id: '2',
    title: 'Sharp Eye',
    description: 'Get 10 correct answers in a row',
    icon: '👁️',
    unlocked: false,
    progress: 7,
    maxProgress: 10,
  },
  {
    id: '3',
    title: 'Animal Expert',
    description: 'Complete 20 animal category games',
    icon: '🐾',
    unlocked: false,
    progress: 15,
    maxProgress: 20,
  },
  {
    id: '4',
    title: 'Speed Demon',
    description: 'Answer correctly within 5 seconds',
    icon: '⚡',
    unlocked: true,
    progress: 5,
    maxProgress: 5,
  },
];

export default function ProgressScreen() {
  const totalGamesPlayed = categoryProgress.reduce((sum, cat) => sum + cat.gamesPlayed, 0);
  const overallAccuracy = Math.round(
    categoryProgress.reduce((sum, cat) => sum + (cat.accuracy * cat.gamesPlayed), 0) / 
    categoryProgress.reduce((sum, cat) => sum + cat.gamesPlayed, 0)
  );

  return (
    <View style={styles.container}>
      <View style={styles.gradient}>
        <BubbleBackground />
        <SafeAreaView style={styles.safeArea}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <View style={[styles.logoSolid]}>
                  <Text style={styles.logoText}>PUPILO</Text>
                </View>
              </View>
              <Text style={styles.headerTitle}>Tu Progreso</Text>
              <Text style={styles.headerSubtitle}>¡Sigue así, lo estás haciendo genial!</Text>
            </View>

            {/* Overall Stats */}
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <LinearGradient colors={['#4CAF50', '#45A049']} style={styles.statGradient}>
                  <Text style={styles.statEmoji}>🎯</Text>
                  <Text style={styles.statNumber}>{totalGamesPlayed}</Text>
                  <Text style={styles.statLabel}>Juegos</Text>
                </LinearGradient>
              </View>
              <View style={styles.statCard}>
                <LinearGradient colors={['#2196F3', '#1976D2']} style={styles.statGradient}>
                  <Text style={styles.statEmoji}>📈</Text>
                  <Text style={styles.statNumber}>{overallAccuracy}%</Text>
                  <Text style={styles.statLabel}>Aciertos</Text>
                </LinearGradient>
              </View>
              <View style={styles.statCard}>
                <LinearGradient colors={['#FFD700', '#FFA500']} style={styles.statGradient}>
                  <Text style={styles.statEmoji}>⭐</Text>
                  <Text style={styles.statNumber}>
                    {achievements.filter(a => a.unlocked).length}
                  </Text>
                  <Text style={styles.statLabel}>Logros</Text>
                </LinearGradient>
              </View>
            </View>

            {/* Category Progress */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionEmoji}>🏆</Text>
                <Text style={styles.sectionTitle}>Progreso por Categoría</Text>
              </View>
              {categoryProgress.map((category, index) => (
                <View key={index} style={styles.categoryCard}>
                  <View style={styles.categoryHeader}>
                    <View style={styles.categoryInfo}>
                      <Text style={styles.categoryIcon}>{category.icon}</Text>
                      <View>
                        <Text style={styles.categoryName}>{category.name === 'Animals' ? 'Animales' : 
                          category.name === 'Food' ? 'Comida' : 
                          category.name === 'Transport' ? 'Transporte' : 
                          category.name === 'Shapes' ? 'Formas' : 
                          category.name === 'Colors' ? 'Colores' : category.name}</Text>
                        <Text style={styles.categoryStats}>
                          {category.gamesPlayed} juegos • {category.accuracy}% aciertos
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        { 
                          width: `${category.accuracy}%`,
                          backgroundColor: category.color,
                        },
                      ]}
                    />
                  </View>
                </View>
              ))}
            </View>

            {/* Achievements */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionEmoji}>🏅</Text>
                <Text style={styles.sectionTitle}>Logros</Text>
              </View>
              <View style={styles.achievementsGrid}>
                {achievements.map((achievement) => (
                  <View
                    key={achievement.id}
                    style={[
                      styles.achievementCard,
                      !achievement.unlocked && styles.lockedAchievement,
                    ]}
                  >
                    <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                    <Text style={styles.achievementTitle}>
                      {achievement.title === 'First Step' ? 'Primer Paso' :
                       achievement.title === 'Sharp Eye' ? 'Ojo Agudo' :
                       achievement.title === 'Animal Expert' ? 'Experto en Animales' :
                       achievement.title === 'Speed Demon' ? 'Súper Rápido' : achievement.title}
                    </Text>
                    <Text style={styles.achievementDescription}>
                      {achievement.description === 'Complete your first game' ? 'Completa tu primer juego' :
                       achievement.description === 'Get 10 correct answers in a row' ? 'Consigue 10 respuestas correctas seguidas' :
                       achievement.description === 'Complete 20 animal category games' ? 'Completa 20 juegos de animales' :
                       achievement.description === 'Answer correctly within 5 seconds' ? 'Responde correctamente en 5 segundos' : achievement.description}
                    </Text>
                    {!achievement.unlocked && (
                      <View style={styles.achievementProgress}>
                        <Text style={styles.progressText}>
                          {achievement.progress}/{achievement.maxProgress}
                        </Text>
                        <View style={styles.progressBar}>
                          <View
                            style={[
                              styles.progressFill,
                              {
                                width: `${(achievement.progress / achievement.maxProgress) * 100}%`,
                                backgroundColor: '#4CAF50',
                              },
                            ]}
                          />
                        </View>
                      </View>
                    )}
                    {achievement.unlocked && (
                      <View style={styles.unlockedBadge}>
                        <Text style={styles.unlockedText}>🌊 ¡Desbloqueado!</Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            </View>

            {/* Weekly Goal */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionEmoji}>📅</Text>
                <Text style={styles.sectionTitle}>Meta Semanal</Text>
              </View>
              <View style={styles.goalCard}>
                <Text style={styles.goalTitle}>Jugar 20 Juegos Esta Semana</Text>
                <Text style={styles.goalProgress}>12 / 20 juegos completados</Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: '60%', backgroundColor: '#4CAF50' }]} />
                </View>
                <Text style={styles.goalEncouragement}>
                  ¡Estás nadando genial! ¡Sigue así! 🐠
                </Text>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    backgroundColor: PALETTE.powderBlue, // Fondo azul polvo
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
  logoSolid: {
    backgroundColor: '#427de1',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 20,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    alignItems: 'center',
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
    fontSize: 34,           // Más grande
    fontWeight: 'bold',
    color: '#fff',          // Blanco
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 3,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: PALETTE.mint, // Cambiamos a verde menta
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  statGradient: {
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    backgroundColor: PALETTE.mint, // Verde menta para estadísticas
  },
  statEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '600',
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
    color: '#333333',
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  categoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: PALETTE.mint, // Borde verde menta
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  categoryStats: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: PALETTE.mint, // Barras de progreso en verde menta
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  achievementCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    borderTopWidth: 4,
    borderTopColor: PALETTE.lightYellow, // Borde amarillo claro
  },
  lockedAchievement: {
    opacity: 0.7,
  },
  achievementIcon: {
    fontSize: 36,
    marginBottom: 8,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 18,
  },
  achievementProgress: {
    width: '100%',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
    fontWeight: '600',
  },
  unlockedBadge: {
    backgroundColor: PALETTE.mint, // Verde menta para logros desbloqueados
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  unlockedText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  goalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    borderTopWidth: 4,
    borderTopColor: PALETTE.lightPink, // Borde rosa claro
  },
  goalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  goalProgress: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
    fontWeight: '600',
  },
  goalEncouragement: {
    fontSize: 16,
    color: PALETTE.mint, // Verde menta para texto de ánimo
    fontWeight: '600',
    marginTop: 12,
    textAlign: 'center',
    lineHeight: 22,
  },
});