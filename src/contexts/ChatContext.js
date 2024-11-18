import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ChatTemplate } from "../Schema";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [chats, setChats] = useState(ChatTemplate);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    try {
      const storedChats = await AsyncStorage.getItem("chats");
      if (storedChats) {
        setChats(JSON.parse(storedChats));
      }
    } catch (error) {
      console.error("Error loading chats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveChats = async (newChats) => {
    try {
      console.log(newChats);
      await AsyncStorage.setItem("chats", JSON.stringify(newChats));
      setChats(newChats);
    } catch (error) {
      throw error;
    }
  };

  const addChat = async (chat) => {
    try {
      const currentChats = await AsyncStorage.getItem("chats");
      const baseStore = currentChats ? JSON.parse(currentChats) : chats;

      const newChats = {
        messages: [...baseStore.messages, chat],
      };

      await saveChats(newChats);
      return chat;
    } catch (error) {
      throw error;
    }
  };

  const removeChat = async (chatId) => {
    const newChats = [...chats.messages];
    await saveChats(newChats.filter((chat) => chat.chatId !== chatId));
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        addChat,
        removeChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChats = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChats must be used within a ChatProvider");
  }
  return context;
};
