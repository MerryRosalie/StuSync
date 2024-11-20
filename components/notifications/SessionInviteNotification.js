import { Text, View, TouchableOpacity, Image, Alert } from "react-native";
import { useUser } from "../../src/contexts/UserContext";

export default function SessionInviteNotification({
  notification,
  onAccept,
  onDeny,
  currentUserSessions = [],
}) {
  const { allUsers } = useUser();
  const user = allUsers[notification.uid];

  const handleAcceptPress = () => {
    onAccept(notification, notification.id);
  };

  return (
    <View className="flex-row items-start py-3 px-4">
      <Image
        source={{ uri: user.profilePicture }}
        className="w-12 h-12 rounded-full mr-3"
      />
      <View className="flex-1">
        <Text className="dark:text-dark-text-default">
          <Text className="font-inter-bold dark:text-dark-text-default">
            {user.name}
          </Text>
          <Text> is having a session at </Text>
          <Text className="font-inter-bold dark:text-dark-text-default">
            {notification.time} {notification.date}
          </Text>
          <Text> would you like to join it?</Text>
        </Text>
        <Text className="text-gray-500 text-sm dark:text-dark-text-default">
          {notification.timestamp}
        </Text>
      </View>
      {notification.requiresAction && (
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={handleAcceptPress}
            className="w-11 h-11 rounded-full bg-success-background dark:bg-dark-success-background mr-2 items-center justify-center"
          >
            <Text className="text-success-text dark:text-dark-success-text text-2xl">
              ✓
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onDeny(notification, notification.id)}
            className="w-11 h-11 rounded-full bg-failure-background dark:bg-dark-alert-background items-center justify-center"
          >
            <Text className="text-failure-text dark:text-dark-alert-text text-2xl">
              ✕
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
