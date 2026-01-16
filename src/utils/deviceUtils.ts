import { DeviceInfo } from '../types/gameTypes';

export const getDeviceInfo = (): DeviceInfo => {
  if (typeof window === 'undefined') {
    return {
      isMobile: true,
      isTablet: false,
      screenWidth: 800,
      screenHeight: 600,
      platform: 'android',
      aspectRatio: 1.5,
    };
  }

  const width = window.innerWidth;
  const height = window.innerHeight;
  const isTablet = width >= 768;
  
  return {
    isMobile: !isTablet,
    isTablet,
    screenWidth: width,
    screenHeight: height,
    platform: /iPhone|iPad|iPod/.test(navigator.userAgent) ? 'ios' : 'android',
    aspectRatio: height / width,
  };
};

export const getGameDimensions = (deviceInfo: DeviceInfo) => {
  const { screenWidth, screenHeight, isTablet } = deviceInfo;

  return {
    ballSize: isTablet ? 24 : 20,
    paddleHeight: isTablet ? 25 : 20,
    paddleWidthRatio: isTablet ? 0.25 : 0.3,
    brickHeight: isTablet ? 35 : 30,
    brickMargin: isTablet ? 3 : 2,
    screenWidth,
    screenHeight,
  };
};

export const getResponsiveFontSize = (baseSize: number, deviceInfo: DeviceInfo): number => {
  const scale = deviceInfo.screenWidth / 320;
  const fontSize = baseSize * scale;

  if (deviceInfo.isTablet) {
    return fontSize * 0.9;
  }

  return Math.round(fontSize);
};

export const getButtonSize = (deviceInfo: DeviceInfo) => {
  if (deviceInfo.isTablet) {
    return { width: 180, height: 55 };
  }
  return { width: 160, height: 50 };
};