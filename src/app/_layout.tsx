import { Archivo_700Bold, Archivo_800ExtraBold } from '@expo-google-fonts/archivo';
import { BodoniModa_500Medium, BodoniModa_500Medium_Italic, BodoniModa_600SemiBold } from '@expo-google-fonts/bodoni-moda';
import { Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold } from '@expo-google-fonts/manrope';
import { useFonts } from 'expo-font';
import { DarkTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { ContentProvider } from '@/content/ContentProvider';
import { RequestProvider } from '@/features/request/RequestProvider';
import { color } from '@/theme/tokens';

SplashScreen.preventAutoHideAsync();

const theme = {
  ...DarkTheme,
  colors: { ...DarkTheme.colors, background: color.bg, card: color.bg, primary: color.gold, text: color.text, border: color.line },
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    BodoniModa_500Medium,
    BodoniModa_500Medium_Italic,
    BodoniModa_600SemiBold,
    Archivo_700Bold,
    Archivo_800ExtraBold,
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
  });

  // A font failure falls back to system fonts rather than holding the splash forever.
  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync();
  }, [loaded, error]);

  if (!loaded && !error) return null;

  return (
    <ThemeProvider value={theme}>
      <ContentProvider>
        <RequestProvider>
          <StatusBar style="light" />
          <Stack screenOptions={{ contentStyle: { backgroundColor: color.bg }, headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen
              name="service/[id]"
              options={{ headerShown: true, headerTransparent: true, headerTitle: '', headerTintColor: color.gold, headerBackButtonDisplayMode: 'minimal' }}
            />
            <Stack.Screen name="request-result" options={{ presentation: 'modal', gestureEnabled: false }} />
          </Stack>
        </RequestProvider>
      </ContentProvider>
    </ThemeProvider>
  );
}
