import { Text, TouchableOpacity, View } from "react-native";
import ModeSwitch from "../../../components/ModeSwitch";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";

export default function Page() {
  const navigation = useNavigation();

  const circles = [
    { color: "bg-red-500", label: "Circle 1" },
    { color: "bg-blue-500", label: "Circle 2" },
    { color: "bg-blue-500", label: "Circle 3" },
    { color: "bg-yellow-500", label: "Circle 4" },
  ];
  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-background p-6 gap-8 items-center">
      <View className="flex-row justify-between  w-full">
        <Text className="font-inter-bold text-xl dark:text-dark-purple-default">
          Profile
        </Text>
        <TouchableOpacity>
          <Feather name="settings" size={24} color="black" />
        </TouchableOpacity>
      </View>
      {/* profile pic */}
      <View className="gap-4 items-center">
        <View className="w-32 h-32 bg-cyan-500 rounded-full"></View>
        <View className="gap-2 items-center">
          <Text className="font-semibold text-xl ">Christine Phung</Text>
          <Text className="text-sm">@khr1s_</Text>
        </View>
        <TouchableOpacity className="flex-row rounded-xl bg-purple-default p-4 gap-2 items-center w-36">
          <Feather name="edit-2" size={24} color="white" />
          <Text className="text-base text-white font-inter">Edit Profile</Text>
        </TouchableOpacity>
      </View>
      <View className="rounded-2xl bg-gray p-4 gap-4 w-full">
        <View>
          <Text className="text-base font-bold">About Me</Text>
          <Text>i love studying</Text>
        </View>
        <View>
          <Text className="text-base font-bold mb-1">Current Courses</Text>
          <View className="flex-row gap-2">
            <Text className="bg-purple-secondary rounded-full px-4 py-2 text-purple-default text-base font-semibold w-28">
              COMP6991
            </Text>
            <Text className="bg-purple-secondary rounded-full px-4 py-2 text-purple-default text-base font-semibold w-28">
              COMP4511
            </Text>
          </View>
        </View>
        <View>
          <Text className="text-base font-bold">Member Since</Text>
          <Text>Jan 1, 2024</Text>
        </View>
      </View>
      <TouchableOpacity
        className="flex-row justify-between w-full rounded-[20px] border-2 border-gray p-4 items-center"
        onPress={() => navigation.navigate("friends")}
      >
        <Text className="text-base font-bold">Your Friends</Text>
        <View className="flex-row">
          <View className="flex-row items-center justify-center">
            {/* Render circles without absolute positioning */}
            {circles.map((circle, index) => (
              <View
                key={index}
                className={`${circle.color} w-8 h-8 rounded-full border-2 border-white`}
                style={{
                  marginLeft: index > 0 ? -10 : 0, // Offset to overlap slightly
                }}
              />
            ))}
          </View>

          <Feather name="chevron-right" size={24} color="black" />
        </View>
      </TouchableOpacity>
      {/* <ModeSwitch /> */}
    </SafeAreaView>
  );
}
