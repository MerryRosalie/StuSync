import { useEffect, useMemo, useState } from "react";
import { View, Text, TouchableOpacity, TextInput, Alert } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import Checkbox from "./Checkbox";
import ResultBox from "./ResultBox";

// Main Poll Component - Manages poll options and voting state
export default function Poll({
  options,
  onChange,
  showResults,
  values: propValues,
}) {
  // Initialise votes state with all options set to false
  const [votes, setVotes] = useState(
    propValues ||
      options.reduce((acc, option) => {
        acc[option] = false;
        return acc;
      }, {})
  );

  // Update votes when propValues changes
  useEffect(() => {
    if (propValues) {
      setVotes(propValues);
    }
  }, [propValues]);

  // State for adding new poll options
  const [newLocation, setNewLocation] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  // Determine if new option can be submitted
  const readyToSubmit = useMemo(
    () => isAdding && newLocation,
    [newLocation, isAdding]
  );

  // Add new option to the poll
  const addOption = (option) => {
    // Check for duplicate options
    if (votes[option] !== undefined) {
      Alert.alert(
        "Error in adding location option",
        `There's an option with the same name already: ${option}`
      );
      return;
    }
    // Add new option to votes state
    setVotes((prevValues) => {
      const newValues = { ...prevValues };
      newValues[option] = false;
      return newValues;
    });
    resetInput();
  };

  // Reset input state
  const resetInput = () => {
    setNewLocation("");
    setIsAdding(false);
  };

  // Notify parent component when votes change
  useEffect(() => {
    if (onChange) onChange(votes);
  }, [votes]);

  return (
    <View className="flex-col gap-3">
      {Object.keys(votes).map((option, index) => (
        <View key={index}>
          {showResults ? (
            // Show results view with percentage
            <ResultBox
              option={option}
              checked={votes[option]}
              numOfVotes={votes[option] ? 1 : 0}
              percentage={
                votes[option]
                  ? (1 / Object.values(votes).filter((value) => value).length) *
                    100
                  : 0
              }
            />
          ) : (
            // Show voting checkbox
            <Checkbox
              option={option}
              value={votes[option]}
              onChange={(value) => {
                setVotes((prevValues) => {
                  const newValues = { ...prevValues };
                  newValues[option] = value;
                  return newValues;
                });
              }}
            />
          )}
        </View>
      ))}

      {/* Add new option section */}
      {isAdding ? (
        <View>
          {/* Location Input */}
          <TextInput
            placeholder="Enter location name..."
            value={newLocation}
            onChangeText={(text) => setNewLocation(text)}
            style={{ padding: 20 }}
            className="border rounded-lg border-text-dimmed dark:border-dark-text-dimmed text-text-default dark:text-dark-text-default placeholder:text-text-default/50 dark:placeholder:text-dark-text-default/50"
          />
          {/* Action buttons container */}
          <View className="flex-row gap-2 justify-end mt-2">
            {/* Cancel button */}
            <TouchableOpacity
              onPress={() => setIsAdding(false)}
              className="py-4 px-6 rounded-lg"
            >
              <Text className="font-inter flex-0 text-text-default dark:text-dark-text-default">
                Cancel
              </Text>
            </TouchableOpacity>
            {/* Add button */}
            <TouchableOpacity
              disabled={!readyToSubmit}
              onPress={() => addOption(newLocation)}
              className="py-4 px-6 rounded-lg bg-purple-default dark:bg-dark-purple-default disabled:bg-purple-default/25"
            >
              <Text className="font-inter-bold flex-0 text-background dark:text-dark-background">
                Add
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        // "Add more options" button
        <TouchableOpacity
          onPress={() => setIsAdding(true)}
          className="flex-row items-center px-4 py-3 border border-dashed rounded-lg border-text-dimmed dark:border-dark-text-dimmed"
        >
          <Feather
            name="plus"
            size={24}
            className="p-2 text-text-default/50 dark:text-dark-text-default/50"
          />
          <Text className="flex-1 ml-2 text-text-default/50 dark:text-dark-text-default/50">
            Add more options
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
