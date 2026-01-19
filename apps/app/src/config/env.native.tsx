/**
 * Native environment configuration.
 *
 * For iOS Simulator: Use localhost directly
 * For Android Emulator: Use 10.0.2.2 (Android's host loopback)
 * For physical devices: Use the local network IP of the dev machine
 *   - Find your IP: `ifconfig | grep "inet " | grep -v 127.0.0.1`
 *   - For Android: `adb reverse tcp:3001 tcp:3001`
 */

import { Platform } from 'react-native';

// Replace with your dev machine's local IP for physical device testing
const DEV_MACHINE_IP = '192.168.1.100';

function getApiUrl(): string {
  // iOS Simulator can use localhost directly
  if (Platform.OS === 'ios' && __DEV__) {
    return 'http://localhost:3001';
  }
  // Android Emulator uses 10.0.2.2 for host loopback
  if (Platform.OS === 'android' && __DEV__) {
    return 'http://10.0.2.2:3001';
  }
  // Physical devices need the actual IP
  return `http://${DEV_MACHINE_IP}:3001`;
}

export const env = {
  apiUrl: getApiUrl(),
} as const;

export function validateEnv(): void {
  console.info('[env] Native configuration loaded:', {
    apiUrl: env.apiUrl,
  });
}
