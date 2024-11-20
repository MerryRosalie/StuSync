import { Text, View, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useMemo, useEffect } from "react";
import { useUser } from "../../../src/contexts/UserContext";
import { ChatTemplate, TimerTemplate } from "../../../src/Schema";
import { useRouter } from "expo-router";
import FriendRequestNotification from "../../../components/notifications/FriendRequestNotification";
import SessionReminderNotification from "../../../components/notifications/SessionReminderNotification";
import SessionInviteNotification from "../../../components/notifications/SessionInviteNotification";
import Alert from "../../../components/notifications/Alert";
import { useSession } from "../../../src/contexts/SessionContext";

export default function Page() {
  const {
    acceptIncomingRequest,
    denyIncomingRequest,
    currentUser,
    addUser,
    allUsers,
  } = useUser();
  const router = useRouter();
  const { startSession } = useSession();
  const [activeTab, setActiveTab] = useState("all");
  const [notifications, setNotifications] = useState(
    currentUser?.notifications || []
  );
  const [showJoinedBanner, setShowJoinedBanner] = useState(false);
  const [showErrorBanner, setShowErrorBanner] = useState(false);

  const removeNotification = (notificationId) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
  };

  // Updates the current and target users friends list if the request is accepted
  const handleAcceptRequest = async (uid, notificationId) => {
    try {
      const targetUser = allUsers[uid];
      if (!targetUser) throw new Error("User not found");

      // Remove the local updates and just call acceptIncomingRequest
      await acceptIncomingRequest(uid);
      removeNotification(notificationId);
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  // Denies the friend request and removes the notification
  const handleDenyRequest = async (uid, notificationId) => {
    try {
      await denyIncomingRequest(uid);
      removeNotification(notificationId);
    } catch (error) {
      console.error("Error denying friend request:", error);
    }
  };

  // Accepts the session invite and updates the current and target users study sessions
  const handleAcceptSession = async (sessionData, notificationId) => {
    try {
      const hasActiveSession = currentUser.studySessions.some(
        (session) => session.active
      );

      if (hasActiveSession) {
        setShowErrorBanner(true);
        setTimeout(() => setShowErrorBanner(false), 5000);
        return;
      }

      const newSession = {
        sessionId: `session_${Date.now()}`,
        date: sessionData.date,
        time: sessionData.time,
        location: sessionData.location || "",
        members: [currentUser.uid, sessionData.uid],
        chat: ChatTemplate,
        timer: TimerTemplate,
        active: true,
      };

      // Updates the current users study sessions
      const updatedCurrentUser = {
        ...currentUser,
        studySessions: [...currentUser.studySessions, newSession],
      };
      await addUser(updatedCurrentUser);

      // Updates the target users study sessions
      const targetUser = allUsers[sessionData.uid];
      if (targetUser) {
        const updatedTargetUser = {
          ...targetUser,
          studySessions: [...targetUser.studySessions, newSession],
        };
        await addUser(updatedTargetUser);
      }

      // Start new session using context
      await startSession({
        date: sessionData.date,
        time: sessionData.time,
        members: [currentUser.uid, sessionData.uid],
      });

      removeNotification(notificationId);
      setShowJoinedBanner(true);
      setTimeout(() => setShowJoinedBanner(false), 5000);
    } catch (error) {
      console.error("Error accepting session invite:", error);
    }
  };

  const handleDenySession = async (sessionData, notificationId) => {
    try {
      removeNotification(notificationId);
    } catch (error) {
      console.error("Error denying session invite:", error);
    }
  };

  // Filters the notifications based on the active tab
  const filteredNotifications = useMemo(() => {
    if (activeTab === "all") return DUMMY_NOTIFICATIONS;
    return DUMMY_NOTIFICATIONS.filter((notification) => {
      if (activeTab === "friends")
        return notification.type.startsWith("friend_");
      if (activeTab === "sessions")
        return notification.type.startsWith("session_");
      return true;
    });
  }, [activeTab]);

  const renderNotification = (notification) => {
    switch (notification.type) {
      case "friend_request":
        return (
          <View
            key={notification.id}
            className="flex-row items-center p-4 border-b border-gray-100"
          >
            <Image
              source={{ uri: notification.user.avatar }}
              className="w-10 h-10 rounded-full mr-3"
            />
            <View className="flex-1">
              <Text className="dark:text-dark-text-default">
                <Text className="font-inter-bold dark:text-dark-text-default">
                  {notification.user.name}
                </Text>
                <Text> {notification.message}</Text>
              </Text>
              <Text className="text-gray-500 text-sm">
                {notification.timestamp}
              </Text>
            </View>
            {notification.requiresAction && (
              <View className="flex-row items-center">
                <TouchableOpacity className="w-8 h-8 rounded-full bg-green mr-2 items-center justify-center">
                  <Text>✓</Text>
                </TouchableOpacity>
                <TouchableOpacity className="w-8 h-8 rounded-full bg-red-100 items-center justify-center">
                  <Text>✕</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        );

      case "session_reminder":
      case "session_location":
        return (
          <View
            key={notification.id}
            className="flex-row items-center p-4 border-b border-gray-100"
          >
            <View className="w-10 h-10 rounded-full mr-3 bg-purple-100 items-center justify-center">
              <Text>📚</Text>
            </View>
            <View className="flex-1">
              <Text className="dark:text-dark-text-default">
                <Text>Session </Text>
                <Text className="font-inter-bold dark:text-dark-text-default">
                  {notification.sessionName}
                </Text>
                {notification.type === "session_reminder" ? (
                  <Text>
                    {" "}
                    at {notification.time} {notification.date}
                  </Text>
                ) : (
                  <Text> location set to {notification.location}</Text>
                )}
              </Text>
              <Text className="text-gray-500 text-sm dark:text-dark-text-default">
                {notification.timestamp}
              </Text>
            </View>
          </View>
        );

      case "session_invite":
        return (
          <View
            key={notification.id}
            className="flex-row items-center p-4 border-b border-gray-100"
          >
            <Image
              source={{ uri: notification.user.avatar }}
              className="w-10 h-10 rounded-full mr-3"
            />
            <View className="flex-1">
              <Text className="dark:text-dark-text-default">
                <Text className="font-inter-bold dark:text-dark-text-default">
                  {notification.user.name}
                </Text>
                <Text> is having a session at </Text>
                <Text className="font-inter-bold dark:text-dark-text-default">
                  {notification.time} {notification.date}
                </Text>
                <Text> would you like to join it?</Text>
              </Text>
              <Text className="text-gray-500 text-sm dark:text-dark-text-default">
                {notification.timestamp}
              </Text>
            </View>
            {notification.requiresAction && (
              <View className="flex-row items-center">
                <TouchableOpacity className="w-8 h-8 rounded-full bg-green mr-2 items-center justify-center">
                  <Text>✓</Text>
                </TouchableOpacity>
                <TouchableOpacity className="w-8 h-8 rounded-full bg-red-100 items-center justify-center">
                  <Text>✕</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-background">
      {/* Header */}
      <View className="flex-row justify-between items-center px-4 pt-2 pb-3 mt-5 mb-2">
        <Text className="font-inter-bold text-xl dark:text-dark-text-default">
          Notifications
        </Text>
        <Text className="text-purple-default dark:text-dark-purple-default">
          Mark all as read
        </Text>
      </View>

      {/* Tabs */}
      <View className="flex-row border-b border-text-dimmed/25 dark:border-dark-text-dimmed/25 px-4">
        {[
          { name: "all", length: notifications.length },
          {
            name: "sessions",
            length: notifications.filter((n) => n.type.startsWith("session_"))
              .length,
          },
          {
            name: "friends",
            length: notifications.filter((n) => n.type.startsWith("friend_"))
              .length,
          },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.name}
            onPress={() => setActiveTab(tab.name)}
            className={`mr-6 pb-2 ${
              activeTab === tab.name
                ? "border-b-2 border-purple-default dark:border-dark-purple-default"
                : ""
            }`}
          >
            <View className="flex-row items-center">
              <Text
                className={`capitalize font-inter-medium dark:text-dark-text-default ${
                  activeTab === tab.name
                    ? "text-purple-default dark:text-dark-purple-default"
                    : "text-text-default dark:text-dark-text-default"
                }`}
              >
                {tab.name}
              </Text>
              <View
                className={`ml-1 rounded-full px-2 py-0.5 ${
                  activeTab === tab.name
                    ? "bg-purple-default dark:bg-dark-purple-default"
                    : "bg-text-dimmed dark:bg-dark-text-dimmed"
                }`}
              >
                <Text
                  className={
                    activeTab === tab.name
                      ? "text-background dark:text-dark-background"
                      : "text-text-default dark:text-dark-text-default"
                  }
                >
                  {tab.length}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Notification List */}
      <ScrollView className="flex-1">
        {filteredNotifications.map((notification) =>
          renderNotification(notification)
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
