import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import Sheet from "../Sheet";
import { useRef } from "react";
import { useUser } from "../../src/contexts/UserContext";
import { useRouter } from "expo-router";

// Friend component for displaying individual friend cards
export default function Friend({ user }) {
  const router = useRouter();
  const { currentUser, addPendingRequest, unfriend } = useUser();

  const bottomSheetRef = useRef(null);

  const handlePresentModalPress = () => bottomSheetRef.current?.present();

  // Handle sending friend request
  const handleAddFriend = async () => {
    try {
      await addPendingRequest(user.uid);
      Alert.alert(
        "Friend Request Sent",
        `Sent a friend request to @${user.username}`
      );
    } catch (error) {
      let message = "Failed to send friend request";

      // Handle specific error cases
      if (error.message === "Friend request already sent") {
        message = `You've already sent a friend request to @${user.username}`;
      } else if (error.message === "Users are already friends") {
        message = `You're already friends with @${user.username}`;
      }

      Alert.alert("Error", message);
    }
  };

  // Handle unfriending with confirmation
  const handleUnfriend = async () => {
    Alert.alert(
      "Unfriend",
      `Are you sure you want to unfriend @${user.username}?`,
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
              await unfriend(user.uid);
              bottomSheetRef.current?.dismiss();
            } catch (error) {
              let message = "Failed to unfriend user";

              // Handle specific error cases
              if (error.message === "Users are not friends") {
                message = `You're not friends with @${user.username}`;
              }

              Alert.alert("Error", message);
            }
          },
        },
      ]
    );
  };

  // Settings menu options
  const icons = [
    {
      name: "Profile",
      icon: (props) => <Feather {...props} name="user" size={24} />,
      warn: false,
      onPress: () => {
        bottomSheetRef.current?.dismiss();
        router.navigate(`/profile/${user.uid}`);
      },
    },
    {
      name: "Mute",
      icon: (props) => <Feather {...props} name="bell-off" size={24} />,
      warn: false,
      onPress: () => {},
    },
    {
      name: "Report",
      icon: (props) => <Feather {...props} name="slash" size={24} />,
      warn: true,
      onPress: () => {},
    },
    {
      name: "Block",
      icon: (props) => <Feather {...props} name="alert-octagon" size={24} />,
      warn: true,
      onPress: () => {},
    },
    {
      name: "Unfriend",
      icon: (props) => <Feather {...props} name="user-minus" size={24} />,
      warn: true,
      onPress: handleUnfriend,
    },
  ];

  return (
    <View className="flex-row items-center gap-2 p-2 flex-2">
      <TouchableOpacity
        onPress={() => router.navigate(`/profile/${user.uid}`)}
        className="flex-1 flex-row items-center gap-2"
      >
        {/* Profile picture */}
        <View className="relative">
          <Image
            source={{ uri: user.profilePicture }}
            className="w-12 h-12 rounded-full object-cover"
            style={{ resizeMode: "cover" }}
          />
          <View className="bg-green w-4 h-4 rounded-full absolute right-0 bottom-0" />
        </View>

        {/* User info */}
        <View className="flex-1">
          <Text className="text-lg text-text-default dark:text-dark-text-default line-clamp-1 text-ellipsis">
            {user.name}
          </Text>
          <Text className="text-sm text-text-default dark:text-dark-text-default line-clamp-1 text-ellipsis">
            @{user.username}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Action buttons */}
      {currentUser.friends.allFriends.includes(user.uid) ? (
        // User is a friend of the current user
        <TouchableOpacity onPress={handlePresentModalPress}>
          <Feather
            className="color-text-default dark:color-dark-text-default"
            name="more-horizontal"
            size={24}
          />
        </TouchableOpacity>
      ) : (
        // User isn't a friend of the current user
        <TouchableOpacity onPress={handleAddFriend}>
          <Feather
            className="color-text-default dark:color-dark-text-default"
            name="user-plus"
            size={24}
          />
        </TouchableOpacity>
      )}

      {/* Settings Modal */}
      <Sheet ref={bottomSheetRef} noExpand>
        <View>
          {icons.map((icon, index) => (
            <TouchableOpacity
              key={index}
              className="flex-row items-center gap-2 py-4"
              onPress={icon.onPress}
            >
              {icon.icon({
                className: icon.warn
                  ? "color-alert-text dark:color-dark-alert-text"
                  : "color-text-default dark:color-dark-text-default",
              })}
              <Text
                className={`capitalize ${
                  icon.warn
                    ? "text-alert-text dark:text-dark-alert-text"
                    : "text-text-default dark:text-dark-text-default"
                }`}
              >
                {icon.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Sheet>
    </View>
  );
}
