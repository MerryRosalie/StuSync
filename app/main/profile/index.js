import { Text } from "react-native";
import ModeSwitch from "../../../components/ModeSwitch";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";

export default function Page() {
  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-background dark:bg-dark-background">
      <Text className="font-inter-bold text-xl text-purple-default dark:text-dark-purple-default">
        Profile Page
      </Text>
      <Link
        className="text-text-default dark:text-dark-text-default"
        href="/friends"
      >
        Go to Friends
      </Link>
      <ModeSwitch />
    </SafeAreaView>
  );
}
