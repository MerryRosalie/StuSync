import { SafeAreaView } from "react-native-safe-area-context";
import {
  Text,
  TouchableOpacity,
  ScrollView,
  View,
  TextInput,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { useRouter, router } from "expo-router";
import React, { useState } from "react";
import { useNavigation } from "expo-router";
import ProfileIcon from "../../components/ProfileIcon";
export default function HistoryScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-background p-6 gap-8 items-center">
      {/* Header */}
      <View className="w-full flex-row items-center justify-center relative mb-3">
        <TouchableOpacity
          className="absolute left-0 pl-0 p-4"
          onPress={() => router.navigate("/main/home")}
        >
          <Feather
            className="color-text-default dark:color-dark-text-default"
            name="chevron-left"
            size={24}
          />
        </TouchableOpacity>
        <Text className="font-inter-bold text-text-default dark:text-dark-text-default">
          COMP1511 grind
        </Text>
      </View>
      {/* info */}
      <View className="gap-4">
        <View className="w-full border border-gray p-4 rounded-xl">
          <Text className="text-base font-bold">Date</Text>
          <Text className="text-base ">Monday, 1st January 2024</Text>
        </View>
        <View className="w-full border border-gray p-4 rounded-xl">
          <Text className="text-base font-bold">Time</Text>
          <View className="flex-row justify-between">
            <View className="items-start">
              <Text className="text-base font-semibold">12:00 PM</Text>
              <Text className="text-sm ">Start</Text>
            </View>
            <View className="items-end">
              <Text className="text-base font-semibold">14:00 PM</Text>
              <Text className="text-sm ">End</Text>
            </View>
          </View>
        </View>
        {/* location */}
        <View className="w-full border border-gray p-4 rounded-xl">
          <Text className="text-base font-bold">Location</Text>
          <Text className="text-base ">Quadrangle</Text>
        </View>
        <View className="w-full border border-gray p-4 rounded-xl">
          <Text className="text-base font-bold mb-2">Members</Text>
          <View className="gap-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-4">
                <ProfileIcon size={"12"} />
                <View>
                  <Text className="text-base">Christine Phung</Text>
                  <Text className="text-XS">@khr1s_</Text>
                </View>
              </View>
              <TouchableOpacity>
                <Feather name="more-horizontal" size={28} color="black" />
              </TouchableOpacity>
            </View>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-4">
                <ProfileIcon size={"12"} />
                <View>
                  <Text className="text-base">Christine Phung</Text>
                  <Text className="text-XS">@khr1s_</Text>
                </View>
              </View>
              <TouchableOpacity>
                <Feather name="more-horizontal" size={28} color="black" />
              </TouchableOpacity>
            </View>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-4">
                <ProfileIcon size={"12"} />
                <View>
                  <Text className="text-base">Christine Phung</Text>
                  <Text className="text-XS">@khr1s_</Text>
                </View>
              </View>
              <TouchableOpacity>
                <Feather name="more-horizontal" size={28} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
