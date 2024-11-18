import { useEffect, useState } from "react";
import { Text, TouchableOpacity } from "react-native";
import Feather from "@expo/vector-icons/Feather";

// Checkbox Component - Interactive poll option for voting
export default function Checkbox({ option, value, onChange }) {
  const [checked, setChecked] = useState(value || false);

  // Notify parent component when checkbox state changes
  useEffect(() => {
    if (onChange) onChange(checked);
  }, [checked]);

  return (
    <TouchableOpacity
      onPress={() => setChecked((prev) => !prev)}
      className={`flex-row items-center px-4 py-3 border rounded-lg ${
        checked
          ? "border-purple-default dark:border-dark-purple-default"
          : "border-text-dimmed dark:border-dark-text-dimmed"
      }`}
    >
      {/* Option Text */}
      <Text
        className={`flex-1 line-clamp-1 text-ellipsis ${
          checked
            ? "text-purple-default dark:text-dark-purple-default"
            : "text-text-default dark:text-dark-text-default"
        }`}
      >
        {option}
      </Text>
      {/* Checkbox */}
      <TouchableOpacity
        onPress={() => setChecked((prev) => !prev)}
        className={`border h-10 w-10 items-center justify-center rounded-lg ${
          checked
            ? "border-purple-default dark:border-dark-purple-default bg-purple-default dark:bg-dark-purple-default"
            : "border-text-default dark:border-dark-text-default/25"
        }`}
      >
        {/* Checkmark icon - only shown when selected */}
        {checked && (
          <Feather
            name="check"
            size={24}
            className="color-background dark:color-dark-background"
          />
        )}
      </TouchableOpacity>
    </TouchableOpacity>
  );
}
