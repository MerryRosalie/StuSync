import { useState } from "react";
import { TouchableOpacity, View, Text } from "react-native";
import Feather from "@expo/vector-icons/Feather";

// Main Poll Component - Manages poll with only "Yes" / "No"
export default function BinaryPoll() {
  // true = Yes, false = No, undefined = no vote
  const [vote, setVote] = useState(true);

  // Toggle vote to Yes if undefined, otherwise toggle current vote
  const setToYes = () => {
    setVote((prev) => (prev === undefined ? true : !prev));
  };

  // Toggle vote to No if undefined, otherwise toggle current vote
  const setToNo = () => {
    setVote((prev) => (prev === undefined ? false : !prev));
  };

  // Common styles and render logic for both options
  const renderOption = (isYes) => {
    const isSelected = isYes ? vote : !vote;
    const label = isYes ? "Yes" : "No";

    return (
      <TouchableOpacity
        onPress={() => (isYes ? setToYes() : setToNo())}
        className="flex-col gap-3"
      >
        <View className="relative flex-row items-center px-4 py-3 border rounded-lg border-background dark:border-dark-background">
          {/* Progress bar background */}
          <View
            className="absolute rounded-tl-lg rounded-bl-lg inset-0 bg-purple-secondary/25 dark:bg-dark-purple-secondary/25"
            style={{ width: isSelected ? "100%" : "0%" }}
          />

          {/* Option content */}
          <View className="flex-1">
            <Text className="line-clamp-1 text-ellipsis text-background dark:text-dark-background">
              {label}
            </Text>
            <Text className="text-sm line-clamp-1 text-ellipsis text-background dark:text-dark-background">
              {isSelected ? "1 votes" : "0 votes"}
            </Text>
          </View>

          {/* Vote stats and checkbox */}
          <View className="flex-row gap-4 items-center">
            <Text className="font-inter-bold text-background dark:text-dark-background">
              {isSelected ? "100%" : "0%"}
            </Text>
            <TouchableOpacity
              onPress={() => (isYes ? setToYes() : setToNo())}
              className={`border h-10 w-10 items-center justify-center rounded-lg ${
                isSelected
                  ? "border-purple-secondary dark:border-dark-purple-secondary bg-purple-secondary dark:bg-dark-purple-secondary"
                  : "border-background dark:border-dark-background"
              }`}
            >
              {isSelected && (
                <Feather
                  name="check"
                  size={24}
                  className="color-text-default dark:color-dark-text-default"
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      {renderOption(true)}
      {renderOption(false)}
    </>
  );
}
