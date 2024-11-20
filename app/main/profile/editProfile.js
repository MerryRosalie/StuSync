import { SafeAreaView } from "react-native-safe-area-context";
import {
  Text,
  TouchableOpacity,
  ScrollView,
  View,
  TextInput,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import Button from "../../../components/Button";
import { useUser } from "../../../src/contexts/UserContext";

export default function EditProfilecreen() {
  const { currentUser, addUser } = useUser();
  const [name, setName] = useState(currentUser.name);
  const [username, setUsername] = useState(currentUser.username);
  const [aboutMe, setAboutMe] = useState(currentUser.profile.aboutMe);
  const [currentCourses, setCurrentCourses] = useState(
    currentUser.profile.currentCourses
  );
  const [course, setCourse] = useState("");
  const router = useRouter();

  const addCourse = () => {
    if (course.trim()) {
      setCurrentCourses([...currentCourses, course.trim().toUpperCase()]);
      setCourse("");
    }
  };

  const handleRemoveCourse = (course) => {
    setCurrentCourses(currentCourses.filter((c) => c !== course));
  };

  // Save event to user data
  //  const handleSave = async () => {
  //   try {
  //     const eventStartTime = new Date(selectedDate);
  //     eventStartTime.setHours(startTime.getHours());
  //     eventStartTime.setMinutes(startTime.getMinutes());

  //     const eventEndTime = new Date(selectedDate);
  //     eventEndTime.setHours(endTime.getHours());
  //     eventEndTime.setMinutes(endTime.getMinutes());

  //     if (eventEndTime < eventStartTime) {
  //       eventEndTime.setDate(eventEndTime.getDate() + 1);
  //     }

  //     const newEvent = {
  //       eventId: event?.eventId || Date.now().toString(),
  //       title,
  //       date: selectedDate.toISOString(),
  //       startTime: eventStartTime.toISOString(),
  //       endTime: eventEndTime.toISOString(),
  //       description,
  //     };

  //     let updatedEvents;
  //     if (event) {
  //       updatedEvents = currentUser.calendar.events.map((e) =>
  //         e.eventId === event.eventId ? newEvent : e
  //       );
  //     } else {
  //       updatedEvents = [...currentUser.calendar.events, newEvent];
  //     }

  //     await addUser({
  //       ...currentUser,
  //       calendar: {
  //         ...currentUser.calendar,
  //         events: updatedEvents,
  //       },
  //     });

  //     onEventUpdate(updatedEvents);
  //     hideModal();
  //   } catch (error) {
  //     console.error("Failed to save event:", error);
  //   }
  // };

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-background p-6 gap-8 items-center">
      {/* Header */}
      <View className="w-full flex-row items-center justify-center relative mb-3">
        <TouchableOpacity
          className="absolute left-0 pl-0 p-4"
          onPress={() => router.back()}
        >
          <Feather
            className="color-text-default dark:color-dark-text-default"
            name="chevron-left"
            size={24}
          />
        </TouchableOpacity>
        <Text className="font-inter-bold text-text-default dark:text-dark-text-default">
          Edit Profile
        </Text>
      </View>
      <View className="w-32 h-32">
        <View className="w-32 h-32 bg-cyan-500 rounded-full"></View>
        <TouchableOpacity className="absolute bottom-0 right-0 w-12 h-12 rounded-full bg-purple-secondary justify-center items-center">
          <Feather name="edit-2" size={24} color="#7A51EC" />
        </TouchableOpacity>
      </View>
      <View className="w-full gap-4">
        {/* name input */}
        <View className="gap-2">
          <Text className="text-base font-semibold">Name</Text>
          <TextInput
            className="border border-gray rounded-xl items-center p-4"
            placeholder="Enter name"
            onChangeText={(e) => {
              setName(e);
            }}
            value={name}
          />
        </View>
        {/* username input */}
        <View className="gap-2">
          <Text className="text-base font-semibold">Username</Text>
          <TextInput
            className="border border-gray rounded-xl items-center p-4"
            placeholder="Enter username"
            onChangeText={(e) => {
              setUsername(e);
            }}
            value={username}
          />
        </View>
        {/* about me input */}
        <View className="w-full gap-2">
          <Text className="text-base font-semibold">About Me</Text>
          <TextInput
            className="border border-gray rounded-xl items-center p-4"
            placeholder="Enter about me"
            multiline={true}
            onChangeText={(e) => {
              setAboutMe(e);
            }}
            value={aboutMe}
          />
        </View>
        {/* courses input */}

        <View className="gap-2">
          <Text className="text-base font-semibold">Current Courses</Text>
          <View className="flex-row w-full gap-2">
            <TextInput
              className="flex-1 border border-gray rounded-xl items-center p-4 "
              placeholder="Enter course code"
              onChangeText={(e) => {
                setCourse(e);
              }}
              value={course}
            />
            <TouchableOpacity
              className="p-4 bg-purple-secondary border rounded-xl border-purple-default"
              onPress={addCourse}
            >
              <Text className="text-purple-default text-semibold">ADD</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row flex-wrap gap-2">
            {currentCourses.map((course, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleRemoveCourse(course)}
                className="bg-purple-100 rounded-full px-4 py-2 flex-row items-center"
              >
                <Text className="text-purple-600 mr-2">{course}</Text>
                <Text className="text-purple-600">×</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
