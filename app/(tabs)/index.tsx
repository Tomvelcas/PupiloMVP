import TextToSpeech from '../../components/TextToSpeech';
import * as Speech from 'expo-speech';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Brain, Wand as Wand2 } from 'lucide-react-native';
import InteractiveBackground from '@/components/InteractiveBackground';
import GameCard from '@/components/GameCard';
import AnimatedButton from '@/components/AnimatedButton';
import { Button } from 'react-native';
import FloatingAvatar from '@/components/FloatingAvatar';
import GameTemplate from '@/components/GameTemplate';
import { generateGameContent } from '@/utils/openai'; // <-- updated import

const { width } = Dimensions.get('window');

interface GameType {
  id: string;
  title: string;
  description: string;
  emoji: string;
  colors: string[];
  route: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  color: string;
}

const gameTypes: GameType[] = [
  {
    id: '1',
    title: 'Encuentra el Diferente',
    description: 'Busca el objeto que no pertenece al grupo',
    emoji: '🔍',
    colors: ['#FF6B9D', '#FF8E9B', '#FFB4B4'],
    route: '/games/odd-one-out',
    difficulty: 'easy',
  },
  {
    id: '2',
    title: 'Busca Objetos',
    description: 'Encuentra objetos específicos en las imágenes',
    emoji: '🖼️',
    colors: ['#4ECDC4', '#44A08D', '#096A2E'],
    route: '/games/find-objects',
    difficulty: 'medium',
  },
  {
    id: '3',
    title: 'Completa la Frase',
    description: 'Termina la oración con la palabra correcta',
    emoji: '🧠',
    colors: ['#A8E6CF', '#7FCDCD', '#55A3FF'],
    route: '/games/analogies',
    difficulty: 'medium',
  },
  {
    id: '4',
    title: 'Patrones Divertidos',
    description: 'Resuelve secuencias y patrones visuales',
    emoji: '🧩',
    colors: ['#FFD93D', '#6BCF7F', '#4D96FF'],
    route: '/games/patterns',
    difficulty: 'hard',
  },
];

const categories: Category[] = [
  {
    id: '1',
    name: 'Animales',
    icon: '🐾',
    description: 'Animales salvajes vs domésticos',
    difficulty: 'easy',
    color: '#FF6B6B',
  },
  {
    id: '2',
    name: 'Comida',
    icon: '🍎',
    description: 'Frutas, verduras y más',
    difficulty: 'easy',
    color: '#4ECDC4',
  },
  {
    id: '3',
    name: 'Transporte',
    icon: '🚗',
    description: 'Vehículos de tierra, aire y mar',
    difficulty: 'medium',
    color: '#45B7D1',
  },
  {
    id: '4',
    name: 'Formas',
    icon: '⭕',
    description: 'Círculos, cuadrados y triángulos',
    difficulty: 'easy',
    color: '#96CEB4',
  },
  {
    id: '5',
    name: 'Colores',
    icon: '🌈',
    description: 'Colores primarios y secundarios',
    difficulty: 'easy',
    color: '#FFEAA7',
  },
  {
    id: '6',
    name: 'Deportes',
    icon: '⚽',
    description: 'Deportes de interior vs exterior',
    difficulty: 'medium',
    color: '#DDA0DD',
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const [customPrompt, setCustomPrompt] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // nuevo estado para mostrar el modal de la plantilla del juego
  const [showGameTemplate, setShowGameTemplate] = useState(false);
  const [templateData, setTemplateData] = useState<{
    title: string;
    description: string;
    target?: string;
    instructions: string;
    image?: string;
    images?: string[];
  } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Default avatar - in real app this would come from user's saved avatar
  const userAvatar = {
    body: '🐠',
    eyes: '😊',
    mouth: '😀',
    accessory: '👑',
    color: '#FF6B9D',
  };

  const handleGamePress = (game: GameType) => {
    router.push('/games');
  };

  const handleCategoryPress = (category: Category) => {
    setSelectedCategory(category.id);
    Alert.alert(
      `¡${category.name} Seleccionado!`,
      `Iniciando juegos de nivel ${category.difficulty === 'easy' ? 'fácil' : category.difficulty === 'medium' ? 'medio' : 'difícil'} sobre ${category.description}`,
      [
        {
          text: '¡Jugar Ahora!',
          onPress: () => {
            router.push('/games');
            setSelectedCategory(null);
          },
        },
        {
          text: 'Cancelar',
          style: 'cancel',
          onPress: () => setSelectedCategory(null),
        },
      ]
    );
  };

  const generateCustomGame = async () => {
    if (!customPrompt.trim()) {
      Alert.alert('¡Escribe un tema!', 'Describe sobre qué quieres que sea el juego');
      return;
    }

    try {
      setIsGenerating(true);
      const result = await generateGameContent(customPrompt);
      console.log('generateGameContent result:', result);
      if (!result) {
        Alert.alert('Error', 'No se pudo generar el juego. Intenta de nuevo.');
        setIsGenerating(false);
        return;
      }

      const title = result.title ?? `Juego: ${customPrompt.slice(0, 40)}${customPrompt.length > 40 ? '...' : ''}`;
      const instructions = result.instructions ?? `Observa las tarjetas y selecciona el que NO pertenece al grupo. Tema: ${customPrompt}.`;
      const description = result.description ?? instructions;
      const images = Array.isArray(result.images) ? result.images : [];
      const target = (result as any).target ?? undefined;
      const previewFromResult = (result as any).preview as string | undefined;

      // Prefer explicit preview returned by the model; otherwise fall back to choosing a preview from images
      let previewImage: string | undefined = previewFromResult;
      let optionImages: string[] = images;
      if (!previewImage) {
        if (images.length > 1) {
          previewImage = images[images.length - 1];
          optionImages = images.slice(0, images.length - 1);
        } else if (images.length === 1) {
          previewImage = images[0];
          optionImages = images;
        }
      }

      setTemplateData({
        title,
        description,
        target,
        instructions,
        images: optionImages,
        image: previewImage,
      });

      setShowGameTemplate(true);
    } catch (e) {
      console.error('generateCustomGame error (OpenAI):', e);
      Alert.alert('Error', 'No se pudo conectar con OpenAI.');
    } finally {
      setIsGenerating(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return '#4CAF50';
      case 'medium':
        return '#FF9800';
      case 'hard':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };

  // 👇 AQUI colocas la función
  const handleSpeak = (title: string, description: string) => {
    const text = `${title}. ${description}`;
    Speech.speak(text, { language: 'es-ES' }); // puedes ajustar idioma
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#87CEEB', '#4682B4', '#1E90FF']} style={styles.gradient}>
        <InteractiveBackground />
        
        <SafeAreaView style={styles.safeArea}>
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            
            {/* Header with App Name */}
            <View style={styles.header}>
              <View style={styles.avatarWelcome}>
                <FloatingAvatar avatar={userAvatar} size={80} animated={true} />
              </View>
              <View style={styles.logoContainer}>
                <LinearGradient colors={['#FFD700', '#FFA500', '#FF6347']} style={styles.logoGradient}>
                  <Text style={styles.logoText}>PUPILO</Text>
                </LinearGradient>
              </View>
              <Text style={styles.welcomeText}>¡Bienvenido a tu aventura de aprendizaje!</Text>
              <Text style={styles.subtitle}>Juega, aprende y diviértete con nosotros</Text>
            </View>

            {/* AI Custom Game Generator - MAIN FEATURE */}
            <View style={styles.aiSection}>
              <View style={styles.aiHeader}>
                <LinearGradient colors={['#9C27B0', '#E91E63']} style={styles.aiHeaderGradient}>
                  <Brain size={32} color="#FFFFFF" />
                  <Text style={styles.aiTitle}>🤖 Crea tu Juego con IA</Text>
                </LinearGradient>
              </View>
              <Text style={styles.aiSubtitle}>
                ¡Usa inteligencia artificial para crear juegos personalizados!
              </Text>
              
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Ejemplo: 'animales del océano vs animales de la tierra' o 'cosas de la cocina'"
                  placeholderTextColor="#A0A0A0"
                  value={customPrompt}
                  onChangeText={setCustomPrompt}
                  multiline
                  maxLength={200}
                />
                <AnimatedButton onPress={generateCustomGame} style={styles.generateButton as any}>
                  <LinearGradient colors={['#FF6B9D', '#FF8E9B']} style={styles.generateButtonGradient}>
                    <Wand2 size={24} color="#FFFFFF" />
                    <Text style={styles.generateButtonText}>{isGenerating ? 'Generando...' : '✨ ¡Crear Juego Mágico!'}</Text>
                  </LinearGradient>
                </AnimatedButton>
              </View>
            </View>

            {/* Game Categories */}
            <View style={styles.categoriesSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>🎯 Categorías de Juegos</Text>
              </View>
              
              <View style={styles.categoriesGrid}>
                {categories.map((category) => (
                  <AnimatedButton
                    key={category.id}
                    onPress={() => handleCategoryPress(category)}
                    style={
                      ([
                        styles.categoryCard,
                        { backgroundColor: category.color },
                        selectedCategory === category.id && styles.selectedCategory,
                      ] as any)
                    }
                  >
                    <Text style={styles.categoryIcon}>{category.icon}</Text>
                    <Text style={styles.categoryName}>{category.name}</Text>
                    <Text style={styles.categoryDescription}>{category.description}</Text>
                    <View style={styles.difficultyBadge}>
                      <View
                        style={[
                          styles.difficultyDot,
                          { backgroundColor: getDifficultyColor(category.difficulty) },
                        ]}
                      />
                      <Text style={styles.difficultyText}>
                        {category.difficulty === 'easy' ? 'Fácil' : 
                         category.difficulty === 'medium' ? 'Medio' : 'Difícil'}
                      </Text>
                    </View>
                  </AnimatedButton>
                ))}
              </View>
            </View>

            {/* All Games Grid */}
            <View style={styles.gamesSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>🎮 Tipos de Juegos</Text>
              </View>
              
              <View style={styles.gamesGrid}>
                {gameTypes.map((game) => (
                  <View key={game.id} style={{ marginBottom: 12 }}>
                    <GameCard
                      title={game.title}
                      description={game.description}
                      colors={game.colors}
                      emoji={game.emoji}
                      difficulty={game.difficulty}
                      onPress={() => handleGamePress(game)}
                    />

                    {/* Botón para convertir a voz */}
                    <AnimatedButton
                      onPress={() => handleSpeak(game.title, game.description)}
                      style={{
                        backgroundColor: '#ff4da6', // rosa fuerte
                        paddingVertical: 12,
                        paddingHorizontal: 24,
                        borderRadius: 30,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 4,
                        elevation: 6, // sombra en Android
                      }}
                    >
                      <Text
                        style={{
                          color: '#fff',
                          fontSize: 18,
                          fontWeight: 'bold',
                          textAlign: 'center',
                        }}
                      >
                        Escuchar descripción
                      </Text>
                    </AnimatedButton>
                  </View>
                ))}
              </View>
            </View>

            {/* Progress Stats */}
            <View style={styles.statsSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>📊 Tu Progreso</Text>
              </View>
              
              <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                  <LinearGradient colors={['#FFD700', '#FFA500']} style={styles.statGradient}>
                    <Text style={styles.statEmoji}>⭐</Text>
                    <Text style={styles.statNumber}>127</Text>
                    <Text style={styles.statLabel}>Puntos</Text>
                  </LinearGradient>
                </View>
                
                <View style={styles.statCard}>
                  <LinearGradient colors={['#4CAF50', '#45A049']} style={styles.statGradient}>
                    <Text style={styles.statEmoji}>🎯</Text>
                    <Text style={styles.statNumber}>23</Text>
                    <Text style={styles.statLabel}>Juegos</Text>
                  </LinearGradient>
                </View>
                
                <View style={styles.statCard}>
                  <LinearGradient colors={['#9C27B0', '#7B1FA2']} style={styles.statGradient}>
                    <Text style={styles.statEmoji}>🏆</Text>
                    <Text style={styles.statNumber}>89%</Text>
                    <Text style={styles.statLabel}>Aciertos</Text>
                  </LinearGradient>
                </View>
              </View>
            </View>

            {/* Motivational Message */}
            <View style={styles.motivationSection}>
              <LinearGradient colors={['#FF9A9E', '#FECFEF', '#FECFEF']} style={styles.motivationCard}>
                <Text style={styles.motivationEmoji}>🌈</Text>
                <Text style={styles.motivationText}>
                  ¡Eres increíble! Sigue jugando y aprendiendo cosas nuevas cada día.
                </Text>
              </LinearGradient>
            </View>

          </ScrollView>
        </SafeAreaView>

        {/* Modal que muestra la plantilla del juego */}
        <Modal
          visible={showGameTemplate}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowGameTemplate(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              {templateData && (
                <GameTemplate
                  title={templateData.title}
                  description={templateData.description}
                  instructions={templateData.instructions}
                  image={templateData.image}
                  // images prop removed, GameTemplate only accepts 'image'
                  onStart={() => {
                    setShowGameTemplate(false);
                    router.push({
                      pathname: '/GeneratedGameScreen',
                      params: {
                        title: templateData.title,
                          instructions: templateData.instructions,
                          description: templateData.description,
                          target: templateData.target,
                          images: JSON.stringify(templateData.images ?? []),
                      },
                    });
                    setCustomPrompt('');
                  }}
                />
              )}
            </View>
          </View>
        </Modal>
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
  avatarWelcome: {
    marginBottom: 20,
  },
  logoContainer: {
    marginBottom: 15,
  },
  logoGradient: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  welcomeText: {
    fontSize: 20,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
  },
  aiSection: {
    marginBottom: 30,
  },
  aiHeader: {
    marginBottom: 16,
    borderRadius: 25,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  aiHeaderGradient: {
    borderRadius: 25,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  aiSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  inputContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 25,
    padding: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    minHeight: 100,
    textAlignVertical: 'top',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  generateButton: {
    borderRadius: 25,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  generateButtonGradient: {
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  categoriesSection: {
    marginBottom: 30,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    borderRadius: 25,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  selectedCategory: {
    transform: [{ scale: 0.95 }],
    opacity: 0.8,
  },
  categoryIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  categoryDescription: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
    opacity: 0.95,
    lineHeight: 18,
  },
  difficultyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  difficultyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  difficultyText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  gamesSection: {
    marginBottom: 30,
  },
  gamesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statsSection: {
    marginBottom: 30,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statCard: {
    borderRadius: 20,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  statGradient: {
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    minWidth: 90,
  },
  statEmoji: {
    fontSize: 28,
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 22,
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
    fontWeight: '600',
    textAlign: 'center',
  },
  motivationSection: {
    marginBottom: 20,
  },
  motivationCard: {
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  motivationEmoji: {
    fontSize: 32,
    marginBottom: 12,
  },
  motivationText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: 22,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },

  /* estilos del modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 720,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
});
