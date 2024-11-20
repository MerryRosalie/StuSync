import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { useUser } from "../../src/contexts/UserContext";
import { useRouter } from "expo-router";

// Request component handles friend request interactions
export default function Request({ user }) {
  const router = useRouter();
  const {
    currentUser,
    cancelPendingRequest,
    acceptIncomingRequest,
    denyIncomingRequest,
  } = useUser();

  // Handle canceling an outgoing request
  const handleCancelRequest = async () => {
    try {
      await cancelPendingRequest(user.uid);
    } catch (error) {
      let message = "Failed to cancel friend request";

      // Handle specific error cases
      if (error.message === "No pending request found") {
        message = `No pending request found for @${user.username}`;
      }

      Alert.alert("Error", message);
    }
  };

  // Handle accepting an incoming request
  const handleAcceptRequest = async () => {
    try {
      await acceptIncomingRequest(user.uid);
    } catch (error) {
      let message = "Failed to accept friend request";

      // Handle specific error cases
      if (error.message === "No pending request found") {
        message = "This friend request is no longer available";
      } else if (error.message === "Users are already friends") {
        message = `You're already friends with @${user.username}`;
      }

      Alert.alert("Error", message);
    }
  };

  // Handle denying an incoming request
  const handleDenyRequest = async () => {
    try {
      await denyIncomingRequest(user.uid);
    } catch (error) {
      let message = "Failed to deny friend request";

      // Handle specific error cases
      if (error.message === "No pending request found") {
        message = "This friend request is no longer available";
      }

      Alert.alert("Error", message);
    }
  };

  return (
    <View className="flex-row items-center gap-2 p-2 flex-2">
      <TouchableOpacity
        onPress={() => router.navigate(`/user/${user.uid}`)}
        className="flex-1 flex-row items-center gap-2"
      >
        {/* Profile picture with status */}
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

      {/* Outgoing request cancel button */}
      {currentUser.friends.pendingRequests.includes(user.uid) && (
        <TouchableOpacity
          className="p-2 rounded-full bg-failure-background dark:bg-dark-alert-background"
          onPress={handleCancelRequest}
        >
          <Feather
            className="color-failure-text dark:color-dark-alert-text"
            name="x"
            size={24}
          />
        </TouchableOpacity>
      )}

      {/* Incoming request accept/deny buttons */}
      {currentUser.friends.incomingRequests.includes(user.uid) && (
        <View className="flex-row gap-2">
          <TouchableOpacity
            className="p-2 rounded-full bg-success-background dark:bg-dark-success-background"
            onPress={handleAcceptRequest}
          >
            <Feather
              className="color-success-text dark:color-dark-success-text"
              name="check"
              size={24}
            />
          </TouchableOpacity>
          <TouchableOpacity
            className="p-2 rounded-full bg-failure-background dark:bg-dark-alert-background"
            onPress={handleDenyRequest}
          >
            <Feather
              className="color-failure-text dark:color-dark-alert-text"
              name="x"
              size={24}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
