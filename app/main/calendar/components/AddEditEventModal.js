import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useState } from "react";
import { useUser } from "../../../../src/contexts/UserContext";

export default function AddEditEventModal({
  event,
  calendarDate,
  hideModal,
  onEventUpdate,
}) {
  const { currentUser, addUser } = useUser();
  const [title, setTitle] = useState(event?.title || "");
  const [description, setDescription] = useState(event?.description || "");
  const [selectedDate, setSelectedDate] = useState(
    event ? new Date(event.startTime) : calendarDate
  );
  const [startTime, setStartTime] = useState(
    event ? new Date(event.startTime) : new Date()
  );
  const [endTime, setEndTime] = useState(() => {
    if (event) {
      return new Date(event.endTime);
    }
    const defaultEnd = new Date();
    defaultEnd.setHours(defaultEnd.getHours() + 1);
    return defaultEnd;
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  // Save event to user data
  const handleSave = async () => {
    try {
      const eventStartTime = new Date(selectedDate);
      eventStartTime.setHours(startTime.getHours());
      eventStartTime.setMinutes(startTime.getMinutes());

      const eventEndTime = new Date(selectedDate);
      eventEndTime.setHours(endTime.getHours());
      eventEndTime.setMinutes(endTime.getMinutes());

      if (eventEndTime < eventStartTime) {
        eventEndTime.setDate(eventEndTime.getDate() + 1);
      }

      const newEvent = {
        eventId: event?.eventId || Date.now().toString(),
        title,
        date: selectedDate.toISOString(),
        startTime: eventStartTime.toISOString(),
        endTime: eventEndTime.toISOString(),
        description,
      };

      let updatedEvents;
      if (event) {
        updatedEvents = currentUser.calendar.events.map((e) =>
          e.eventId === event.eventId ? newEvent : e
        );
      } else {
        updatedEvents = [...currentUser.calendar.events, newEvent];
      }

      await addUser({
        ...currentUser,
        calendar: {
          ...currentUser.calendar,
          events: updatedEvents,
        },
      });

      onEventUpdate(updatedEvents);
      hideModal();
    } catch (error) {
      console.error("Failed to save event:", error);
    }
  };

  // Delete event from user data
  const handleDelete = async () => {
    try {
      const updatedEvents = currentUser.calendar.events.filter(
        (e) => e.eventId !== event.eventId
      );

      await addUser({
        ...currentUser,
        calendar: {
          ...currentUser.calendar,
          events: updatedEvents,
        },
      });

      onEventUpdate(updatedEvents);
      hideModal();
    } catch (error) {
      console.error("Failed to delete event:", error);
    }
  };

  return (
    <ScrollView className="py-10 px-7">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-8">
        <Text className="text-xl font-inter-bold dark:text-white">
          {event ? "Edit Event" : "Add Event"}
        </Text>
        <TouchableOpacity onPress={hideModal}>
          <Text className="text-gray-500 dark:text-gray-400">Close</Text>
        </TouchableOpacity>
      </View>

      {/* Title */}
      <View className="flex-row items-center mb-2">
        <Text className="font-inter-medium dark:text-white">Title</Text>
        <Text className="text-red-500 ml-1">*</Text>
      </View>
      <TextInput
        value={title}
        onChangeText={setTitle}
        className="bg-gray-100 dark:bg-dark-gray-100 p-3 rounded-lg mb-4 border border-gray dark:border-gray-700"
        placeholder="Enter Title"
      />

      {/* Date Selection */}
      <View className="flex-row items-center mb-2">
        <Text className="font-inter-medium dark:text-white">Date</Text>
        <Text className="text-red-500 ml-1">*</Text>
      </View>
      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        className="bg-gray-100 dark:bg-dark-gray-100 p-3 rounded-lg mb-4 border border-gray dark:border-gray-700"
      >
        <Text>
          {selectedDate.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          })}
        </Text>
      </TouchableOpacity>

      {/* Time Selection */}
      <View className="flex-row justify-between mb-4">
        <View className="flex-1 mr-2">
          <View className="flex-row items-center mb-2">
            <Text className="font-inter-medium dark:text-white">
              Start Time
            </Text>
            <Text className="text-red-500 ml-1">*</Text>
          </View>
          <TouchableOpacity
            onPress={() => setShowStartTimePicker(true)}
            className="bg-gray-100 dark:bg-dark-gray-100 p-3 rounded-lg border border-gray dark:border-gray-700"
          >
            <Text>
              {startTime.toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </TouchableOpacity>
        </View>
        <View className="flex-1 ml-2">
          <View className="flex-row items-center mb-2">
            <Text className="font-inter-medium dark:text-white">End Time</Text>
            <Text className="text-red-500 ml-1">*</Text>
          </View>
          <TouchableOpacity
            onPress={() => setShowEndTimePicker(true)}
            className="bg-gray-100 dark:bg-dark-gray-100 p-3 rounded-lg border border-gray dark:border-gray-700"
          >
            <Text>
              {endTime.toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Description */}
      <Text className="font-inter-medium dark:text-white mb-2">
        Description
      </Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        className="bg-gray-100 dark:bg-dark-gray-100 p-3 rounded-lg mb-4 border border-gray dark:border-gray-700"
        placeholder="Enter Description"
        numberOfLines={3}
      />

      {/* Date Time Pickers */}
      <DateTimePickerModal
        isVisible={showDatePicker}
        mode="date"
        onConfirm={(date) => {
          setShowDatePicker(false);
          setSelectedDate(date);
        }}
        onCancel={() => setShowDatePicker(false)}
        date={selectedDate}
      />

      <DateTimePickerModal
        isVisible={showStartTimePicker}
        mode="time"
        onConfirm={(time) => {
          setShowStartTimePicker(false);
          setStartTime(time);
          // Set end time to 1 hour after selected start time
          const newEndTime = new Date(time);
          newEndTime.setHours(time.getHours() + 1);
          setEndTime(newEndTime);
        }}
        onCancel={() => setShowStartTimePicker(false)}
        date={startTime}
      />

      <DateTimePickerModal
        isVisible={showEndTimePicker}
        mode="time"
        onConfirm={(time) => {
          setShowEndTimePicker(false);
          setEndTime(time);
        }}
        onCancel={() => setShowEndTimePicker(false)}
        date={endTime}
        minimumDate={startTime}
      />

      <View className="flex-col  ">
        <TouchableOpacity
          className={`flex-1 bg-purple-600 p-4 rounded-lg items-center my-3 ${
            !title ? "opacity-50" : "opacity-100"
          }`}
          onPress={handleSave}
          disabled={!title}
        >
          <Text className="text-white dark:text-white font-inter-medium">
            SAVE
          </Text>
        </TouchableOpacity>
        {event && (
          // Only show delete button when editing an event
          <TouchableOpacity
            className="flex-1 bg-red-100 dark:bg-red-900 p-4 rounded-lg items-center"
            onPress={handleDelete}
          >
            <Text className="text-red-600 dark:text-red-300 font-inter-medium">
              DELETE
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}
