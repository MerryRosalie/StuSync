import React from "react";
import { View, Text } from "react-native";
import Event from "./Event";

export default function TimeSlots({
  timeSlots,
  getEventsForTimeSlot,
  onEventPress,
}) {
  const calculateEventStyle = (event, allEvents) => {
    const startTime = new Date(event.startTime);
    const endTime = new Date(event.endTime);

    const startMinutes = startTime.getHours() * 60 + startTime.getMinutes();
    const endMinutes = endTime.getHours() * 60 + endTime.getMinutes();
    const duration = endMinutes - startMinutes;

    const PIXELS_PER_MINUTE = 144 / 60;
    const CONTAINER_PADDING = 8;
    const EVENT_GAP = 4;

    const top = startMinutes * PIXELS_PER_MINUTE - startTime.getHours() * 144;
    const height = duration * PIXELS_PER_MINUTE;

    const overlappingEvents = allEvents.filter((otherEvent) => {
      if (otherEvent.eventId === event.eventId) return false;
      const otherStart = new Date(otherEvent.startTime);
      const otherEnd = new Date(otherEvent.endTime);
      return startTime < otherEnd && endTime > otherStart;
    });

    const totalOverlapping = overlappingEvents.length + 1;
    const availableWidth = 100 - 2 * CONTAINER_PADDING;
    const eventWidth = availableWidth / totalOverlapping - EVENT_GAP;
    const width = `${eventWidth}%`;

    const index = overlappingEvents.filter(
      (e) =>
        new Date(e.startTime) < startTime ||
        (new Date(e.startTime).getTime() === startTime.getTime() &&
          e.eventId < event.eventId)
    ).length;

    const left = `${CONTAINER_PADDING + index * (eventWidth + EVENT_GAP)}%`;

    return {
      top,
      height,
      width,
      left,
      zIndex: 1,
    };
  };

  const allEvents = timeSlots
    .flatMap((time) => getEventsForTimeSlot(time) || [])
    .filter(
      (event, index, self) =>
        self.findIndex((e) => e.eventId === event.eventId) === index
    );

  return (
    <View>
      {timeSlots.map((timeSlot) => {
        const slotEvents = getEventsForTimeSlot(timeSlot);

        return (
          <View
            key={timeSlot}
            className="flex-row border-b h-36 border-gray dark:border-dark-text-dimmed"
          >
            {/* Time label */}
            <View className="w-20 py-4 px-2 ml-2">
              <Text className="text-text-default dark:text-dark-text-default">
                {timeSlot}
              </Text>
            </View>

            <View className="flex-1 relative">
              {events?.map((event) => (
                <Event
                  key={event.eventId}
                  event={event}
                  onPress={onEventPress}
                  style={calculateEventStyle(event, allEvents)}
                />
              ))}
            </View>
          </View>
        );
      })}
    </View>
  );
};

