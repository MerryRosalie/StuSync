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
import Button from "../../components/Button";

export default function updateEmail() {
  const [newEmail, setNewEmail] = useState("");
  const [error, setError] = useState(false);

  const router = useRouter();

  const navigation = useNavigation();

  const validEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return false;
    }
    return true;
  };

  const handleSave = () => {
    // validate the new email
    if (!validEmail(newEmail)) {
      setError(true);
      // TODO: add it to the database
    } else {
      setError(false);
      navigation.navigate("account");
    }
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
          Update Email
        </Text>
      </View>
      <View className="justify-between w-full flex-1">
        <View className="gap-2 w-full">
          <Text className="text-base font-semibold">Email</Text>
          <TextInput
            className={`${
              error ? "border-red-500 border-2" : "border border-gray"
            } border border-gray rounded-xl items-center p-4`}
            placeholder="Email"
            onChangeText={(e) => {
              setNewEmail(e);
            }}
            value={newEmail}
          />
          {error && (
            <Text className="text-red-500">
              Please enter a valid email address
            </Text>
          )}
        </View>

        <Button text="SAVE CHANGES" handleOnPress={handleSave} />
      </View>
    </SafeAreaView>
  );
}
