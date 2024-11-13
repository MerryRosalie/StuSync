import { useState } from "react";
import {
  Text,
  View,
  ScrollView,
  Pressable,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import Friend from "../../components/Friend";

const FriendsTab = {
  All: "all",
  Incoming: "incoming",
  Pending: "pending",
};

function Tab({ buttons, selectedTab, setSelectedTab }) {
  return (
    <View className="flex-row px-6">
      {buttons.map((button) => {
        const selected = button === selectedTab;
        return (
          <Pressable
            key={button}
            className={`flex-1 justify-center items-center py-3 rounded-full mb-4 ${
              selected && "bg-purple-default dark:bg-dark-purple-default"
            }`}
            onPress={() => setSelectedTab(button)}
          >
            <Text
              className={`capitalize ${
                selected
                  ? "font-inter-bold text-background dark:text-dark-background"
                  : "font-inter text-text-default/50 dark:text-dark-text-default/50"
              }`}
            >
              {button}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function AllPage() {
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <ScrollView className="flex-1 px-6">
      {/* Search Bar */}
      <View className="flex-row items-center gap-3 px-6 py-3 bg-text-default/5 dark:bg-dark-text-default/5 rounded-full">
        <Feather
          className="opacity-50 color-text-default dark:color-dark-text-default"
          name="search"
          size={24}
        />
        <TextInput
          className="flex-1 font-inter text-text-default dark:text-dark-text-default placeholder:text-text-default/50 dark:placeholder:text-dark-text-default/50"
          placeholder="Search by name or username..."
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
      </View>
      {/* Friends List */}
      <View className="flex-1">
        <Friend />
      </View>
    </ScrollView>
  );
}

export default function Page() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState(FriendsTab.All);

  const buttons = Object.values(FriendsTab);

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
            Friends List
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/friends/add")}
            className="p-4"
          >
            <Feather
              className="color-text-default dark:color-dark-text-default"
              name="user-plus"
              size={24}
            />
          </TouchableOpacity>
        </View>
        {/* Tabs */}
        <Tab
          buttons={buttons}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
        {/* Pages based on selectedTab */}
        {selectedTab === FriendsTab.All && <AllPage />}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
