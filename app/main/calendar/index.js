import { View, TouchableOpacity, ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useRef, useEffect } from "react";
import { Animated, Dimensions } from "react-native";
import { Feather } from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useUser } from "../../../src/contexts/UserContext";
import TimeSlots from "../../../components/calendar/TimeSlots";
import AddEditEventModal from "../../../components/calendar/AddEditEventModal";
import LinkCalendarModal from "../../../components/calendar/LinkCalendarModal";
import CalendarHeader from "../../../components/calendar/CalendarHeader";

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
        toValue: screenHeight * 0.9,
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

  // Filter events for selected date
  const getEventsForDate = (date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.startTime);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  // Get events for a specific time slot
  const getEventsForTimeSlot = (time) => {
    const dateEvents = getEventsForDate(calendarDate);
    const hour = parseInt(time.split(":")[0]);

    return dateEvents.filter((event) => {
      const eventStart = new Date(event.startTime);
      return eventStart.getHours() === hour;
    });
  };

  // Generate time slots
  const timeSlots = Array.from({ length: 18 }, (_, i) => {
    const hour = (i + 6).toString().padStart(2, "0");
    return `${hour}:00`;
  });

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-background">
      <CalendarHeader
        calendarDate={calendarDate}
        onPreviousDay={goToPreviousDay}
        onNextDay={goToNextDay}
        onDatePress={() => setShowDatePicker(true)}
        onLinkPress={showLinkModal}
      />

      {/* Calendar Content */}
      <View className="flex-1">
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <TimeSlots
            timeSlots={timeSlots}
            events={events}
            selectedDate={calendarDate}
            getEventsForTimeSlot={getEventsForTimeSlot}
            onEventPress={handleEventPress}
          />
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

      {/* Add Event Button */}
      <TouchableOpacity
        className="absolute bottom-32 right-6 w-14 h-14 bg-purple-default dark:bg-dark-purple-default rounded-full items-center justify-center shadow-lg z-0"
        onPress={handleAddEvent}
      >
        <Feather name="plus" size={24} className="text-white" />
      </TouchableOpacity>

      {/* Event Modal */}
      {showAddEvent && (
        <Animated.View
          style={{
            height: modalHeight,
            transform: [
              {
                translateY: modalHeight.interpolate({
                  inputRange: [0, screenHeight * 0.9],
                  outputRange: [screenHeight * 0.9, 0],
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
