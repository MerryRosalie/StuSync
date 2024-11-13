import React from "react";
import { View, Image } from "react-native";

export default function ProfileIcon({ imgUri, status }) {
  return (
    <View className="relative w-20 h-20">
      {/* Profile Icon */}
      <View className="w-full h-full rounded-full overflow-hidden">
        {/* <Image source={{ uri: imageUri }} className="w-full h-full" /> */}
        <View className="w-full h-full bg-blue-500"></View>
      </View>
      {/* Status Indicator */}
      <View
        className={`absolute bottom-0 right-0 w-6 h-6 rounded-full border-2 border-white bg-red-500`}
      />
    </View>
  );
}
