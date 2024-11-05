import { View, Text, TouchableOpacity } from "react-native";
import Feather from "@expo/vector-icons/Feather";

export default function TabBar({ state, descriptors, navigation }) {
  // Filter out unwanted routes
  const filteredRoutes = state.routes.filter(
    (route) => !["_sitemap", "+not-found"].includes(route.name.toLowerCase())
  );

  const icon = {
    home: (props) => <Feather {...props} name="home" size={24} />,
    profile: (props) => <Feather {...props} name="user" size={24} />,
    calendar: (props) => <Feather {...props} name="calendar" size={24} />,
    alert: (props) => <Feather {...props} name="bell" size={24} />,
  };

  return (
    <View className="absolute bottom-6 flex-row justify-between gap-10 items-center bg-background dark:bg-dark-background mx-8 rounded-full p-2 shadow-md shadow-black">
      {filteredRoutes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={route.name}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            className={`flex-1 justify-center items-center rounded-full aspect-square ${
              isFocused ? "bg-purple-default dark:bg-dark-purple-default" : ""
            }`}
          >
            {icon[route.name]({
              className: isFocused
                ? "color-background dark:color-dark-background"
                : "color-text-default dark:color-dark-text-default",
            })}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
