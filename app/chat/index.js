import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import React, { useRef } from "react";
import Sheet from "../../components/Sheet";

const LocationPollModal = () => {
  return <Text>Location Poll Modal</Text>;
};

const ChatBubble = ({ mode, text }) => {
  // Mode can be either "sender" or "receiver"
  return (
    <View>
      {mode === "receiver" && (
        <Text
          className="text-text-default/50 dark:text-dark-text-default/50 mr-auto
            "
        >
          @shinybuncis
        </Text>
      )}
      <View
        className={`py-3 px-4 self-start max-w-80 mt-2 mb-4 ${
          mode === "receiver"
            ? "rounded-tl-2xl rounded-tr-2xl rounded-br-2xl rounded-bl-none bg-text-dimmed dark:bg-dark-text-dimmed mr-auto"
            : "rounded-tl-2xl rounded-tr-2xl rounded-br-none rounded-bl-2xl bg-purple-default dark:bg-dark-purple-default ml-auto"
        }`}
      >
        <Text
          className={`${
            mode === "receiver"
              ? "text-text-default dark:text-dark-text-default"
              : "text-background dark:text-dark-background"
          }`}
        >
          {text}
        </Text>
        <Text
          className={`${
            mode === "receiver"
              ? "text-text-default/50 dark:text-dark-text-default/50"
              : "text-background/50 dark:text-dark-background/50"
          } mt-2 ml-auto`}
        >
          08:34 AM
        </Text>
      </View>
    </View>
  );
};

export default function Page() {
  const router = useRouter();
  const bottomSheetRef = useRef(null);

  const handlePresentModalPress = () => bottomSheetRef.current?.present();

  return (
    <SafeAreaProvider className="flex-1">
      <SafeAreaView className="flex-1 bg-background dark:bg-dark-background">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-3 px-6">
          <TouchableOpacity className="p-4" onPress={() => router.back()}>
            <Feather
              className="color-text-default dark:color-dark-text-default"
              name="chevron-left"
              size={24}
            />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="font-inter-bold text-text-default dark:text-dark-text-default">
              Active Study Session
            </Text>
            <Text className="text-sm text-text-default dark:text-dark-text-default">
              Christine, Urja, Merry
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/details")}
            className="p-4"
          >
            <Feather
              className="color-text-default dark:color-dark-text-default"
              name="more-vertical"
              size={24}
            />
          </TouchableOpacity>
        </View>
        {/* Location Poll Warning */}
        <TouchableOpacity className="w-full px-6 py-4 flex-row justify-between items-center bg-purple-secondary dark:bg-dark-purple-secondary">
          <Text className="text-purple-default dark:text-dark-purple-default">
            Tap here to vote for a location!
          </Text>
          <TouchableOpacity>
            <Text className="font-bold text-purple-default dark:text-dark-purple-default">
              Hide
            </Text>
          </TouchableOpacity>
        </TouchableOpacity>
        {/* Location Poll Modal */}
        <Sheet ref={bottomSheetRef}></Sheet>
        {/* Chat Interface */}
        <ScrollView
          className="px-6 py-2 flex-1"
          contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-end" }}
        >
          <ChatBubble mode="receiver" text="Lorem Ipsum dolor sit amet." />
          <ChatBubble text="Lorem Ipsum dolor sit amet." />
        </ScrollView>
        {/* Chat Utilities Interface */}
        <View className="flex-row gap-3 px-6 my-6">
          {/* Make a poll */}
          <TouchableOpacity className="p-4 bg-text-dimmed dark:bg-dark-text-dimmed rounded-full">
            <Feather
              className="color-text-default/50 dark:color-dark-text-default/50"
              name="align-left"
              size={24}
            />
          </TouchableOpacity>
          {/* Emoji + Input + Image */}
          <View className="flex-row flex-1 rounded-full bg-text-dimmed dark:bg-dark-text-dimmed px-1">
            <TouchableOpacity className="p-4">
              <Feather
                className="color-text-default/50 dark:color-dark-text-default/50"
                name="smile"
                size={24}
              />
            </TouchableOpacity>
            <TextInput
              className="flex-1 text-text-default dark:text-dark-text-default placeholder:text-text-default/50 dark:placeholder:text-dark-text-default/50"
              placeholder="Send a message..."
            />
            <TouchableOpacity className="p-4">
              <Feather
                className="color-text-default/50 dark:color-dark-text-default/50"
                name="camera"
                size={24}
              />
            </TouchableOpacity>
          </View>
          {/* Voice message or send message */}
          <TouchableOpacity className="p-4 bg-purple-default dark:bg-dark-purple-default rounded-full">
            <Feather
              className="color-background dark:color-dark-background"
              name="mic"
              size={24}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
