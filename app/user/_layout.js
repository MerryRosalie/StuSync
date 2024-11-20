import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="[uid]" options={{ headerShown: false }} />
    </Stack>
  );
}
