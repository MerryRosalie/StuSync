import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import Sheet from "./Sheet";
import { useRef } from "react";
import { useUser } from "../src/contexts/UserContext";

const icons = [
  {
    name: "Profile",
    icon: (props) => <Feather {...props} name="user" size={24} />,
    warn: false,
  },
  {
    name: "Mute",
    icon: (props) => <Feather {...props} name="bell-off" size={24} />,
    warn: false,
  },
  {
    name: "Report",
    icon: (props) => <Feather {...props} name="slash" size={24} />,
    warn: true,
  },
  {
    name: "Block",
    icon: (props) => <Feather {...props} name="alert-octagon" size={24} />,
    warn: true,
  },
  {
    name: "Unfriend",
    icon: (props) => <Feather {...props} name="user-minus" size={24} />,
    warn: true,
  },
];

export default function Friend({ user }) {
  const { currentUser, addFriend } = useUser();
  const bottomSheetRef = useRef(null);

  const handlePresentModalPress = () => bottomSheetRef.current?.present();

  return (
    <View className="flex-row items-center gap-2 p-2 flex-2">
      {/* Profile picture + Name + Settings */}
      <View className="relative">
        {/* Image */}
        <Image
          source={{ uri: user.profilePicture }}
          className="w-12 h-12 rounded-full object-cover"
          style={{ resizeMode: "cover" }}
        />
        <View className="bg-green w-4 h-4 rounded-full absolute right-0 bottom-0" />
      </View>
      <View className="flex-1">
        <Text className="text-lg text-text-default dark:text-dark-text-default">
          {user.name}
        </Text>
        <Text className="text-sm text-text-default dark:text-dark-text-default">
          @{user.username}
        </Text>
      </View>
      {currentUser.friends.allFriends.includes(user.uid) ? (
        <TouchableOpacity onPress={handlePresentModalPress}>
          <Feather
            className="color-text-default dark:color-dark-text-default"
            name="more-horizontal"
            size={24}
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => {
            addFriend(user.uid);
            Alert.alert(
              "Friend request sent!",
              `Sent a friend request to @${user.username}`
            );
          }}
        >
          <Feather
            className="color-text-default dark:color-dark-text-default"
            name="user-plus"
            size={24}
          />
        </TouchableOpacity>
      )}
      {/* Settings Modal */}
      <Sheet ref={bottomSheetRef} noExpand>
        <View>
          {icons.map((icon, index) => (
            <TouchableOpacity
              key={index}
              className="flex-row items-center gap-2 py-4"
            >
              {icon.icon({
                className: icon.warn
                  ? "color-alert-text dark:color-dark-alert-text"
                  : "color-text-default dark:color-dark-text-default",
              })}
              <Text
                className={`capitalize ${
                  icon.warn
                    ? "text-alert-text dark:text-dark-alert-text"
                    : "text-text-default dark:text-dark-text-default"
                }`}
              >
                {icon.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Sheet>
    </View>
  );
}
