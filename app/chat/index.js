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
import ImageModal from "../../components/ImageModal";
import VoiceRecorder from "../../components/chat/voice/VoiceRecorder";
import VoiceMessage from "../../components/chat/voice/VoiceMessage";
import LocationPollModal from "../../components/chat/LocationPollModal";

// ChatBubble component handles individual message display
const ChatBubble = ({
  mode,
  username,
  message,
  time,
  images,
  reply,
  onSwipe,
  voiceUri,
}) => {
  // Animation value for swipe gesture
  const translateX = useRef(new Animated.Value(0)).current;

  // Configure pan responder for swipe-to-reply gesture
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (_, gestureState) => {
        // Only handle horizontal swipes
        return Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
      },
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only handle horizontal swipes
        return Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
      },
      // Handle swipe movement
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx > 0) {
          translateX.setValue(gestureState.dx);
        }
      },
      // Handle swipe release
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > 20) {
          // Animate to swipe position
          Animated.spring(translateX, {
            toValue: 60,
            useNativeDriver: true,
          }).start();
          onSwipe({
            username,
            userMode: mode,
            time,
            content: message,
            voiceUri,
            reply,
            images,
          });
          // Return to original position after delay
          setTimeout(() => {
            Animated.spring(translateX, {
              toValue: 0,
              useNativeDriver: true,
            }).start();
          }, 500);
        } else {
          // Reset if swipe not far enough
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  // Utility function to arrange images in pairs
  const pairImages = (images) => {
    const paired = [];
    for (let i = 0; i < images.length; i += 2) {
      paired.push(images.slice(i, i + 2));
    }
    return paired;
  };

  return (
    <View>
      <Animated.View
        {...panResponder.panHandlers}
        style={{ transform: [{ translateX: translateX }] }}
      >
        {/* Show username for sender's messages */}
        {mode === "sender" && (
          <Text className="text-text-default/50 dark:text-dark-text-default/50 mr-auto">
            @{username}
          </Text>
        )}

        {/* Message bubble container */}
        <View className="relative">
          <View
            className={`flex-col gap-2 py-3 px-4 self-start max-w-80 mt-2 mb-4 ${
              mode === "sender"
                ? "rounded-tl-2xl rounded-tr-2xl rounded-br-2xl rounded-bl-none mr-auto bg-text-dimmed dark:bg-dark-text-dimmed"
                : "rounded-tl-2xl rounded-tr-2xl rounded-br-none rounded-bl-2xl bg-purple-default dark:bg-dark-purple-default ml-auto"
            }`}
          >
            {reply && (
              <View
                className={`flex-row gap-2 rounded-md ${
                  mode === "sender"
                    ? "bg-text-default/15 dark:bg-dark-text-default/15"
                    : "bg-purple-secondary/15 dark:bg-dark-purple-secondary/15"
                }`}
              >
                {/* Reply */}
                <View
                  className={`w-1 rounded-tl-full rounded-bl-full ${
                    mode === "sender"
                      ? "bg-purple-default dark:bg-dark-purple-default"
                      : "bg-purple-secondary dark:bg-dark-purple-secondary"
                  }`}
                />
                <View className="p-2 gap-1">
                  <Text
                    className={`text-sm font-inter-bold ${
                      mode === "sender"
                        ? "text-purple-default dark:text-dark-purple-default"
                        : "text-background dark:text-dark-background"
                    }`}
                  >
                    @{reply.username}
                  </Text>
                  <Text
                    className={`line-clamp-1 text-ellipsis ${
                      mode === "sender"
                        ? "text-text-default dark:text-dark-text-default"
                        : "text-background dark:text-dark-background"
                    }`}
                  >
                    {reply.content}
                  </Text>
                </View>
              </View>
            )}

            {/* Text message content */}
            {message && (
              <Text
                className={`${
                  mode === "sender"
                    ? "text-text-default dark:text-dark-text-default"
                    : "text-background dark:text-dark-background"
                }`}
              >
                {message}
              </Text>
            )}

            {/* Image grid display */}
            {images && images.length !== 0 && (
              <View>
                {pairImages(images).map((pair, rowIndex) => (
                  <View key={rowIndex} className="flex-row gap-2 mb-2">
                    {pair.map((image, index) => (
                      <ImageModal
                        key={index}
                        initialVisibility={false}
                        image={image}
                      >
                        <Image
                          source={{ uri: image }}
                          className="w-36 h-36 rounded-lg"
                          style={{ resizeMode: "cover" }}
                        />
                      </ImageModal>
                    ))}
                  </View>
                ))}
              </View>
            )}

            {/* Voice message component */}
            {voiceUri && <VoiceMessage uri={voiceUri} mode={mode} />}

            {/* Message timestamp */}
            <Text
              className={`${
                mode === "sender"
                  ? "text-text-default/50 dark:text-dark-text-default/50"
                  : "text-background/50 dark:text-dark-background/50"
              } ml-auto`}
            >
              {format(time, "p")}
            </Text>
          </View>

          {/* Reply icon for affordance */}
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
  // TODO: Get actual user
  const username = "shinybuncis";
  const router = useRouter();

  // References for scrolling down when there's a new message
  const scrollView = useRef();
  // References for location poll
  const locationSheetRef = useRef(null);

  // Initialise chat history with dummy data
  const [chats, setChats] = useState([
    {
      username: "ur-ja",
      userMode: "sender",
      time: new Date(),
      content:
        "very very very very very very very very very very very very very long message",
      voiceUri: undefined,
      reply: undefined,
      images: [],
    },
    {
      username: "shinybuncis",
      userMode: "receiver",
      time: new Date(),
      content: "Hi there too!",
      voiceUri: undefined,
      reply: undefined,
      images: [],
    },
  ]);

  // States
  const [message, setMessage] = useState("");
  const [images, setImages] = useState([]);
  const [reply, setReply] = useState(undefined);
  const [voiceUri, setVoiceUri] = useState(undefined);
  const [showLocationPoll, setShowLocationPoll] = useState(true);

  // Memoized values for UI states
  const isTyping = useMemo(
    () => message.length !== 0 || images.length !== 0,
    [message, images]
  );

  // Handler for sheet modal
  const handlePresentModalPress = (ref) => {
    ref.current?.present();
  };

  // Handler for swipe-to-reply feature
  const swipeToReply = (reply) => {
    console.log(reply);
    setReply(reply);
  };

  // Handler to cancel reply
  const closeReply = () => {
    setReply(undefined);
  };

  // Image handling functions
  const uploadImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "We need camera permission to upload images."
      );
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        quality: 1,
        allowsMultipleSelection: true,
      });
      if (!result.canceled) {
        addImages(result.assets.map((image) => image.uri));
      }
    }
  };

  // Function to add images
  const addImages = (images) => {
    setImages((array) => {
      return [...array, ...images];
    });
  };

  // Function to delete an image
  const deleteImage = (index) => {
    setImages((array) => {
      let prevArray = [...array];
      if (index >= 0 && index < prevArray.length) {
        prevArray.splice(index, 1);
      }
      return prevArray;
    });
  };

  // Effect to handle voice message recording completion
  useEffect(() => {
    if (voiceUri) {
      addChats();
    }
  }, [voiceUri]);

  // Function to add a chat to the chats array
  const addChats = () => {
    setChats((prevChats) => {
      const newChats = [
        ...prevChats,
        {
          userMode: "receiver",
          username,
          time: new Date(),
          content: message,
          voiceUri,
          reply,
          images,
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
    setVoiceUri(undefined);
    closeReply();
  };

  return (
    <SafeAreaProvider className="flex-1">
      <SafeAreaView className="flex-1 bg-background dark:bg-dark-background">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-3 px-6">
          {/* Back button */}
          <TouchableOpacity className="p-4" onPress={() => router.back()}>
            <Feather
              className="color-text-default dark:color-dark-text-default"
              name="chevron-left"
              size={24}
            />
          </TouchableOpacity>
          {/* Brief study session details */}
          <View className="flex-1">
            <Text className="font-inter-bold text-text-default dark:text-dark-text-default">
              Active Study Session
            </Text>
            <Text className="text-sm text-text-default dark:text-dark-text-default">
              Christine, Urja, Merry
            </Text>
          </View>
          {/* Go to Details */}
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
          <TouchableOpacity
            onPress={() => handlePresentModalPress(locationSheetRef)}
            className="w-full px-6 py-4 flex-row justify-between items-center bg-purple-secondary dark:bg-dark-purple-secondary"
          >
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
          <LocationPollModal sheetRef={locationSheetRef} />
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
              username={chat.username}
              message={chat.content}
              time={chat.time}
              images={chat.images}
              reply={chat.reply}
              onSwipe={swipeToReply}
              voiceUri={chat.voiceUri}
            />
          ))}
        </ScrollView>
        <View>
          {/* Images preview */}
          {images.length !== 0 && (
            <ScrollView
              horizontal
              className="flex-row"
              contentContainerStyle={{
                paddingHorizontal: 16,
                paddingVertical: 12,
              }}
            >
              {images.map((image, index) => (
                <View key={index} className="relative">
                  <ImageModal initialVisibility={false} image={image}>
                    <Image
                      source={{ uri: image }}
                      key={index}
                      className="w-28 h-28 object-contain rounded-lg ml-3"
                      style={{ resizeMode: "cover" }}
                    />
                  </ImageModal>
                  <Feather
                    onPress={() => deleteImage(index)}
                    name="trash"
                    size={16}
                    className="absolute -top-2 -right-2 color-background dark:color-dark-background bg-alert-text dark:bg-dark-alert-text p-2 rounded-full"
                  />
                </View>
              ))}
            </ScrollView>
          )}
          {/* Reply preview */}
          {reply && (
            <View className="flex-row w-full items-center gap-2 px-6 mt-3">
              <View className="flex-row flex-1 gap-2 bg-text-dimmed dark:bg-dark-text-dimmed rounded-md">
                <View className="bg-purple-default w-1 rounded-tl-full rounded-bl-full" />
                <View className="p-2 gap-1">
                  <Text className="text-sm font-inter-bold text-purple-default dark:text-dark-purple-default">
                    {reply.username}
                  </Text>
                  <Text className="line-clamp-1 text-ellipsis text-text-default dark:text-dark-text-default">
                    {reply.content}
                  </Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => closeReply()} className="p-4">
                <Feather
                  name="x"
                  size={24}
                  className="color-text-default dark:color-dark-text-default"
                />
              </TouchableOpacity>
            </View>
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
            {/* Send messages or voice messages */}
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
              <VoiceRecorder onRecordingComplete={(uri) => setVoiceUri(uri)} />
            )}
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
