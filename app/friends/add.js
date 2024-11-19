import { Text, View, TouchableOpacity, TextInput, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import { useState, useMemo } from "react";
import { useUser } from "../../src/contexts/UserContext";
import Friend from "../../components/friends/Friend";
import EmptyState from "../../components/friends/EmptyState";

export default function Page() {
  const { currentUser, allUsers } = useUser();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  // Track if user has entered search text
  const isTyping = useMemo(() => searchQuery, [searchQuery]);

  // Filter and sort users based on search query
  const filteredUsers = useMemo(() => {
    if (searchQuery) {
      return Object.values(allUsers)
        .filter(
          (user) =>
            currentUser.email !== user.email &&
            !currentUser.friends.allFriends.includes(user.uid) &&
            (user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
              user.name.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        .sort((a, b) => a.name.localeCompare(b.name));
    }
    return [];
  }, [searchQuery, allUsers]);

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-background px-6">
      {/* Header with back button */}
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

      {/* Search results or empty states */}
      {filteredUsers.length !== 0 ? (
        <>
          {filteredUsers.map((user, index) => (
            <Friend key={index} user={user} />
          ))}
        </>
      ) : (
        <>
          {isTyping ? (
            <EmptyState
              title="No Results Found"
              description="We couldn't find any users matching your search. Try a different name or username"
            />
          ) : (
            <EmptyState
              title="Add Your Friends"
              description="Search by name or username to discover and connect with people you know"
              source={require("../../assets/add-friends.png")}
            />
          )}
        </>
      )}
    </SafeAreaView>
  );
}
