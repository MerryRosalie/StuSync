import { View, TouchableOpacity, ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useRef, useEffect } from "react";
import { Animated, Dimensions } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useUser } from "../../../src/contexts/UserContext";

import TimeSlots from "./components/TimeSlots";
import AddEditEventModal from "./components/AddEditEventModal";
import LinkCalendarModal from "./components/LinkCalendarModal";

export default function Page() {
  const { currentUser } = useUser();
  const screenHeight = Dimensions.get("window").height;
  const modalHeight = useRef(new Animated.Value(0)).current;

  // State
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [events, setEvents] = useState([]);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showLinkCalendar, setShowLinkCalendar] = useState(false);

  // Load events from user data
  useEffect(() => {
    if (currentUser?.calendar?.events) {
      setEvents(currentUser.calendar.events);
    }
  }, [currentUser]);

  // Modal handlers for add/edit event
  const showAddEditModal = () => {
    setShowAddEvent(true);
    requestAnimationFrame(() => {
      Animated.spring(modalHeight, {
        toValue: screenHeight * 0.8,
        useNativeDriver: false,
      }).start();
    });
  };

  const hideAddEditModal = () => {
    Animated.spring(modalHeight, {
      toValue: 0,
      useNativeDriver: false,
    }).start(() => {
      setShowAddEvent(false);
    });
  };

  // Modal handlers for link calendar modal
  const showLinkModal = () => {
    setShowLinkCalendar(true);
    requestAnimationFrame(() => {
      Animated.spring(modalHeight, {
        toValue: screenHeight * 0.8,
        useNativeDriver: false,
      }).start();
    });
  };

  const hideLinkModal = () => {
    Animated.spring(modalHeight, {
      toValue: 0,
      useNativeDriver: false,
    }).start(() => {
      setShowLinkCalendar(false);
    });
  };

  // Event handlers
  const handleAddEvent = () => {
    setSelectedEvent(null);
    showAddEditModal();
  };

  // Modal pops up when event is pressed
  const handleEventPress = (event) => {
    setSelectedEvent(event);
    showAddEditModal();
  };

  // Go back one day
  const goToPreviousDay = () => {
    const newDate = new Date(calendarDate);
    newDate.setDate(calendarDate.getDate() - 1);
    setCalendarDate(newDate);
  };

  // Go forward one day
  const goToNextDay = () => {
    const newDate = new Date(calendarDate);
    newDate.setDate(calendarDate.getDate() + 1);
    setCalendarDate(newDate);
  };

  // Filter events for selected date (the date displayed in the calendar)
  const getEventsForDate = (date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.startTime);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  // Render events in time slots
  const renderEvents = (time) => {
    const dateEvents = getEventsForDate(calendarDate);
    const hour = parseInt(time.split(":")[0]);

    const timeSlotEvents = dateEvents.filter((event) => {
      const eventStart = new Date(event.startTime);
      return eventStart.getHours() === hour;
    });

    if (timeSlotEvents.length === 0) {
      return null;
    }

    return timeSlotEvents.map((event) => (
      <TouchableOpacity
        key={event.eventId}
        className="bg-purple-100 dark:bg-purple-900 p-2 rounded-lg mb-1"
        onPress={() => handleEventPress(event)}
      >
        <Text className="font-inter-medium dark:text-white">{event.title}</Text>
        <Text className="text-sm text-gray-500 dark:text-gray-400">
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
    ));
  };

  // Generate time slots
  const timeSlots = Array.from({ length: 18 }, (_, i) => {
    const hour = (i + 6).toString().padStart(2, "0");
    return `${hour}:00`;
  });

  // Helper function to check if a date is today
  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-background">
      {/* Header */}
      <View className="px-4 py-6 border-b border-gray dark:border-gray-800">
        <View className="flex-row justify-between items-center">
          <TouchableOpacity onPress={goToPreviousDay}>
            <MaterialIcons name="chevron-left" size={24} color="black" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            className="flex-1 ml-4"
          >
            <View className="flex-row items-center">
              <View className="flex-row items-center">
                <View
                  className={`${
                    isToday(calendarDate)
                      ? "bg-purple-secondary dark:bg-purple-secondary px-2 py-1 rounded-lg"
                      : ""
                  }`}
                >
                  <Text className="text-2xl font-inter-bold dark:text-white">
                    {calendarDate.getDate()}
                  </Text>
                </View>
                <Text className="text-2xl font-inter-bold dark:text-white ml-2">
                  {calendarDate.toLocaleString("default", { month: "long" })}
                </Text>
              </View>
              <MaterialIcons
                name="keyboard-arrow-down"
                size={24}
                color="black"
                className="ml-2 mt-1"
              />
            </View>
          </TouchableOpacity>

          <View className="flex-row items-center">
            <TouchableOpacity className="mr-4" onPress={showLinkModal}>
              <MaterialCommunityIcons name="link" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={goToNextDay}>
              <MaterialIcons name="chevron-right" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Calendar Content */}
      <View className="flex-1">
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }} // Add padding for FAB
        >
          <TimeSlots timeSlots={timeSlots} renderEvents={renderEvents} />
        </ScrollView>
      </View>

      {/* Date Picker Modal */}
      <DateTimePickerModal
        isVisible={showDatePicker}
        mode="date"
        date={calendarDate}
        onConfirm={(date) => {
          setShowDatePicker(false);
          setCalendarDate(date);
        }}
        onCancel={() => setShowDatePicker(false)}
      />

      {/* Event Modal */}
      {showAddEvent && (
        <Animated.View
          style={{
            height: modalHeight,
            transform: [
              {
                translateY: modalHeight.interpolate({
                  inputRange: [0, screenHeight * 0.8],
                  outputRange: [screenHeight * 0.8, 0],
                }),
              },
            ],
          }}
          className="absolute bottom-0 left-0 right-0 bg-white dark:bg-dark-background rounded-t-3xl shadow-lg"
        >
          <AddEditEventModal
            event={selectedEvent}
            calendarDate={calendarDate}
            hideModal={hideAddEditModal}
            onEventUpdate={setEvents}
          />
        </Animated.View>
      )}

      {/* Add Event Button */}
      <TouchableOpacity
        className="absolute bottom-28 right-6 w-14 h-14 bg-purple-600 rounded-full items-center justify-center shadow-lg"
        onPress={handleAddEvent}
      >
        <MaterialIcons name="add" size={24} color="white" />
      </TouchableOpacity>

      {showLinkCalendar && (
        <Animated.View
          style={{
            height: modalHeight,
            transform: [
              {
                translateY: modalHeight.interpolate({
                  inputRange: [0, screenHeight * 0.8],
                  outputRange: [screenHeight * 0.8, 0],
                }),
              },
            ],
          }}
          className="absolute bottom-0 left-0 right-0 bg-white dark:bg-dark-background rounded-t-3xl shadow-lg"
        >
          <LinkCalendarModal hideModal={hideLinkModal} />
        </Animated.View>
      )}
    </SafeAreaView>
  );
}
