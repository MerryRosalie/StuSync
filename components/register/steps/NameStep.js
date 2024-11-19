import { Text, TextInput } from "react-native";

export default function NameStep({ value, onChangeText }) {
  return (
    <>
      <Text className="text-2xl font-semibold mb-2 text-text-default dark:text-dark-text-default">
        What's your name?
      </Text>
      <Text className="text-text-default dark:text-dark-text-default mb-6">
        Enter your name so your friends know who you are!
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Enter your name..."
        className="w-full p-4 rounded-xl border border-gray dark:border-gray-700 bg-background dark:bg-dark-background text-text-default dark:text-dark-text-default "
        placeholderTextColor="#9CA3AF"
      />
    </>
  );
}
