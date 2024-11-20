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

export default function Button({ text, handleOnPress }) {
  return (
    <TouchableOpacity
      className="rounded-xl p-6 bg-purple-default w-full items-center"
      onPress={handleOnPress}
    >
      <Text className="text-base font-bold text-white">{text}</Text>
    </TouchableOpacity>
  );
}
