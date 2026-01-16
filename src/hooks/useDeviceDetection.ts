import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';
import { DeviceInfo } from '../types/gameTypes';
import { getDeviceInfo } from '../utils/deviceUtils';

export const useDeviceDetection = (): DeviceInfo => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(getDeviceInfo());

  useEffect(() => {
    const updateDeviceInfo = () => {
      setDeviceInfo(getDeviceInfo());
    };

    const subscription = Dimensions.addEventListener('change', updateDeviceInfo);
    
    return () => {
      subscription.remove();
    };
  }, []);

  return deviceInfo;
};