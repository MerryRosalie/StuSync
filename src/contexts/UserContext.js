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

  const addFriend = async (uid) => {
    if (currentUser) {
      const newAllFriends = [
        ...userStore.users[userStore.activeUser].friends.allFriends,
        uid,
      ];
      userStore.users[userStore.activeUser].friends.allFriends = newAllFriends;
      await saveUserStore(userStore);
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
        addFriend,
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
