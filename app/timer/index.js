// app/pomodoro.js
import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Animated,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import Sheet from "../../components/Sheet";

// TimerSettingsSheet component handles timer duration configuration
const TimerSettingsSheet = ({
  sheetRef,
  onSave,
  initialStudyTime,
  initialBreakTime,
}) => {
  // State for form inputs and validation
  const [studyDuration, setStudyDuration] = useState(String(initialStudyTime));
  const [breakDuration, setBreakDuration] = useState(String(initialBreakTime));
  const [studyError, setStudyError] = useState("");
  const [breakError, setBreakError] = useState("");

  // Memoised form validation
  const isFormValid = useMemo(() => {
    const validateDuration = (text) => {
      const number = parseInt(text);
      if (!text || isNaN(number) || number <= 0 || number > 60) {
        return false;
      }
      return true;
    };
    return validateDuration(studyDuration) && validateDuration(breakDuration);
  }, [studyDuration, breakDuration]);

  // Handler for input changes with validation
  const handleDurationChange = (text, setDuration, setError) => {
    setDuration(text);
    const number = parseInt(text);

    if (!text) {
      setError("Duration is required");
      return;
    }

    if (isNaN(number)) {
      setError("Please enter a valid number");
      return;
    }

    if (number <= 0) {
      setError("Duration must be greater than 0 minutes");
      return;
    }

    if (number > 60) {
      setError("Duration cannot exceed 60 minutes");
      return;
    }

    setError("");
  };

  return (
    <View className="px-2 py-6 gap-6">
      {/* Title */}
      <Text className="text-2xl text-center font-inter-bold text-text-default dark:text-dark-text-default">
        Edit Timer Settings
      </Text>

      {/* Study Duration Input Section */}
      <View className="gap-2">
        <Text className="text-text-default dark:text-dark-text-default">
          Study Duration (1-60 minutes)
        </Text>
        <TextInput
          value={studyDuration}
          onChangeText={(text) =>
            handleDurationChange(text, setStudyDuration, setStudyError)
          }
          placeholder="Enter Input"
          keyboardType="numeric"
          maxLength={2}
          className={`p-4 bg-text-dimmed dark:bg-dark-text-dimmed rounded-lg text-text-default dark:text-dark-text-default border ${
            studyError ? "border-red-500" : "border-transparent"
          }`}
        />
        {/* Error message for study duration */}
        {studyError && (
          <Text className="text-red-500 text-sm">{studyError}</Text>
        )}
      </View>

      {/* Break Duration Input Section */}
      <View className="gap-2">
        <Text className="text-text-default dark:text-dark-text-default">
          Break Duration (1-60 minutes)
        </Text>
        <TextInput
          value={breakDuration}
          onChangeText={(text) =>
            handleDurationChange(text, setBreakDuration, setBreakError)
          }
          placeholder="Enter Input"
          keyboardType="numeric"
          maxLength={2}
          className={`p-4 bg-text-dimmed dark:bg-dark-text-dimmed rounded-lg text-text-default dark:text-dark-text-default border ${
            breakError ? "border-red-500" : "border-transparent"
          }`}
        />
        {/* Error message for break duration */}
        {breakError && (
          <Text className="text-red-500 text-sm">{breakError}</Text>
        )}
      </View>

      {/* Save Button - disabled when form is invalid */}
      <TouchableOpacity
        onPress={() => {
          if (isFormValid) {
            onSave(parseInt(studyDuration), parseInt(breakDuration));
            sheetRef.current?.dismiss();
          }
        }}
        disabled={!isFormValid}
        className={`p-6 rounded-lg ${
          isFormValid
            ? "bg-purple-secondary dark:bg-dark-purple-secondary"
            : "bg-purple-secondary/50 dark:bg-dark-purple-secondary/50"
        }`}
      >
        <Text
          className={`text-center font-inter-bold ${
            isFormValid
              ? "text-purple-default dark:text-dark-purple-default"
              : "text-purple-default/50 dark:text-dark-purple-default/50"
          }`}
        >
          SAVE
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default function Page() {
  const router = useRouter();

  // Timer state
  const [studyMinutes, setStudyMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [timeLeft, setTimeLeft] = useState(studyMinutes * 60);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  // Animation and sheet refs
  const progressAnimation = useRef(new Animated.Value(0)).current;
  const settingsSheetRef = useRef(null);

  // Timer countdown effect
  useEffect(() => {
    let intervalId;
    if (isActive && timeLeft > 0) {
      intervalId = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Switch between study and break periods
      setIsBreak((prev) => !prev);
      setTimeLeft(isBreak ? studyMinutes * 60 : breakMinutes * 60);
      setIsActive(false);
    }
    return () => clearInterval(intervalId);
  }, [isActive, timeLeft, isBreak, studyMinutes, breakMinutes]);

  // Utility function to format time displa
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Timer control handlers
  const toggleTimer = () => {
    setIsActive((prev) => !prev);
  };

  // Function to reset timer
  const resetTimer = () => {
    setIsActive(false);
    if (isBreak) {
      setTimeLeft(breakMinutes * 60);
    } else {
      setTimeLeft(studyMinutes * 60);
    }
  };

  // Handler for saving new timer settings
  const handleTimerSettingsSave = (newStudyMinutes, newBreakMinutes) => {
    setStudyMinutes(newStudyMinutes);
    setBreakMinutes(newBreakMinutes);
    setTimeLeft(isBreak ? newBreakMinutes * 60 : newStudyMinutes * 60);
    setIsActive(false);
  };

  return (
    <SafeAreaView
      className={`flex-1 ${
        isBreak ? "bg-yellow-default" : "bg-purple-default"
      }`}
    >
      <View className="flex-row items-center justify-between mb-3 px-6">
        {/* Header with back button */}
        <TouchableOpacity className="p-4" onPress={() => router.back()}>
          <Feather
            className={`${
              isBreak ? "color-dark-background" : "color-background"
            }`}
            name="chevron-left"
            size={24}
          />
        </TouchableOpacity>
        <Text
          className={`font-inter-bold ${
            isBreak ? "text-dark-background" : "text-background"
          } text-xl`}
        >
          {isBreak ? "Break Time" : "Pomodoro"}
        </Text>
        <TouchableOpacity
          className="p-4"
          onPress={() => settingsSheetRef.current?.present()}
        >
          <Feather
            className={`${
              isBreak ? "color-dark-background" : "color-background"
            }`}
            name="edit-2"
            size={24}
          />
        </TouchableOpacity>
      </View>

      <View className="flex-1 justify-between items-center py-16 px-6">
        {/* Title changes based on timer mode */}
        <Text
          className={`text-2xl ${
            isBreak ? "text-dark-background" : "text-background"
          } mb-8`}
        >
          Time to {isBreak ? "take a break" : "get to work"},{" "}
          {isBreak ? "relax" : "focus"}!
        </Text>

        {/* Timer display */}
        <Text
          className={`text-8xl font-inter-bold ${
            isBreak ? "text-dark-background" : "text-background"
          }`}
        >
          {formatTime(timeLeft)}
        </Text>

        {/* Timer Controls */}
        <View className="flex-row gap-8">
          {/* Reset button */}
          <TouchableOpacity
            onPress={resetTimer}
            className={`p-6 rounded-full ${
              isBreak ? "bg-dark-background/20" : "bg-background/20"
            }`}
          >
            <Feather
              className={`${
                isBreak ? "color-dark-background" : "color-background"
              }`}
              name="rotate-ccw"
              size={28}
            />
          </TouchableOpacity>
          {/* Play/Pause button */}
          <TouchableOpacity
            onPress={toggleTimer}
            className={`p-6 rounded-full ${
              isBreak ? "bg-dark-background" : "bg-yellow-default"
            }`}
          >
            <Feather
              className="color-background"
              name={isActive ? "pause" : "play"}
              size={28}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Settings Sheet Modal */}
      <Sheet ref={settingsSheetRef} noExpand>
        <TimerSettingsSheet
          sheetRef={settingsSheetRef}
          onSave={handleTimerSettingsSave}
          initialStudyTime={studyMinutes}
          initialBreakTime={breakMinutes}
        />
      </Sheet>
    </SafeAreaView>
  );
}
