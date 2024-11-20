import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import { Switch, TouchableOpacity, Text, View, Pressable } from "react-native";

export default function PreviousStudySessCard({ title, time, friends }) {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const circles = [
    { color: "bg-red-500", label: "Circle 1" },
    { color: "bg-blue-500", label: "Circle 2" },
    { color: "bg-blue-500", label: "Circle 3" },
    { color: "bg-yellow-500", label: "Circle 4" },
  ];
  return (
    // shadow-sm shadow-black
    <TouchableOpacity
      className=" w-52 h-36 border border-[#EEEEEE] rounded-[12] gap-1 p-4 justify-between"
      onPress={() => {
        router.navigate("/history");
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
        {/* TODO: fix this with images/profiles */}
        {circles.map((circle, index) => (
          <View
            key={index}
            className={`${circle.color} w-8 h-8 rounded-full border-2 border-white absolute mt-auto`}
            style={{
              left: index * 20, // profiles are offset
            }}
          />
        ))}
      </View>
    </TouchableOpacity>
  );
}
