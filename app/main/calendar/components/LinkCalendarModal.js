import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { Feather } from "@expo/vector-icons";

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
          <Text className="text-md dark:text-white">Close</Text>
        </TouchableOpacity>
      </View>

      {/* iCal  */}
      <Text className="font-inter-medium dark:text-white mb-2">iCal Link</Text>
      <TextInput
        className="bg-gray dark:bg-dark-gray p-3 rounded-lg mb-4 border border-gray dark:border-dark-gray text-text-default dark:text-dark-text-default"
        placeholder="Enter Input"
      />

      <View className="flex-row items-center mb-4">
        <View className="flex-1 h-[1px] bg-gray dark:bg-dark-gray" />
        <Text className="mx-4 text-text-default dark:text-dark-text-default">
          or
        </Text>
        <View className="flex-1 h-[1px] bg-gray dark:bg-dark-gray" />
      </View>

      {/* Google Button */}
      <TouchableOpacity
        onPress={handleGoogleAuth}
        className="flex-row items-center justify-center bg-gray dark:bg-dark-gray p-3 rounded-lg mb-4 border border-gray dark:border-dark-gray"
      >
        <Feather
          name="chrome"
          size={20}
          className="mr-2 text-text-default dark:text-dark-text-default"
        />
        <Text className="font-inter-medium dark:text-white">
          Continue with Google
        </Text>
      </TouchableOpacity>

      {/* Apple Button */}
      <TouchableOpacity
        onPress={handleAppleAuth}
        className="flex-row items-center justify-center bg-gray dark:bg-dark-gray p-3 rounded-lg mb-4 border border-gray dark:border-dark-gray"
      >
        <Feather
          name="command"
          size={20}
          className="mr-2 text-text-default dark:text-dark-text-default"
        />
        <Text className="font-inter-medium dark:text-white">
          Continue with Apple
        </Text>
      </TouchableOpacity>

      {/* Save Button */}
      <TouchableOpacity
        className="bg-purple-default dark:bg-dark-purple-default p-4 rounded-lg items-center mt-4"
        onPress={hideModal}
      >
        <Text className="text-white font-inter-medium">SAVE</Text>
      </TouchableOpacity>
    </View>
  );
}
