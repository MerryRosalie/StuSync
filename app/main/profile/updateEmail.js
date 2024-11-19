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
import ModeSwitch from "../../../components/ModeSwitch";

export default function Settingscreen() {
  return (
    <>
      <ModeSwitch />
    </>
  );
}
