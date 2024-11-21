import { View, TouchableOpacity, Text } from "react-native";
import { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns/format";

// Component which represents the page for location poll
export default function ProposeEndTimeModal({ sheetRef, onSubmit }) {
  // State to handle date input
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(today);

  // Function to propose time
  const proposeTime = () => {
    if (onSubmit) onSubmit(selectedDate);
    sheetRef.current?.dismiss();
  };

  return (
    <View className="gap-4">
      {/* Header section with title and description */}
      <View>
        <Text className="font-inter-bold text-center text-lg text-text-default dark:text-dark-text-default">
          Propose an end time
        </Text>
        <Text className="text-text-default text-center dark:text-dark-text-default">
          Input your desired end time
        </Text>
      </View>

      {/* Time Input */}
      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        className="px-4 py-6 border border-text-dimmed dark:border-dark-text-dimmed rounded-lg"
      >
        <Text className="text-text-default dark:text-dark-text-default">
          {format(selectedDate, "p")}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="time"
          onChange={(_, selectedDate) => {
            setSelectedDate(selectedDate);
            setShowDatePicker(false);
          }}
        />
      )}

      {/* Propose time button */}
      <TouchableOpacity
        onPress={() => proposeTime()}
        className="rounded-lg bg-purple-default dark:bg-dark-purple-default disabled:bg-purple-default/25 dark:disabled:bg-dark-purple-default/25 p-6"
      >
        <Text className="font-inter-bold text-background text-center dark:text-dark-background">
          PROPOSE TIME
        </Text>
      </TouchableOpacity>
    </View>
  );
}
