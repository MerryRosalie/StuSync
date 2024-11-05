import { Text } from "react-native";
import ModeSwitch from "../../components/ModeSwitch";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page() {
  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-background dark:bg-dark-background">
      <Text className="font-inter-bold text-xl text-purple-default dark:text-dark-purple-default">
        Login Page
      </Text>
      <ModeSwitch />
    </SafeAreaView>
  );
}
