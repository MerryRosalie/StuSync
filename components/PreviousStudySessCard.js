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
export default function PreviousStudySessCard({ title, time, members }) {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const { currentUser, allUsers } = useUser();

  console.log(members);
  return (
    // shadow-sm shadow-black
    <TouchableOpacity
      className=" w-52 h-36 border border-[#EEEEEE] rounded-[12] gap-1 p-4 justify-between"
      onPress={() => {
        router.navigate({ pathname: "/history", params: { title: title } });
      }}
    >
      <View>
        <Text className="text-sm text-text-default dark:text-dark-text-default">
          {time}
        </Text>
        <Text className="font-semibold text-base text-text-default dark:text-dark-text-default">
          {title}
        </Text>
      </View>
      <View className=" flex-row items-center justify-center relative h-8">
        {members
          .map((uid) => allUsers[uid])
          .slice(0, 4)
          .map((member, index) => {
            console.log(member);
            return (
              <Image
                key={index}
                source={{ uri: member.profilePicture }}
                className="w-8 h-8 object-cover rounded-full border border-background dark:border-dark-background absolute mt-auto"
                style={{ resizeMode: "cover", left: index * 20 }}
              />
            );
          })}
      </View>
    </TouchableOpacity>
  );
}
