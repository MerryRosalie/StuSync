import { View, Text } from "react-native";
import Feather from "@expo/vector-icons/Feather";

// ResultBox Component - Displays a poll option with voting percentage and selection status
export default function ({ option, checked, numOfVotes, percentage }) {
  return (
    <View
      className={`relative flex-row items-center px-4 py-3 border rounded-lg ${
        checked
          ? "border-purple-default dark:border-dark-purple-default"
          : "border-text-dimmed dark:border-dark-text-dimmed"
      }`}
    >
      {/* Progress bar background */}
      <View
        className="absolute rounded-tl-lg rounded-bl-lg inset-0 bg-purple-secondary dark:bg-dark-purple-secondary"
        style={{ width: `${percentage}%` }}
      />
      <View className="flex-1">
        {/* Option text */}
        <Text
          className={`line-clamp-1 text-ellipsis ${
            checked
              ? "text-purple-default dark:text-dark-purple-default"
              : "text-text-default dark:text-dark-text-default"
          }`}
        >
          {option}
        </Text>
        <Text
          className={`text-sm line-clamp-1 text-ellipsis ${
            checked
              ? "text-purple-default dark:text-dark-purple-default"
              : "text-text-default dark:text-dark-text-default"
          }`}
        >
          {numOfVotes} votes
        </Text>
      </View>
      <View className="flex-row gap-4 items-center">
        {/* Percentage display */}
        <Text
          className={`font-inter-bold ${
            checked
              ? "text-purple-default dark:text-dark-purple-default"
              : "text-text-default dark:text-dark-text-default"
          }`}
        >
          {Math.floor(percentage)}%
        </Text>
        {/* Checkbox indicator */}
        <View
          onPress={() => setChecked((prev) => !prev)}
          className={`border h-10 w-10 items-center justify-center rounded-lg ${
            checked
              ? "border-purple-default dark:border-dark-purple-default bg-purple-default dark:bg-dark-purple-default"
              : "border-text-default dark:border-dark-text-default/25"
          }`}
        >
          {checked && (
            <Feather
              name="check"
              size={24}
              className="color-background dark:color-dark-background"
            />
          )}
        </View>
      </View>
    </View>
  );
}
