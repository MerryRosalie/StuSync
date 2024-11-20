import { Text, TouchableOpacity, View, Image } from "react-native";
import ModeSwitch from "../../../components/ModeSwitch";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import { useUser } from "../../../src/contexts/UserContext";

export default function Page() {
  const { currentUser, allUsers } = useUser();
  const router = useRouter();

  const formatDate = (memberSince) => {
    const date = new Date(memberSince);
    const newDate = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
    return newDate;
  };

  const circles = [
    { color: "bg-red-500", label: "Circle 1" },
    { color: "bg-blue-500", label: "Circle 2" },
    { color: "bg-blue-500", label: "Circle 3" },
    { color: "bg-yellow-500", label: "Circle 4" },
  ];

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-background p-6 gap-8 items-center">
      <View className="flex-row justify-between  w-full">
        <Text className="font-inter-bold text-xl text-text-default dark:text-dark-text-default">
          Your Profile
        </Text>
        <TouchableOpacity onPress={() => router.replace("/settings")}>
          <Feather
            name="settings"
            size={24}
            className="color-text-default dark:color-dark-text-default"
          />
        </TouchableOpacity>
      </View>
      {/* profile pic */}
      <View className="gap-4 items-center">
        <Image
          source={{
            uri:
              currentUser.profilePicture === ""
                ? "https://avatar.iran.liara.run/public/1"
                : currentUser.profilePicture,
          }}
          className="w-32 h-32 rounded-full"
          resizeMode="cover"
        />
        <View className="items-center">
          <Text className="font-inter-bold text-xl text-text-default dark:text-dark-text-default line-clamp-1 text-ellipsis">
            {currentUser.name}
          </Text>
          <Text className="text-text-default dark:text-dark-text-default line-clamp-1 text-ellipsis">
            @{currentUser.username}
          </Text>
        </View>
        <TouchableOpacity
          className="flex-row rounded-xl bg-purple-default dark:bg-dark-purple-default p-4 gap-2 items-center w-36"
          onPress={() => router.navigate("/settings/editProfile")}
        >
          <Feather
            name="edit-2"
            size={16}
            className="color-background dark:color-dark-background"
          />
          <Text className="font-inter-bold text-background dark:text-dark-background font-inter">
            Edit Profile
          </Text>
        </TouchableOpacity>
      </View>
      <View className="rounded-2xl border bg-text-dimmed/25 dark:bg-dark-text-dimmed/25 border-text-dimmed/40 dark:border-dark-text-dimmed/40 p-4 gap-6 w-full">
        <View>
          <Text className="text-base font-inter-bold text-text-default dark:text-dark-text-default">
            About Me
          </Text>
          <Text className="text-text-default dark:text-dark-text-default">
            {currentUser.profile.aboutMe || "N/A"}
          </Text>
        </View>
        <View>
          <Text className="text-base font-inter-bold mb-2 text-text-default dark:text-dark-text-default">
            Current Courses
          </Text>

          <View className="flex-row gap-2">
            {currentUser.profile.currentCourses.map((course, index) => {
              return (
                <Text
                  className="bg-purple-secondary dark:bg-dark-purple-secondary rounded-full px-4 py-2 text-purple-default dark:text-dark-purple-default font-semibold"
                  key={index}
                >
                  {course}
                </Text>
              );
            })}
          </View>
        </View>
        <View>
          <Text className="text-base font-inter-bold text-text-default dark:text-dark-text-default">
            Member Since
          </Text>
          <Text className="text-text-default dark:text-dark-text-default">
            {formatDate(currentUser.profile.memberSince)}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        className="flex-row justify-between w-full rounded-2xl border bg-text-dimmed/25 dark:bg-dark-text-dimmed/25 border-text-dimmed/40 dark:border-dark-text-dimmed/40 p-4 items-center"
        onPress={() => router.navigate("/friends")}
      >
        <Text className="text-text-default h-8 align-middle dark:text-dark-text-default font-inter-bold">
          Your Friends
        </Text>
        <View className="flex-row">
          <View className="flex-row items-center justify-center">
            {/* Render friends circles */}
            {currentUser.friends.allFriends
              .map((uid) => allUsers[uid])
              .slice(0, 3)
              .map((friend, index) => (
                <Image
                  key={index}
                  source={{ uri: friend.profilePicture }}
                  className="w-8 h-8 object-cover rounded-full border border-background dark:border-dark-background"
                  style={{ resizeMode: "cover" }}
                />
              ))}
          </View>

          <Feather
            name="chevron-right"
            size={24}
            className="color-text-default dark:color-dark-text-default"
          />
        </View>
      </TouchableOpacity>
      {/* <ModeSwitch /> */}
    </SafeAreaView>
  );
}
