import { Text, View } from "react-native";

export default function SessionReminderNotification({ notification }) {
  return (
    <View className="flex-row items-start p-4">
      <View className="w-12 h-12 rounded-full mr-3 bg-purple-100 dark:bg-purple-900 items-center justify-center">
        <Text className="text-2xl">📚</Text>
      </View>
      <View className="flex-1">
        <Text className="dark:text-dark-text-default">
          <Text>Session </Text>
          <Text className="font-inter-bold dark:text-dark-text-default">
            {notification.sessionName}
          </Text>
          {notification.type === "session_reminder" ? (
            <Text>
              {" "}
              at {notification.time} {notification.date}
            </Text>
          ) : (
            <Text> location set to {notification.location}</Text>
          )}
        </Text>
        <Text className="text-gray-500 text-sm dark:text-dark-text-default">
          {notification.timestamp}
        </Text>
      </View>
    </View>
  );
}
