// Per-weight subpath imports: the package index would bundle every weight (~20 MB of fonts).
import { Archivo_700Bold } from '@expo-google-fonts/archivo/700Bold';
import { Archivo_800ExtraBold } from '@expo-google-fonts/archivo/800ExtraBold';
import { BodoniModa_500Medium } from '@expo-google-fonts/bodoni-moda/500Medium';
import { BodoniModa_500Medium_Italic } from '@expo-google-fonts/bodoni-moda/500Medium_Italic';
import { BodoniModa_600SemiBold } from '@expo-google-fonts/bodoni-moda/600SemiBold';
import { Manrope_400Regular } from '@expo-google-fonts/manrope/400Regular';
import { Manrope_500Medium } from '@expo-google-fonts/manrope/500Medium';
import { Manrope_600SemiBold } from '@expo-google-fonts/manrope/600SemiBold';
import { useFonts } from 'expo-font';
import { DarkTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform } from 'react-native';

import { ContentProvider } from '@/content/ContentProvider';
import { RequestProvider } from '@/features/request/RequestProvider';
import { color } from '@/theme/tokens';
import V22App from '@/v22native/V22App';
import { v22Fonts } from '@/v22native/fonts';

SplashScreen.preventAutoHideAsync();

const theme = {
  ...DarkTheme,
  colors: { ...DarkTheme.colors, background: color.bg, card: color.bg, primary: color.gold, text: color.text, border: color.line },
};

export default function RootLayout() {
  // iOS/Android run Damian's v22 design, rebuilt natively (src/v22native); the web build keeps the earlier screens.
  // EXPO_PUBLIC_V22_PREVIEW=1 renders the v22 screens in the web preview too, for side-by-side QA.
  if (Platform.OS !== 'web' || process.env.EXPO_PUBLIC_V22_PREVIEW === '1') return <NativeV22Root />;
  return <ExpoScreensRoot />;
}

function NativeV22Root() {
  const [loaded, error] = useFonts(v22Fonts);
  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync();
  }, [loaded, error]);
  if (!loaded && !error) return null;
  return (
    <>
      <StatusBar style="light" />
      <V22App />
    </>
  );
}

function ExpoScreensRoot() {
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
