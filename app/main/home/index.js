import { Text, TouchableOpacity, ScrollView, View, Image } from "react-native";
import ModeSwitch from "../../../components/ModeSwitch";
import { SafeAreaView } from "react-native-safe-area-context";
import PreviousStudySessCard from "../../../components/PreviousStudySessCard";
import Feather from "@expo/vector-icons/Feather";
import ProfileIcon from "../../../components/ProfileIcon";
// import { useNavigation } from "@react-navigation/native";
import { Link, useRouter } from "expo-router";
import glasses from "../../../assets/glasses.png";
import girl from "../../../assets/girl.png";

export default function Page() {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-background p-6 justify-around pb-32">
      {/* <Text className="font-inter-bold text-xl text-purple-default dark:text-dark-purple-default">
        Home Page
      </Text>

      <ModeSwitch /> */}
      <View>
        <Text className="text-left text-lg font-medium">Welcome back👋🏻</Text>
        <Text className="text-left text-2xl font-semibold">Username</Text>
      </View>
      {/* active study sess */}
      <TouchableOpacity
        className="bg-purple-default w-full h-40 rounded-2xl p-4 justify-between overflow-hidden"
        onPress={() => router.navigate("chat")}
      >
        <Image
          source={glasses}
          className="h-5/6 w-[100%] absolute right-[-20%] top-10"
          resizeMode="contain"
        />
        <View className="absolute justify-between h-full left-4 top-4">
          <View>
            <Text className="text-white font-semibold text-base">
              COMP1511 studymaxxing!!
            </Text>
            <Text className="text-white text-base">QUADG</Text>
          </View>
          <Text className="text-white font-semibold text-2xl">13 DEC 12PM</Text>
        </View>
      </TouchableOpacity>
      {/* inactive */}
      {/* <TouchableOpacity
        className="bg-purple-secondary w-full h-40 rounded-2xl p-4 justify-center gap-4 overflow-hidden"
        onPress={() => router.navigate("alert")}
      >
        <Image
          source={girl}
          className="h-full w-[100%] absolute right-[-20%]"
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
      </TouchableOpacity> */}
      <View className="gap-6">
        <TouchableOpacity
          className="flex-row justify-between"
          onPress={() => navigation.navigate("friends")}
        >
          <Text className="text-left text-xl font-semibold">{`Friends On Campus! (7)`}</Text>
          <Feather name="chevron-right" size={24} color="black" />
        </TouchableOpacity>
        <ScrollView horizontal>
          <View className="gap-6 flex-row">
            <ProfileIcon size={"20"} />
            <ProfileIcon size={"20"} />
            <ProfileIcon size={"20"} />
            <ProfileIcon size={"20"} />
            <ProfileIcon size={"20"} />
          </View>
        </ScrollView>
      </View>
      {/* past study sessions */}
      <View className="gap-3">
        <TouchableOpacity
          className="flex-row justify-between"
          onPress={() => router.navigate("/history/overview")}
        >
          <Text className="text-left text-xl font-semibold">
            Past Study Sessions
          </Text>
          <Feather name="chevron-right" size={24} color="black" />
        </TouchableOpacity>
        <ScrollView horizontal>
          <View className="gap-3 flex-row">
            <PreviousStudySessCard
              title={"COMP1511 grind"}
              time={"13 DEC 2PM"}
            />
            <PreviousStudySessCard
              title={"COMP1511 grind"}
              time={"13 DEC 2PM"}
            />
            <PreviousStudySessCard
              title={"COMP1511 grind"}
              time={"13 DEC 2PM"}
            />
          </View>
        </ScrollView>
      </View>
      <Link
        className="text-text-default dark:text-dark-text-default"
        href="/auth/login"
      >
        Go to Signin
      </Link>
      <Link
        className="text-text-default dark:text-dark-text-default"
        href="/timer"
      >
        Go to Timer
      </Link>
      <Link
        className="text-text-default dark:text-dark-text-default"
        href="/history"
      >
        Go to History
      </Link>
    </SafeAreaView>
  );
}
