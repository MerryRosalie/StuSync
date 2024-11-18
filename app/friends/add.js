import { Text, View, TouchableOpacity, TextInput, Image } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import { useState, useMemo } from "react";
import { useUser } from "../../src/contexts/UserContext";
import Friend from "../../components/Friend";

export default function Page() {
  const { currentUser, allUsers } = useUser();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = useMemo(() => {
    if (searchQuery) {
      return Object.values(allUsers)
        .filter(
          (user) =>
            currentUser.email !== user.email &&
            (user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
              user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              user.email.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        .sort((a, b) => a.name.localeCompare(b.name));
    }
    return [];
  }, [searchQuery, allUsers]);

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-background dark:bg-dark-background px-6">
        {/* Header */}
        <View className="flex-row items-center relative mb-3">
          <TouchableOpacity className="p-4" onPress={() => router.back()}>
            <Feather
              className="color-text-default dark:color-dark-text-default"
              name="chevron-left"
              size={24}
            />
          </TouchableOpacity>
          <Text className="font-inter-bold absolute left-1/2 -translate-x-1/2 text-text-default dark:text-dark-text-default">
            Add Friends
          </Text>
        </View>
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
        {filteredUsers.length !== 0 ? (
          <>
            {filteredUsers.map((user, index) => (
              <Friend key={index} user={user} />
            ))}
          </>
        ) : (
          <View className="flex-1 w-3/4 m-auto opacity-50 justify-center">
            <View className="items-center h-1/4 mb-6">
              <Image
                className="flex-1 aspect-square"
                width={100}
                height={100}
                source={require("../../assets/add-friends.png")}
              />
            </View>
            <Text className="mb-2 text-text-default text-center dark:text-dark-text-default text-xl font-inter-bold">
              Add Your Friends
            </Text>
            <Text className="text-text-default text-center dark:text-dark-text-default font-inter">
              Search by name or username to discover and connect with people you
              know
            </Text>
          </View>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
