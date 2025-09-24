import * as Speech from 'expo-speech';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import InteractiveBackground from '@/components/InteractiveBackground';
import AnimatedButton from '@/components/AnimatedButton';
import GameAvatar from '@/components/GameAvatar';

const { width } = Dimensions.get('window');

const PALETTE = {
  mint: '#87d4a3',
  powderBlue: '#b0e0e6',
  lightPink: '#ffb6c1',
  lightYellow: '#fae470',
  backgroundColor: '#b0e0e6' // Añadimos el color de fondo
};

interface GameItem {
  id: string;
  name: string;
  imageUrl: string;
  category: string;
  isOddOne: boolean;
}

interface GameScenario {
  id: string;
  title: string;
  instruction: string; // 👈 instrucciones por escenario
  items: GameItem[];
  difficulty: 'easy' | 'medium' | 'hard';
}

interface FindObjectsGame {
  id: string;
  title: string;
  imageUrl: string;
  targetObjects: string[];
  foundObjects: string[];
  level: number;
}

interface AnalogyOption {
  text: string;
  imageUrl: string;
}

interface AnalogyGame {
  id: string;
  question: string;
  options: AnalogyOption[]; // 👈 ahora con imágenes
  correctAnswer: number;
  level: number;
}

const oddOneOutScenarios: GameScenario[] = [
  {
    id: '1',
    title: 'Animales del Océano vs Tierra',
    instruction: 'Toca el animal que no pertenece al océano',
    difficulty: 'easy',
    items: [
      {
        id: '1',
        name: 'Delfín',
        imageUrl:
          'https://images.pexels.com/photos/64219/dolphin-marine-mammals-water-sea-64219.jpeg?auto=compress&cs=tinysrgb&w=300',
        category: 'ocean',
        isOddOne: false,
      },
      {
        id: '2',
        name: 'Ballena',
        imageUrl:
          'https://img.freepik.com/vector-gratis/lindo-personaje-dibujos-animados-ballenas_1308-119816.jpg?semt=ais_incoming&w=740&q=80',
        category: 'ocean',
        isOddOne: false,
      },
      {
        id: '3',
        name: 'León',
        imageUrl:
          'https://images.pexels.com/photos/247502/pexels-photo-247502.jpeg?auto=compress&cs=tinysrgb&w=300',
        category: 'land',
        isOddOne: true,
      },
      {
        id: '4',
        name: 'Tiburón',
        imageUrl:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrAJAkmrIEtaZ5IFXZLE5ZzvxJ1aI9IHlhTQ&s',
        category: 'ocean',
        isOddOne: false,
      },
    ],
  },
  {
    id: '2',
    title: 'Frutas vs Verduras',
    instruction: 'Toca la verdura que no es una fruta',
    difficulty: 'easy',
    items: [
      {
        id: '1',
        name: 'Manzana',
        imageUrl:
          'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=300',
        category: 'fruit',
        isOddOne: false,
      },
      {
        id: '2',
        name: 'Plátano',
        imageUrl:
          'https://images.pexels.com/photos/61127/pexels-photo-61127.jpeg?auto=compress&cs=tinysrgb&w=300',
        category: 'fruit',
        isOddOne: false,
      },
      {
        id: '3',
        name: 'Zanahoria',
        imageUrl:
          'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=300',
        category: 'vegetable',
        isOddOne: true,
      },
      {
        id: '4',
        name: 'Naranja',
        imageUrl:
          'https://images.pexels.com/photos/161559/background-bitter-breakfast-bright-161559.jpeg?auto=compress&cs=tinysrgb&w=300',
        category: 'fruit',
        isOddOne: false,
      },
    ],
  },
  {
    id: '3',
    title: 'Objetos de Cocina',
    instruction: 'Toca el objeto que no pertenece a la cocina',
    difficulty: 'easy',
    items: [
      {
        id: '1',
        name: 'Sartén',
        imageUrl: 'https://img.freepik.com/vector-gratis/huevo-flotante-frito-ilustracion-icono-vector-dibujos-animados-sarten-concepto-icono-objeto-comida-aislado-vector-premium-estilo-dibujos-animados-plana_138676-3815.jpg?semt=ais_incoming&w=740&q=80',
        category: 'kitchen',
        isOddOne: false,
      },
      {
        id: '2',
        name: 'Cuchara',
        imageUrl: 'https://img.icons8.com/color/96/spoon.png',
        category: 'kitchen',
        isOddOne: false,
      },
      {
        id: '3',
        name: 'Zapato',
        imageUrl: 'https://img.icons8.com/color/96/shoes.png',
        category: 'clothes',
        isOddOne: true,
      },
      {
        id: '4',
        name: 'Plato',
        imageUrl: 'https://img.icons8.com/color/96/plate.png',
        category: 'kitchen',
        isOddOne: false,
      },
    ],
  },
];

const findObjectsGames: FindObjectsGame[] = [
  {
    id: '1',
    title: 'Encuentra Frutas en el Mercado',
    imageUrl:
      'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg?auto=compress&cs=tinysrgb&w=600',
    targetObjects: ['Manzana', 'Plátano', 'Naranja'],
    foundObjects: [],
    level: 1,
  },
  {
    id: '2',
    title: 'Busca Juguetes en la Habitación',
    imageUrl:
      'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg?auto=compress&cs=tinysrgb&w=600',
    targetObjects: ['Pelota', 'Oso de Peluche'],
    foundObjects: [],
    level: 2,
  },
];

const analogyGames: AnalogyGame[] = [
  {
    id: '1',
    question: 'El pan se...',
    options: [
      { text: 'Vuela', imageUrl: 'https://img.icons8.com/clouds/100/airplane-take-off.png' },
      { text: 'Toma', imageUrl: 'https://i.pinimg.com/736x/d3/92/5a/d3925aaf0a0a7b1fc61796b669b02a17.jpg' },
      { text: 'Duerme', imageUrl: 'https://img.freepik.com/vector-gratis/personaje-dibujos-animados-doodle-dormir-nino-aislado_1308-63135.jpg' },
      { text: 'Come', imageUrl: 'https://static.vecteezy.com/system/resources/previews/007/152/952/non_2x/cartoon-little-school-boy-eating-bread-vector.jpg' },
    ],
    correctAnswer: 3,
    level: 1,
  },
  {
    id: '2',
    question: 'El coche se...',
    options: [
      { text: 'Maneja', imageUrl: 'https://img.icons8.com/clouds/100/car.png' },
      { text: 'Lee', imageUrl: 'https://img.freepik.com/vector-gratis/nino-sentado-suelo-leyendo-libro_1308-92292.jpg?semt=ais_hybrid&w=740&q=80' },
      { text: 'Nada', imageUrl: 'https://img.icons8.com/clouds/100/swimming.png' },
      { text: 'Baila', imageUrl: 'https://img.freepik.com/vector-gratis/pareja-nino-diferente-raza-bailando-juntos_1308-138127.jpg?semt=ais_incoming&w=740&q=80' },
    ],
    correctAnswer: 0,
    level: 1,
  },
  {
    id: '3',
    question: 'El mono se...',
    options: [
      { text: 'Cuelga', imageUrl: 'https://img.icons8.com/clouds/100/monkey.png' },
      { text: 'Nada', imageUrl: 'https://img.icons8.com/clouds/100/swimming.png' },
      { text: 'Vuela', imageUrl: 'https://img.icons8.com/clouds/100/airplane.png' },
      { text: 'Escribe', imageUrl: 'https://img.icons8.com/clouds/100/writing.png' },
    ],
    correctAnswer: 0,
    level: 2,
  },
];

type GameMode = 'menu' | 'odd-one-out' | 'find-objects' | 'analogies';

export default function GamesScreen() {
  const [gameMode, setGameMode] = useState<GameMode>('menu');
  const [currentScenario, setCurrentScenario] = useState<GameScenario>(oddOneOutScenarios[0]);
  const [currentFindGame, setCurrentFindGame] = useState<FindObjectsGame>(findObjectsGames[0]);
  const [currentAnalogy, setCurrentAnalogy] = useState<AnalogyGame>(analogyGames[0]);

  // progreso real
  const [totalScore, setTotalScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalAnswers, setTotalAnswers] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [showNextButton, setShowNextButton] = useState(false);
  const [avatarEmotion, setAvatarEmotion] = useState<'happy' | 'excited' | 'thinking' | 'celebrating'>('happy');

  const userAvatar = {
    body: '🐠',
    eyes: '😊',
    mouth: '😀',
    accessory: '👑',
    color: '#FF6B9D',
  };

  const handleOddOneOutPress = (item: GameItem) => {
    if (selectedItem) return;

    setSelectedItem(item.id);
    setAvatarEmotion('thinking');

    setTimeout(() => {
      if (item.isOddOne) {
        const points = 10;
        setTotalScore((prev) => prev + points);
        setCorrectAnswers((prev) => prev + 1);
        setTotalAnswers((prev) => prev + 1);
        setCurrentStreak((prev) => {
          const next = prev + 1;
          if (next > bestStreak) setBestStreak(next);
          return next;
        });

        setShowNextButton(true);
        setAvatarEmotion('celebrating');
        Alert.alert(
          '¡Excelente! 🎉',
          `¡Encontraste el diferente! ${item.name} no pertenece.`,
          [{ text: '¡Genial!' }]
        );
      } else {
        setAvatarEmotion('thinking');
        setTotalAnswers((prev) => prev + 1);
        setCurrentStreak(0);

        Alert.alert(
          '¡Inténtalo de nuevo! 🤔',
          `${item.name} sí pertenece al grupo.`,
          [
            {
              text: 'OK',
              onPress: () => {
                setSelectedItem(null);
                setAvatarEmotion('happy');
              },
            },
          ]
        );
      }
    }, 600);
  };

  const handleAnalogyAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answerIndex);
    setAvatarEmotion('thinking');

    setTimeout(() => {
      if (answerIndex === currentAnalogy.correctAnswer) {
        const points = 15;
        setTotalScore((prev) => prev + points);
        setCorrectAnswers((prev) => prev + 1);
        setTotalAnswers((prev) => prev + 1);
        setCurrentStreak((prev) => {
          const next = prev + 1;
          if (next > bestStreak) setBestStreak(next);
          return next;
        });

        setShowNextButton(true);
        setAvatarEmotion('celebrating');
        Alert.alert('¡Correcto! 🌟', '¡Excelente razonamiento!', [{ text: '¡Siguiente!' }]);
      } else {
        setAvatarEmotion('thinking');
        setTotalAnswers((prev) => prev + 1);
        setCurrentStreak(0);

        Alert.alert('¡No es correcto! 🤔', 'Piensa de nuevo.', [
          {
            text: 'Intentar otra vez',
            onPress: () => {
              setSelectedAnswer(null);
              setAvatarEmotion('happy');
            },
          },
        ]);
      }
    }, 600);
  };

  const handleNextLevel = () => {
    // ✅ usar actualizaciones funcionales evita cierres obsoletos y asegura que el botón responda
    setShowNextButton(false);
    setSelectedItem(null);
    setSelectedAnswer(null);
    setAvatarEmotion('excited');

    if (gameMode === 'odd-one-out') {
      const nextScenarioIndex =
        (oddOneOutScenarios.findIndex((s) => s.id === currentScenario.id) + 1) %
        oddOneOutScenarios.length;
      setCurrentScenario(oddOneOutScenarios[nextScenarioIndex]);
    } else if (gameMode === 'analogies') {
      const nextAnalogyIndex =
        (analogyGames.findIndex((a) => a.id === currentAnalogy.id) + 1) % analogyGames.length;
      setCurrentAnalogy(analogyGames[nextAnalogyIndex]);
    } else if (gameMode === 'find-objects') {
      const nextGameIndex =
        (findObjectsGames.findIndex((g) => g.id === currentFindGame.id) + 1) %
        findObjectsGames.length;
      setCurrentFindGame(findObjectsGames[nextGameIndex]);
    }

    setCurrentLevel((prev) => prev + 1);

    setTimeout(() => setAvatarEmotion('happy'), 1200);
  };

  const getItemStyle = (item: GameItem) => {
    if (!selectedItem) return styles.gameItem;

    if (selectedItem === item.id) {
      if (item.isOddOne) {
        return [styles.gameItem, styles.correctItem];
      } else {
        return [styles.gameItem, styles.incorrectItem];
      }
    }
    return [styles.gameItem, styles.fadedItem];
  };

  const getAnswerStyle = (index: number) => {
    if (selectedAnswer === null) return styles.answerOption;

    if (selectedAnswer === index) {
      if (index === currentAnalogy.correctAnswer) {
        return [styles.answerOption, styles.correctAnswer];
      } else {
        return [styles.answerOption, styles.incorrectAnswer];
      }
    }
    return [styles.answerOption, styles.fadedAnswer];
  };

  const renderGameMenu = () => (
    <View style={styles.menuContainer}>
      <Text style={styles.menuTitle}>Elige tu Juego Favorito</Text>

      <AnimatedButton onPress={() => setGameMode('odd-one-out')} style={{ ...styles.gameMenuCard, backgroundColor: PALETTE.mint }}>
        <View style={styles.gameMenuContent}>
          <Text style={styles.gameMenuEmoji}>🔍</Text>
          <Text style={styles.gameMenuTitle}>Encuentra el Diferente</Text>
          <Text style={styles.gameMenuDescription}>Busca lo que no pertenece</Text>
        </View>
      </AnimatedButton>

      <AnimatedButton onPress={() => setGameMode('find-objects')} style={Object.assign({}, styles.gameMenuCard, { backgroundColor: PALETTE.lightYellow })}>
        <View style={styles.gameMenuContent}>
          <Text style={styles.gameMenuEmoji}>🖼️</Text>
          <Text style={styles.gameMenuTitle}>Busca Objetos</Text>
          <Text style={styles.gameMenuDescription}>Encuentra cosas en las fotos</Text>
        </View>
      </AnimatedButton>

      <AnimatedButton onPress={() => setGameMode('analogies')} style={Object.assign({}, styles.gameMenuCard, { backgroundColor: PALETTE.lightPink })}>
        <View style={styles.gameMenuContent}>
          <Text style={styles.gameMenuEmoji}>🧠</Text>
          <Text style={styles.gameMenuTitle}>Completa la Frase</Text>
          <Text style={styles.gameMenuDescription}>Termina las oraciones con imágenes</Text>
        </View>
      </AnimatedButton>
    </View>
  );

  const renderOddOneOut = () => (
    <View style={styles.gameContainer}>
      <View style={styles.gameHeader}>
        <AnimatedButton onPress={() => setGameMode('menu')} style={styles.backButton}>
          <ArrowLeft size={24} color="#000000" />
        </AnimatedButton>
        <Text style={styles.gameTitle}>{currentScenario.title}</Text>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreEmoji}>⭐</Text>
          <Text style={styles.scoreText}>{totalScore}</Text>
        </View>
      </View>

      <View style={styles.levelIndicator}>
        <Text style={styles.levelText}>Nivel {currentLevel}</Text>
      </View>

      <Text style={styles.instruction}>{currentScenario.instruction}</Text>

      <View style={styles.gameGrid}>
        {currentScenario.items.map((item) => (
          <AnimatedButton
            key={item.id}
            onPress={() => handleOddOneOutPress(item)}
            disabled={selectedItem !== null}
            style={getItemStyle(item)}
          >
            <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
            <Text style={styles.itemName}>{item.name}</Text>
          </AnimatedButton>
        ))}
      </View>
      <View style={{ alignItems: 'center', marginVertical: 16 }}>
        <AnimatedButton
          onPress={() => handleSpeakInstruction(currentScenario.instruction)}
          style={{
            backgroundColor: '#ff4da6', // rosa llamativo
            paddingVertical: 12,
            paddingHorizontal: 24,
            borderRadius: 30,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 6,
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
            Escuchar instrucción
          </Text>
        </AnimatedButton>
      </View>

      {showNextButton && (
        <AnimatedButton onPress={handleNextLevel} style={styles.nextButton}>
          <LinearGradient colors={['#4CAF50', '#45A049']} style={styles.nextButtonGradient}>
            <Text style={styles.nextButtonText}>¡Siguiente Nivel!</Text>
          </LinearGradient>
        </AnimatedButton>
      )}
    </View>
  );

  const renderFindObjects = () => (
    <View style={styles.gameContainer}>
      <View style={styles.gameHeader}>
        <AnimatedButton onPress={() => setGameMode('menu')} style={styles.backButton}>
          <ArrowLeft size={24} color="#000000" />
        </AnimatedButton>
        <Text style={styles.gameTitle}>{currentFindGame.title}</Text>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreEmoji}>⭐</Text>
          <Text style={styles.scoreText}>{totalScore}</Text>
        </View>
      </View>

      <View style={styles.levelIndicator}>
        <Text style={styles.levelText}>Nivel {currentLevel}</Text>
      </View>

      <Text style={styles.instruction}>¡Encuentra y toca los objetos indicados!</Text>

      <View style={styles.findGameContainer}>
        <TouchableOpacity style={styles.findImageContainer} activeOpacity={0.9}>
          <Image source={{ uri: currentFindGame.imageUrl }} style={styles.findImage} />
        </TouchableOpacity>

        <View style={styles.targetList}>
          <Text style={styles.targetTitle}>Busca estos objetos:</Text>
          {currentFindGame.targetObjects.map((obj, index) => (
            <View key={index} style={styles.targetItemContainer}>
              <Text style={styles.targetItemEmoji}>🎯</Text>
              <Text style={styles.targetItem}>{obj}</Text>
            </View>
          ))}
        </View>

        <View style={{ alignItems: 'center', marginVertical: 16 }}>
        <AnimatedButton
          onPress={() => handleSpeakInstruction(currentFindGame.title)}
          style={{
            backgroundColor: '#ff4da6', // rosa llamativo
            paddingVertical: 12,
            paddingHorizontal: 24,
            borderRadius: 30,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 6,
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
            Escuchar instrucción
          </Text>
        </AnimatedButton>
      </View>

        <AnimatedButton onPress={handleNextLevel} style={styles.nextButton}>
          <LinearGradient colors={['#4CAF50', '#45A049']} style={styles.nextButtonGradient}>
            <Text style={styles.nextButtonText}>¡Siguiente Imagen!</Text>
          </LinearGradient>
        </AnimatedButton>
      </View>
    </View>
  );

  const renderAnalogies = () => (
    <View style={styles.gameContainer}>
      <View style={styles.gameHeader}>
        <AnimatedButton onPress={() => setGameMode('menu')} style={styles.backButton}>
          <ArrowLeft size={24} color="#000000" />
        </AnimatedButton>
        <Text style={styles.gameTitle}>Completa la Frase</Text>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreEmoji}>⭐</Text>
          <Text style={styles.scoreText}>{totalScore}</Text>
        </View>
      </View>

      <View style={styles.levelIndicator}>
        <Text style={styles.levelText}>Nivel {currentLevel}</Text>
      </View>

      <View style={styles.progressDisplay}>
        <Text style={styles.progressText}>
          🎯 Aciertos: {correctAnswers}/{totalAnswers} ({totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0}
          %)
        </Text>
        <Text style={styles.progressText}>🔥 Racha actual: {currentStreak}</Text>
        <Text style={styles.progressText}>🏆 Mejor racha: {bestStreak}</Text>
      </View>

      <View style={styles.analogyContainer}>
        <View style={styles.questionContainer}>
          <Text style={styles.analogyQuestion}>{currentAnalogy.question}</Text>
        </View>

        <View style={styles.answersContainer}>
          {currentAnalogy.options.map((option, index) => (
            <AnimatedButton
              key={index}
              onPress={() => handleAnalogyAnswer(index)}
              disabled={selectedAnswer !== null}
              style={getAnswerStyle(index)}
            >
              <Image source={{ uri: option.imageUrl }} style={styles.answerImage} />
              <Text style={styles.answerText}>{option.text}</Text>
            </AnimatedButton>
          ))}
        </View>

        <View style={{ alignItems: 'center', marginVertical: 16 }}>
        <AnimatedButton
          onPress={() => handleSpeakInstruction(currentAnalogy.question)}
          style={{
            backgroundColor: '#ff4da6', // rosa llamativo
            paddingVertical: 12,
            paddingHorizontal: 24,
            borderRadius: 30,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 6,
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
            Escuchar instrucción
          </Text>
        </AnimatedButton>
      </View>

        {showNextButton && (
          <AnimatedButton onPress={handleNextLevel} style={styles.nextButton}>
            <LinearGradient colors={['#4CAF50', '#45A049']} style={styles.nextButtonGradient}>
              <Text style={styles.nextButtonText}>¡Siguiente Pregunta!</Text>
            </LinearGradient>
          </AnimatedButton>
        )}
      </View>

    </View>
  );

  const handleSpeakInstruction = (instruction: string) => {
  Speech.speak(instruction, { language: 'es-ES' }); // ajusta idioma si lo deseas
  };

  return (
    <View style={styles.container}>
      <View style={styles.gradient}>
        <InteractiveBackground />
        <GameAvatar avatar={userAvatar} emotion={avatarEmotion} size={70} position="top-right" />
        <SafeAreaView style={styles.safeArea}>
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {gameMode === 'menu' && renderGameMenu()}
            {gameMode === 'odd-one-out' && renderOddOneOut()}
            {gameMode === 'find-objects' && renderFindObjects()}
            {gameMode === 'analogies' && renderAnalogies()}
          </ScrollView>
        </SafeAreaView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  gradient: { 
    flex: 1,
    backgroundColor: '#b0e0e6' // Cambiamos el fondo a powder blue
  },
  safeArea: { 
    flex: 1 
  },
  scrollContent: { 
    flexGrow: 1, 
    padding: 20 
  },
  menuContainer: { 
    flex: 1, 
    justifyContent: 'center',
    gap: 20
  },
  menuTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 40,
  },
  gameMenuCard: {
    borderRadius: 25,
    marginBottom: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    width: '100%',
    minHeight: 150,
    alignSelf: 'center',
    maxWidth: 500,
  },
  gameMenuContent: {
    padding: 24,
    alignItems: 'center',
  },
  gameMenuEmoji: { 
    fontSize: 40, 
    marginBottom: 12 
  },
  gameMenuTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  gameMenuDescription: { 
    fontSize: 16, 
    color: '#555555', 
    textAlign: 'center' 
  },
  
  gameContainer: { flex: 1 },
  gameHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    backgroundColor: PALETTE.lightYellow, // Cambiado de mint a lightYellow
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    flex: 1,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  scoreEmoji: { fontSize: 18, marginRight: 4 },
  scoreText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  levelIndicator: { alignItems: 'center', marginBottom: 20 },
  levelText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  progressDisplay: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  progressText: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '600',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  instruction: {
    fontSize: 18,
    color: '#000000',
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: '600',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: 16,
    borderRadius: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  gameGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  gameItem: {
    width: (width - 60) / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 25,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  correctItem: { 
    backgroundColor: PALETTE.mint
  },
  incorrectItem: { 
    backgroundColor: PALETTE.lightPink
  },
  fadedItem: { opacity: 0.5 },
  itemImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 12,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  itemName: { fontSize: 16, fontWeight: '600', color: '#333', textAlign: 'center' },

  findGameContainer: { alignItems: 'center' },
  findImageContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    marginBottom: 20,
  },
  findImage: { width: width - 40, height: 220 },
  targetList: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    marginBottom: 20,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  targetTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 12, textAlign: 'center' },
  targetItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    padding: 12,
    borderRadius: 15,
  },
  targetItemEmoji: { fontSize: 18, marginRight: 10 },
  targetItem: { fontSize: 16, color: '#333', fontWeight: '600' },

  analogyContainer: { alignItems: 'center' },
  questionContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
    width: '100%',
  },
  analogyQuestion: {
    fontSize: 22,
    color: '#000000',
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: 30,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  answersContainer: { width: '100%', marginBottom: 20 },
  answerOption: {
    backgroundColor: '#fae470', // Cambiado a amarillo
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  correctAnswer: { 
    backgroundColor: PALETTE.mint 
  },
  incorrectAnswer: { 
    backgroundColor: PALETTE.lightPink 
  },
  fadedAnswer: {
    opacity: 0.5,
  },
  nextButton: {
    borderRadius: 25,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    marginTop: 20,
    backgroundColor: PALETTE.mint,
  },
  nextButtonGradient: { borderRadius: 25, paddingHorizontal: 30, paddingVertical: 16 },
  nextButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    padding: 16,
  },
});