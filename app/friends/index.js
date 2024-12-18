import { useState, useMemo } from "react";
import {
  Text,
  View,
  ScrollView,
  Pressable,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import { useUser } from "../../src/contexts/UserContext";
import Friend from "../../components/friends/Friend";
import Request from "../../components/friends/Request";
import EmptyState from "../../components/friends/EmptyState";

const FriendsTab = {
  All: "all",
  Incoming: "incoming",
  Pending: "pending",
};

function Tab({ buttons, selectedTab, setSelectedTab }) {
  return (
    <View className="flex-row px-6">
      {buttons.map((button) => {
        const selected = button === selectedTab;
        return (
          <Pressable
            key={button}
            className={`flex-1 justify-center items-center py-3 rounded-full mb-4 ${
              selected && "bg-purple-default dark:bg-dark-purple-default"
            }`}
            onPress={() => setSelectedTab(button)}
          >
            <Text
              className={`capitalize ${
                selected
                  ? "font-inter-bold text-background dark:text-dark-background"
                  : "font-inter text-text-default/50 dark:text-dark-text-default/50"
              }`}
            >
              {button}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function AllPage() {
  const { currentUser, allUsers } = useUser();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = useMemo(() => {
    if (searchQuery) {
      return Object.values(allUsers)
        .filter(
          (user) =>
            currentUser.email !== user.email &&
            (user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
              user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              user.email.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        .sort((a, b) => a.name.localeCompare(b.name));
    }
    return [];
  }, [searchQuery, allUsers]);

  return (
    <ScrollView className="flex-1 px-6">
      {currentUser.friends.allFriends.length !== 0 ? (
        <>
          {/* Search Bar */}
          <View className="flex-row items-center gap-3 px-6 py-3 bg-text-default/5 dark:bg-dark-text-default/5 rounded-full">
            <Feather
              className="opacity-50 color-text-default dark:color-dark-text-default"
              name="search"
              size={24}
            />
            <TextInput
              className="flex-1 font-inter text-text-default dark:text-dark-text-default placeholder:text-text-default/50 dark:placeholder:text-dark-text-default/50"
              placeholder="Search by name or username..."
              value={searchQuery}
              onChangeText={(text) => setSearchQuery(text)}
            />
          </View>
          {/* Friends List */}
          <View className="flex-1 mt-4 gap-1">
            {filteredUsers.length !== 0 ? (
              <>
                {filteredUsers.map((user, index) => (
                  <Friend key={index} user={user} />
                ))}
              </>
            ) : (
              <>
                {currentUser.friends.allFriends
                  .map((friend) => allUsers[friend])
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((friend, index) => (
                    <Friend key={index} user={friend} />
                  ))}
              </>
            )}
          </View>
        </>
      ) : (
        <EmptyState
          title="No Friends Yet"
          description="You don't have any friend at the moment. Start by adding them!"
          source={require("../../assets/incoming.png")}
        />
      )}
    </ScrollView>
  );
}

function IncomingPage() {
  const { currentUser, allUsers } = useUser();

  return (
    <ScrollView className="flex-1 px-6">
      {currentUser.friends.incomingRequests.length !== 0 ? (
        // Requests List
        <View className="flex-1 mt-4 gap-1">
          {currentUser.friends.incomingRequests
            .map((uid) => allUsers[uid])
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((request, index) => (
              <Request key={index} user={request} />
            ))}
        </View>
      ) : (
        <EmptyState
          title="No Incoming Requests"
          description="You don't have any friend requests at the moment. Check back later!"
          source={require("../../assets/incoming.png")}
        />
      )}
    </ScrollView>
  );
}

function PendingPage() {
  const { currentUser, allUsers } = useUser();

  return (
    <ScrollView className="flex-1 px-6">
      {currentUser.friends.pendingRequests.length !== 0 ? (
        // Requests List
        <View className="flex-1 mt-4 gap-1">
          {currentUser.friends.pendingRequests
            .map((uid) => allUsers[uid])
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((request, index) => (
              <Request key={index} user={request} />
            ))}
        </View>
      ) : (
        <EmptyState
          title="No Pending Requests"
          description="You haven't sent any friend requests yet. Find friends and start connecting!"
          source={require("../../assets/pending.png")}
        />
      )}
    </ScrollView>
  );
}

export default function Page() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState(FriendsTab.All);

  const buttons = Object.values(FriendsTab);

  return (
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
        <Text className="font-inter-bold text-text-default dark:text-dark-text-default">
          Friends List
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/friends/add")}
          className="p-4"
        >
          <Feather
            className="color-text-default dark:color-dark-text-default"
            name="user-plus"
            size={24}
          />
        </TouchableOpacity>
      </View>
      {/* Tabs */}
      <Tab
        buttons={buttons}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />
      {/* Pages based on selectedTab */}
      {selectedTab === FriendsTab.All && <AllPage />}
      {selectedTab === FriendsTab.Incoming && <IncomingPage />}
      {selectedTab === FriendsTab.Pending && <PendingPage />}
    </SafeAreaView>
  );
}
