import { View, TouchableOpacity, Text } from "react-native";
import Poll from "../chat/poll/Poll";
import { useMemo } from "react";

export default function BreakActivityPollModal({
  sheetRef,
  onComplete,
  options,
  values,
  showResults,
}) {
  const readyToSubmit = useMemo(
    () => Object.values(values || {}).some((value) => value),
    [values]
  );

  return (
    <View className="gap-4">
      {/* Close button */}
      <TouchableOpacity
        onPress={() => sheetRef.current?.dismiss()}
        className="flex-row self-end py-2 items-center gap-2"
      >
        <Text className="font-inter-bold text-text-default dark:text-dark-text-default">
          CLOSE
        </Text>
      </TouchableOpacity>

      {/* Header section with title and description */}
      <View>
        <Text className="font-inter-bold text-center text-lg text-text-default dark:text-dark-text-default">
          What would you like to do during break?
        </Text>
        <Text className="text-text-default text-center dark:text-dark-text-default">
          Select one or more activities
        </Text>
      </View>

      {/* Poll component */}
      <Poll
        onChange={(newValues) => onComplete(newValues, showResults)}
        showResults={showResults}
        options={options}
        values={values}
      />

      {/* Conditional rendering of action button */}
      {showResults ? (
        // Remove vote button - shown when viewing results
        <TouchableOpacity
          onPress={() => onComplete(values, false)}
          className="rounded-lg p-6 border border-purple-default dark:border-dark-purple-default"
        >
          <Text className="font-inter-bold text-purple-default text-center dark:text-dark-purple-default">
            REMOVE VOTE
          </Text>
        </TouchableOpacity>
      ) : (
        // Save votes button - shown when voting
        <TouchableOpacity
          disabled={!readyToSubmit}
          onPress={() => onComplete(values, true)}
          className="rounded-lg bg-purple-default dark:bg-dark-purple-default disabled:bg-purple-default/25 dark:disabled:bg-dark-purple-default/25 p-6"
        >
          <Text className="font-inter-bold text-background text-center dark:text-dark-background">
            VOTE ACTIVITY
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
