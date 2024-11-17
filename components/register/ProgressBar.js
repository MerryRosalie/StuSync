import { View } from "react-native";

export default function ProgressBar({ currentStep }) {
  return (
    <View className="flex-row h-1.5 space-x-1 mx-4">
      {[1, 2, 3, 4].map((index) => (
        <View
          key={index}
          className={`h-full rounded-full flex-1 mx-1 ${
            index === currentStep
              ? "bg-purple-default dark:bg-dark-purple-default"
              : index < currentStep
              ? "bg-purple-secondary dark:bg-dark-purple-secondary"
              : "bg-purple-secondary dark:bg-dark-purple-secondary opacity-30"
          }`}
        />
      ))}
    </View>
  );
}
