import { Text, View, ScrollView, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useMemo, useEffect } from "react";
import { useUser } from "../../../src/contexts/UserContext";
import { ChatTemplate, TimerTemplate, FriendsTemplate, ProfileTemplate, SettingsTemplate, CalendarTemplate } from "../../../src/Schema";


const MOCK_USERS = {
  'user123': {
    uid: 'user123',
    name: 'Lauren Smith',
    email: 'lauren@test.com',
    username: 'laurensmith',
    password: 'password123',
    profilePicture: 'https://avatar.iran.liara.run/public/1',
    profile: {
      ...ProfileTemplate,
      aboutMe: "Computer Science Student",
      currentCourses: ["COMP1511", "MATH1141"],
      memberSince: "2024-01",
    },
    friends: {
      ...FriendsTemplate,
      incomingRequests: [],
      pendingRequests: [],
      allFriends: [],
    },
    settings: { ...SettingsTemplate },
    calendar: { ...CalendarTemplate },
    studySessions: [],
  },
  'user456': {
    uid: 'user456',
    name: 'Emma Wilson',
    email: 'emma@test.com',
    username: 'emmawilson',
    password: 'password456',
    profilePicture: 'https://avatar.iran.liara.run/public/6',
    profile: {
      ...ProfileTemplate,
      aboutMe: "Engineering Student",
      currentCourses: ["ENGG1000", "PHYS1121"],
      memberSince: "2024-01",
    },
    friends: { ...FriendsTemplate },
    settings: { ...SettingsTemplate },
    calendar: { ...CalendarTemplate },
    studySessions: [],
  },
  'user789': {
    uid: 'user789',
    name: 'Michael Chen',
    email: 'michael@test.com',
    username: 'michaelchen',
    password: 'password789',
    profilePicture: 'https://avatar.iran.liara.run/public/3',
    profile: {
      ...ProfileTemplate,
      aboutMe: "Mathematics Student",
      currentCourses: ["MATH1141", "MATH1241"],
      memberSince: "2024-01",
    },
    friends: { ...FriendsTemplate },
    settings: { ...SettingsTemplate },
    calendar: { ...CalendarTemplate },
    studySessions: [],
  },
  'user101': {
    uid: 'user101',
    name: 'Sarah Johnson',
    email: 'sarah@test.com',
    username: 'sarahjohnson',
    password: 'password101',
    profilePicture: 'https://avatar.iran.liara.run/public/4',
    profile: {
      ...ProfileTemplate,
      aboutMe: "Physics Student",
      currentCourses: ["PHYS1121", "MATH1141"],
      memberSince: "2024-01",
    },
    friends: { ...FriendsTemplate },
    settings: { ...SettingsTemplate },
    calendar: { ...CalendarTemplate },
    studySessions: [],
  },
};


const DUMMY_NOTIFICATIONS = [
  {
    id: 1,
    type: 'friend_request',
    user: {
      uid: 'user123',
      name: 'Lauren Smith',
      avatar: 'https://avatar.iran.liara.run/public/1'
    },
    message: 'sent you a friend request',
    timestamp: '5 mins ago',
    requiresAction: true,
    category: 'friends'
  },
  {
    id: 3,
    type: 'friend_request',
    user: {
      uid: 'user101',
      name: 'Sarah Johnson',
      avatar: 'https://avatar.iran.liara.run/public/4'
    },
    message: 'sent you a friend request',
    timestamp: '15 mins ago',
    requiresAction: true,
    category: 'friends'
  },
  {
    id: 4,
    type: 'session_invite',
    user: {
      uid: 'user456',
      name: 'Emma Wilson',
      avatar: 'https://avatar.iran.liara.run/public/6'
    },
    time: '4:00 PM',
    date: 'Tomorrow',
    location: 'Main Library',
    timestamp: '20 mins ago',
    requiresAction: true,
    category: 'sessions'
  },
  {
    id: 7,
    type: 'session_location',
    sessionName: 'MATH1141 Study Group',
    location: 'Room 205, Mathematics Building',
    timestamp: '30 mins ago',
    category: 'sessions'
  },
  {
    id: 8,
    type: 'session_location',
    sessionName: 'Physics Group Study',
    location: 'Physics Library, Level 2',
    timestamp: '1 hour ago',
    category: 'sessions'
  },
  {
    id: 6,
    type: 'session_invite',
    user: {
      uid: 'user123',
      name: 'Lauren Smith',
      avatar: 'https://avatar.iran.liara.run/public/1'
    },
    time: '10:00 AM',
    date: 'Saturday',
    location: 'Science Building',
    timestamp: '2 hours ago',
    requiresAction: true,
    category: 'sessions'
  },
  {
    id: 11,
    type: 'session_reminder',
    sessionName: 'Physics Group Study',
    time: '11:00 AM',
    date: 'Tomorrow',
    timestamp: '2 hours ago',
    category: 'sessions'
  }
];

export default function Page() {
  const { acceptIncomingRequest, denyIncomingRequest, currentUser, addUser } = useUser();
  const [activeTab, setActiveTab] = useState('all');
  const [notifications, setNotifications] = useState(DUMMY_NOTIFICATIONS);


  const initializeMockUsers = async () => {
    try {
      for (const user of Object.values(MOCK_USERS)) {
        await addUser(user);
      }
      console.log('Mock users initialized');
    } catch (error) {
      console.error('Error initializing mock users:', error);
    }
  };

  useEffect(() => {
    initializeMockUsers();
  }, []);

  const removeNotification = (notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const handleAcceptRequest = async (uid, notificationId) => {
    try {
      
      // add the friend request to the database
      const targetUser = MOCK_USERS[uid];
      if (!targetUser) throw new Error('User not found');
      
      // update the current user's incoming requests
      const updatedCurrentUser = {
        ...currentUser,
        friends: {
          ...currentUser.friends,
          incomingRequests: [...currentUser.friends.incomingRequests, uid]
        }
      };
      await addUser(updatedCurrentUser);

      // update the target user's pending requests
      const updatedTargetUser = {
        ...targetUser,
        friends: {
          ...targetUser.friends,
          pendingRequests: [...targetUser.friends.pendingRequests, currentUser.uid]
        }
      };
      await addUser(updatedTargetUser);

      // accept the request
      await acceptIncomingRequest(uid);
      removeNotification(notificationId);
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  const handleDenyRequest = async (uid, notificationId) => {
    try {
      await denyIncomingRequest(uid);
      removeNotification(notificationId);
    } catch (error) {
      console.error('Error denying friend request:', error);
    }
  };

  const handleAcceptSession = async (sessionData, notificationId) => {
    try {
      const newSession = {
        sessionId: `session_${Date.now()}`,
        date: sessionData.date,
        time: sessionData.time,
        location: sessionData.location || '',
        members: [currentUser.uid, sessionData.user.uid],
        chat: ChatTemplate,
        timer: TimerTemplate,
      };

      // update both users with the new session
      const updatedCurrentUser = {
        ...currentUser,
        studySessions: [...currentUser.studySessions, newSession]
      };
      await addUser(updatedCurrentUser);

      const targetUser = MOCK_USERS[sessionData.user.uid];
      if (targetUser) {
        const updatedTargetUser = {
          ...targetUser,
          studySessions: [...targetUser.studySessions, newSession]
        };
        await addUser(updatedTargetUser);
      }

      removeNotification(notificationId);
    } catch (error) {
      console.error('Error accepting session invite:', error);
    }
  };

  const handleDenySession = async (sessionData, notificationId) => {
    try {
      removeNotification(notificationId);
    } catch (error) {
      console.error('Error denying session invite:', error);
    }
  };

  const filteredNotifications = useMemo(() => {
    if (activeTab === 'all') return notifications;
    return notifications.filter(notification => {
      if (activeTab === 'friends') return notification.type.startsWith('friend_');
      if (activeTab === 'sessions') return notification.type.startsWith('session_');
      return true;
    });
  }, [activeTab, notifications]);

  const handleMarkAllAsRead = () => {
    setNotifications([]);
  };

  const renderNotification = (notification) => {
    switch (notification.type) {
      case 'friend_request':
        return (
          <View key={notification.id} className="flex-row items-start p-4">
            <Image
              source={{ uri: notification.user.avatar }}
              className="w-12 h-12 rounded-full mr-3"
            />
            <View className="flex-1">
              <Text className="dark:text-dark-text-default">
                <Text className="font-inter-bold dark:text-dark-text-default">{notification.user.name}</Text>
                <Text> {notification.message}</Text>
              </Text>
              <Text className="text-gray-500 text-sm">{notification.timestamp}</Text>
            </View>
            {notification.requiresAction && (
              <View className="flex-row items-center">
                <TouchableOpacity 
                  onPress={() => handleAcceptRequest(notification.user.uid, notification.id)}
                  className="w-12 h-12 rounded-full bg-success-background dark:bg-dark-success-background mr-2 items-center justify-center"
                >
                  <Text className="text-success-text dark:text-dark-success-text text-2xl">✓</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => handleDenyRequest(notification.user.uid, notification.id)}
                  className="w-12 h-12 rounded-full bg-failure-background dark:bg-dark-alert-background items-center justify-center"
                >
                  <Text className="text-failure-text dark:text-dark-alert-text text-2xl">✕</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        );

      case 'session_reminder':
      case 'session_location':
        return (
          <View key={notification.id} className="flex-row items-start p-4">
            <View className="w-12 h-12 rounded-full mr-3 bg-purple-100 dark:bg-purple-900 items-center justify-center">
              <Text className="text-2xl">📚</Text>
            </View>
            <View className="flex-1">
              <Text className="dark:text-dark-text-default">
                <Text>Session </Text>
                <Text className="font-inter-bold dark:text-dark-text-default">{notification.sessionName}</Text>
                {notification.type === 'session_reminder' ? (
                  <Text> at {notification.time} {notification.date}</Text>
                ) : (
                  <Text> location set to {notification.location}</Text>
                )}
              </Text>
              <Text className="text-gray-500 text-sm dark:text-dark-text-default">{notification.timestamp}</Text>
            </View>
          </View>
        );

      case 'session_invite':
        return (
          <View key={notification.id} className="flex-row items-start p-4">
            <Image
              source={{ uri: notification.user.avatar }}
              className="w-12 h-12 rounded-full mr-3"
            />
            <View className="flex-1">
              <Text className="dark:text-dark-text-default">
                <Text className="font-inter-bold dark:text-dark-text-default">{notification.user.name}</Text>
                <Text> is having a session at </Text>
                <Text className="font-inter-bold dark:text-dark-text-default">{notification.time} {notification.date}</Text>
                <Text> would you like to join it?</Text>
              </Text>
              <Text className="text-gray-500 text-sm dark:text-dark-text-default">{notification.timestamp}</Text>
            </View>
            {notification.requiresAction && (
              <View className="flex-row items-center">
                <TouchableOpacity 
                  onPress={() => handleAcceptSession(notification, notification.id)}
                  className="w-12 h-12 rounded-full bg-success-background dark:bg-dark-success-background mr-2 items-center justify-center"
                >
                  <Text className="text-success-text dark:text-dark-success-text text-2xl">✓</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => handleDenySession(notification, notification.id)}
                  className="w-12 h-12 rounded-full bg-failure-background dark:bg-dark-alert-background items-center justify-center"
                >
                  <Text className="text-failure-text dark:text-dark-alert-text text-2xl">✕</Text>
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
      <View className="flex-row justify-between items-center px-4 pt-2 pb-9">
        <Text className="font-inter-bold text-xl dark:text-dark-text-default">Notifications</Text>
        <TouchableOpacity onPress={handleMarkAllAsRead}>
          <Text className="text-purple-600 dark:text-dark-purple-default">Mark all as read</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View className="flex-row border-b border-[#DCDCDC] px-4">
        <TouchableOpacity
          onPress={() => setActiveTab('all')}
          className={`mr-6 pb-2 ${activeTab === 'all' ? 'border-b-2 border-purple-600 dark:border-dark-purple-tertiary' : ''}`}
        >
          <View className="flex-row items-center">
            <Text className={`font-inter-medium dark:text-dark-text-default ${activeTab === 'all' ? 'text-purple-600 dark:text-dark-purple-tertiary' : ''}`}>
              All
            </Text>
            <View className={`ml-1 rounded-full px-2 py-0.5 ${activeTab === 'all' ? 'bg-purple-600' : 'bg-[#EBE5FC] dark:bg-dark-purple-secondary'}`}>
              <Text className={activeTab === 'all' ? 'text-white' : 'text-purple-600 dark:text-white'}>
                {notifications.length}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('sessions')}
          className={`mr-6 pb-2 ${activeTab === 'sessions' ? 'border-b-2 border-purple-600 dark:border-dark-purple-tertiary' : ''}`}
        >
          <View className="flex-row items-center">
            <Text className={`font-inter-medium dark:text-dark-text-default ${activeTab === 'sessions' ? 'text-purple-600 dark:text-dark-purple-tertiary' : ''}`}>
              Sessions
            </Text>
            <View className={`ml-1 rounded-full px-2 py-0.5 ${activeTab === 'sessions' ? 'bg-purple-600' : 'bg-[#EBE5FC] dark:bg-dark-purple-secondary'}`}>
              <Text className={activeTab === 'sessions' ? 'text-white' : 'text-purple-600 dark:text-white'}>
                {notifications.filter(n => n.type.startsWith('session_')).length}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('friends')}
          className={`pb-2 ${activeTab === 'friends' ? 'border-b-2 border-purple-600 dark:border-dark-purple-tertiary' : ''}`}
        >
          <View className="flex-row items-center">
            <Text className={`font-inter-medium dark:text-dark-text-default ${activeTab === 'friends' ? 'text-purple-600 dark:text-dark-purple-tertiary' : ''}`}>
              Friends
            </Text>
            <View className={`ml-1 rounded-full px-2 py-0.5 ${activeTab === 'friends' ? 'bg-purple-600' : 'bg-[#EBE5FC] dark:bg-dark-purple-secondary'}`}>
              <Text className={activeTab === 'friends' ? 'text-white' : 'text-purple-600 dark:text-white'}>
                {notifications.filter(n => n.type.startsWith('friend_')).length}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* Notification List */}
      <ScrollView className="flex-1">
        {filteredNotifications.map(notification => renderNotification(notification))}
      </ScrollView>

    </SafeAreaView>
  );
}
