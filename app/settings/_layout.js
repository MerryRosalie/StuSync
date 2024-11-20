import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="account" options={{ headerShown: false }} />
      <Stack.Screen name="changePassword" options={{ headerShown: false }} />
      <Stack.Screen name="updateEmail" options={{ headerShown: false }} />
      <Stack.Screen name="editProfile" options={{ headerShown: false }} />
    </Stack>
  );
}
