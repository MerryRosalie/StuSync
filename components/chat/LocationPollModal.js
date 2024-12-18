import { View, TouchableOpacity, Text } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import Poll from "./poll/Poll";
import { useMemo, memo } from "react";
import { useSession } from "../../src/contexts/SessionContext";

const LocationPollModal = ({
  sheetRef,
  onComplete,
  options,
  values,
  showResults,
}) => {
  const { sessionStatus } = useSession();

  const readyToSubmit = useMemo(
    () => Object.values(values || {}).some((value) => value),
    [values]
  );

  return (
    <View className="gap-4">
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

      <View>
        <Text className="font-inter-bold text-center text-lg text-text-default dark:text-dark-text-default">
          Propose a location
        </Text>
        <Text className="text-text-default text-center dark:text-dark-text-default">
          Select one or more locations ({sessionStatus.locationPollTimeLeft}s
          remaining)
        </Text>
      </View>

      <Poll
        onChange={(newValues) => onComplete(newValues, showResults)}
        showResults={showResults}
        options={options}
        values={values}
      />

      {showResults ? (
        <TouchableOpacity
          onPress={() => onComplete(values, false)}
          className="rounded-lg p-6 border border-purple-default dark:border-dark-purple-default"
        >
          <Text className="font-inter-bold text-purple-default text-center dark:text-dark-purple-default">
            REMOVE VOTE
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          disabled={!readyToSubmit}
          onPress={() => onComplete(values, true)}
          className="rounded-lg bg-purple-default dark:bg-dark-purple-default disabled:bg-purple-default/25 dark:disabled:bg-dark-purple-default/25 p-6"
        >
          <Text className="font-inter-bold text-background text-center dark:text-dark-background">
            SAVE VOTES
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default memo(LocationPollModal);
