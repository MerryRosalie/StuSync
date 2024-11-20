import { SafeAreaView } from "react-native-safe-area-context";
import {
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useUser } from "../../src/contexts/UserContext";
import * as ImagePicker from "expo-image-picker";

export default function EditProfileScreen() {
  const { currentUser, addUser, setCurrentUser, checkUsernameExists } =
    useUser();
  const [name, setName] = useState(currentUser.name);
  const [username, setUsername] = useState(currentUser.username);
  const [aboutMe, setAboutMe] = useState(currentUser.profile.aboutMe);
  const [currentCourses, setCurrentCourses] = useState(
    currentUser.profile.currentCourses
  );
  const [profilePicture, setProfilePicture] = useState(
    currentUser.profilePicture
  );
  const [course, setCourse] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Validation functions from register
  const validateName = (name) => {
    if (!name.trim()) {
      return "Name is required";
    }
    if (username.length < 2 || username.length > 70) {
      return "Name must be between 2-70 characters";
    }
    return "";
  };

  const validateUsername = (username) => {
    if (!username.trim()) {
      return "Username is required";
    }
    if (username.length < 3 || username.length > 20) {
      return "Username must be between 3-20 characters";
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return "Username can only contain letters, numbers, and underscores";
    }
    return "";
  };

  const handleNameChange = (text) => {
    setName(text);
    setErrors((prev) => ({
      ...prev,
      name: validateName(text),
    }));
  };

  const handleUsernameChange = async (text) => {
    setUsername(text);
    const validationError = validateUsername(text);
    if (validationError) {
      setErrors((prev) => ({
        ...prev,
        username: validationError,
      }));
      return;
    }

    // Only check if username exists if it's different from current username
    if (text.toLowerCase() !== currentUser.username.toLowerCase()) {
      const usernameExists = await checkUsernameExists(text.toLowerCase());
      if (usernameExists) {
        setErrors((prev) => ({
          ...prev,
          username: "Username already exists",
        }));
        return;
      }
    }

    setErrors((prev) => ({
      ...prev,
      username: "",
    }));
  };

  const addCourse = () => {
    if (course.trim()) {
      setCurrentCourses([...currentCourses, course.trim().toUpperCase()]);
      setCourse("");
    }
  };

  const handleRemoveCourse = (course) => {
    setCurrentCourses(currentCourses.filter((c) => c !== course));
  };

  const handleSave = async () => {
    if (!isFormValid()) return;

    setIsLoading(true);
    try {
      const updatedUser = {
        ...currentUser,
        name: name.trim(),
        username: username.trim().toLowerCase(),
        profilePicture,
        profile: {
          ...currentUser.profile,
          aboutMe,
          currentCourses,
        },
      };

      await addUser(updatedUser);
      await setCurrentUser(currentUser.uid);
      router.push("main/profile");
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        submit: "Failed to save changes. Please try again.",
      }));
      console.error("Failed to save profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const uploadImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "We need camera permission to upload images."
      );
    } else {
      try {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.5,
        });

        if (!result.canceled && result.assets[0].uri) {
          setProfilePicture(result.assets[0].uri);
        }
      } catch (error) {
        Alert.alert("Error uploading image", "Please try again");
        console.error("Error uploading profile picture:", error);
      }
    }
  };

  // Check if form is valid and different from initial values
  const isFormValid = () => {
    const hasChanges =
      name !== currentUser.name ||
      username !== currentUser.username ||
      aboutMe !== currentUser.profile.aboutMe ||
      profilePicture !== currentUser.profilePicture ||
      JSON.stringify(currentCourses) !==
        JSON.stringify(currentUser.profile.currentCourses);

    const hasNoErrors = !Object.values(errors).some((error) => error);

    return (
      hasChanges && hasNoErrors && name.trim() && username.trim() && !isLoading
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-background p-6 gap-8 items-center">
      {/* Header */}
      <View className="w-full flex-row items-center justify-center relative mb-3">
        <TouchableOpacity
          className="absolute left-0 pl-0 p-4"
          onPress={() => router.push("main/profile")}
        >
          <Feather
            className="color-text-default dark:color-dark-text-default"
            name="chevron-left"
            size={24}
          />
        </TouchableOpacity>
        <Text className="font-inter-bold text-text-default dark:text-dark-text-default">
          Edit Profile
        </Text>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView className="flex-1" contentContainerStyle={{ gap: 24 }}>
            {/* Edit profile picture */}
            <TouchableOpacity
              onPress={uploadImage}
              className="w-32 h-32 self-center"
            >
              <Image
                className="w-32 h-32 object-cover rounded-full"
                source={{ uri: profilePicture }}
                style={{ resizeMode: "cover" }}
              />
              <View className="absolute bottom-0 right-0 w-12 h-12 rounded-full bg-purple-secondary dark:bg-dark-purple-secondary justify-center items-center">
                <Feather
                  name="edit-2"
                  size={24}
                  className="color-purple-default dark:color-dark-purple-default"
                />
              </View>
            </TouchableOpacity>
            <View className="w-full gap-4">
              {/* name input */}
              <View className="gap-2">
                <Text className="text-base font-semibold text-text-default dark:text-dark-text-default">
                  Name
                </Text>
                <TextInput
                  className={`border ${
                    errors.name ? "border-red-500" : "border-gray"
                  } text-text-default dark:text-dark-text-default placeholder:text-text-default/25 dark:placeholder:text-dark-text-default/25 rounded-xl items-center p-4`}
                  placeholder="Enter name"
                  onChangeText={handleNameChange}
                  value={name}
                />
                {errors.name && (
                  <Text className="text-red-500 text-sm">{errors.name}</Text>
                )}
              </View>
              {/* username input */}
              <View className="gap-2">
                <Text className="text-base font-semibold text-text-default dark:text-dark-text-default">
                  Username
                </Text>
                <TextInput
                  className={`border ${
                    errors.username ? "border-red-500" : "border-gray"
                  } text-text-default dark:text-dark-text-default placeholder:text-text-default/25 dark:placeholder:text-dark-text-default/25 rounded-xl items-center p-4`}
                  placeholder="Enter username"
                  onChangeText={handleUsernameChange}
                  value={username}
                />
                {errors.username && (
                  <Text className="text-red-500 text-sm">
                    {errors.username}
                  </Text>
                )}
              </View>
              {/* about me input */}
              <View className="w-full gap-2">
                <Text className="text-base font-semibold text-text-default dark:text-dark-text-default">
                  About Me
                </Text>
                <TextInput
                  className="border border-gray text-text-default dark:text-dark-text-default placeholder:text-text-default/25 dark:placeholder:text-dark-text-default/25 rounded-xl items-center p-4"
                  placeholder="Enter about me"
                  multiline={true}
                  onChangeText={setAboutMe}
                  value={aboutMe}
                />
              </View>
              {/* courses input */}
              <View className="gap-2">
                <Text className="text-base font-semibold text-text-default dark:text-dark-text-default">
                  Current Courses
                </Text>
                <View className="flex-row w-full gap-2">
                  <TextInput
                    className="flex-1 border border-gray text-text-default dark:text-dark-text-default placeholder:text-text-default/25 dark:placeholder:text-dark-text-default/25 rounded-xl items-center p-4"
                    placeholder="Enter course code"
                    onSubmitEditing={addCourse}
                    onChangeText={setCourse}
                    value={course}
                  />
                  <TouchableOpacity
                    className="p-4 bg-purple-default dark:bg-dark-purple-default border rounded-xl"
                    onPress={addCourse}
                  >
                    <Text className="font-inter-bold text-background dark:text-dark-background text-semibold">
                      ADD
                    </Text>
                  </TouchableOpacity>
                </View>
                <View className="flex-row flex-wrap gap-2">
                  {currentCourses.map((course, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleRemoveCourse(course)}
                      className="bg-purple-secondary dark:bg-dark-purple-secondary rounded-full px-4 py-2 flex-row items-center"
                    >
                      <Text className="text-purple-default mr-2">{course}</Text>
                      <Text className="text-purple-default">×</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {errors.submit && (
                  <Text className="text-red-500 text-sm text-center mt-2">
                    {errors.submit}
                  </Text>
                )}
              </View>
            </View>
            {/* Save changes button */}
            <TouchableOpacity
              className={`${
                isFormValid()
                  ? "bg-purple-default dark:bg-dark-purple-default"
                  : "bg-text-dimmed dark:bg-dark-text-dimmed"
              } rounded-lg p-6`}
              onPress={handleSave}
              disabled={!isFormValid()}
            >
              <Text className="text-background dark:text-dark-background text-center font-inter-bold">
                {isLoading ? "SAVING..." : "SAVE CHANGES"}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
