import React, { useRef, useState, useEffect } from "react";
import { View, Text, Pressable, TouchableOpacity, Alert } from "react-native";
import { Audio } from "expo-av";
import Feather from "@expo/vector-icons/Feather";

export default function VoiceRecorder({ onRecordingComplete }) {
  // State for managing recording status and duration
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recording, setRecording] = useState(null);

  // Reference for the duration timer
  const timerRef = useRef(null);

  // Initialise and start recording
  const startRecording = async () => {
    try {
      // Request permissions and configure audio
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Create new recording instance
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
      setIsRecording(true);

      // Start duration timer
      timerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      Alert.alert("Failed to start recording. Try again later.");
    }
  };

  // Stop recording and get the recorded audio URI
  const stopRecording = async () => {
    if (!recording) return;

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      clearInterval(timerRef.current);
      setIsRecording(false);
      setRecordingDuration(0);
      if (onRecordingComplete) onRecordingComplete(uri);
    } catch (error) {
      Alert.alert("Failed to stop recording. Try again later.");
    }
  };

  // Convert seconds to MM:SS format
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Cleanup timer on component unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <>
      {/* Recording button */}
      <TouchableOpacity
        onLongPress={startRecording}
        onPressOut={stopRecording}
        className="p-4 bg-purple-default dark:bg-dark-purple-default rounded-full"
      >
        <Feather
          className="color-background dark:color-dark-background"
          name="mic"
          size={24}
        />
      </TouchableOpacity>

      {/* Recording interface */}
      {isRecording && (
        <View className="absolute left-0 right-0 bottom-0 flex-row items-center bg-text-dimmed dark:bg-dark-text-dimmed p-6 mx-6 rounded-full">
          <View className="flex-row w-full items-center justify-between">
            <View className="flex-row items-center">
              <View className="w-2 h-2 rounded-full bg-failure-text animate-pulse mr-2" />
              <Text className="text-text-default dark:text-dark-text-default">
                {formatDuration(recordingDuration)}
              </Text>
            </View>
            <TouchableOpacity
              onPress={stopRecording}
              className="flex-row items-center gap-2"
            >
              <Feather
                name="stop-circle"
                size={24}
                className="color-failure-text dark:color-dark-alert-text"
              />
              <Text className="text-failure-text dark:text-dark-alert-text">
                STOP
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
}
