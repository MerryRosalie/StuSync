import { View, TouchableOpacity, Text } from "react-native";
import { useState, useCallback } from "react";
import Feather from "@expo/vector-icons/Feather";
import { TextInput } from "react-native-gesture-handler";

export default function KickAMemberModal({ sheetRef, members, onSubmit }) {
  // State for managing input, selected member and auto-complete suggestion
  const [input, setInput] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);
  const [suggestion, setSuggestion] = useState("");

  // Find matching member name based on input text - case sensitive
  const getSuggestion = useCallback(
    (text) => {
      if (!text) return "";
      const matchingMember = members.find((member) =>
        member.name.startsWith(text)
      );
      return matchingMember ? matchingMember.name : "";
    },
    [members]
  );

  // Handle text input changes and update suggestion/selected member
  const handleChangeText = (text) => {
    setInput(text);
    const newSuggestion = getSuggestion(text);
    if (newSuggestion) {
      setSuggestion(newSuggestion);
      const member = members.find((m) => m.name === newSuggestion);
      setSelectedMember(member);
    } else {
      setSuggestion("");
      setSelectedMember(null);
    }
  };

  // Handle keyboard submit - auto-complete the input with suggestion
  const handleSubmitEditing = () => {
    if (suggestion) {
      setInput(suggestion);
      setSuggestion("");
    }
  };

  return (
    <View className="gap-4">
      {/* Header section */}
      <View>
        <Text className="font-inter-bold text-center text-lg text-text-default dark:text-dark-text-default">
          Kick a member
        </Text>
        <Text className="text-text-default text-center dark:text-dark-text-default">
          Select which members do you want to kick
        </Text>
      </View>

      {/* Search input section */}
      <View className="relative flex-row items-center gap-2 px-4 py-3 border border-text-dimmed dark:border-dark-text-dimmed rounded-lg">
        <Feather
          name="search"
          size={24}
          className="color-text-default/50 dark:color-dark-text-default/50"
        />
        <View className="flex-1 flex-row">
          {/* Auto-complete suggestion overlay */}
          {suggestion && input && (
            <TextInput
              className="absolute text-text-default/50 dark:text-dark-text-default/50"
              value={suggestion}
              editable={false}
            />
          )}
          {/* Main input field */}
          <TextInput
            placeholder="Search for a member..."
            className="flex-1 text-text-default dark:text-dark-text-default placeholder:text-text-default/50 dark:placeholder:text-dark-text-default/50"
            value={input}
            onChangeText={handleChangeText}
            onSubmitEditing={handleSubmitEditing}
          />
        </View>
      </View>

      {/* Kick button - enabled only when a member is selected */}
      <TouchableOpacity
        className="rounded-lg bg-purple-default dark:bg-dark-purple-default disabled:bg-purple-default/25 dark:disabled:bg-dark-purple-default/25 p-6"
        disabled={!selectedMember}
        onPress={() => {
          if (selectedMember) {
            onSubmit(selectedMember);
            sheetRef.current?.close();
          }
        }}
      >
        <Text className="font-inter-bold text-background text-center dark:text-dark-background">
          KICK MEMBER
        </Text>
      </TouchableOpacity>
    </View>
  );
}
