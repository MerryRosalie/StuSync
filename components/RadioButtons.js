// components/RadioButtons.js
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

const RadioButtons = ({ options, selectedValue, onValueChange }) => {
  return (
    <View className="gap-6 w-full p-4">
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          onPress={() => onValueChange(option)}
          className="flex-row items-center justify-between"
        >
          <Text
            className={`text-base dark:text-white ${
              selectedValue === option ? "font-medium" : "font-normal"
            }`}
          >
            {option}
          </Text>
          <View className="h-7 w-7 rounded-full border-2 dark:border-white items-center justify-center">
            {selectedValue === option && (
              <View className="h-4 w-4 rounded-full bg-black dark:bg-white" />
            )}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default RadioButtons;
