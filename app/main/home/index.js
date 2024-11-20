import { Text, TouchableOpacity, ScrollView, View } from "react-native";
import ModeSwitch from "../../../components/ModeSwitch";
import { SafeAreaView } from "react-native-safe-area-context";
import PreviousStudySessCard from "../../../components/PreviousStudySessCard";
import Feather from "@expo/vector-icons/Feather";
import ProfileIcon from "../../../components/ProfileIcon";
import { useNavigation } from "@react-navigation/native";
import { Link } from "expo-router";

export default function Page() {
  const navigation = useNavigation();

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
        className="bg-purple-default w-full h-40 rounded-2xl p-4 justify-between"
        onPress={() => router.navigate("chat")}
      >
        <View>
          <Text className="text-white font-semibold text-base">
            COMP1511 studymaxxing!!
          </Text>
          <Text className="text-white text-base">QUADG035</Text>
        </View>
        <Text className="text-white font-semibold text-2xl">13 DEC 12PM</Text>
      </TouchableOpacity>
      <View className="gap-6">
        <TouchableOpacity
          className="flex-row justify-between"
          onPress={() => router.navigate("friends")}
        >
          <Text className="text-left text-xl font-semibold">{`Friends On Campus! (7)`}</Text>
          <Feather name="chevron-right" size={24} color="black" />
        </TouchableOpacity>
        <ScrollView horizontal>
          <View className="gap-6 flex-row">
            <ProfileIcon />
            <ProfileIcon />
            <ProfileIcon />
            <ProfileIcon />
            <ProfileIcon />
            <ProfileIcon />
          </View>
        </ScrollView>
      </View>
      {/* past study sessions */}
      <View className="gap-3">
        <TouchableOpacity className="flex-row justify-between">
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
    </SafeAreaView>
  );
}
