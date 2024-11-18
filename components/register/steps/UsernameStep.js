import { Text, TextInput } from "react-native";

export default function UsernameStep({ value, onChangeText, error }) {
  return (
    <>
      <Text className="text-2xl font-semibold mb-2 text-text-default dark:text-dark-text-default">
        Create your username
      </Text>
      <Text className="text-text-default dark:text-dark-text-default mb-6">
        You can use letters, numbers, and underscores. Must be between 3-20
        characters and unique to other users.
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Enter your username..."
        className={`w-full p-4 rounded-xl border text-text-default dark:text-dark-text-default ${
          error ? "border-failure-text" : "border-gray dark:border-gray-700 "
        } bg-background dark:bg-dark-background`}
        placeholderTextColor="#9CA3AF"
      />

      {error && <Text className="text-failure-text mt-2">{error}</Text>}
    </>
  );
}
