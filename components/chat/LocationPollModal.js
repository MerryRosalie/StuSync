import { View, TouchableOpacity, Text } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import Poll from "./poll/Poll";
import { useMemo, useState } from "react";

// Component which represents the page for location poll
export default function LocationPollModal({ sheetRef }) {
  // State to track selected poll options
  const [values, setValues] = useState({});
  // State to toggle between voting and results view
  const [showResults, setShowResults] = useState(false);

  // Memoized value to determine if any option is selected
  const readyToSubmit = useMemo(
    () => Object.values(values).some((value) => value),
    [values]
  );

  return (
    <View className="gap-4">
      {/* Close button */}
      <TouchableOpacity
        onPress={() => sheetRef.current?.dismiss()}
        className="flex-row self-end py-2 items-center gap-2"
      >
        <Feather
          name="x"
          size={24}
          className="color-failure-text dark:color-dark-alert-text"
        />
        <Text className="font-inter-bold text-failure-text dark:text-dark-alert-text">
          CLOSE
        </Text>
      </TouchableOpacity>

      {/* Header section with title and description */}
      <View>
        <Text className="font-inter-bold text-center text-lg text-text-default dark:text-dark-text-default">
          Propose a location
        </Text>
        <Text className="text-text-default text-center dark:text-dark-text-default">
          Select one or more locations
        </Text>
      </View>

      {/* Poll component */}
      <Poll
        onChange={(values) => setValues(values)}
        showResults={showResults}
        options={["Electrical Engineering G03", "Quadrangle G040"]}
      />

      {/* Conditional rendering of action button */}
      {showResults ? (
        // Remove vote button - shown when viewing results
        <TouchableOpacity
          onPress={() => setShowResults(false)}
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
          onPress={() => setShowResults(true)}
          className="rounded-lg bg-purple-default dark:bg-dark-purple-default disabled:bg-purple-default/25 dark:disabled:bg-dark-purple-default/25 p-6"
        >
          <Text className="font-inter-bold text-background text-center dark:text-dark-background">
            SAVE VOTES
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
