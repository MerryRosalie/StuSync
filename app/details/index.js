import { Text, View, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import Friend from "../../components/friends/Friend";
import { useSession } from "../../src/contexts/SessionContext";
import { useUser } from "../../src/contexts/UserContext";
import { addHours, format, parse } from "date-fns";

const addTwoHours = (timeString) => {
  const date = parse(timeString, "h:mm a", new Date());
  const newDate = addHours(date, 2);
  return format(newDate, "h:mm a");
};

export default function Page() {
  const router = useRouter();

  const { currentUser, allUsers } = useUser();
  const { activeSession, sessionStatus, startPomodoroTimer } = useSession();

  const handleStartPomodoroTimer = () => {
    startPomodoroTimer();
    router.push("/timer");
  };

  console.log("sessionDetails", currentUser.studySessions[0]);

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-background">
      {/* Header with back button */}
      <View className="flex-row items-center relative mb-3">
        <TouchableOpacity className="p-4" onPress={() => router.back()}>
          <Feather
            className="color-text-default dark:color-dark-text-default"
            name="chevron-left"
            size={24}
          />
        </TouchableOpacity>
        <Text className="font-inter-bold absolute left-1/2 -translate-x-1/2 text-text-default dark:text-dark-text-default">
          Study Session Details
        </Text>
      </View>
      <ScrollView className="flex-1 px-6 py-2 flex">
        {/* Date Information */}
        <View className="p-4 rounded-2xl border border-text-dimmed dark:border-dark-text-dimmed">
          <Text className="font-bold text-text-default dark:text-dark-text-default">
            Date
          </Text>
          <Text className="text-text-default dark:text-dark-text-default">
            {activeSession.date}
            {", "}
            {activeSession.time}
          </Text>
        </View>
        {/* Time Information */}
        <View className="p-4 mt-4 rounded-2xl border border-text-dimmed dark:border-dark-text-dimmed">
          <Text className="font-bold text-text-default dark:text-dark-text-default">
            Time
          </Text>
          <View className="flex-row justify-between">
            <View>
              <Text className="font-bold text-xl text-text-default dark:text-dark-text-default">
                {activeSession.time}
              </Text>
              <Text className="text-text-default dark:text-dark-text-default">
                Start Time
              </Text>
            </View>
            <View>
              <Text className="font-bold text-xl text-text-default dark:text-dark-text-default">
                {addTwoHours(activeSession.time)}
              </Text>
              <Text className="text-text-default dark:text-dark-text-default">
                Start Time
              </Text>
            </View>
          </View>
        </View>
        {/* Location Information */}
        <View className="p-4 mt-4 rounded-2xl flex-row justify-between items-center border border-text-dimmed dark:border-dark-text-dimmed">
          <View className="flex-1">
            <Text className="font-bold text-text-default dark:text-dark-text-default">
              Location
            </Text>
            {sessionStatus.locationPollActive && (
              <Text className="text-text-default/50 dark:text-dark-text-default/50">
                Voting in progress
              </Text>
            )}
          </View>

          {activeSession.location && (
            <Text className="flex-1 text-right line-clamp-1 text-ellipsis text-text-default dark:text-dark-text-default">
              {activeSession.location}
            </Text>
          )}
          {sessionStatus.locationPollActive && (
            <TouchableOpacity className="bg-purple-secondary dark:bg-dark-purple-secondary py-3 px-4 rounded-xl">
              <Text className="text-purple-default dark:text-dark-purple-default">
                Vote Now
              </Text>
            </TouchableOpacity>
          )}
        </View>
        {/* Members Information */}
        <View className="p-4 mt-4 rounded-2xl border border-text-dimmed dark:border-dark-text-dimmed">
          <Text className="font-bold text-text-default dark:text-dark-text-default">
            Members
          </Text>
          {activeSession.members
            .filter((uid) => currentUser.uid !== uid)
            .map((uid) => allUsers[uid])
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((friend) => (
              <Friend key={friend.uid} user={friend} />
            ))}
        </View>
        {/* Start Study Session */}
        <TouchableOpacity
          disabled={!activeSession.location}
          onPress={handleStartPomodoroTimer}
          className="flex-row mt-4 justify-center items-center gap-2 bg-purple-secondary dark:bg-dark-purple-secondary disabled:bg-purple-default/25 dark:disabled:bg-dark-purple-default/25 py-3 px-4 rounded-xl"
        >
          <Feather
            className="text-purple-default dark:text-dark-purple-default"
            name="play"
            size={24}
          />
          <Text className="text-purple-default dark:text-dark-purple-default">
            Start Study Session
          </Text>
        </TouchableOpacity>
        {/* Leave Study Session */}
        <TouchableOpacity className="flex-row mt-4 justify-center items-center gap-2 border border-alert-text dark:border-dark-alert-text py-3 px-4 rounded-xl">
          <Feather
            className="color-alert-text dark:color-dark-alert-text"
            name="log-out"
            size={24}
          />
          <Text className="color-alert-text dark:color-dark-alert-text">
            Leave Study Session
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
