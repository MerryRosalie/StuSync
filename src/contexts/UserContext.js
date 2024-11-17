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
      await AsyncStorage.setItem("userStore", JSON.stringify(newUserStore));
      setUserStore(newUserStore);
    } catch (error) {
      console.error("Error saving users:", error);
    }
  };

  const setCurrentUser = async (uid) => {
    const newUserStore = { ...userStore, activeUser: uid };
    await saveUserStore(newUserStore);
  };

  const addUser = async (user) => {
    const newUserStore = {
      ...userStore,
      users: { ...userStore.users, [user.uid]: user },
    };
    await saveUserStore(newUserStore);
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

  return (
    <UserContext.Provider
      value={{
        currentUser,
        allUsers: userStore.users,
        setCurrentUser,
        addUser,
        removeUser,
        isLoading,
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
