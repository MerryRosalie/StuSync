import { Redirect } from "expo-router";

export default function Page() {
  // TODO: Change to Auth first
  return (
    <UserProvider>
      <Redirect href="/main/home" />
    </UserProvider>
  );
}
