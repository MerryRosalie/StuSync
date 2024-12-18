import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ gestureEnabled: false }}>
      <Stack.Screen
        name="login"
        options={{
          title: "Login",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          title: "Register",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
