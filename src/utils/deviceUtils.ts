import { Platform, Dimensions, PixelRatio } from 'react-native';
import { DeviceInfo } from '../types/gameTypes';

export const getDeviceInfo = (): DeviceInfo => {
  const { width, height } = Dimensions.get('window');
  const pixelDensity = PixelRatio.get();
  const aspectRatio = height / width;
  
  // Определение типа устройства для iOS и Android
  const isTablet = Platform.OS === 'ios' 
    ? (pixelDensity === 2 && (width >= 768 || height >= 768)) ||
      (pixelDensity === 1 && (width >= 768 || height >= 768))
    : (width >= 600 || height >= 600);
  
  const isMobile = !isTablet;
  
  return {
    isMobile,
    isTablet,
    screenWidth: width,
    screenHeight: height,
    platform: Platform.OS as 'ios' | 'android',
    aspectRatio
  };
};

export const getGameDimensions = (deviceInfo: DeviceInfo) => {
  const { screenWidth, screenHeight, isTablet } = deviceInfo;
  
  // Адаптивные размеры для разных устройств
  const ballSize = isTablet ? 24 : 20;
  const paddleHeight = isTablet ? 25 : 20;
  const paddleWidthRatio = isTablet ? 0.25 : 0.3; // На планшетах платформа шире
  const brickHeight = isTablet ? 35 : 30;
  const brickMargin = isTablet ? 3 : 2;
  
  return {
    ballSize,
    paddleHeight,
    paddleWidthRatio,
    brickHeight,
    brickMargin,
    screenWidth,
    screenHeight
  };
};

export const getResponsiveFontSize = (baseSize: number, deviceInfo: DeviceInfo): number => {
  const scale = deviceInfo.screenWidth / 320;
  const fontSize = baseSize * scale;
  
  if (deviceInfo.isTablet) {
    return fontSize * 0.9; // Немного меньше на планшетах
  }
  
  return Math.round(PixelRatio.roundToNearestPixel(fontSize));
};

export const getButtonSize = (deviceInfo: DeviceInfo) => {
  if (deviceInfo.isTablet) {
    return { width: 180, height: 55 };
  }
  return { width: 160, height: 50 };
};