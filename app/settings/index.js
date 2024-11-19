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
import ModeSwitch from "../../components/ModeSwitch";

export default function SettingsScreen() {
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
          Settings
        </Text>
      </View>
      <ModeSwitch />
      {/* privacy settings */}
      <View className="w-full flex-row border border-gray rounded-2xl items-center justify-between px-4 py-2">
        {/* heading */}
        <View className="flex-row gap-2">
          <Feather name="eye" size={24} color="black" />
          <Text className="text-base font-semibold justify-between">
            Privacy
          </Text>
        </View>
        {/* radio buttons */}
        <TouchableOpacity></TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
