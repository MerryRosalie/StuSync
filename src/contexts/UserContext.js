import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  FriendsTemplate,
  ProfileTemplate,
  SettingsTemplate,
  CalendarTemplate,
  generateProfilePicture,
} from "../Schema";

const UserContext = createContext();

// Mock users as app is beta used as friends for the current user
const MOCK_USERS = {
  user123: {
    uid: "user123",
    name: "Lauren Smith",
    email: "lauren@test.com",
    username: "laurensmith",
    password: "password123",
    profilePicture: "https://avatar.iran.liara.run/public/1",
    profile: {
      profilePicture: generateProfilePicture("Lauren Smith"),
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
  user456: {
    uid: "user456",
    name: "Emma Wilson",
    email: "emma@test.com",
    username: "emmawilson",
    password: "password456",
    profilePicture: "https://avatar.iran.liara.run/public/6",
    profile: {
      profilePicture: generateProfilePicture("Emma Wilson"),
      aboutMe: "Engineering Student",
      currentCourses: ["ENGG1000", "PHYS1121"],
      memberSince: "2024-01",
    },
    friends: { ...FriendsTemplate },
    settings: { ...SettingsTemplate },
    calendar: { ...CalendarTemplate },
    studySessions: [],
  },
  user789: {
    uid: "user789",
    name: "Michael Chen",
    email: "michael@test.com",
    username: "michaelchen",
    password: "password789",
    profilePicture: "https://avatar.iran.liara.run/public/3",
    profile: {
      profilePicture: generateProfilePicture("Michael Chen"),
      aboutMe: "Mathematics Student",
      currentCourses: ["MATH1141", "MATH1241"],
      memberSince: "2024-01",
    },
    friends: { ...FriendsTemplate },
    settings: { ...SettingsTemplate },
    calendar: { ...CalendarTemplate },
    studySessions: [],
  },
  user101: {
    uid: "user101",
    name: "Sarah Johnson",
    email: "sarah@test.com",
    username: "sarahjohnson",
    password: "password101",
    profilePicture: "https://avatar.iran.liara.run/public/4",
    profile: {
      profilePicture: generateProfilePicture("Sarah Johnson"),
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

export const UserProvider = ({ children }) => {
  const [userStore, setUserStore] = useState({
    activeUser: null,
    users: {},
  });
  const [isLoading, setIsLoading] = useState(true);

  // Initialise mock users when the app starts
  const initialiseUsers = async () => {
    try {
      const currentStore = await AsyncStorage.getItem("userStore");
      if (!currentStore) {
        // Only initialize mock users if there's no existing store
        const initialStore = {
          activeUser: null,
          users: MOCK_USERS,
        };
        await AsyncStorage.setItem("userStore", JSON.stringify(initialStore));
        setUserStore(initialStore);
      } else {
        // If store exists, make sure all mock users are present
        const parsedStore = JSON.parse(currentStore);
        const updatedUsers = {
          ...MOCK_USERS,
          ...parsedStore.users,
        };
        const updatedStore = {
          ...parsedStore,
          users: updatedUsers,
        };
        await AsyncStorage.setItem("userStore", JSON.stringify(updatedStore));
        setUserStore(updatedStore);
      }
    } catch (error) {
      console.error("Error initializing mock users:", error);
    }
  };

  useEffect(() => {
    const initialise = async () => {
      await initialiseUsers();
      setIsLoading(false);
    };
    initialise();
  }, []);

  const saveUserStore = async (newUserStore) => {
    try {
      const currentStore = await AsyncStorage.getItem("userStore");
      let finalStore = newUserStore;

      if (currentStore) {
        const parsedStore = JSON.parse(currentStore);
        finalStore = {
          ...parsedStore,
          ...newUserStore,
          users: {
            ...parsedStore.users,
            ...newUserStore.users,
          },
        };
      }

      await AsyncStorage.setItem("userStore", JSON.stringify(finalStore));
      setUserStore(finalStore);
    } catch (error) {
      throw error;
    }
  };

  const addUser = async (user) => {
    try {
      if (!user.uid || !user.email || !user.password) {
        throw new Error("Invalid user object");
      }

      const currentStore = await AsyncStorage.getItem("userStore");
      const baseStore = currentStore ? JSON.parse(currentStore) : userStore;

      const newUserStore = {
        ...baseStore,
        users: {
          ...baseStore.users,
          [user.uid]: user,
        },
      };

      await saveUserStore(newUserStore);
      return user;
    } catch (error) {
      throw error;
    }
  };

  const editUser = async (uid, updates) => {
    try {
      const newUserStore = { ...userStore };
      if (!newUserStore.users[uid]) {
        throw new Error("User not found");
      }

      // Update the user while preserving existing data structure
      newUserStore.users[uid] = {
        ...newUserStore.users[uid],
        ...updates,
        // Handle nested updates
        studySessions: Array.isArray(updates.studySessions)
          ? updates.studySessions
          : newUserStore.users[uid].studySessions,
        profile: updates.profile
          ? { ...newUserStore.users[uid].profile, ...updates.profile }
          : newUserStore.users[uid].profile,
        friends: updates.friends
          ? { ...newUserStore.users[uid].friends, ...updates.friends }
          : newUserStore.users[uid].friends,
        settings: updates.settings
          ? { ...newUserStore.users[uid].settings, ...updates.settings }
          : newUserStore.users[uid].settings,
      };

      await saveUserStore(newUserStore);

      // If we're editing the current user, trigger a re-render
      if (uid === userStore.activeUser) {
        await setCurrentUser(uid);
      }

      return newUserStore.users[uid];
    } catch (error) {
      console.error("Error editing user:", error);
      throw error;
    }
  };

  const setCurrentUser = async (uid) => {
    try {
      const currentStore = await AsyncStorage.getItem("userStore");
      const baseStore = currentStore ? JSON.parse(currentStore) : userStore;

      const newUserStore = {
        ...baseStore,
        activeUser: uid,
      };

      await saveUserStore(newUserStore);
    } catch (error) {
      throw error;
    }
  };

  const removeUser = async (uid) => {
    const newUsers = { ...userStore.users };
    delete newUsers[uid];
    const newUserStore = {
      ...userStore,
      users: newUsers,
      activeUser: userStore.activeUser === uid ? null : userStore.activeUser,
    };
    await saveUserStore(newUserStore);
  };

  const currentUser = userStore.activeUser
    ? userStore.users[userStore.activeUser]
    : null;

  const addPendingRequest = async (uid) => {
    try {
      const newUserStore = { ...userStore };
      if (currentUser && newUserStore.users[uid]) {
        // Check if request already exists
        if (
          newUserStore.users[
            newUserStore.activeUser
          ].friends.pendingRequests.includes(uid)
        ) {
          throw new Error("Friend request already sent");
        }

        // Check if they're already friends
        if (
          newUserStore.users[
            newUserStore.activeUser
          ].friends.allFriends.includes(uid)
        ) {
          throw new Error("Users are already friends");
        }

        // Add users to list of pending requests
        const newPendingRequests = Array.from(
          new Set([
            ...newUserStore.users[newUserStore.activeUser].friends
              .pendingRequests,
            uid,
          ])
        );
        newUserStore.users[newUserStore.activeUser].friends.pendingRequests =
          newPendingRequests;

        // Add current user to list of incoming requests
        const newIncomingRequests = Array.from(
          new Set([
            ...newUserStore.users[uid].friends.incomingRequests,
            currentUser.uid,
          ])
        );
        newUserStore.users[uid].friends.incomingRequests = newIncomingRequests;

        await saveUserStore(newUserStore);
      } else {
        throw new Error("Error in sending a friend request");
      }
    } catch (error) {
      throw error;
    }
  };

  const cancelPendingRequest = async (uid) => {
    try {
      const newUserStore = { ...userStore };
      if (currentUser && newUserStore.users[uid]) {
        // Remove uid from current user's pending requests
        newUserStore.users[currentUser.uid].friends.pendingRequests =
          newUserStore.users[currentUser.uid].friends.pendingRequests.filter(
            (id) => id !== uid
          );

        // Remove current user from target user's incoming requests
        newUserStore.users[uid].friends.incomingRequests = newUserStore.users[
          uid
        ].friends.incomingRequests.filter((id) => id !== currentUser.uid);

        await saveUserStore(newUserStore);
      } else {
        throw new Error("Error in canceling friend request");
      }
    } catch (error) {
      throw error;
    }
  };

  const acceptIncomingRequest = async (uid) => {
    try {
      const newUserStore = { ...userStore };
      if (currentUser && newUserStore.users[uid]) {
        // Verify request exists
        if (
          !newUserStore.users[
            currentUser.uid
          ].friends.incomingRequests.includes(uid)
        ) {
          throw new Error("No pending request found");
        }

        // Check if already friends
        if (
          newUserStore.users[currentUser.uid].friends.allFriends.includes(uid)
        ) {
          throw new Error("Users are already friends");
        }

        // Remove uid from current user's incoming requests
        newUserStore.users[currentUser.uid].friends.incomingRequests =
          newUserStore.users[currentUser.uid].friends.incomingRequests.filter(
            (id) => id !== uid
          );

        // Remove current user from sender's pending requests
        newUserStore.users[uid].friends.pendingRequests = newUserStore.users[
          uid
        ].friends.pendingRequests.filter((id) => id !== currentUser.uid);

        // Add to both users' friends lists (using Set to prevent duplicates)
        newUserStore.users[currentUser.uid].friends.allFriends = Array.from(
          new Set([
            ...newUserStore.users[currentUser.uid].friends.allFriends,
            uid,
          ])
        );

        newUserStore.users[uid].friends.allFriends = Array.from(
          new Set([
            ...newUserStore.users[uid].friends.allFriends,
            currentUser.uid,
          ])
        );

        await saveUserStore(newUserStore);
      } else {
        throw new Error("Error in accepting friend request");
      }
    } catch (error) {
      throw error;
    }
  };

  const denyIncomingRequest = async (uid) => {
    try {
      const newUserStore = { ...userStore };
      if (currentUser && newUserStore.users[uid]) {
        // Verify request exists
        if (
          !newUserStore.users[
            currentUser.uid
          ].friends.incomingRequests.includes(uid)
        ) {
          throw new Error("No pending request found");
        }

        // Remove uid from current user's incoming requests
        newUserStore.users[currentUser.uid].friends.incomingRequests =
          newUserStore.users[currentUser.uid].friends.incomingRequests.filter(
            (id) => id !== uid
          );

        // Remove current user from sender's pending requests
        newUserStore.users[uid].friends.pendingRequests = newUserStore.users[
          uid
        ].friends.pendingRequests.filter((id) => id !== currentUser.uid);

        await saveUserStore(newUserStore);
      } else {
        throw new Error("Error in denying friend request");
      }
    } catch (error) {
      throw error;
    }
  };

  const unfriend = async (uid) => {
    try {
      const newUserStore = { ...userStore };
      if (currentUser && newUserStore.users[uid]) {
        // Verify they are actually friends
        if (
          !newUserStore.users[currentUser.uid].friends.allFriends.includes(uid)
        ) {
          throw new Error("Users are not friends");
        }

        // Remove uid from current user's friends list
        newUserStore.users[currentUser.uid].friends.allFriends =
          newUserStore.users[currentUser.uid].friends.allFriends.filter(
            (id) => id !== uid
          );

        // Remove current user from target user's allFriends
        newUserStore.users[uid].friends.allFriends = newUserStore.users[
          uid
        ].friends.allFriends.filter((id) => id !== currentUser.uid);

        await saveUserStore(newUserStore);
      } else {
        throw new Error("Error in unfriending user");
      }
    } catch (error) {
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const user = Object.values(userStore.users).find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );

      if (!user) {
        throw new Error("No account found with this email");
      }

      if (user.password !== password) {
        throw new Error("Incorrect password");
      }

      await setCurrentUser(user.uid);
      return user;
    } catch (error) {
      throw error;
    }
  };

  const checkEmailExists = (email) => {
    return Object.values(userStore.users).some(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  };

  const checkUsernameExists = (username) => {
    return Object.values(userStore.users).some(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  };

  const clearStorage = async () => {
    try {
      await AsyncStorage.clear();
      setUserStore({
        activeUser: null,
        users: {},
      });
      console.log("Storage successfully cleared!");
    } catch (error) {
      console.error("Error clearing storage:", error);
    }
  };

  // Add chat to a session
  const addChatToSession = async (chat, sessionId) => {
    try {
      const newUserStore = { ...userStore };
      if (currentUser && newUserStore.users[currentUser.uid]) {
        const currentUserData = newUserStore.users[currentUser.uid];
        const sessionIndex = currentUserData.studySessions.findIndex(
          (session) => session.sessionId === sessionId
        );

        if (sessionIndex !== -1) {
          // Add chat to the current user's session
          currentUserData.studySessions[sessionIndex].chat.messages = [
            ...currentUserData.studySessions[sessionIndex].chat.messages,
            chat,
          ];

          // Get all session members
          const sessionMembers =
            currentUserData.studySessions[sessionIndex].members;

          // Update the chat for all session members
          for (const memberId of sessionMembers) {
            if (memberId !== currentUser.uid && newUserStore.users[memberId]) {
              const memberUser = newUserStore.users[memberId];
              const memberSessionIndex = memberUser.studySessions.findIndex(
                (session) => session.sessionId === sessionId
              );

              if (memberSessionIndex !== -1) {
                memberUser.studySessions[memberSessionIndex].chat.messages = [
                  ...memberUser.studySessions[memberSessionIndex].chat.messages,
                  chat,
                ];
              }
            }
          }

          await saveUserStore(newUserStore);
          return chat;
        } else {
          throw new Error("Session not found");
        }
      } else {
        throw new Error("Current user not found");
      }
    } catch (error) {
      console.error("Error adding chat:", error);
      throw error;
    }
  };

  return (
    <UserContext.Provider
      value={{
        currentUser,
        allUsers: userStore.users,
        setCurrentUser,
        addUser,
        editUser,
        removeUser,
        isLoading,
        login,
        checkEmailExists,
        checkUsernameExists,
        addPendingRequest,
        cancelPendingRequest,
        acceptIncomingRequest,
        denyIncomingRequest,
        unfriend,
        clearStorage,
        addChatToSession,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
