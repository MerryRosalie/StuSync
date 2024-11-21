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

  const [pastSessions, setPastSessions] = useState([]);
  // console.log(currentUser);
  useEffect(() => {
    // if its not null
    // console.log(currentUser.studySessions.filter((session) => !session.active));
    // console.log(currentUser);
  }, []);
  console.log(activeSession);
  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-background p-6 justify-around pb-32">
      <View>
        <Text className="text-left text-lg font-medium text-text-default dark:text-dark-text-default">
          Welcome back
        </Text>
        <Text className="text-left text-2xl font-semibold text-text-default dark:text-dark-text-default">
          {currentUser.name}
        </Text>
      </View>
      {/* active study sess */}
      {activeSession !== null && (
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
                  COMP1511 studymaxxing!!
                </Text>
                <Text className="text-white text-base">QUADG035</Text>
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
              13 DEC 12PM
            </Text>
          </View>
        </TouchableOpacity>
      )}
      {/* inactive */}
      {activeSession === null && (
        <TouchableOpacity
          className="bg-purple-secondary w-full h-40 rounded-2xl p-4 justify-center gap-4 overflow-hidden"
          onPress={() => router.navigate("alert")}
        >
          <Image
            source={girl}
            className="h-full w-[100%] absolute right-[-25%] mix-blend-luminosity"
            resizeMode="contain"
          />
          <View className="w-3/5">
            <Text className="text-purple-default font-semibold text-2xl">
              Start studying now!!
            </Text>
            <View className="bg-white px-4 py-2 items-center gap-4 rounded-xl flex-row">
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
      <View className="gap-6">
        <TouchableOpacity
          className="flex-row justify-between"
          onPress={() => router.push("friends")}
        >
          <Text className="text-left text-xl font-semibold text-text-default dark:text-dark-text-default">{`Friends`}</Text>
          <View className="flex-row items-center">
            <Text className="text-left text-base text-green">{`(5)`}</Text>
            <Feather
              name="chevron-right"
              size={24}
              className="text-text-default dark:text-dark-text-default"
            />
          </View>
        </TouchableOpacity>
        <ScrollView horizontal>
          <View className="gap-8 flex-row">
            {currentUser.friends.allFriends
              .map((uid) => allUsers[uid])
              .map((friend, index) => {
                console.log(friend);
                const pfp =
                  friend.profilePicture === ""
                    ? "https://avatar.iran.liara.run/public/1"
                    : friend.profilePicture;
                return (
                  <View className="items-center gap-2" key={index}>
                    <ProfileIcon size={"20"} imgUri={pfp} />
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
          onPress={() => router.navigate("/history/overview")}
        >
          <Text className="text-left text-xl font-semibold text-text-default dark:text-dark-text-default">
            Past Study Sessions
          </Text>
          <Feather
            name="chevron-right"
            size={24}
            className="text-text-default dark:text-dark-text-default"
          />
        </TouchableOpacity>
        <ScrollView horizontal>
          <View className="gap-3 flex-row">
            {currentUser.studySessions
              .filter((session) => !session.active)
              .map((session, index) => {
                return (
                  <PreviousStudySessCard
                    key={index}
                    title={session.name}
                    time={session.date}
                    members={session.members}
                  />
                );
              })}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
