import { Tabs } from 'expo-router';
import { Chrome as Home, Settings, Trophy, Gamepad2, User } from 'lucide-react-native';

const PALETTE = {
  mint: '#87d4a3',
  powderBlue: '#b0e0e6',
  lightPink: '#ffb6c1',
  lightYellow: '#fae470',
  crema: '#e1e3e1'
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#427de1', // Azul para el activo
        tabBarInactiveTintColor: PALETTE.mint, // Mint para el inactivo
        tabBarStyle: {
          backgroundColor: PALETTE.crema, // Fondo azul polvo
          borderTopWidth: 0,
          elevation: 15, // Aumentada la elevación
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.2,
          shadowRadius: 15,
          height: 95, // Altura ligeramente aumentada
          paddingBottom: 25,
          paddingTop: 15,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
        },
        tabBarLabelStyle: {
          fontSize: 16, // Texto más grande
          fontWeight: '800', // Texto más bold
          marginTop: 8, // Más espacio arriba del texto
          textShadowColor: 'rgba(0, 0, 0, 0.1)',
          textShadowOffset: { width: 0, height: 1 },
          textShadowRadius: 2,
        },
        tabBarIconStyle: {
          marginTop: 8, // Más espacio arriba de los iconos
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => (
            <Home size={32} color={color} strokeWidth={3} /> // Iconos más grandes y más gruesos
          ),
        }}
      />
      <Tabs.Screen
        name="games"
        options={{
          title: 'Juegos',
          tabBarIcon: ({ color }) => (
            <Gamepad2 size={32} color={color} strokeWidth={3} />
          ),
        }}
      />
      <Tabs.Screen
        name="avatar"
        options={{
          title: 'Avatar',
          tabBarIcon: ({ color }) => (
            <User size={32} color={color} strokeWidth={3} />
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progreso',
          tabBarIcon: ({ color }) => (
            <Trophy size={32} color={color} strokeWidth={3} />
          ),
        }}
      />
    </Tabs>
  );
}