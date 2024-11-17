import { Text, TextInput } from "react-native";

export default function EmailStep({ value, onChangeText, error }) {
  return (
    <>
      <Text className="text-2xl font-semibold mb-2 text-text-default dark:text-dark-text-default">
        What's your email?
      </Text>
      <Text className="text-text-default dark:text-dark-text-default mb-6">
        Enter your email address to create your account
      </Text>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Enter your email..."
        keyboardType="email-address"
        autoCapitalize="none"
        className={`w-full p-4 rounded-xl border text-text-default dark:text-dark-text-default ${
          error ? "border-failure-text" : "border-gray dark:border-gray-700 "
        } bg-background dark:bg-dark-background`}
        placeholderTextColor="#9CA3AF"
      />

      {error && <Text className="text-failure-text mt-2">{error}</Text>}
    </>
  );
}
