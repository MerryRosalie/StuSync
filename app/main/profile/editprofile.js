import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TouchableOpacity, ScrollView, View } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";

export default function EditProfilecreen() {
  const router = useRouter();

  return (
    <SafeAreaView>
      {/* Header */}
      <View className="flex-row items-center relative mb-3">
        <TouchableOpacity className="p-4" onPress={() => router.back()}>
          <Feather
            className="color-text-default dark:color-dark-text-default"
            name="chevron-left"
            size={24}
          />
        </TouchableOpacity>
        <Text className="font-inter-bold absolute left-1/2 -translate-x-1/2 text-text-default dark:text-dark-text-default">
          Edit Profile
        </Text>
        <View className="w-32 h-32 bg-cyan-500 rounded-full"></View>
      </View>
    </SafeAreaView>
  );
}
