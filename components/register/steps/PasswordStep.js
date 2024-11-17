import { Text, TextInput, View } from "react-native";

export default function PasswordStep({
  password,
  confirmPassword,
  onPasswordChange,
  onConfirmPasswordChange,
  error,
}) {
  return (
    <>
      <Text className="text-2xl font-semibold mb-2 text-text-default dark:text-dark-text-default">
        Create a password
      </Text>
      <Text className="text-text-default dark:text-dark-text-default mb-6">
        Choose a secure password to protect your account
      </Text>

      <TextInput
        value={password}
        onChangeText={onPasswordChange}
        placeholder="Enter your password..."
        secureTextEntry
        className={`w-full p-4 rounded-xl border text-text-default dark:text-dark-text-default  ${
          error ? "border-failure-text" : "border-gray dark:border-gray-700"
        } bg-background dark:bg-dark-background`}
        placeholderTextColor="#9CA3AF"
      />
      <TextInput
        value={confirmPassword}
        onChangeText={onConfirmPasswordChange}
        placeholder="Confirm password..."
        secureTextEntry
        className={`w-full p-4 mt-5 rounded-xl border text-text-default dark:text-dark-text-default  ${
          error ? "border-failure-text" : "border-gray dark:border-gray-700"
        } bg-background dark:bg-dark-background`}
        placeholderTextColor="#9CA3AF"
      />
      <Text className="text-text dark:text-dark-text text-sm my-4 text-text-default dark:text-dark-text-default">
<<<<<<< HEAD
        Password must be at least 8 characters long. Password must contain at
        least one uppercase letter, one lowercase letter, and one number.
=======
        Password must be at least 8 characters long.
>>>>>>> 791a713 (:sparkles: implement authentication functionality and new register page)
      </Text>

      {error && <Text className="text-failure-text mt-2">{error}</Text>}
    </>
  );
}
