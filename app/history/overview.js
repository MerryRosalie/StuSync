import { SafeAreaView } from "react-native-safe-area-context";
import {
  Text,
  TouchableOpacity,
  ScrollView,
  View,
  TextInput,
  Image,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { useUser } from "../../src/contexts/UserContext";
import { format, addHours } from "date-fns";

export default function OverviewScreen() {
  const { currentUser, allUsers } = useUser();
  const router = useRouter();

  //   const circles = [
  //     { color: "bg-red-500", label: "Circle 1" },
  //     { color: "bg-blue-500", label: "Circle 2" },
  //     { color: "bg-blue-500", label: "Circle 3" },
  //     { color: "bg-yellow-500", label: "Circle 4" },
  //   ];

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-background p-6 gap-8 items-center">
      {/* Header */}
      <View className="w-full flex-row items-center justify-center relative mb-3">
        <TouchableOpacity
          className="absolute left-0 pl-0 p-4"
          onPress={() => router.push("/main/home")}
        >
          <Feather
            className="color-text-default dark:color-dark-text-default"
            name="chevron-left"
            size={24}
          />
        </TouchableOpacity>
        <Text className="font-inter-bold text-text-default dark:text-dark-text-default">
          Past Study Sessions
        </Text>
      </View>
      <View className="gap-4">
        {currentUser?.studySessions
          .filter((session) => !session?.active)
          .map((session, index) => (
            <TouchableOpacity
              key={index}
              className="rounded-xl bg-background dark:bg-dark-background border border-dark-background/10 dark:border-background/10 my-1 py-6 px-4 w-full"
              onPress={() => {
                router.navigate({
                  pathname: "/history",
                  params: {
                    title: session.name,
                    time: session.date,
                    members: JSON.stringify(session.members),
                    location: session.location,
                  },
                });
              }}
              style={{
                elevation: 2,
                shadowOffset: { width: 0, height: 2 },
                shadowRadius: 100,
              }}
            >
              <View className="w-full flex-row items-center gap-4">
                <View className="flex-1">
                  <Text className="text-lg font-medium text-text-default dark:text-dark-text-default">
                    {session?.name}
                  </Text>
                  <Text className=" text-text-default dark:text-dark-text-default opacity-50">
                    {format(session?.date, "eeee do MMMM yyyy, p")}
                    {" - "}
                    {format(addHours(session?.date, 2), "p")}
                  </Text>
                </View>
                <View className="flex-row items-center justify-center">
                  {/* Render friends circles */}
                  {session?.members
                    .map((uid) => allUsers[uid])
                    .slice(0, 3)
                    .map((friend, index) => (
                      <Image
                        key={index}
                        source={{ uri: friend.profilePicture }}
                        className="w-8 h-8 object-cover rounded-full border border-background dark:border-dark-background -mx-1"
                        style={{ resizeMode: "cover" }}
                      />
                    ))}
                </View>
              </View>
            </TouchableOpacity>
          ))}
      </View>
    </SafeAreaView>
  );
}
