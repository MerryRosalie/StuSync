import { Text, View, TouchableOpacity } from "react-native";

export default function Alert({ visible, onClose, onPress, title, message }) {
  if (!visible) return null;

  return (
    <View className="absolute top-12 left-0 right-0 z-50">
      <TouchableOpacity
        onPress={onPress}
        className="flex-row items-center px-4 py-3 bg-purple-default dark:bg-dark-purple-default shadow-lg"
      >
        <View className="w-8 h-8 mr-3 bg-background dark:bg-dark-background rounded-full items-center justify-center">
          <Text className="text-purple-default dark:text-dark-purple-default text-xl">
            ✓
          </Text>
        </View>
        <View className="flex-1">
          <Text className="font-inter-bold text-background dark:text-dark-background">
            {title}
          </Text>
          <Text className="text-background/80 dark:text-dark-background/80">
            {message}
          </Text>
        </View>
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="p-2"
        >
          <Text className="text-2xl text-background dark:text-dark-background">
            ×
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
}
