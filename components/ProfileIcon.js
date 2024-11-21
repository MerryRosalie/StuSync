import React from "react";
import { View, Image } from "react-native";

export default function ProfileIcon({ imgUri, status, size }) {
  return (
    <View className={`relative w-${size} h-${size}`}>
      {/* Profile Icon */}
      <View className="w-full h-full rounded-full overflow-hidden">
        <Image source={{ uri: imgUri }} className="w-full h-full bg-blue-500" />
        {/* <View className="w-full h-full bg-blue-500"></View> */}
      </View>
      {/* Status Indicator */}
      <View
        className={`absolute bottom-0 right-0 w-6 h-6 rounded-full border-2 border-white bg-green`}
      />
    </View>
  );
}
