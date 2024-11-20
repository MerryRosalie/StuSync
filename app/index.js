import { Redirect } from "expo-router";
import { UserProvider } from "../src/contexts/UserContext";
import { useUser } from "../src/contexts/UserContext";

export default function Page() {
  const { clearStorage } = useUser();

  // Clears the storage and chats a helper function for development
  const handleClearStorage = async () => {
    try {
      await clearStorage();
      console.log("Storage cleared successfully");
    } catch (error) {
      console.error("Error clearing storage:", error);
    }
  };

  //   handleClearStorage();

  // TODO: Change to Auth first
  return (
    <UserProvider>
      <Redirect href="/auth/register" />
    </UserProvider>
  );
}
