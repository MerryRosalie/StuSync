import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import RegisterImage from "../../assets/auth/sign-up.png";
import { useNavigation } from "@react-navigation/native";

export default function Page() {
  const navigation = useNavigation();

  return (
    <SafeAreaView className="flex-1 bg-purple-secondary dark:bg-dark-purple-secondary">
      <View className="flex-1 relative">
        <Image
          source={RegisterImage}
          className="absolute top-8 z-10 h-[180px] self-end"
        />
        <ScrollView className="flex-1 mt-[220px]">
          <View className="bg-white dark:bg-dark-background px-5 py-8 rounded-t-[30px] min-h-[500px]">
            <Text className="font-inter-bold text-2xl text-purple-default dark:text-dark-purple-default self-start mb-6">
              Create an account
            </Text>

            <Text className="font-inter-medium text-lg mb-2 dark:text-dark-text-default">
              Name
            </Text>
            <TextInput
              placeholder="Enter your name..."
              className="w-full p-4 rounded-xl bg-white dark:bg-dark-background border border-gray-200 dark:border-gray-700"
              placeholderTextColor="#9CA3AF"
            />

            <Text className="font-inter-medium text-lg my-2 dark:text-dark-text-default">
              Username
            </Text>
            <TextInput
              placeholder="Enter your username..."
              className="w-full p-4 rounded-xl bg-white dark:bg-dark-background border border-gray-200 dark:border-gray-700"
              placeholderTextColor="#9CA3AF"
            />

            <Text className="font-inter-medium text-lg my-2 dark:text-dark-text-default">
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

            <Text className="font-inter-medium text-lg my-2 dark:text-dark-text-default">
              Confirm Password
            </Text>
            <TextInput
              placeholder="Confirm password..."
              secureTextEntry
              className="w-full p-4 rounded-xl bg-white dark:bg-dark-background border border-gray-200 dark:border-gray-700"
              placeholderTextColor="#9CA3AF"
            />

            <View className="flex-row justify-center items-center mt-4">
              <Text className="font-inter-regular dark:text-dark-text-default">
                Have an account?{" "}
              </Text>
              <Link
                href="/auth/login"
                className="font-inter-medium text-purple-default"
              >
                Log In
              </Link>
            </View>

            <TouchableOpacity
              className="w-full bg-purple-default py-4 rounded-xl mt-safe"
              onPress={() => navigation.navigate("home")}
            >
              <Text className="text-white font-inter-bold text-center text-lg">
                SIGN UP
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
