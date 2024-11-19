import { View, Image, Text } from "react-native";

export default function EmptyState({ title, description, source }) {
  return (
    <View className="flex-1 w-3/4 m-auto opacity-50 justify-center">
      {/* Image container */}
      <View className="items-center h-1/4 mb-6">
        <Image
          className="flex-1 aspect-square"
          width={100}
          height={100}
          source={source || require("../../assets/sorry.png")}
        />
      </View>
      {/* Title */}
      {title && (
        <Text className="mb-2 text-text-default text-center dark:text-dark-text-default text-xl font-inter-bold">
          {title}
        </Text>
      )}
      {/* Description */}
      {description && (
        <Text className="text-text-default text-center dark:text-dark-text-default font-inter">
          {description}
        </Text>
      )}
    </View>
  );
}
