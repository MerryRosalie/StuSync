import { Text, View, TouchableOpacity, TextInput, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useRef } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { PanResponder, Animated, Dimensions } from 'react-native';

export default function Page() {
  const today = new Date();
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [selectedDate, setSelectedDate] = useState(today);
  const [events, setEvents] = useState([]);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalType, setModalType] = useState(null); // 'add' or 'view'
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Modal animation
  const modalHeight = useRef(new Animated.Value(0)).current;
  const screenHeight = Dimensions.get('window').height;
  
  const showModal = () => {
    setShowAddEvent(true);
    requestAnimationFrame(() => {
      Animated.spring(modalHeight, {
        toValue: screenHeight * 0.8,
        useNativeDriver: false,
      }).start();
    });
  };

  const hideModal = () => {
    Animated.spring(modalHeight, {
      toValue: 0,
      useNativeDriver: false,
    }).start(() => setShowAddEvent(false));
  };

  // Filter events for selected date
  const getEventsForDate = (date) => {
    return events.filter(event => {
      const eventDate = new Date(event.startTime);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  // Handle event creation
  const handleSaveEvent = () => {
    const newEvent = {
      id: Date.now(),
      title,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      description,
    };
    setEvents([...events, newEvent]);
    hideModal();
    setTitle('');
    setDescription('');
  };

  // Handle opening add event modal
  const handleAddEvent = () => {
    setModalType('add');
    setSelectedEvent(null);
    showModal();
  };

  // Handle opening event details modal
  const handleEventPress = (event) => {
    setModalType('view');
    setSelectedEvent(event);
    showModal();
  };

  // Render events in time slots with date filtering
  const renderEvents = (time) => {
    const timeSlotEvents = getEventsForDate(selectedDate).filter(event => {
      const eventStart = new Date(event.startTime);
      return eventStart.getHours() === parseInt(time.split(':')[0]);
    });

    return timeSlotEvents.map(event => (
      <TouchableOpacity 
        key={event.id} 
        className="bg-purple-100 dark:bg-purple-900 p-2 rounded-lg mb-1"
        onPress={() => handleEventPress(event)}
      >
        <Text className="font-inter-medium dark:text-white">{event.title}</Text>
        <Text className="text-sm text-gray-500 dark:text-gray-400">
          {new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
          {new Date(event.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </TouchableOpacity>
    ));
  };

  // Generate time slots from 8:00 AM to 8:00 PM
  const timeSlots = Array.from({ length: 13 }, (_, i) => `${(i + 8).toString().padStart(2, '0')}:00`);

  // Modal content based on type
  const renderModalContent = () => {
    if (modalType === 'view') {
      return (
        <ScrollView className="p-4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-inter-bold dark:text-white">Event Details</Text>
            <TouchableOpacity onPress={hideModal}>
              <Text className="text-gray-500 dark:text-gray-400">Close</Text>
            </TouchableOpacity>
          </View>
          
          <Text className="text-2xl font-inter-bold dark:text-white mb-2">{selectedEvent.title}</Text>
          
          <View className="bg-purple-50 dark:bg-purple-900 p-4 rounded-lg mb-4">
            <Text className="text-gray-600 dark:text-gray-300 mb-2">
              {selectedEvent.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
              {selectedEvent.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
            <Text className="text-gray-600 dark:text-gray-300">{selectedEvent.description}</Text>
          </View>

          <View className="flex-row space-x-2">
            <TouchableOpacity 
              className="flex-1 bg-red-100 dark:bg-red-900 p-4 rounded-lg items-center"
              onPress={() => {
                setEvents(events.filter(e => e.id !== selectedEvent.id));
                hideModal();
              }}
            >
              <Text className="text-red-600 dark:text-red-300 font-inter-medium">DELETE</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className="flex-1 bg-purple-100 dark:bg-purple-900 p-4 rounded-lg items-center"
              onPress={() => {
                setModalType('add');
                setTitle(selectedEvent.title);
                setStartTime(selectedEvent.startTime);
                setEndTime(selectedEvent.endTime);
                setDescription(selectedEvent.description);
              }}
            >
              <Text className="text-purple-600 dark:text-purple-300 font-inter-medium">EDIT</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      );
    }

    return (
      <ScrollView className="p-4">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-xl font-inter-bold dark:text-white">Add Event</Text>
          <TouchableOpacity onPress={hideModal}>
            <Text className="text-gray-500 dark:text-gray-400">Close</Text>
          </TouchableOpacity>
        </View>
        
        <Text className="font-inter-medium dark:text-white mb-2">Title*</Text>
        <TextInput 
          value={title}
          onChangeText={setTitle}
          className="bg-gray-100 dark:bg-dark-gray-100 p-3 rounded-lg mb-4"
          placeholder="Enter Title"
        />

        {/* Add Date Selection */}
        <Text className="font-inter-medium dark:text-white mb-2">Date*</Text>
        <TouchableOpacity 
          onPress={() => setShowDatePicker(true)}
          className="bg-gray-100 dark:bg-dark-gray-100 p-3 rounded-lg mb-4"
        >
          <Text>
            {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric' 
            })}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                // Preserve the selected time while changing the date
                const newDate = new Date(selectedDate);
                setStartTime(prev => {
                  const newStartTime = new Date(newDate);
                  newStartTime.setHours(prev.getHours(), prev.getMinutes());
                  return newStartTime;
                });
                setEndTime(prev => {
                  const newEndTime = new Date(newDate);
                  newEndTime.setHours(prev.getHours(), prev.getMinutes());
                  return newEndTime;
                });
              }
            }}
          />
        )}

        <View className="flex-row justify-between mb-4">
          <View className="flex-1 mr-2">
            <Text className="font-inter-medium dark:text-white mb-2">Start Time*</Text>
            <TouchableOpacity 
              onPress={() => setShowStartTimePicker(true)}
              className="bg-gray-100 dark:bg-dark-gray-100 p-3 rounded-lg"
            >
              <Text>{startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-1 ml-2">
            <Text className="font-inter-medium dark:text-white mb-2">End Time*</Text>
            <TouchableOpacity 
              onPress={() => setShowEndTimePicker(true)}
              className="bg-gray-100 dark:bg-dark-gray-100 p-3 rounded-lg"
            >
              <Text>{endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Time Pickers */}
        {showStartTimePicker && (
          <DateTimePicker
            value={startTime}
            mode="time"
            is24Hour={false}
            onChange={(event, selectedTime) => {
              setShowStartTimePicker(false);
              if (selectedTime) setStartTime(selectedTime);
            }}
          />
        )}

        {showEndTimePicker && (
          <DateTimePicker
            value={endTime}
            mode="time"
            is24Hour={false}
            onChange={(event, selectedTime) => {
              setShowEndTimePicker(false);
              if (selectedTime) setEndTime(selectedTime);
            }}
          />
        )}

        <Text className="font-inter-medium dark:text-white mb-2">Description</Text>
        <TextInput 
          value={description}
          onChangeText={setDescription}
          className="bg-gray-100 dark:bg-dark-gray-100 p-3 rounded-lg mb-4"
          placeholder="Enter Description"
          multiline
          numberOfLines={3}
        />

        <TouchableOpacity 
          className="bg-purple-600 p-4 rounded-lg items-center"
          onPress={handleSaveEvent}
        >
          <Text className="text-white dark:text-white font-inter-medium">SAVE</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  // Update the horizontal date scroll section
  const renderDateScroll = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      className="border-b border-gray-200 py-2 max-h-24"
    >
      {Array.from({ length: 5 }, (_, i) => {
        const date = new Date();
        date.setDate(today.getDate() + (i - 2));
        const isSelected = selectedDate.toDateString() === date.toDateString();
        
        return (
          <TouchableOpacity 
            key={i}
            onPress={() => setSelectedDate(new Date(date))}
            className="px-6 items-center"
          >
            <View className={`py-2 ${isSelected ? 'relative' : ''}`}>
              <Text className={`text-sm ${
                isSelected ? 'text-purple-600 dark:text-purple-300 font-bold' : 'text-gray-600 dark:text-gray-400'
              }`}>
                {date.toLocaleDateString('en-US', { weekday: 'short' })}
              </Text>
              <Text className={`text-center mt-1 ${
                isSelected ? 'text-purple-600 dark:text-purple-300 font-bold' : 'text-gray-600 dark:text-gray-400'
              }`}>
                {date.getDate()}
              </Text>
              
              {isSelected && (
                <View 
                  className="absolute top-[120%] left-1/2 -translate-x-1/2 w-[6px] h-[calc(100vh-350px)] bg-purple-600 rounded-full opacity-20"
                  style={{ zIndex: -1 }}
                />
              )}
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-background">
      {/* Header with current selected date */}
      <View className="flex-row justify-between items-center px-4 py-2 border-b border-gray-200 dark:border-gray-800">
        <View>
          <Text className="text-2xl font-inter-bold dark:text-white">
            {selectedDate.getDate()} {selectedDate.toLocaleString('default', { month: 'long' })}
          </Text>
          <Text className="text-gray-500 dark:text-gray-400">
            {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'short',
              day: 'numeric'
            })} - {new Date(selectedDate.getTime() + 86400000).toLocaleDateString('en-US', { 
              weekday: 'short',
              day: 'numeric'
            })}
          </Text>
        </View>
        <TouchableOpacity>
          <Text className="text-purple-600 dark:text-purple-300">Link Calendar</Text>
        </TouchableOpacity>
      </View>

      {/* Replace the old date scroll with the new one */}
      {renderDateScroll()}

      {/* Time slots with events */}
      <ScrollView className="flex-1">
        <View className="px-4">
          {timeSlots.map((time) => (
            <View key={time} className="flex-row border-b border-gray-100 dark:border-gray-800 py-4">
              <Text className="w-16 text-gray-500 dark:text-gray-400">{time}</Text>
              <View className="flex-1 ml-4">
                {renderEvents(time)}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Enhanced Modal */}
      {showAddEvent && (
        <Animated.View 
          style={{ 
            height: modalHeight,
            transform: [{ translateY: modalHeight.interpolate({
              inputRange: [0, screenHeight * 0.8],
              outputRange: [screenHeight * 0.8, 0]
            }) }]
          }}
          className="absolute bottom-0 left-0 right-0 bg-white dark:bg-dark-background rounded-t-3xl shadow-lg"
        >
          {renderModalContent()}
        </Animated.View>
      )}

      {/* Floating Action Button */}
      <TouchableOpacity 
        className="absolute bottom-20 right-6 w-14 h-14 bg-purple-600 rounded-full items-center justify-center shadow-lg"
        onPress={handleAddEvent}
      >
        <Text className="text-white text-3xl">+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
