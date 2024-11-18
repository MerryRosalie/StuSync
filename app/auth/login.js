import { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useRouter } from "expo-router";
import LoginImage from "../../assets/auth/sign-in.png";
import { useUser } from "../../src/contexts/UserContext";

export default function Page() {
  const router = useRouter();
  const { login } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Check email is valid using regex
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  // If no errors, login
  const handleLogin = async () => {
    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    if (!password) {
      setError("Please enter your password");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await login(email, password);
      router.replace("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // check if email and password are not empty
  const isEmpty = () => {
    return email.trim() !== "" && password.trim() !== "";
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView className="flex justify-start items-center bg-purple-secondary dark:bg-dark-purple-secondary h-full">
        <View className="h-[20%] w-full">
          <Image
            source={LoginImage}
            className="h-full w-full"
            resizeMode="contain"
          />
        </View>
        <View className="bg-white dark:bg-dark-background w-full h-full px-5 py-12 rounded-t-[30px]">
          <Text className="font-inter-bold text-3xl text-purple-default dark:text-dark-purple-default self-start mb-8">
            Welcome Back!
          </Text>

          <Text className="font-inter-medium text-lg mb-2 dark:text-dark-text-default">
            Email
          </Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email..."
            keyboardType="email-address"
            autoCapitalize="none"
            className={`w-full p-4 rounded-xl bg-white dark:bg-dark-background border text-text-default dark:text-dark-text-default ${
              error ? "border-red-500" : "border-gray dark:border-gray-700"
            }`}
            placeholderTextColor="#9CA3AF"
          />

          <Text className="font-inter-medium text-lg my-2 dark:text-dark-text-default">
            Password
          </Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password..."
            secureTextEntry
            className={`w-full p-4 rounded-xl bg-white dark:bg-dark-background border text-text-default dark:text-dark-text-default ${
              error ? "border-red-500" : "border-gray dark:border-gray-700"
            }`}
            placeholderTextColor="#9CA3AF"
          />

          {error && (
            <Text className="text-red-500 mt-2 text-center">{error}</Text>
          )}

          <View className="flex-row justify-center items-center mt-4">
            <Text className="font-inter-regular dark:text-dark-text-default">
              Don't have an account?{" "}
            </Text>
            <Link
              href="/auth/register"
              className="font-inter-medium text-purple-default"
            >
              Sign Up
            </Link>
          </View>

          <TouchableOpacity
            className={`w-full py-4 rounded-xl mt-safe ${
              isLoading ? "opacity-50" : ""
            } ${!isEmpty() ? "bg-purple-default/50" : "bg-purple-default"}`}
            onPress={handleLogin}
            disabled={isLoading || !isEmpty()}
          >
            <Text className="text-white font-inter-bold text-center text-lg">
              {isLoading ? "LOGGING IN..." : "LOGIN"}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
