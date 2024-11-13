import { Text, View, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import Friend from "../../components/Friend";

export default function Page() {
  const router = useRouter();
  return (
    <SafeAreaProvider className="flex-1">
      <SafeAreaView className="flex-1 bg-background dark:bg-dark-background">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-3 px-6">
          <TouchableOpacity className="p-4" onPress={() => router.back()}>
            <Feather
              className="color-text-default dark:color-dark-text-default"
              name="chevron-left"
              size={24}
            />
          </TouchableOpacity>
          <Text className="font-inter-bold text-text-default dark:text-dark-text-default">
            Study Session Details
          </Text>
          <TouchableOpacity className="p-4">
            <Feather
              className="color-text-default dark:color-dark-text-default"
              name="edit-2"
              size={24}
            />
          </TouchableOpacity>
        </View>
        <ScrollView className="flex-1 px-6 py-2 flex">
          {/* Date Information */}
          <View className="p-4 rounded-2xl border border-text-dimmed dark:border-dark-text-dimmed">
            <Text className="font-bold text-text-default dark:text-dark-text-default">
              Date
            </Text>
            <Text className="text-text-default dark:text-dark-text-default">
              Monday, 1st January 2024
            </Text>
          </View>
          {/* Time Information */}
          <View className="p-4 mt-4 rounded-2xl border border-text-dimmed dark:border-dark-text-dimmed">
            <Text className="font-bold text-text-default dark:text-dark-text-default">
              Time
            </Text>
            <View className="flex-row justify-between">
              <View>
                <Text className="font-bold text-xl text-text-default dark:text-dark-text-default">
                  12:00 PM
                </Text>
                <Text className="text-text-default dark:text-dark-text-default">
                  Start Time
                </Text>
              </View>
              <View>
                <Text className="font-bold text-xl text-text-default dark:text-dark-text-default">
                  14:00 PM
                </Text>
                <Text className="text-text-default dark:text-dark-text-default">
                  Start Time
                </Text>
              </View>
            </View>
          </View>
          {/* Location Information */}
          <View className="p-4 mt-4 rounded-2xl flex-row justify-between items-center border border-text-dimmed dark:border-dark-text-dimmed">
            <View>
              <Text className="font-bold text-text-default dark:text-dark-text-default">
                Location
              </Text>
              <Text className="text-text-default/50 dark:text-dark-text-default/50">
                Voting in progress
              </Text>
            </View>
            <TouchableOpacity className="bg-purple-secondary dark:bg-dark-purple-secondary py-3 px-4 rounded-xl">
              <Text className="text-purple-default dark:text-dark-purple-default">
                Vote Now
              </Text>
            </TouchableOpacity>
          </View>
          {/* Members Information */}
          <View className="p-4 mt-4 rounded-2xl border border-text-dimmed dark:border-dark-text-dimmed">
            <Text className="font-bold text-text-default dark:text-dark-text-default">
              Members
            </Text>
            <Friend />
            <Friend />
          </View>
          {/* Start Study Session */}
          <TouchableOpacity className="flex-row mt-4 justify-center items-center gap-2 bg-purple-secondary dark:bg-dark-purple-secondary py-3 px-4 rounded-xl">
            <Feather
              className="text-purple-default dark:text-dark-purple-default"
              name="play"
              size={24}
            />
            <Text className="text-purple-default dark:text-dark-purple-default">
              Start Study Session
            </Text>
          </TouchableOpacity>
          {/* Leave Study Session */}
          <TouchableOpacity className="flex-row mt-4 justify-center items-center gap-2 border border-alert-text dark:border-dark-alert-text py-3 px-4 rounded-xl">
            <Feather
              className="color-alert-text dark:color-dark-alert-text"
              name="log-out"
              size={24}
            />
            <Text className="color-alert-text dark:color-dark-alert-text">
              Leave Study Session
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
