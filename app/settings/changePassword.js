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
import { useUser } from "../../src/contexts/UserContext";

export default function ChangePasswordScreen() {
  const { currentUser, updateUserPassword } = useUser();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSave = async () => {
    // Verify current password
    if (currentUser.password !== currentPassword) {
      setError("Current password is incorrect");
      return;
    }

    // validate new password
    setError(validatePassword(newPassword, confirmPassword));

    if (error !== "") {
      return;
    }

    try {
      await updateUserPassword(currentPassword, newPassword);
      router.back();
    } catch (error) {
      console.error("Failed to change password:", error);
    }
  };

  // Ensure password is at least 8 characters long, contains at least one uppercase letter, one lowercase letter, one number and matches confirm password
  const validatePassword = (pass, confirm) => {
    if (pass.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/[A-Z]/.test(pass)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/[a-z]/.test(pass)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/[0-9]/.test(pass)) {
      return "Password must contain at least one number";
    }
    if (confirm && pass !== confirm) {
      return "Passwords do not match";
    }
    return "";
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
          Change Password
        </Text>
      </View>
      <View className="justify-between w-full flex-1">
        {/* inputs */}
        <View className="w-full gap-4">
          {/* current password */}
          <View className="gap-2">
            <Text className="text-base font-semibold  text-text-default dark:text-dark-text-default">
              Current Password
            </Text>
            <TextInput
              className={`${
                error ? "border-red-500" : "border border-gray"
              } border border-gray rounded-xl items-center p-4 text-text-default dark:text-dark-text-default`}
              placeholder="Enter current password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              onChangeText={(e) => {
                setCurrentPassword(e);
              }}
              value={currentPassword}
            />
          </View>

          {/* new password */}
          <View className="gap-2">
            <Text className="text-base font-semibold  text-text-default dark:text-dark-text-default">
              New Password
            </Text>
            <TextInput
              className={`${
                error ? "border-red-500" : "border border-gray"
              } border border-gray rounded-xl items-center p-4 text-text-default dark:text-dark-text-default`}
              placeholder="Enter new password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              onChangeText={(e) => {
                setNewPassword(e);
              }}
              value={newPassword}
            />
          </View>
          {/* confirm password */}
          <View className="gap-2">
            <Text className="text-base font-semibold text-text-default dark:text-dark-text-default">
              Confirm New Password
            </Text>
            <TextInput
              className={`${
                error ? "border-red-500" : "border border-gray"
              } border border-gray rounded-xl items-center p-4 text-text-default dark:text-dark-text-default`}
              placeholder="Confirm new password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              onChangeText={(e) => {
                setConfirmPassword(e);
              }}
              value={confirmPassword}
            />
          </View>
          {error !== "" && <Text className="text-red-500">{error}</Text>}
        </View>
        <Button text="SAVE CHANGES" handleOnPress={handleSave} />
      </View>
    </SafeAreaView>
  );
}
