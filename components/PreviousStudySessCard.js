import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import {
  Switch,
  TouchableOpacity,
  Text,
  View,
  Pressable,
  Image,
} from "react-native";
import { useUser } from "../src/contexts/UserContext";

export default function PreviousStudySessCard({ session }) {
  const { allUsers } = useUser();

  const { name: title, date: time, members, location } = session;

  // Format the date string
  const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    if (isNaN(date)) return dateString;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <TouchableOpacity
      className="w-52 h-36 my-2 bg-background dark:bg-dark-background border border-dark-background/10 dark:border-background/10 shadow-dark-background dark:shadow-background rounded-[12] gap-1 p-4 justify-between"
      onPress={() => {
        router.navigate({
          pathname: "/history",
          params: { title, time, members: JSON.stringify(members), location },
        });
      }}
      style={{
        elevation: 2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 100,
      }}
    >
      <View>
        <Text className="text-sm text-text-default dark:text-dark-text-default">
          {formatDate(time)}
        </Text>
        <Text className="font-semibold text-base text-text-default dark:text-dark-text-default">
          {title}
        </Text>
      </View>
      <View className="flex-row items-center justify-center relative h-8">
        {members
          .map((uid) => allUsers[uid])
          .slice(0, 4)
          .map((member, index) => (
            <Image
              key={index}
              source={{ uri: member.profilePicture }}
              className="w-8 h-8 object-cover rounded-full border border-background dark:border-dark-background absolute mt-auto"
              style={{ resizeMode: "cover", left: index * 20 }}
            />
          ))}
      </View>
    </TouchableOpacity>
  );
}
