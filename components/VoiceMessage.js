import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Audio } from "expo-av";
import Feather from "@expo/vector-icons/Feather";

const VoiceMessage = ({ uri, mode }) => {
  // States for audio playback
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);

  // Initialise audio on component mount
  useEffect(() => {
    setupAudio();
    return () => {
      // Cleanup to unload audio when component unmounts
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  // Configure audio settings and load the sound file
  const setupAudio = async () => {
    try {
      // Configure audio mode for optimal playback
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true, // Lower volume of other apps' audio
        playThroughEarpieceAndroid: false,
      });

      await loadSound();
    } catch (error) {
      Alert.alert("Error in setting up audio. Try again later.");
    }
  };

  // Load the audio file from the provided URI
  const loadSound = async () => {
    try {
      const soundObject = new Audio.Sound();
      await soundObject.loadAsync({ uri });
      setSound(soundObject);

      // Get and set initial duration
      const status = await soundObject.getStatusAsync();
      if (status.isLoaded) {
        setDuration(status.durationMillis / 1000); // Convert milliseconds to seconds
      }
    } catch (error) {
      Alert.alert("Error in loading audio. Try again later.");
    }
  };

  // Reset playback to beginning
  const resetPlayback = async () => {
    try {
      if (sound) {
        await sound.stopAsync();
        await sound.setPositionAsync(0);
        setPosition(0);
        setIsPlaying(false);
      }
    } catch (error) {
      Alert.alert("Error in resetting playback. Try again later.");
    }
  };

  // Callback function for tracking playback status
  const onPlaybackStatusUpdate = async (status) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis / 1000);
      setDuration(status.durationMillis / 1000);
      setIsPlaying(status.isPlaying);

      // Reset when playback finishes
      if (status.didJustFinish) {
        await resetPlayback();
      }
    }
  };

  // Handle play/pause button press
  const handlePlayPause = async () => {
    try {
      if (!sound) {
        return;
      }

      const status = await sound.getStatusAsync();

      if (status.isPlaying) {
        // If playing, pause the audio
        await sound.pauseAsync();
        setIsPlaying(false);
      } else {
        // If paused or stopped, start playing
        if (status.positionMillis === status.durationMillis) {
          // If at the end, reset to beginning
          await sound.setPositionAsync(0);
          setPosition(0);
        }
        // Set up status monitoring and start playback
        await sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
        await sound.playAsync();
        setIsPlaying(true);
      }
    } catch (error) {
      Alert.alert("Error in playing or pausing. Try again later.");
    }
  };

  // Convert seconds to MM:SS format
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Calculate progress percentage for progress bar
  const progressPercentage = (position / duration) * 100 || 0;

  return (
    <View className="flex-row items-center gap-3">
      {/* Play/Pause button */}
      <TouchableOpacity
        onPress={handlePlayPause}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        className={`p-3 rounded-full ${
          mode === "sender"
            ? "bg-text-default/15 dark:bg-dark-text-default/15"
            : "bg-purple-secondary/25 dark:bg-dark-purple-secondary/25"
        }`}
      >
        <Feather
          name={isPlaying ? "pause" : "play"}
          size={16}
          className="color-text-default dark:color-dark-text-default"
        />
      </TouchableOpacity>

      {/* Progress bar container */}
      <View className="w-40 h-2 rounded-full bg-white/25">
        {/* Progress bar fill */}
        <View
          className="absolute left-0 top-0 bottom-0 rounded-full opacity-65 bg-white"
          style={{
            width: `${progressPercentage}%`,
          }}
        />
      </View>

      {/* Duration/Position display */}
      <Text className="text-text-default dark:text-dark-text-default">
        {formatTime(isPlaying ? position : duration || 0)}
      </Text>
    </View>
  );
};

export default VoiceMessage;
