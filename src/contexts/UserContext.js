import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userStore, setUserStore] = useState({
    activeUser: null,
    users: {},
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const storedUsers = await AsyncStorage.getItem("userStore");
      if (storedUsers) {
        setUserStore(JSON.parse(storedUsers));
      }
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setIsLoading(false);
    }
  };

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

  return (
    <UserContext.Provider
      value={{
        currentUser,
        allUsers: userStore.users,
        setCurrentUser,
        addUser,
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
