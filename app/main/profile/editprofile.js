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

export default function EditProfilecreen() {
  const [name, setName] = useState("Christine Phung");
  const [username, setUsername] = useState("khr1s_");
  const [aboutMe, setAboutMe] = useState("I love studying");
  const [currentCourses, setCurrentCourses] = useState(["COMP6991"]);

  const router = useRouter();

  const handleRemoveCourse = (course) => {
    setCurrentCourses(currentCourses.filter((c) => c !== course));
  };

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
            onChangeText={(e) => {
              setAboutMe(e);
            }}
            value={aboutMe}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
