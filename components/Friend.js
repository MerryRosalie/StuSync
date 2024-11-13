import { View, Text, Image, TouchableOpacity } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import Sheet from "./Sheet";
import { useRef } from "react";

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

export default function Friend() {
  const bottomSheetRef = useRef(null);

  const handlePresentModalPress = () => bottomSheetRef.current?.present();

  return (
    <View className="flex-row items-center gap-2 p-2 flex-2">
      {/* Profile picture + Name + Settings */}
      <View className="relative">
        {/* TODO: Change to Image */}
        <View className="bg-gray-200 w-12 h-12 rounded-full" />
        <View className="bg-green w-4 h-4 rounded-full absolute right-0 bottom-0" />
      </View>
      <View className="flex-1">
        <Text className="text-lg text-text-default dark:text-dark-text-default">
          Merry Rosalie
        </Text>
        <Text className="text-sm text-text-default dark:text-dark-text-default">
          @shinybuncis
        </Text>
      </View>
      <TouchableOpacity onPress={handlePresentModalPress}>
        <Feather
          className="color-text-default dark:color-dark-text-default"
          name="more-horizontal"
          size={24}
        />
      </TouchableOpacity>
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
