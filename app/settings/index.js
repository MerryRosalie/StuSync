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
import RadioButtons from "../../components/RadioButtons";
import { useNavigation } from "@react-navigation/native";

export default function SettingsScreen() {
  const [privacy, setPrivacy] = React.useState("Friends only");
  const options = ["Friends only", "Friends and course mates"];
  const router = useRouter();

  const navigation = useNavigation();

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-background p-6 gap-8 items-center">
      {/* Header */}
      <View className="w-full flex-row items-center justify-center relative mb-3">
        <TouchableOpacity
          className="absolute left-0 pl-0 p-4"
          onPress={() => navigation.navigate("profile")}
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
      <View className="w-full border border-gray rounded-2xl justify-between p-4">
        {/* heading */}
        <View className="flex-row gap-2 items-center">
          <Feather name="eye" size={24} color="black" />
          <Text className="text-base font-semibold justify-between">
            Privacy
          </Text>
        </View>
        {/* radio buttons */}
        <RadioButtons
          options={options}
          selectedValue={privacy}
          onValueChange={setPrivacy}
        />
      </View>
      {/* manage account */}
      <TouchableOpacity
        className="w-full flex-row border border-gray rounded-2xl items-center justify-between p-4"
        onPress={() => navigation.navigate("account")}
      >
        <View className="gap-4 flex-row items-center">
          <Feather name="user" size={24} color="black" />
          <Text className="text-base font-semibold">Manage Account</Text>
        </View>
        <Feather name="chevron-right" size={24} color="black" />
      </TouchableOpacity>
      {/* logout */}
      <TouchableOpacity className="w-full flex-row border border-alert-text rounded-2xl items-center p-4">
        <Feather name="log-out" size={24} color="#FF8F85" />
        <Text className="ml-4 text-base text-alert-text font-semibold">
          Logout
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
