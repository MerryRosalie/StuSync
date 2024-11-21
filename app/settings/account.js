import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TouchableOpacity, View } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import React from "react";
import { useUser } from "../../src/contexts/UserContext";

export default function AccountScreen() {
  const { removeUser, currentUser } = useUser();

  const handleDeleteAccount = async () => {
    try {
      await removeUser(currentUser.uid);
      router.replace("/auth/login");
    } catch (error) {
      console.error("Error removing user:", error);
    }
  };

  const router = useRouter();
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
          Account
        </Text>
      </View>
      <View className="justify-between w-full rounded-2xl border bg-text-dimmed/25 dark:bg-dark-text-dimmed/25 border-text-dimmed/40 dark:border-dark-text-dimmed/40">
        <TouchableOpacity
          className="w-full flex-row rounded-2xl items-center justify-between p-4"
          onPress={() => router.replace("/settings/updateEmail")}
        >
          <View className="gap-4 flex-row items-center">
            <Feather name="mail" size={24} className="dark:text-white" />
            <Text className="text-base font-semibold dark:text-white">
              Update Email
            </Text>
          </View>
          <Feather name="chevron-right" size={24} className="dark:text-white" />
        </TouchableOpacity>
        <View className="border-b border-gray mx-4 gap-2 dark:border-dark-text-dimmed" />
        <TouchableOpacity
          className="w-full flex-row rounded-2xl items-center justify-between p-4"
          onPress={() => router.replace("/settings/changePassword")}
        >
          <View className="gap-4 flex-row items-center">
            <Feather name="key" size={24} className="dark:text-white" />
            <Text className="text-base font-semibold dark:text-white">
              Change Password
            </Text>
          </View>
          <Feather name="chevron-right" size={24} className="dark:text-white" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        className="flex-row p-4 items-center w-full rounded-2xl border bg-text-dimmed/25 dark:bg-dark-text-dimmed/25 border-text-dimmed/40 dark:border-dark-text-dimmed/40"
        onPress={handleDeleteAccount}
      >
        <Feather name="trash-2" size={24} color="#FF8F85" />
        <Text className="ml-4 text-base text-[#FF8F85] font-semibold ">
          Delete Account
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
