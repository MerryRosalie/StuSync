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
import { Link } from "expo-router";
import LoginImage from "../../assets/auth/sign-in.png";
import { useNavigation } from "@react-navigation/native";

export default function Page() {
  const navigation = useNavigation();

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
            placeholder="Enter your email..."
            className="w-full p-4 rounded-xl bg-white dark:bg-dark-background border border-gray-200 dark:border-gray-700"
            placeholderTextColor="#9CA3AF"
          />

          <Text className="font-inter-medium text-lg my-2 dark:text-dark-text-default">
            Password
          </Text>
          <TextInput
            placeholder="Enter your password..."
            secureTextEntry
            className="w-full p-4 rounded-xl bg-white dark:bg-dark-background border border-gray-200 dark:border-gray-700"
            placeholderTextColor="#9CA3AF"
          />

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
            className="w-full bg-purple-default py-4 rounded-xl mt-safe"
            onPress={() => navigation.navigate("home")}
          >
            <Text className="text-white font-inter-bold text-center text-lg">
              LOGIN
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
