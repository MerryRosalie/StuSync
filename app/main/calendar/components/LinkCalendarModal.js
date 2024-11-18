import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function LinkCalendarModal({ hideModal }) {
  const handleGoogleAuth = async () => {
    console.log("Google auth clicked");
  };

  const handleAppleAuth = async () => {
    console.log("Apple auth clicked");
  };

  return (
    <View className="py-10 px-7">
      <View className="flex-row justify-between items-center mb-8">
        <Text className="text-xl font-inter-bold dark:text-white">
          Link External Calendar
        </Text>
        <TouchableOpacity onPress={hideModal}>
          <Text className="text-gray-500 dark:text-gray-400">Close</Text>
        </TouchableOpacity>
      </View>

      {/* iCal  */}
      <Text className="font-inter-medium dark:text-white mb-2">iCal Link</Text>
      <TextInput
        className="bg-gray-100 dark:bg-dark-gray-100 p-3 rounded-lg mb-4 border border-gray dark:border-gray-700"
        placeholder="Enter Input"
      />

      <View className="flex-row items-center mb-4">
        <View className="flex-1 h-[1px] bg-gray-300 dark:bg-gray-700" />
        <Text className="mx-4 text-gray-500 dark:text-gray-400">or</Text>
        <View className="flex-1 h-[1px] bg-gray-300 dark:bg-gray-700" />
      </View>

      {/* Google Button */}
      <TouchableOpacity
        onPress={handleGoogleAuth}
        className="flex-row items-center justify-center dark:bg-dark-gray-100 p-3 rounded-lg mb-4 border border-gray dark:border-gray-700"
      >
        <MaterialCommunityIcons
          name="google"
          size={22}
          color="black"
          className="mr-2"
        />
        <Text className="font-inter-medium dark:text-white">
          Continue with Google
        </Text>
      </TouchableOpacity>

      {/* Apple Button */}
      <TouchableOpacity
        onPress={handleAppleAuth}
        className="flex-row items-center justify-center dark:bg-dark-gray-100 p-3 rounded-lg mb-4 border border-gray dark:border-gray-700"
      >
        <MaterialCommunityIcons
          name="apple"
          size={26}
          color="black"
          className="mr-2"
        />
        <Text className="font-inter-medium dark:text-white">
          Continue with Apple
        </Text>
      </TouchableOpacity>

      {/* Save Button */}
      <TouchableOpacity
        className="bg-purple-100 p-4 rounded-lg items-center mt-4"
        onPress={hideModal}
      >
        <Text className="text-purple-600 font-inter-medium">SAVE</Text>
      </TouchableOpacity>
    </View>
  );
}
