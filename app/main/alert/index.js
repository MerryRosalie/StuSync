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
        name: sessionData.name || "Study Session",
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
          router.replace("/chat");
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
