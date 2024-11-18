import { TouchableOpacity, Text } from "react-native";

// event in the calendar
export default function Event({ event, onPress, style }) {
  return (
    <TouchableOpacity
      key={event.eventId}
      className="bg-purple-default dark:bg-dark-purple-default p-2 rounded-lg absolute"
      style={{
        ...style,
        left: style.left,
        width: style.width,
        height: style.height - 20,
        marginTop: 2,
      }}
      onPress={() => onPress(event)}
    >
      <Text className="font-inter-medium text-dark-text-default dark:text-text-default">
        {event.title}
      </Text>
      <Text className="text-sm text-text-dimmed dark:text-dark-text-dimmed">
        {new Date(event.startTime).toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        })}
        {" - "}
        {new Date(event.endTime).toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </Text>
    </TouchableOpacity>
  );
}
