import {
  Inter_400Regular,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { cssInterop } from "nativewind";
import Feather from "@expo/vector-icons/Feather";
import Entypo from "@expo/vector-icons/Entypo";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import "react-native-reanimated";

import "../global.css";
import { StatusBar } from "expo-status-bar";
import { UserProvider } from "../src/contexts/UserContext";
import { ChatProvider } from "../src/contexts/ChatContext";
import { SafeAreaProvider } from "react-native-safe-area-context";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // TODO: Change to Auth first
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "main",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Enable icon to be coloured with nativewind
cssInterop(Feather, {
  className: {
    target: "style",
    nativeStyleToProp: { height: true, width: true, size: true },
  },
});
cssInterop(Entypo, {
  className: {
    target: "style",
    nativeStyleToProp: { height: true, width: true, size: true },
  },
});

export default function RootLayout() {
  const [loaded, error] = useFonts({ Inter_400Regular, Inter_700Bold });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <UserProvider>
        <ChatProvider>
          <RootLayoutNavigation />
        </ChatProvider>
      </UserProvider>
    </SafeAreaProvider>
  );
}

function RootLayoutNavigation() {
  return (
    <GestureHandlerRootView className="flex-1">
      <BottomSheetModalProvider>
        <Stack initialRouteName="main" screenOptions={{ headerShown: false }}>
          {/* // TODO: Change to Auth first */}
          <Stack.Screen name="auth" options={{ headerShown: false }} />
          <Stack.Screen name="main" options={{ headerShown: false }} />
          <Stack.Screen name="friends" options={{ headerShown: false }} />
        </Stack>
      </BottomSheetModalProvider>
      <StatusBar style="auto" />
    </GestureHandlerRootView>
  );
}
