import { View, Text } from "react-native";
import Event from "./Event";

// renders each time slot (one row in the calendar) and its events
export default function TimeSlots({
  timeSlots,
  getEventsForTimeSlot,
  onEventPress,
}) {
  return (
    <View>
      {timeSlots.map((time) => {
        const events = getEventsForTimeSlot(time);

        return (
          <View
            key={time}
            className="flex-row border-b h-36 border-gray dark:border-dark-text-dimmed"
          >
            <View className="w-20 py-4 px-2 ml-2">
              <Text className="text-text-default dark:text-dark-text-default">
                {time}
              </Text>
            </View>

            <View className="flex-1 py-2">
              {events?.map((event) => (
                <Event
                  key={event.eventId}
                  event={event}
                  onPress={onEventPress}
                />
              ))}
            </View>
          </View>
        );
      })}
    </View>
  );
}
