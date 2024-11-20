import { useColorScheme } from "nativewind";
import {
  Text,
  TouchableOpacity,
  ScrollView,
  View,
  TextInput,
  Switch,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";

export default function ModeSwitch() {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  return (
    <View className="flex-row justify-between w-full rounded-2xl border bg-text-dimmed/25 dark:bg-dark-text-dimmed/25 border-text-dimmed/40 dark:border-dark-text-dimmed/40 py-2 px-4 items-center">
      <Text className="text-base font-semibold justify-between dark:text-white">
        Theme
      </Text>
      {/* <Switch value={colorScheme === "dark"} onChange={toggleColorScheme} /> */}
      <View className="flex-row">
        {/* fix the font colours later */}
        <TouchableOpacity
          className={`${
            colorScheme === "light"
              ? "bg-purple-secondary text-purple-default"
              : "text-gray"
          } flex-row gap-2 p-4 rounded-2xl`}
          onPress={toggleColorScheme}
        >
          <Feather name="sun" size={20} className="dark:text-white" />
          <Text className="text-sm font-semibold dark:text-white">Light</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`${
            colorScheme === "dark"
              ? "bg-purple-secondary text-purple-default"
              : "text-gray"
          } flex-row gap-2 p-4 rounded-2xl`}
          onPress={toggleColorScheme}
        >
          <Feather name="moon" size={20} color="inherit" />
          <Text className="text-sm font-semibold ">Dark</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
