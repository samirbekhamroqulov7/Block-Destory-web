import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import HomeScreen from './src/screens/HomeScreen';
import GameScreen from './src/screens/GameScreen';
import { Platform } from 'react-native';

export type RootStackParamList = {
  Home: undefined;
  Game: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#1A1A2E',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: Platform.OS === 'ios' ? 20 : 18,
            },
            headerShown: false,
            cardStyle: { backgroundColor: '#1A1A2E' },
            gestureEnabled: true,
            animation: Platform.OS === 'ios' ? 'default' : 'slide_from_right',
          }}
        >
          <Stack.Screen 
            name="Home" 
            component={HomeScreen}
            options={{ 
              title: 'Brick Breaker',
              headerShown: false,
            }}
          />
          <Stack.Screen 
            name="Game" 
            component={GameScreen}
            options={{ 
              title: 'Игра',
              headerShown: false,
              gestureEnabled: false, // Отключаем жесты назад во время игры
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}