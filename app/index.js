import { Redirect } from "expo-router";
import { UserProvider } from "../src/contexts/UserContext";

export default function Page() {
  const { clearStorage } = useUser();
  const { clearChats } = useChats();

  // Clears the storage and chats a helper function for development
  const handleClearStorage = async () => {
    try {
      await clearStorage();
      await clearChats();
      console.log("Storage cleared successfully");
    } catch (error) {
      console.error("Error clearing storage:", error);
    }
  };

  return (
    <UserProvider>
      <Redirect href="/auth/login" />
    </UserProvider>
  );
}
