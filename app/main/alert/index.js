import { Text, View, ScrollView, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useMemo } from "react";

const DUMMY_NOTIFICATIONS = [
  {
    id: 1,
    type: 'friend_request',
    user: {
      id: 1,
      name: 'Lauren Smith',
      avatar: 'https://avatar.iran.liara.run/public/1'
    },
    message: 'sent you a friend request',
    timestamp: '5 mins ago',
    requiresAction: true,
    category: 'friends'
  },
  {
    id: 2,
    type: 'session_reminder',
    sessionName: 'Quokka',
    time: '5:30PM',
    date: 'Today',
    timestamp: '30 mins ago',
    category: 'sessions'
  },
  {
    id: 3,
    type: 'session_location',
    sessionName: 'Quokka',
    location: 'RM 402 Main Library UNSW',
    timestamp: '1 hour ago',
    category: 'sessions'
  },
  {
    id: 10,
    type: 'session_invite',
    user: {
      id: 6,
      name: 'Emma Wilson',
      avatar: 'https://avatar.iran.liara.run/public/6'
    },
    time: '4PM',
    date: 'Tomorrow',
    timestamp: '6 hours ago',
    requiresAction: true,
    category: 'sessions'
  },
  {
    id: 4,
    type: 'session_invite',
    user: {
      id: 2,
      name: 'Amy Smith',
      avatar: 'https://avatar.iran.liara.run/public/2'
    },
    time: '3PM',
    date: 'Today',
    timestamp: '2 hours ago',
    requiresAction: true,
    category: 'sessions'
  },
  {
    id: 5,
    type: 'friend_request',
    user: {
      id: 3,
      name: 'Peter Tran',
      avatar: 'https://avatar.iran.liara.run/public/3'
    },
    message: 'sent you a friend request',
    timestamp: '3 hours ago',
    requiresAction: true,
    category: 'friends'
  },
  {
    id: 6,
    type: 'session_invite',
    user: {
      id: 4,
      name: 'Sarah Johnson',
      avatar: 'https://avatar.iran.liara.run/public/4'
    },
    time: '2PM',
    date: 'Tomorrow',
    timestamp: '3 hours ago',
    requiresAction: true,
    category: 'sessions'
  },
  {
    id: 7,
    type: 'session_location',
    sessionName: 'Physics Study Group',
    location: 'Physics Building Room 205',
    timestamp: '4 hours ago',
    category: 'sessions'
  },
  {
    id: 8,
    type: 'friend_request',
    user: {
      id: 5,
      name: 'Michael Chang',
      avatar: 'https://avatar.iran.liara.run/public/5'
    },
    message: 'sent you a friend request',
    timestamp: '5 hours ago',
    requiresAction: true,
    category: 'friends'
  },
  {
    id: 9,
    type: 'session_reminder',
    sessionName: 'Chemistry Lab Prep',
    time: '11:00AM',
    date: 'Tomorrow',
    timestamp: '5 hours ago',
    category: 'sessions'
  },

];

export default function Page() {
  const [activeTab, setActiveTab] = useState('all');

  const filteredNotifications = useMemo(() => {
    if (activeTab === 'all') return DUMMY_NOTIFICATIONS;
    return DUMMY_NOTIFICATIONS.filter(notification => {
      if (activeTab === 'friends') return notification.type.startsWith('friend_');
      if (activeTab === 'sessions') return notification.type.startsWith('session_');
      return true;
    });
  }, [activeTab]);

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
                <TouchableOpacity className="w-12 h-12 rounded-full bg-success-background dark:bg-dark-success-background mr-2 items-center justify-center">
                  <Text className="text-success-text dark:text-dark-success-text text-2xl">✓</Text>
                </TouchableOpacity>
                <TouchableOpacity className="w-12 h-12 rounded-full bg-failure-background dark:bg-dark-alert-background  items-center justify-center">
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
               <TouchableOpacity className="w-12 h-12 rounded-full bg-success-background dark:bg-dark-success-background mr-2 items-center justify-center">
                 <Text className="text-success-text dark:text-dark-success-text text-2xl">✓</Text>
               </TouchableOpacity>
               <TouchableOpacity className="w-12 h-12 rounded-full bg-failure-background dark:bg-dark-alert-background  items-center justify-center">
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
        <TouchableOpacity>
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
                {DUMMY_NOTIFICATIONS.length}
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
                {DUMMY_NOTIFICATIONS.filter(n => n.type.startsWith('session_')).length}
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
                {DUMMY_NOTIFICATIONS.filter(n => n.type.startsWith('friend_')).length}
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
