import { Text, TouchableOpacity, ScrollView, View, Image } from "react-native";
import ModeSwitch from "../../../components/ModeSwitch";
import { SafeAreaView } from "react-native-safe-area-context";
import PreviousStudySessCard from "../../../components/PreviousStudySessCard";
import Feather from "@expo/vector-icons/Feather";
import ProfileIcon from "../../../components/ProfileIcon";
import { useRouter } from "expo-router";
import { Link } from "expo-router";
import glasses from "../../../assets/glasses.png";
import girl from "../../../assets/girl.png";
import { useSession } from "../../../src/contexts/SessionContext";
import { useUser } from "../../../src/contexts/UserContext";
import { useState, useEffect } from "react";
export default function Page() {
  const router = useRouter();
  const { activeSession } = useSession();
  const { currentUser, allUsers } = useUser();

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-background px-6 py-10 gap-[6%]">
      <View>
        <View className="mb-5">
          <Text className="text-left text-lg font-medium text-text-default dark:text-dark-text-default">
            Welcome back
          </Text>
          <Text className="text-left text-2xl font-semibold text-text-default dark:text-dark-text-default">
            {currentUser.name}
          </Text>
        </View>
        {/* active study sess */}
        {activeSession ? (
          <TouchableOpacity
            className="bg-purple-default w-full h-40 rounded-2xl p-4 items-end justify-between overflow-hidden"
            onPress={() => router.push("chat")}
          >
            <Image
              source={glasses}
              className="w-1/2 h-3/4 bg-bottom bottom-2 absolute"
              resizeMode="contain"
            />
            <View className="absolute justify-between h-full left-4 top-4">
              <View className="flex-row w-full justify-between items-top">
                <View className="w-1/2">
                  <Text className="text-white font-semibold text-base">
                    {activeSession.sessionName || "Study Session"}
                  </Text>
                  <Text className="text-white text-base">
                    {activeSession.location || ""}
                  </Text>
                </View>
                {/* top right info */}
                <View className="gap-2 items-top h-7 flex-row">
                  {/* study session status */}
                  <View className="bg-white flex-row items-center px-3 py-1 rounded-full">
                    <View className="w-4 h-4 bg-green rounded-full mr-2" />
                    <Text className="text-black text-sm">Studying</Text>
                  </View>
                  <Feather
                    name="arrow-up-right"
                    size={24}
                    className="bg-white rounded-full text-purple-default"
                  />
                </View>
              </View>
              <Text className="text-white font-semibold text-2xl">
                {`${activeSession.date} ${activeSession.time}`}
              </Text>
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            className="bg-purple-secondary w-full h-40 rounded-2xl p-4 justify-center gap-4 overflow-hidden"
            onPress={() => router.push("main/alert")}
          >
            <Image
              source={girl}
              className="h-full w-[100%] absolute right-[-25%] mix-blend-luminosity"
              resizeMode="contain"
            />
            <View className="w-3/5">
              <Text className="text-purple-default font-semibold text-2xl">
                Start Studying Now!
              </Text>
              <View className="bg-white mt-4 px-4 py-2 justify-center items-center gap-4 rounded-xl flex-row">
                <Text className="text-sm text-purple-default">
                  Check Notifications
                </Text>
                <Feather
                  name="arrow-right"
                  size={24}
                  className="text-purple-default"
                />
              </View>
            </View>
          </TouchableOpacity>
        )}
      </View>

      <View className="gap-6">
        <TouchableOpacity
          className="flex-row justify-between"
          onPress={() => router.push("friends")}
        >
          <Text className="text-left text-xl font-semibold text-text-default dark:text-dark-text-default">
            Your Friends
          </Text>
          <View className="flex-row items-center">
            <Text className="text-left text-base text-green">
              {`(${currentUser.friends.allFriends.length})`}
            </Text>
            <Feather
              name="chevron-right"
              size={24}
              className="text-text-default dark:text-dark-text-default"
            />
          </View>
        </TouchableOpacity>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className=""
        >
          <View className="gap-8 flex-row">
            {currentUser.friends.allFriends.map((friendId, index) => {
              const friend = allUsers[friendId];
              if (!friend) return null;

              return (
                <View className="items-center gap-2" key={index}>
                  <ProfileIcon imgUri={friend.profilePicture} size={"20"} />
                  <Text className="text-text-default dark:text-dark-text-default">
                    {friend.username}
                  </Text>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>
      {/* past study sessions */}
      <View className="gap-3">
        <TouchableOpacity
          className="flex-row justify-between"
          onPress={() => router.push("/history/overview")}
        >
          <Text className="text-left text-xl font-semibold text-text-default dark:text-dark-text-default mb-3">
            Past Study Sessions
          </Text>
          <Feather
            name="chevron-right"
            size={24}
            className="text-text-default dark:text-dark-text-default"
          />
        </TouchableOpacity>

        {currentUser.studySessions?.filter((session) => !session.active)
          .length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="gap-3 flex-row">
              {currentUser.studySessions
                .filter((session) => !session.active)
                .map((session, index) => (
                  <PreviousStudySessCard key={index} session={session} />
                ))}
            </View>
          </ScrollView>
        ) : (
          <View className="bg-purple-secondary dark:bg-dark-purple-secondary rounded-2xl p-6 items-center">
            <View className="items-center gap-2 mb-4">
              <Feather
                name="book-open"
                size={32}
                className="text-purple-default dark:text-dark-purple-default"
              />
              <Text className="text-lg font-semibold text-purple-default dark:text-dark-purple-default text-center">
                No Study Sessions Yet
              </Text>
            </View>
            <Text className="text-sm text-text-default dark:text-dark-text-default text-center mb-4">
              Join study sessions with your friends to improve together and
              track your progress!
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
