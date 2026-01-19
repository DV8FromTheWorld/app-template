/**
 * Native router implementation using @react-navigation.
 */

import '@/modules/store/stores'; // Register all store initializers

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { HomeScreen } from '@/modules/home/native/HomeScreen';
import { useStoreInit } from '@/modules/store/useStoreInit';

/**
 * Type-safe route params for navigation.
 */
export type RootStackParamList = {
  Home: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function Router(): JSX.Element {
  // Initialize all registered stores on app start
  useStoreInit();

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
