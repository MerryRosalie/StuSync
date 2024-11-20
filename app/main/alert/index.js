import { Text, View, ScrollView, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useMemo, useEffect } from "react";
import { useUser } from "../../../src/contexts/UserContext";
import { ChatTemplate, TimerTemplate } from "../../../src/Schema";
import { useRouter } from "expo-router";
import FriendRequestNotification from "../../../components/notifications/FriendRequestNotification";
import SessionReminderNotification from "../../../components/notifications/SessionReminderNotification";
import SessionInviteNotification from "../../../components/notifications/SessionInviteNotification";
import Alert from "../../../components/notifications/Alert";

export default function Page() {
  const {
    acceptIncomingRequest,
    denyIncomingRequest,
    currentUser,
    addUser,
    allUsers,
  } = useUser();
  const router = useRouter();
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

      const updatedCurrentUser = {
        ...currentUser,
        friends: {
          ...currentUser.friends,
          incomingRequests: [...currentUser.friends.incomingRequests, uid],
        },
      };
      await addUser(updatedCurrentUser);

      const updatedTargetUser = {
        ...targetUser,
        friends: {
          ...targetUser.friends,
          pendingRequests: [
            ...targetUser.friends.pendingRequests,
            currentUser.uid,
          ],
        },
      };
      await addUser(updatedTargetUser);

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
        members: [currentUser.uid, sessionData.user.uid],
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
      const targetUser = allUsers[sessionData.user.uid];
      if (targetUser) {
        const updatedTargetUser = {
          ...targetUser,
          studySessions: [...targetUser.studySessions, newSession],
        };
        await addUser(updatedTargetUser);
      }

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
    if (activeTab === "all") return notifications;
    return notifications.filter((notification) => {
      if (activeTab === "friends")
        return notification.type.startsWith("friend_");
      if (activeTab === "sessions")
        return notification.type.startsWith("session_");
      return true;
    });
  }, [activeTab, notifications]);

  // Renders the notification based on the type
  const renderNotification = (notification) => {
    switch (notification.type) {
      case "friend_request":
        return (
          <FriendRequestNotification
            key={notification.id}
            notification={notification}
            onAccept={handleAcceptRequest}
            onDeny={handleDenyRequest}
          />
        );

      case "session_reminder":
      case "session_location":
        return (
          <SessionReminderNotification
            key={notification.id}
            notification={notification}
          />
        );

      case "session_invite":
        return (
          <SessionInviteNotification
            key={notification.id}
            notification={notification}
            onAccept={handleAcceptSession}
            onDeny={handleDenySession}
            currentUserSessions={currentUser?.studySessions || []}
          />
        );
    }
  };

  // Updates the current users notifications
  useEffect(() => {
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        notifications: notifications,
      };
      addUser(updatedUser);
    }
  }, [notifications]);

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-background">
      {/* Joined Banner */}
      <Alert
        visible={showJoinedBanner}
        onClose={() => setShowJoinedBanner(false)}
        onPress={() => {
          setShowJoinedBanner(false);
          router.push("/chat");
        }}
        title="Joined a study session"
        message="Tap here to navigate to the study session"
      />

      {/* Error Banner */}
      <Alert
        visible={showErrorBanner}
        onClose={() => setShowErrorBanner(false)}
        onPress={() => setShowErrorBanner(false)}
        title="Cannot Join Session"
        message="You already have an active study session. Please complete or leave your current session before joining a new one."
      />

      {/* Header */}
      <View className="flex-row justify-between items-center px-4 pt-2 pb-9 mt-5 mb-2">
        <Text className="font-inter-bold text-xl dark:text-dark-text-default">
          Notifications
        </Text>
        <Text className="text-purple-600 dark:text-dark-purple-default">
          Mark all as read
        </Text>
      </View>

      {/* Tabs */}
      <View className="flex-row border-b border-[#DCDCDC] px-4">
        {/* All Tab */}
        <TouchableOpacity
          onPress={() => setActiveTab("all")}
          className={`mr-6 pb-2 ${
            activeTab === "all"
              ? "border-b-2 border-purple-600 dark:border-dark-purple-tertiary"
              : ""
          }`}
        >
          <View className="flex-row items-center">
            <Text
              className={`font-inter-medium dark:text-dark-text-default ${
                activeTab === "all"
                  ? "text-purple-600 dark:text-dark-purple-tertiary"
                  : ""
              }`}
            >
              All
            </Text>
            <View
              className={`ml-1 rounded-full px-2 py-0.5 ${
                activeTab === "all"
                  ? "bg-purple-600"
                  : "bg-[#EBE5FC] dark:bg-dark-purple-secondary"
              }`}
            >
              <Text
                className={
                  activeTab === "all"
                    ? "text-white"
                    : "text-purple-600 dark:text-white"
                }
              >
                {notifications.length}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        {/* Sessions Tab */}
        <TouchableOpacity
          onPress={() => setActiveTab("sessions")}
          className={`mr-6 pb-2 ${
            activeTab === "sessions"
              ? "border-b-2 border-purple-600 dark:border-dark-purple-tertiary"
              : ""
          }`}
        >
          <View className="flex-row items-center">
            <Text
              className={`font-inter-medium dark:text-dark-text-default ${
                activeTab === "sessions"
                  ? "text-purple-600 dark:text-dark-purple-tertiary"
                  : ""
              }`}
            >
              Sessions
            </Text>
            <View
              className={`ml-1 rounded-full px-2 py-0.5 ${
                activeTab === "sessions"
                  ? "bg-purple-600"
                  : "bg-[#EBE5FC] dark:bg-dark-purple-secondary"
              }`}
            >
              <Text
                className={
                  activeTab === "sessions"
                    ? "text-white"
                    : "text-purple-600 dark:text-white"
                }
              >
                {
                  notifications.filter((n) => n.type.startsWith("session_"))
                    .length
                }
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        {/* Friends Tab */}
        <TouchableOpacity
          onPress={() => setActiveTab("friends")}
          className={`pb-2 ${
            activeTab === "friends"
              ? "border-b-2 border-purple-600 dark:border-dark-purple-tertiary"
              : ""
          }`}
        >
          <View className="flex-row items-center">
            <Text
              className={`font-inter-medium dark:text-dark-text-default ${
                activeTab === "friends"
                  ? "text-purple-600 dark:text-dark-purple-tertiary"
                  : ""
              }`}
            >
              Friends
            </Text>
            <View
              className={`ml-1 rounded-full px-2 py-0.5 ${
                activeTab === "friends"
                  ? "bg-purple-600"
                  : "bg-[#EBE5FC] dark:bg-dark-purple-secondary"
              }`}
            >
              <Text
                className={
                  activeTab === "friends"
                    ? "text-white"
                    : "text-purple-600 dark:text-white"
                }
              >
                {
                  notifications.filter((n) => n.type.startsWith("friend_"))
                    .length
                }
              </Text>
            </View>
          </View>
        </TouchableOpacity>
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
