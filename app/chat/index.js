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
import Modal from "react-native-modal";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";
import Entypo from "@expo/vector-icons/Entypo";
import { useRouter } from "expo-router";
import React, { useMemo, useRef, useState, useEffect } from "react";
import { format } from "date-fns/format";
import * as ImagePicker from "expo-image-picker";

// Components
import Sheet from "../../components/Sheet";
import ImageModal from "../../components/ImageModal";
import VoiceRecorder from "../../components/chat/voice/VoiceRecorder";
import VoiceMessage from "../../components/chat/voice/VoiceMessage";
import LocationPollModal from "../../components/chat/LocationPollModal";
import ProposeEndTimeModal from "../../components/chat/ProposeEndTimeModal";
import KickAMemberModal from "../../components/chat/KickAMemberModal";
import BinaryPoll from "../../components/chat/poll/BinaryPoll";

// Contexts
import { useUser } from "../../src/contexts/UserContext";
import { useSession } from "../../src/contexts/SessionContext";

const LOCATION_OPTIONS = ["Electrical Engineering G04", "Quadrangle G040"];

const generateChatInstance = (
  message,
  senderUid,
  voiceUri,
  reply,
  images,
  poll,
  button
) => {
  return {
    messageId: Date.now().toString(),
    message,
    senderUid,
    timestamp: new Date().toISOString(),
    voiceUri,
    reply,
    images,
    poll,
    button,
  };
};

// ChatBubble component handles individual message display
const ChatBubble = ({ mode: propMode, chat, onSwipe }) => {
  const mode = chat.button ? "sender" : propMode;
  const router = useRouter();

  // Get sender details
  const { allUsers } = useUser();
  const { sessionStatus, startPomodoroTimer } = useSession();

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
        if (gestureState.dx < 0) {
          translateX.setValue(gestureState.dx);
        }
      },
      // Handle swipe release
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -20) {
          // Animate to swipe position
          Animated.spring(translateX, {
            toValue: -60,
            useNativeDriver: true,
          }).start();
          // Reply to this chat
          onSwipe(chat);
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

  // Handler to start pomodoro timer
  const handleStartPomodoroTimer = () => {
    startPomodoroTimer();
    router.push("/timer");
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
            @{allUsers[chat.senderUid].username}
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
            {chat.reply && (
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
                    @{allUsers[chat.reply.senderUid].username}
                  </Text>
                  <Text
                    className={`line-clamp-1 text-ellipsis ${
                      mode === "sender"
                        ? "text-text-default dark:text-dark-text-default"
                        : "text-background dark:text-dark-background"
                    }`}
                  >
                    {chat.reply.message}
                  </Text>
                </View>
              </View>
            )}

            {/* Text message content */}
            {chat.message && (
              <Text
                className={`${
                  mode === "sender"
                    ? "text-text-default dark:text-dark-text-default"
                    : "text-background dark:text-dark-background"
                }`}
              >
                {chat.message}
              </Text>
            )}

            {/* Image grid display */}
            {chat.images && chat.images.length !== 0 && (
              <View>
                {pairImages(chat.images).map((pair, rowIndex) => (
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
            {chat.voiceUri && <VoiceMessage uri={chat.voiceUri} mode={mode} />}

            {/* Poll interface */}
            {chat.poll && <BinaryPoll />}

            {/* Start study session button */}
            {chat.button && (
              <TouchableOpacity
                onPress={handleStartPomodoroTimer}
                className="px-4 py-3 flex-row gap-2 justify-center items-center border bg-background dark:bg-dark-background rounded-lg"
              >
                <Feather
                  name="play"
                  size={24}
                  className="color-purple-default dark:color-dark-purple-default"
                />
                <Text className="text-purple-default dark:text-dark-purple-default">
                  Start Study Session
                </Text>
              </TouchableOpacity>
            )}

            {/* Message timestamp */}
            <Text
              className={`${
                mode === "sender"
                  ? "text-text-default/50 dark:text-dark-text-default/50"
                  : "text-background/50 dark:text-dark-background/50"
              } ml-auto`}
            >
              {format(new Date(chat.timestamp), "p")}
            </Text>
          </View>

          {/* Reply icon for affordance */}
          <Entypo
            className="absolute top-1/2 -translate-y-1/2 -right-16 color-background dark:color-dark-background bg-purple-default dark:bg-dark-purple-default p-2 rounded-full"
            name="reply"
            size={16}
          />
        </View>
      </Animated.View>
    </View>
  );
};

export default function ChatPage() {
  const router = useRouter();
  const { currentUser, allUsers } = useUser();
  const { activeSession, sessionStatus, setSessionLocation, addChatToSession } =
    useSession();

  // Refs
  const scrollView = useRef(null);
  const locationSheetRef = useRef(null);
  const proposeEndTimeSheetRef = useRef(null);
  const kickAMemberSheetRef = useRef(null);

  // Chat States
  const [chats, setChats] = useState(activeSession?.chat?.messages || []);
  const [message, setMessage] = useState("");
  const [images, setImages] = useState([]);
  const [reply, setReply] = useState(undefined);
  const [voiceUri, setVoiceUri] = useState(undefined);

  // UI States
  const [showPollOptions, setShowPollOptions] = useState(false);
  const [showLocationPoll, setShowLocationPoll] = useState(
    sessionStatus?.locationPollActive
  );

  // Poll States
  const [proposedEndTime, setProposedEndTime] = useState(undefined);
  const [memberKicking, setMemberKicking] = useState(undefined);
  const [voteValues, setVoteValues] = useState(
    LOCATION_OPTIONS.reduce((acc, option) => {
      acc[option] = false;
      return acc;
    }, {})
  );
  const [showResults, setShowResults] = useState(false);

  // Memoized values for UI states
  const isTyping = useMemo(
    () => message.length !== 0 || images.length !== 0,
    [message, images]
  );

  const members = useMemo(() => activeSession?.members || [], [activeSession]);

  // Effects
  // Route to home if user hasn't accepted a session
  useEffect(() => {
    if (!activeSession) {
      router.replace("/main/home");
    }
  }, [activeSession]);

  // Watch for timer completion
  useEffect(() => {
    if (
      sessionStatus.locationPollActive &&
      sessionStatus.locationPollTimeLeft === 0
    ) {
      const selectedLocations = Object.entries(voteValues)
        .filter(([_, isSelected]) => isSelected)
        .map(([location]) => location);

      const locationsToChooseFrom =
        selectedLocations.length > 0 ? selectedLocations : LOCATION_OPTIONS;

      const randomIndex = Math.floor(
        Math.random() * locationsToChooseFrom.length
      );
      const finalLocation = locationsToChooseFrom[randomIndex];

      if (!activeSession?.location) {
        handleLocationSelected(finalLocation);
      }
      locationSheetRef.current?.dismiss();
    }
  }, [sessionStatus.locationPollTimeLeft]);

  // Handle voice uri
  useEffect(() => {
    if (voiceUri) {
      const newChat = generateChatInstance(
        message,
        currentUser.uid,
        voiceUri,
        reply,
        images,
        false,
        false
      );
      insertChat(newChat, activeSession?.sessionId);
    }
  }, [voiceUri]);

  // Effect to add chats when end time is proposed
  useEffect(() => {
    if (proposedEndTime) {
      const newChat = generateChatInstance(
        `⏰ I suggest we end at ${format(
          proposedEndTime,
          "p"
        )}\n\nDoes this work for everyone?\n\nThis requires majority vote (at least 50%) to apply`,
        currentUser.uid,
        voiceUri,
        reply,
        images,
        true,
        false
      );
      insertChat(newChat, activeSession?.sessionId);
    }
  }, [proposedEndTime]);

  // Effect to add chats when a member is being kicked
  useEffect(() => {
    if (memberKicking) {
      const newChat = generateChatInstance(
        `⚠️ Remove ${memberKicking.name} from study session?\n\nThis requires majority vote (at least 50%) to apply`,
        currentUser.uid,
        voiceUri,
        reply,
        images,
        true,
        false
      );
      insertChat(newChat, activeSession?.sessionId);
    }
  }, [memberKicking]);

  // Effect to add message about location
  useEffect(() => {
    const sendMessage = async () => {
      if (showLocationPoll && activeSession?.location) {
        const chatMessage = generateChatInstance(
          `📍 Location decided: ${activeSession?.location}! Click below to start the study session!`,
          currentUser.uid,
          null,
          null,
          [],
          false,
          true
        );
        await insertChat(chatMessage, activeSession?.sessionId);
        setShowLocationPoll(false);
      }
    };
    sendMessage();
  }, [activeSession?.location]);

  // Handler when vote changes
  const handleLocationVote = (values, showResults) => {
    setVoteValues(values);
    setShowResults(showResults);
  };

  // Handler for location selection
  const handleLocationSelected = async (location) => {
    try {
      await setSessionLocation(location);
    } catch (error) {
      console.error("Error in handleLocationSelected:", error);
    }
  };

  // Handler for sheet modal
  const handlePresentModalPress = (ref) => {
    ref.current?.present();
  };

  // Handler for swipe-to-reply feature
  const swipeToReply = (reply) => {
    setReply(reply);
  };

  // Handler to cancel reply
  const closeReply = () => {
    setReply(undefined);
  };

  // Function to add a chat to the chats array
  const insertChat = async (chat, sessionId) => {
    try {
      await addChatToSession(chat, sessionId);
      setChats((prevChats) => [...prevChats, chat]);
      resetMessage();
    } catch (error) {
      console.error("Error in insertChat:", error);
    }
  };

  // Function to reset message
  const resetMessage = () => {
    setMessage("");
    setImages([]);
    setVoiceUri(undefined);
    closeReply();
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

  if (!activeSession) return null;

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-background">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-3 px-6">
        {/* Back button */}
        <TouchableOpacity
          className="p-4"
          onPress={() => router.replace("/main/home")}
        >
          <Feather
            className="color-text-default dark:color-dark-text-default"
            name="chevron-left"
            size={24}
          />
        </TouchableOpacity>
        {/* Brief study session details */}
        <TouchableOpacity
          onPress={() => router.push("/details")}
          className="flex-1"
        >
          <Text className="font-inter-bold text-text-default dark:text-dark-text-default">
            Active Study Session
          </Text>
          <Text className="text-sm line-clamp-1 text-ellipsis text-text-default dark:text-dark-text-default">
            {members
              .map((uid) => allUsers[uid])
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((friend) => friend.name.split(" ")[0])
              .join(", ")}
          </Text>
        </TouchableOpacity>
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
        <LocationPollModal
          sheetRef={locationSheetRef}
          onComplete={handleLocationVote}
          options={LOCATION_OPTIONS}
          values={voteValues}
          showResults={showResults}
          locationPollTimeLeft={sessionStatus.locationPollTimeLeft}
        />
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
            mode="receiver"
            chat={chat}
            onSwipe={swipeToReply}
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
                  {allUsers[reply.senderUid].username}
                </Text>
                <Text className="line-clamp-1 text-ellipsis text-text-default dark:text-dark-text-default">
                  {reply.message}
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
        {/* Poll Options Modal */}
        <Modal
          isVisible={showPollOptions}
          onBackdropPress={() => setShowPollOptions(false)}
          backdropOpacity={0}
          animationIn="fadeIn"
          animationOut="fadeOut"
          avoidKeyboard={false}
        >
          <View className="absolute left-0 right-0 bottom-20 flex-row justify-center px-4 py-6 rounded-lg gap-4 bg-text-dimmed dark:bg-dark-text-dimmed">
            {/* Propose end time button */}
            <TouchableOpacity
              onPress={() => {
                setShowPollOptions(false);
                handlePresentModalPress(proposeEndTimeSheetRef);
              }}
              className="flex flex-col gap-2 justify-center"
            >
              <Feather
                name="clock"
                size={24}
                className="mx-auto p-4 rounded-full bg-purple-secondary dark:bg-dark-purple-secondary color-purple-default dark:color-dark-purple-default"
              />
              <Text className="text-text-default dark:text-dark-text-default">
                Propose End Time
              </Text>
            </TouchableOpacity>
            {/* Kick a member button */}
            <TouchableOpacity
              onPress={() => {
                setShowPollOptions(false);
                handlePresentModalPress(kickAMemberSheetRef);
              }}
              className="flex-col gap-2 justify-center"
            >
              <Feather
                name="user-minus"
                size={24}
                className="mx-auto p-4 rounded-full bg-dark-alert-text dark:bg-dark-alert-background color-failure-text dark:color-dark-alert-text"
              />
              <Text className="text-text-default dark:text-dark-text-default">
                Kick a Member
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
        {/* Propose End Time Sheet */}
        <Sheet ref={proposeEndTimeSheetRef} noExpand>
          <ProposeEndTimeModal
            onSubmit={(date) => setProposedEndTime(date)}
            sheetRef={proposeEndTimeSheetRef}
          />
        </Sheet>
        {/* Kick a Member Sheet */}
        <Sheet ref={kickAMemberSheetRef} noExpand>
          <KickAMemberModal
            onSubmit={(member) => setMemberKicking(member)}
            sheetRef={kickAMemberSheetRef}
            members={members}
          />
        </Sheet>
        {/* Chat Utilities Interface */}
        <View className="flex-row gap-3 px-6 my-6">
          {/* Make a poll button */}
          {!isTyping && (
            <TouchableOpacity
              onPress={() => setShowPollOptions((prev) => !prev)}
              className="p-4 bg-text-dimmed dark:bg-dark-text-dimmed rounded-full"
            >
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
              className="flex-1 line-clamp-2 pl-4 text-text-default dark:text-dark-text-default placeholder:text-text-default/50 dark:placeholder:text-dark-text-default/50"
              placeholder="Send a message..."
              value={message}
              onChangeText={(text) => setMessage(text)}
              multiline
              textAlignVertical="center" // For IOS support
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
              onPress={() => {
                const newChat = generateChatInstance(
                  message,
                  currentUser.uid,
                  voiceUri,
                  reply,
                  images,
                  false,
                  false
                );
                insertChat(newChat, activeSession?.sessionId);
              }}
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
  );
}
