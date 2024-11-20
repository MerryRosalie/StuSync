import { View, TouchableOpacity, Text } from "react-native";
import { useState, useCallback } from "react";
import Feather from "@expo/vector-icons/Feather";
import { TextInput } from "react-native-gesture-handler";
import { useUser } from "../../src/contexts/UserContext";

export default function KickAMemberModal({ sheetRef, members, onSubmit }) {
  const { currentUser, allUsers } = useUser();
  const [input, setInput] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);
  const [suggestion, setSuggestion] = useState("");

  // Find matching member name based on input text - case insensitive for better UX
  const getSuggestion = useCallback(
    (text) => {
      if (!text) return "";
      const matchingMember = members
        .filter((uid) => currentUser.uid !== uid)
        .map((uid) => allUsers[uid])
        .find((member) =>
          member.name.toLowerCase().startsWith(text.toLowerCase())
        );
      return matchingMember ? matchingMember : null;
    },
    [members, allUsers, currentUser]
  );

  // Handle text input changes and update suggestion/selected member
  const handleChangeText = (text) => {
    setInput(text);
    const matchingMember = getSuggestion(text);
    if (matchingMember) {
      setSuggestion(matchingMember.name);
      setSelectedMember(matchingMember);
    } else {
      setSuggestion("");
      setSelectedMember(null);
    }
  };

  // Handle keyboard submit - auto-complete the input with suggestion
  const handleSubmitEditing = () => {
    if (suggestion && selectedMember) {
      setInput(suggestion);
      // Keep the selected member state instead of clearing it
      setSuggestion("");
    }
  };

  // Handle kick button press
  const handleKick = () => {
    if (selectedMember) {
      onSubmit(selectedMember);
      sheetRef.current?.close();
    }
  };

  return (
    <View className="gap-4">
      <View>
        <Text className="font-inter-bold text-center text-lg text-text-default dark:text-dark-text-default">
          Kick a member
        </Text>
        <Text className="text-text-default text-center dark:text-dark-text-default">
          Select which members do you want to kick
        </Text>
      </View>

      <View className="relative flex-row items-center gap-2 px-4 py-3 border border-text-dimmed dark:border-dark-text-dimmed rounded-lg">
        <Feather
          name="search"
          size={24}
          className="color-text-default/50 dark:color-dark-text-default/50"
        />
        <View className="flex-1 flex-row">
          {suggestion && input && (
            <TextInput
              className="absolute text-text-default/50 dark:text-dark-text-default/50"
              value={suggestion}
              editable={false}
            />
          )}
          <TextInput
            placeholder="Search for a member..."
            className="flex-1 text-text-default dark:text-dark-text-default placeholder:text-text-default/50 dark:placeholder:text-dark-text-default/50"
            value={input}
            onChangeText={handleChangeText}
            onSubmitEditing={handleSubmitEditing}
          />
        </View>
      </View>

      <TouchableOpacity
        className="rounded-lg bg-purple-default dark:bg-dark-purple-default disabled:bg-purple-default/25 dark:disabled:bg-dark-purple-default/25 p-6"
        disabled={!selectedMember}
        onPress={handleKick}
      >
        <Text className="font-inter-bold text-background text-center dark:text-dark-background">
          KICK MEMBER
        </Text>
      </TouchableOpacity>
    </View>
  );
}
