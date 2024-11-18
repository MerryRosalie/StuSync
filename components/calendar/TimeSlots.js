import React from "react";
import { View, Text } from "react-native";
import Event from "./Event";

// Calendar time slot component that handles event rendering and overlaps etc
const TimeSlots = ({ timeSlots, getEventsForTimeSlot, onEventPress }) => {
  // This is to ensure that overlapping events are styled differently
  const calculateEventStyle = (currentEvent, dayEvents) => {
    const start = new Date(currentEvent.startTime);
    const end = new Date(currentEvent.endTime);

    // Calculate the start time and duration
    const startOffset = start.getHours() * 60 + start.getMinutes();
    const duration = (end - start) / (1000 * 60);

    // Each minute is 2.4 pixels
    const MINUTE_SCALE = 2.4;
    const CONTAINER_PADDING = 8;
    const EVENT_SPACING = 4;

    // Finds overlapping events
    const overlappingEvents = dayEvents.filter((otherEvent) => {
      if (otherEvent.eventId === currentEvent.eventId) return false;

      const otherStart = new Date(otherEvent.startTime);
      const otherEnd = new Date(otherEvent.endTime);

      return start < otherEnd && end > otherStart;
    });

    // Calculate the total number of overlaps and the available width
    const totalOverlaps = overlappingEvents.length + 1;
    const availableWidth = 100 - 2 * CONTAINER_PADDING;

    // Based on the number of overlaps calculates the width of each event
    const eventWidth = availableWidth / totalOverlaps - EVENT_SPACING;

    // Based on the start time and event id calculates the index of the event
    const overlapIndex = overlappingEvents.filter(
      (e) =>
        new Date(e.startTime) < start ||
        (new Date(e.startTime).getTime() === start.getTime() &&
          e.eventId < currentEvent.eventId)
    ).length;

    return {
      top: startOffset * MINUTE_SCALE,
      height: duration * MINUTE_SCALE,
      width: `${eventWidth}%`,
      left: `${
        CONTAINER_PADDING + overlapIndex * (eventWidth + EVENT_SPACING)
      }%`,
      zIndex: 1,
    };
  };

  // Gets all the events for the day
  const eventsForSelectedDay = timeSlots
    .flatMap((slot) => getEventsForTimeSlot(slot) || [])
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

            {/* Event rendering area */}
            <View className="flex-1 relative">
              {slotEvents?.map((event) => (
                <Event
                  key={event.eventId}
                  event={event}
                  onPress={onEventPress}
                  style={calculateEventStyle(event, eventsForSelectedDay)}
                />
              ))}
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default TimeSlots;
