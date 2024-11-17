import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Animated,
  PanResponder,
  Image,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";
import Entypo from "@expo/vector-icons/Entypo";
import { useRouter } from "expo-router";
import React, { useMemo, useRef, useState, useEffect } from "react";
import Sheet from "../../components/Sheet";
import { format } from "date-fns/format";
import * as ImagePicker from "expo-image-picker";

const LocationPollModal = () => {
  return <Text>Location Poll Modal</Text>;
};

const ChatBubble = ({ mode, message, time, onSwipe }) => {
  // Handle pan gestures
  const translateX = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx > 0) {
          translateX.setValue(gestureState.dx);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        // Swipe to the right
        if (gestureState.dx > 20) {
          // Animate to swipe position
          Animated.spring(translateX, {
            toValue: 60,
            useNativeDriver: true,
          }).start();
          // Trigger the reply action
          onSwipe(message);
          // Return to original position after delay
          setTimeout(() => {
            Animated.spring(translateX, {
              toValue: 0,
              useNativeDriver: true,
            }).start();
          }, 500);
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  // Mode can be either "sender" or "receiver"
  return (
    <View {...panResponder.panHandlers}>
      <Animated.View style={{ transform: [{ translateX: translateX }] }}>
        {mode === "sender" && (
          <Text
            className="text-text-default/50 dark:text-dark-text-default/50 mr-auto
            "
          >
            @shinybuncis
          </Text>
        )}
        <View className="flex-row relative items-center gap-4">
          <View
            className={`py-3 px-4 self-start max-w-80 mt-2 mb-4 ${
              mode === "sender"
                ? "rounded-tl-2xl rounded-tr-2xl rounded-br-2xl rounded-bl-none mr-auto bg-text-dimmed dark:bg-dark-text-dimmed"
                : "rounded-tl-2xl rounded-tr-2xl rounded-br-none rounded-bl-2xl bg-purple-default dark:bg-dark-purple-default ml-auto"
            }`}
          >
            <Text
              className={`${
                mode === "sender"
                  ? "text-text-default dark:text-dark-text-default"
                  : "text-background dark:text-dark-background"
              }`}
            >
              {message}
            </Text>
            <Text
              className={`${
                mode === "sender"
                  ? "text-text-default/50 dark:text-dark-text-default/50"
                  : "text-background/50 dark:text-dark-background/50"
              } mt-2 ml-auto`}
            >
              {format(time, "p")}
            </Text>
          </View>
          <Entypo
            className="absolute top-1/2 -translate-y-1/2 -left-16 color-text-default dark:color-dark-text-default bg-text-dimmed dark:bg-dark-text-dimmed p-2 rounded-full"
            name="reply"
            size={16}
          />
        </View>
      </Animated.View>
    </View>
  );
};

export default function Page() {
  const router = useRouter();

  // References for scrolling down when there's a new message
  const scrollView = useRef();
  // References for location poll
  const locationSheetRef = useRef(null);
  // References for image preview
  const imageSheetRef = useRef(null);

  // Dummy data for chats
  const [chats, setChats] = useState([
    {
      userMode: "sender",
      time: new Date(),
      content: "Hello there :)",
    },
    {
      userMode: "receiver",
      time: new Date(),
      content: "Hi there too!",
    },
  ]);

  // States
  const [message, setMessage] = useState("");
  const [images, setImages] = useState([]);
  const [reply, setReply] = useState("");
  const [showLocationPoll, setShowLocationPoll] = useState(true);

  // Memoised values
  const isTyping = useMemo(() => message.length !== 0, [message]);
  const isReplying = useMemo(() => reply.length !== 0, [reply]);

  // Function to open sheet
  const handlePresentModalPress = (ref) => {
    console.log("Sheet opened?");
    ref.current?.present();
  };

  // Function for swipe to reply function
  const swipeToReply = (message) => {
    setReply(message.length > 50 ? message.slice(0, 50) + "..." : message);
  };

  // Function to close and/or cancel reply
  const closeReply = () => {
    setReply("");
  };

  // Function to upload an image
  const uploadImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "We need camera permission to upload images."
      );
    } else {
      const result = await ImagePicker.launchImageLibraryAsync();
      if (!result.canceled) {
        addImage(result.assets[0].uri);
      }
    }
  };

  // Function to add image
  const addImage = (image) => {
    setImages((array) => {
      return [...array, image];
    });
  };

  // Function to delete image
  const deleteImage = (index) => {
    setImages((array) => {
      let prevArray = [...array];
      if (index >= 0 && index < prevArray.length) {
        prevArray.splice(index, 1);
      }
      return prevArray;
    });
  };

  // Function to add a chat
  const addChats = () => {
    setChats((prevChats) => {
      const newChats = [
        ...prevChats,
        {
          userMode: "receiver",
          time: new Date(),
          content: message,
        },
      ];
      return newChats;
    });
    resetMessage();
  };

  // Function to reset message
  const resetMessage = () => {
    setMessage("");
    setImages([]);
  };

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
        {showLocationPoll && (
          <TouchableOpacity className="w-full px-6 py-4 flex-row justify-between items-center bg-purple-secondary dark:bg-dark-purple-secondary">
            <Text className="text-purple-default dark:text-dark-purple-default">
              Tap here to vote for a location!
            </Text>
            <TouchableOpacity onPress={() => setShowLocationPoll(false)}>
              <Text className="font-bold text-purple-default dark:text-dark-purple-default">
                Hide
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        {/* Location Poll Modal */}
        <Sheet ref={locationSheetRef}>
          <Text>test</Text>
        </Sheet>
        {/* Chat Interface */}
        <ScrollView
          className="px-6 py-2 flex-1"
          contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-end" }}
          ref={(ref) => {
            scrollView.current = ref;
          }}
          onContentSizeChange={() => {
            scrollView.current.scrollToEnd({ animated: true });
          }}
        >
          {chats.map((chat, index) => (
            <ChatBubble
              key={index}
              mode={chat.userMode}
              message={chat.content}
              time={chat.time}
              onSwipe={swipeToReply}
              isReplying={isReplying}
            />
          ))}
        </ScrollView>
        <View>
          {/* Images preview */}
          {images.length !== 0 && (
            <ScrollView horizontal className="flex-row py-3 p-2">
              {images.map((image, index) => (
                <View key={index} className="relative">
                  <TouchableOpacity
                    onPress={() => handlePresentModalPress(imageSheetRef)}
                  >
                    <Image
                      source={{ uri: image }}
                      key={index}
                      className="w-28 h-28 object-contain rounded-lg ml-3"
                      style={{ resizeMode: "contain" }}
                    />
                  </TouchableOpacity>
                  <Feather
                    onPress={() => deleteImage(index)}
                    name="trash"
                    size={16}
                    className="absolute -top-2 -right-2 color-background bg-alert-text dark:bg-dark-alert-text p-2 rounded-full"
                  />
                </View>
              ))}
            </ScrollView>
          )}
          {/* Chat Utilities Interface */}
          <View className="flex-row gap-3 px-6 my-6">
            {/* Make a poll button */}
            {!isTyping && (
              <TouchableOpacity className="p-4 bg-text-dimmed dark:bg-dark-text-dimmed rounded-full">
                <Feather
                  className="color-text-default/50 dark:color-dark-text-default/50"
                  name="align-left"
                  size={24}
                />
              </TouchableOpacity>
            )}
            {/* Emoji + Input + Image */}
            <View className="flex-row flex-1 rounded-full bg-text-dimmed dark:bg-dark-text-dimmed px-1">
              <TextInput
                className="flex-1 line-clamp-1 pl-4 text-text-default dark:text-dark-text-default placeholder:text-text-default/50 dark:placeholder:text-dark-text-default/50"
                placeholder="Send a message..."
                value={message}
                onChangeText={(text) => setMessage(text)}
              />
              <TouchableOpacity onPress={() => uploadImage()} className="p-4">
                <Feather
                  className="color-text-default/50 dark:color-dark-text-default/50"
                  name="camera"
                  size={24}
                />
              </TouchableOpacity>
            </View>
            {/* Voice message or send message */}
            {isTyping ? (
              <TouchableOpacity
                onPress={() => addChats()}
                className="p-4 bg-purple-default dark:bg-dark-purple-default rounded-full"
              >
                <Feather
                  className="color-background dark:color-dark-background"
                  name="send"
                  size={24}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity className="p-4 bg-purple-default dark:bg-dark-purple-default rounded-full">
                <Feather
                  className="color-background dark:color-dark-background"
                  name="mic"
                  size={24}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
