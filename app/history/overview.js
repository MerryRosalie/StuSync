import { SafeAreaView } from "react-native-safe-area-context";
import {
  Text,
  TouchableOpacity,
  ScrollView,
  View,
  TextInput,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import React, { useState } from "react";
import { useRouter } from "expo-router";

export default function OverviewScreen() {
  const router = useRouter();

  const circles = [
    { color: "bg-red-500", label: "Circle 1" },
    { color: "bg-blue-500", label: "Circle 2" },
    { color: "bg-blue-500", label: "Circle 3" },
    { color: "bg-yellow-500", label: "Circle 4" },
  ];

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-background p-6 gap-8 items-center">
      {/* Header */}
      <View className="w-full flex-row items-center justify-center relative mb-3">
        <TouchableOpacity
          className="absolute left-0 pl-0 p-4"
          onPress={() => router.push("/main/home")}
        >
          <Feather
            className="color-text-default dark:color-dark-text-default"
            name="chevron-left"
            size={24}
          />
        </TouchableOpacity>
        <Text className="font-inter-bold text-text-default dark:text-dark-text-default">
          Past Study Sessions
        </Text>
      </View>
      <TouchableOpacity
        className="rounded-xl border p-4 w-full"
        onPress={() => router.push("index")}
      >
        <View className="flex-row items-center justify-between">
          <Text className="text-lg font-medium">COMP1511 grind</Text>
          {/* <View className="flex-row items-center justify-center relative h-8">

            {circles.map((circle, index) => (
              <View
                key={index}
                className={`${circle.color} w-8 h-8 rounded-full border-2 border-white absolute mt-auto`}
                style={{
                  left: index * 20, // profiles are offset
                }}
              />
            ))}
          </View> */}
        </View>
        <Text className="text-xs">13 DEC 2PM</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
