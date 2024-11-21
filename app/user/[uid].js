import { Text, View, TouchableOpacity, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";
import { useGlobalSearchParams, useRouter } from "expo-router";
import { useUser } from "../../src/contexts/UserContext";
import { useMemo, useState } from "react";
import format from "date-fns/format";
import Friend from "../../components/friends/Friend";

const ProfileTab = {
  AboutMe: "about me",
  MutualFriends: "mutual friends",
};

export default function Page() {
  const router = useRouter();
  const {
    currentUser,
    allUsers,
    cancelPendingRequest,
    addPendingRequest,
    unfriend,
  } = useUser();
  const local = useGlobalSearchParams();
  const user = allUsers[local.uid];

  const [selectedTab, setSelectedTab] = useState(ProfileTab.AboutMe);

  const isFriended = useMemo(
    () => currentUser?.friends?.allFriends.includes(user?.uid),
    [currentUser, currentUser?.friends?.allFriends]
  );

  const isRequestSent = useMemo(
    () => currentUser?.friends?.pendingRequests.includes(user?.uid),
    [currentUser, currentUser?.friends?.pendingRequests]
  );

  const mutualFriends = useMemo(
    () =>
      currentUser?.friends?.allFriends
        .filter((uid) => user?.friends?.allFriends.includes(uid))
        .map((uid) => allUsers[uid])
        .sort((a, b) => a.name.localeCompare(b.name)),
    [user, currentUser]
  );

  // Handle sending friend request
  const handleAddFriend = async () => {
    try {
      await addPendingRequest(user?.uid);
      Alert.alert(
        "Friend Request Sent",
        `Sent a friend request to @${user?.username}`
      );
    } catch (error) {
      let message = "Failed to send friend request";

      // Handle specific error cases
      if (error.message === "Friend request already sent") {
        message = `You've already sent a friend request to @${user?.username}`;
      } else if (error.message === "Users are already friends") {
        message = `You're already friends with @${user?.username}`;
      }

      Alert.alert("Error", message);
    }
  };

  // Handle unfriending with confirmation
  const handleUnfriend = async () => {
    Alert.alert(
      "Unfriend",
      `Are you sure you want to unfriend @${user?.username}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Unfriend",
          style: "destructive",
          onPress: async () => {
            try {
              await unfriend(user?.uid);
            } catch (error) {
              let message = "Failed to unfriend user";

              // Handle specific error cases
              if (error.message === "Users are not friends") {
                message = `You're not friends with @${user?.username}`;
              }

              Alert.alert("Error", message);
            }
          },
        },
      ]
    );
  };

  // Handle canceling an outgoing request
  const handleCancelRequest = async () => {
    Alert.alert(
      "Cancel Request",
      `Are you sure you want to cancel the friend request to @${user?.username}?`,
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes",
          style: "destructive",
          onPress: async () => {
            try {
              await cancelPendingRequest(user?.uid);
            } catch (error) {
              let message = "Failed to cancel friend request";

              if (error.message === "No pending request found") {
                message = `No pending request found for @${user?.username}`;
              }

              Alert.alert("Error", message);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-background">
      {/* Header */}
      <View className="px-6">
        <View className="flex-row items-center relative mb-3">
          <TouchableOpacity className="p-4" onPress={() => router.back()}>
            <Feather
              className="color-text-default dark:color-dark-text-default"
              name="chevron-left"
              size={24}
            />
          </TouchableOpacity>
          <Text className="font-inter-bold absolute left-1/2 -translate-x-1/2 text-text-default dark:text-dark-text-default">
            Profile
          </Text>
        </View>
      </View>
      <View className="relative flex-1">
        {/* Backdrop */}
        <View className="absolute inset-0 h-20 bg-purple-secondary dark:bg-dark-purple-secondary" />
        {/* Profile picture */}
        <View className="relative self-center mt-6">
          <Image
            source={{ uri: user?.profilePicture }}
            className="w-24 h-24 rounded-full object-cover border-4 border-background dark:border-dark-background"
            style={{ resizeMode: "cover" }}
          />
          <View className="bg-green w-6 h-6 rounded-full absolute right-1 bottom-1" />
        </View>
        {/* User info */}
        <View className="self-center mt-3 px-6">
          <Text className="text-lg font-inter-bold text-center text-text-default dark:text-dark-text-default line-clamp-1 text-ellipsis">
            {user?.name}
          </Text>
          <Text className="text-sm text-center text-text-default dark:text-dark-text-default line-clamp-1 text-ellipsis">
            @{user?.username}
          </Text>
        </View>
        {isFriended ? (
          <TouchableOpacity
            onPress={handleUnfriend}
            className="flex-row self-center mt-4 justify-center items-center gap-2 bg-purple-default dark:bg-dark-purple-default py-3 px-4 rounded-xl"
          >
            {/* Unfriend button if user is already friended */}
            <Feather
              className="text-background dark:text-dark-background"
              name="user-check"
              size={24}
            />
            <Text className="font-inter-bold text-background dark:text-dark-background">
              Added
            </Text>
          </TouchableOpacity>
        ) : (
          <>
            {isRequestSent ? (
              <TouchableOpacity
                onPress={handleCancelRequest}
                className="flex-row self-center mt-4 justify-center items-center gap-2 bg-purple-default dark:bg-dark-purple-default py-3 px-4 rounded-xl"
              >
                {/* Cancel friend request button if user request already sent */}
                <Feather
                  className="text-background dark:text-dark-background"
                  name="user-check"
                  size={24}
                />
                <Text className="font-inter-bold text-background dark:text-dark-background">
                  Request Sent
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={handleAddFriend}
                className="flex-row self-center mt-4 justify-center items-center gap-2 border border-purple-default dark:border-dark-purple-default py-3 px-4 rounded-xl"
              >
                {/* Friend button if user is not yet friended */}
                <Feather
                  className="text-purple-default dark:text-dark-purple-default"
                  name="user-plus"
                  size={24}
                />
                <Text className="text-purple-default dark:text-dark-purple-default">
                  Add as a friend
                </Text>
              </TouchableOpacity>
            )}
          </>
        )}
        {/* About Me + Mutual Friends tabs */}
        <View className="flex-row mt-4">
          <TouchableOpacity
            className={`flex-1 p-6 ${
              selectedTab === ProfileTab.AboutMe &&
              "border-b border-purple-default dark:border-dark-purple-default"
            }`}
            onPress={() => setSelectedTab(ProfileTab.AboutMe)}
          >
            <Text
              className={`text-center ${
                selectedTab === ProfileTab.AboutMe
                  ? "text-purple-default dark:text-dark-purple-default font-inter-bold"
                  : "text-text-default dark:text-dark-text-default"
              }`}
            >
              About Me
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 p-6 ${
              selectedTab === ProfileTab.MutualFriends &&
              "border-b border-purple-default dark:border-dark-purple-default"
            }`}
            onPress={() => setSelectedTab(ProfileTab.MutualFriends)}
          >
            <Text
              className={`text-center ${
                selectedTab === ProfileTab.MutualFriends
                  ? "text-purple-default dark:text-dark-purple-default font-inter-bold"
                  : "text-text-default/50 dark:text-dark-text-default/50"
              }`}
            >
              {mutualFriends.length} Mutual{" "}
              {mutualFriends.length === 1 ? "Friend" : "Friends"}
            </Text>
          </TouchableOpacity>
        </View>
        {/* Content based on selected tab */}
        {selectedTab === ProfileTab.AboutMe && (
          <View className="flex-1 p-6 gap-6">
            <View className="gap-2">
              <Text className="font-inter-bold text-text-default dark:text-dark-text-default">
                About Me
              </Text>
              <Text className="text-text-default dark:text-dark-text-default">
                {user?.aboutMe || "N/A"}
              </Text>
            </View>
            <View className="gap-2">
              <Text className="font-inter-bold text-text-default dark:text-dark-text-default">
                Current Courses
              </Text>
              <Text className="uppercase text-text-default dark:text-dark-text-default">
                {user?.courses?.join(", ") || "N/A"}
              </Text>
            </View>
            <View className="gap-2">
              <Text className="font-inter-bold text-text-default dark:text-dark-text-default">
                Member Since
              </Text>
              <Text className="text-text-default dark:text-dark-text-default">
                {format(user?.profile?.memberSince, "MMM d, yyyy")}
              </Text>
            </View>
          </View>
        )}
        {selectedTab === ProfileTab.MutualFriends && (
          <>
            {mutualFriends.length !== 0 ? (
              <View className="gap-2 p-6 flex-1">
                {mutualFriends.map((friend, index) => (
                  <Friend key={index} user={friend} />
                ))}
              </View>
            ) : (
              <Text className="p-6 text-center text-text-default/50 dark:text-dark-text-default/50">
                No mutual friends yet
              </Text>
            )}
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
