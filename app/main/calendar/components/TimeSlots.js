import { View, Text } from "react-native";

// renders each time slot (one row in the calendar) and its events
export default function TimeSlots({ timeSlots, renderEvents }) {
  return (
    <View>
      {timeSlots.map((time) => {
        const events = renderEvents(time);

        return (
          <View
            key={time}
            className="flex-row border-b border-gray dark:border-gray-800 h-36"
          >
            <View className="w-20 py-4 px-2">
              <Text className="text-gray-500 dark:text-gray-400">{time}</Text>
            </View>

            <View className="flex-1 py-2">{events}</View>
          </View>
        );
      })}
    </View>
  );
}
