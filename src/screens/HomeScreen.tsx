import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Animated,
  Easing,
  Vibration,
  ScrollView,
  StatusBar,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../App';
import { useDeviceDetection } from '../hooks/useDeviceDetection';
import { getResponsiveFontSize, getButtonSize } from '../utils/deviceUtils';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const deviceInfo = useDeviceDetection();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [buttonPulse] = useState(new Animated.Value(1));
  const [bestScore, setBestScore] = useState(0);
  const [bestLevel, setBestLevel] = useState(1);

  useEffect(() => {
    // Загрузка лучших результатов (заглушка)
    const savedScore = 1250; // В реальном приложении получаем из AsyncStorage
    const savedLevel = 3; // В реальном приложении получаем из AsyncStorage
    setBestScore(savedScore);
    setBestLevel(savedLevel);

    // Анимация появления
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
    ]).start();

    // Пульсация кнопки
    Animated.loop(
      Animated.sequence([
        Animated.timing(buttonPulse, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(buttonPulse, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleStartGame = () => {
    Vibration.vibrate(70);
    navigation.navigate('Game');
  };

  const handleHowToPlay = () => {
    Vibration.vibrate(30);
    Alert.alert(
      'Как играть?',
      `• ${deviceInfo.isTablet ? 'Используйте кнопки ← → или свайпайте по экрану для управления платформой' : 'Свайпайте пальцем по экрану для управления платформой'}
• Разбейте все кирпичи мячом
• Не дайте мячу упасть вниз
• У вас есть 3 жизни
• Каждый уровень становится сложнее
• Набирайте очки и ставьте рекорды!`,
      [{ text: 'Понятно', style: 'default' }]
    );
  };

  const handleSettings = () => {
    Vibration.vibrate(30);
    // Здесь можно добавить экран настроек
    Alert.alert(
      'Настройки',
      'В будущих обновлениях здесь будут настройки звука и вибрации.',
      [{ text: 'OK', style: 'default' }]
    );
  };

  const buttonSize = getButtonSize(deviceInfo);
  const pulseScale = buttonPulse.interpolate({
    inputRange: [1, 1.05],
    outputRange: [1, 1.05],
  });

  return (
    <ImageBackground
      source={require('../../assets/background.jpg')}
      style={styles.container}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" backgroundColor="#1A1A2E" />
      
      <ScrollView
        contentContainerStyle={[
          styles.scrollContainer,
          {
            paddingHorizontal: deviceInfo.isTablet ? 30 : 20,
            paddingVertical: deviceInfo.isTablet ? 40 : 30,
          }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          {/* Заголовок */}
          <View style={styles.titleContainer}>
            <Text style={[
              styles.title,
              { fontSize: getResponsiveFontSize(deviceInfo.isTablet ? 50 : 40, deviceInfo) }
            ]}>
              BRICK BREAKER
            </Text>
            <Text style={[
              styles.subtitle,
              { fontSize: getResponsiveFontSize(deviceInfo.isTablet ? 18 : 14, deviceInfo) }
            ]}>
              Классическая аркада для мобильных устройств
            </Text>
          </View>

          {/* Статистика лучших результатов */}
          <View style={[
            styles.statsContainer,
            {
              marginVertical: deviceInfo.isTablet ? 30 : 20,
            }
          ]}>
            <View style={styles.statCard}>
              <Text style={[
                styles.statNumber,
                { fontSize: getResponsiveFontSize(28, deviceInfo) }
              ]}>
                {bestScore}
              </Text>
              <Text style={[
                styles.statLabel,
                { fontSize: getResponsiveFontSize(12, deviceInfo) }
              ]}>
                ЛУЧШИЙ СЧЕТ
              </Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[
                styles.statNumber,
                { fontSize: getResponsiveFontSize(28, deviceInfo) }
              ]}>
                {bestLevel}
              </Text>
              <Text style={[
                styles.statLabel,
                { fontSize: getResponsiveFontSize(12, deviceInfo) }
              ]}>
                ЛУЧШИЙ УРОВЕНЬ
              </Text>
            </View>
          </View>

          {/* Кнопки действий */}
          <View style={styles.buttonsContainer}>
            <Animated.View style={{ transform: [{ scale: pulseScale }] }}>
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.startButton,
                  buttonSize
                ]}
                onPress={handleStartGame}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.buttonText,
                  { fontSize: getResponsiveFontSize(20, deviceInfo) }
                ]}>
                  НАЧАТЬ ИГРУ
                </Text>
              </TouchableOpacity>
            </Animated.View>

            <TouchableOpacity
              style={[
                styles.button,
                styles.secondaryButton,
                {
                  width: buttonSize.width * 0.8,
                  height: buttonSize.height * 0.8,
                }
              ]}
              onPress={handleHowToPlay}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.buttonText,
                { fontSize: getResponsiveFontSize(16, deviceInfo) }
              ]}>
                КАК ИГРАТЬ?
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                styles.settingsButton,
                {
                  width: buttonSize.width * 0.6,
                  height: buttonSize.height * 0.6,
                }
              ]}
              onPress={handleSettings}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.buttonText,
                { fontSize: getResponsiveFontSize(14, deviceInfo) }
              ]}>
                ⚙️
              </Text>
            </TouchableOpacity>
          </View>

          {/* Подсказка управления */}
          <View style={[
            styles.tipContainer,
            {
              marginTop: deviceInfo.isTablet ? 40 : 30,
            }
          ]}>
            <Text style={[
              styles.tipTitle,
              { fontSize: getResponsiveFontSize(16, deviceInfo) }
            ]}>
              {deviceInfo.isTablet ? 'Управление:' : 'Как играть:'}
            </Text>
            <Text style={[
              styles.tipText,
              { fontSize: getResponsiveFontSize(14, deviceInfo) }
            ]}>
              {deviceInfo.isTablet 
                ? 'Используйте кнопки ← → или свайпайте по экрану'
                : 'Свайпайте пальцем по экрану для управления'}
            </Text>
          </View>

          {/* Информация о разработчике */}
          <View style={styles.footer}>
            <Text style={[
              styles.footerText,
              { fontSize: getResponsiveFontSize(10, deviceInfo) }
            ]}>
              Версия 1.0.0
            </Text>
            <Text style={[
              styles.footerText,
              { fontSize: getResponsiveFontSize(10, deviceInfo) }
            ]}>
              Оптимизировано для {deviceInfo.isTablet ? 'планшетов' : 'телефонов'}
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A2E',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    color: '#4ECDC4',
    fontWeight: '900',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 8,
    letterSpacing: 1,
    marginBottom: 10,
  },
  subtitle: {
    color: '#FFF',
    textAlign: 'center',
    opacity: 0.8,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    gap: 20,
  },
  statCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(26, 26, 46, 0.9)',
    borderRadius: 15,
    padding: 15,
    minWidth: 100,
    borderWidth: 2,
    borderColor: 'rgba(78, 205, 196, 0.3)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statNumber: {
    color: '#FFD166',
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#FFF',
    opacity: 0.8,
    textAlign: 'center',
    marginTop: 5,
  },
  buttonsContainer: {
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
    gap: 15,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  startButton: {
    backgroundColor: '#06D6A0',
    borderWidth: 3,
    borderColor: '#FFF',
  },
  secondaryButton: {
    backgroundColor: 'rgba(17, 138, 178, 0.9)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  settingsButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  tipContainer: {
    backgroundColor: 'rgba(26, 26, 46, 0.8)',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  tipTitle: {
    color: '#4ECDC4',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  tipText: {
    color: '#FFF',
    textAlign: 'center',
    opacity: 0.8,
  },
  footer: {
    marginTop: 30,
    alignItems: 'center',
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.4)',
    textAlign: 'center',
    marginVertical: 2,
  },
});

export default HomeScreen;