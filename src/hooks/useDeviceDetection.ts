import { useState, useEffect } from 'react';
import { DeviceInfo } from '../types/gameTypes';

export const useDeviceDetection = (): DeviceInfo => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: true,
    isTablet: false,
    screenWidth: 800,
    screenHeight: 600,
    platform: typeof window !== 'undefined' && /iPhone|iPad|iPod/.test(navigator.userAgent) ? 'ios' : 'android',
    aspectRatio: 1.5,
  });

  useEffect(() => {
    const updateDeviceInfo = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isTablet = width >= 768;
      
      setDeviceInfo({
        isMobile: !isTablet,
        isTablet,
        screenWidth: width,
        screenHeight: height,
        platform: /iPhone|iPad|iPod/.test(navigator.userAgent) ? 'ios' : 'android',
        aspectRatio: height / width,
      });
    };

    updateDeviceInfo();
    window.addEventListener('resize', updateDeviceInfo);
    
    return () => window.removeEventListener('resize', updateDeviceInfo);
  }, []);

  return deviceInfo;
};