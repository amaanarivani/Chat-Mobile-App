import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { PaperProvider } from 'react-native-paper';
import { AppProvider } from '@/contextApi/UseContext';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <PaperProvider>
      <AppProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(session)" options={{ headerShown: false }} />
          <Stack.Screen name="(no-session)" options={{ headerShown: false }} />
          <Stack.Screen name="(no-session)/signin" options={{ headerShown: false }} />
          <Stack.Screen name="(no-session)/signup" options={{ headerShown: false }} />
          <Stack.Screen name="(no-session)/verifyEmailCode" options={{ headerShown: false }} />
          <Stack.Screen name="(no-session)/resetPassword" options={{ headerShown: false }} />
          <Stack.Screen name="(no-session)/forgotPassword" options={{ headerShown: false }} />
          <Stack.Screen name="(session)/home" options={{ headerShown: false }} />
          <Stack.Screen name="(session)/chatSession" options={{ headerShown: false }} />
          <Stack.Screen name="(session)/chatSessionHistory" options={{ headerShown: false }} />
          <Stack.Screen name="(session)/addFriend" options={{ headerShown: false }} />
          <Stack.Screen name="(session)/myFriends" options={{ headerShown: false }} />
          <Stack.Screen name="(session)/userAccount" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </AppProvider>
    </PaperProvider>
  );
}
