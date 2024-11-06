import { Stack } from "expo-router";
import TabBar from "../../components/TabBar";

export default function RootLayout() {
  return (
    <Stack>
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
