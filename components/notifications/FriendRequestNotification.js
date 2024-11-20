import { Text, View, TouchableOpacity, Image } from "react-native";

export default function FriendRequestNotification({
  notification,
  onAccept,
  onDeny,
}) {
  return (
    <View className="flex-row items-start p-4">
      <Image
        source={{ uri: notification.user.avatar }}
        className="w-12 h-12 rounded-full mr-3"
      />
      <View className="flex-1">
        <Text className="dark:text-dark-text-default">
          <Text className="font-inter-bold dark:text-dark-text-default">
            {notification.user.name}
          </Text>
          <Text> {notification.message}</Text>
        </Text>
        <Text className="dark:text-gray text-sm">{notification.timestamp}</Text>
      </View>
      {notification.requiresAction && (
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => onAccept(notification.user.uid, notification.id)}
            className="w-11 h-11 rounded-full bg-success-background dark:bg-dark-success-background mr-2 items-center justify-center"
          >
            <Text className="text-success-text dark:text-dark-success-text text-2xl">
              ✓
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onDeny(notification.user.uid, notification.id)}
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
