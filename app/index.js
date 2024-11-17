import { Redirect } from "expo-router";
import { UserProvider } from "../src/contexts/UserContext";

export default function Page() {
  // TODO: Change to Auth first
  return (
    <UserProvider>
      <Redirect href="/main/home" />
    </UserProvider>
  );
}
