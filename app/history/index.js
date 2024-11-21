import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TouchableOpacity, View } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { addHours, format } from "date-fns";
import { useUser } from "../../src/contexts/UserContext";
import Friend from "../../components/friends/Friend";

export default function HistoryScreen() {
  const { allUsers } = useUser();
  const { title, time, members: rawMembers, location } = useLocalSearchParams();

  const members = JSON.parse(rawMembers);

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
          {title}
        </Text>
      </View>
      {/* info */}
      <View className="gap-4">
        <View className="w-full border border-text-dimmed dark:border-dark-text-dimmed p-4 rounded-xl">
          <Text className="text-base font-bold text-text-default dark:text-dark-text-default">
            Date
          </Text>
          <Text className="text-base text-text-default dark:text-dark-text-default">
            {format(new Date(time), "eeee, do MMMM yyyy")}
          </Text>
        </View>
        <View className="w-full border border-text-dimmed dark:border-dark-text-dimmed p-4 rounded-xl ">
          <Text className="text-base font-bold text-text-default dark:text-dark-text-default">
            Time
          </Text>
          <View className="flex-row justify-between">
            <View className="items-start">
              <Text className="text-base font-semibold text-text-default dark:text-dark-text-default">
                {format(new Date(time), "p")}
              </Text>
              <Text className="text-sm text-text-default dark:text-dark-text-default ">
                Start
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-base font-semibold text-text-default dark:text-dark-text-default">
                {format(addHours(new Date(time), 2), "p")}
              </Text>
              <Text className="text-sm text-text-default dark:text-dark-text-default">
                End
              </Text>
            </View>
          </View>
        </View>
        {/* location */}
        <View className="w-full border border-text-dimmed dark:border-dark-text-dimmed p-4 rounded-xl">
          <Text className="text-base font-bold text-text-default dark:text-dark-text-default">
            Location
          </Text>
          <Text className="text-base text-text-default dark:text-dark-text-default">
            {location}
          </Text>
        </View>
        <View className="w-full border border-text-dimmed dark:border-dark-text-dimmed p-4 rounded-xl">
          <Text className="text-base font-bold mb-2 text-text-default dark:text-dark-text-default">
            Members
          </Text>
          <View className="gap-4">
            {members
              .map((uid) => allUsers[uid])
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((friend, index) => (
                <Friend key={index} user={friend} />
              ))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
