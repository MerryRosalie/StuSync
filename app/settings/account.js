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
import { useNavigation } from "@react-navigation/native";

export default function AccountScreen() {
  const router = useRouter();

  const navigation = useNavigation();
  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-background p-6 gap-8 items-center">
      {/* Header */}
      <View className="w-full flex-row items-center justify-center relative mb-3">
        <TouchableOpacity
          className="absolute left-0 pl-0 p-4"
          onPress={() => navigation.navigate("index")}
        >
          <Feather
            className="color-text-default dark:color-dark-text-default"
            name="chevron-left"
            size={24}
          />
        </TouchableOpacity>
        <Text className="font-inter-bold text-text-default dark:text-dark-text-default">
          Account
        </Text>
      </View>
      <View className="w-full border border-gray rounded-2xl justify-between">
        <TouchableOpacity
          className="w-full flex-row rounded-2xl items-center justify-between p-4"
          onPress={() => navigation.navigate("updateEmail")}
        >
          <View className="gap-4 flex-row items-center">
            <Feather name="mail" size={24} color="black" />
            <Text className="text-base font-semibold">Update Email</Text>
          </View>
          <Feather name="chevron-right" size={24} color="black" />
        </TouchableOpacity>
        <View className="border-b border-gray mx-4 gap-2" />
        <TouchableOpacity
          className="w-full flex-row rounded-2xl items-center justify-between p-4"
          onPress={() => navigation.navigate("changePassword")}
        >
          <View className="gap-4 flex-row items-center">
            <Feather name="key" size={24} color="black" />
            <Text className="text-base font-semibold">Change Password</Text>
          </View>
          <Feather name="chevron-right" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity className="w-full flex-row border border-alert-text rounded-2xl items-center p-4">
        <Feather name="log-out" size={24} color="#FF8F85" />
        <Text className="ml-4 text-base text-alert-text font-semibold">
          Delete Account
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
