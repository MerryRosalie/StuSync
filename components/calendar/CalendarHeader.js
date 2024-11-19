import { View, TouchableOpacity, Text } from "react-native";
import { Feather } from "@expo/vector-icons";

export default function CalendarHeader({
  calendarDate,
  onPreviousDay,
  onNextDay,
  onDatePress,
  onLinkPress,
}) {
  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <View className="px-4 py-6 border-b border-gray dark:border-dark-text-dimmed">
      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={onPreviousDay}>
            <Feather
              name="chevron-left"
              size={24}
              className="text-text-default dark:text-dark-text-default"
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={onDatePress} className="ml-4 w-auto">
            <View className="flex-row items-center">
              <View className="flex-row items-center ">
                <View
                  className={`${
                    isToday(calendarDate)
                      ? "bg-purple-default dark:bg-dark-purple-default px-2 py-1 rounded-lg"
                      : ""
                  }`}
                >
                  <Text
                    className={`text-2xl font-inter-bold ${
                      isToday(calendarDate)
                        ? "text-white dark:text-black"
                        : "text-text-default dark:text-dark-text-default"
                    }`}
                  >
                    {calendarDate.getDate()}
                  </Text>
                </View>
                <Text className="text-2xl font-inter-bold dark:text-white ml-2">
                  {calendarDate.toLocaleString("default", { month: "long" })}
                </Text>
              </View>
              <Feather
                name="chevron-down"
                size={24}
                className="text-text-default dark:text-dark-text-default ml-1"
              />
            </View>
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center">
          <TouchableOpacity className="mr-4" onPress={onLinkPress}>
            <Feather
              name="link"
              size={24}
              className="text-text-default dark:text-dark-text-default"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={onNextDay}>
            <Feather
              name="chevron-right"
              size={24}
              className="text-text-default dark:text-dark-text-default"
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
