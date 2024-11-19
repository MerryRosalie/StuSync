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
    <View className="w-full flex-row border border-gray rounded-2xl items-center justify-between px-4 py-2">
      <Text className="text-base font-semibold justify-between">Theme</Text>
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
          <Feather name="sun" size={20} color="inherit" />
          <Text className="text-sm font-semibold">Light</Text>
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
