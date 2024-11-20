import { useState } from "react";
import { useRouter } from "expo-router";
import { useUser } from "../../src/contexts/UserContext";
import NameStep from "../../components/register/steps/NameStep";
import PasswordStep from "../../components/register/steps/PasswordStep";
import EmailStep from "../../components/register/steps/EmailStep";
import CoursesStep from "../../components/register/steps/CoursesStep";
import { SafeAreaView, View, Text, TouchableOpacity } from "react-native";
import ProgressBar from "../../components/register/ProgressBar";
import UsernameStep from "../../components/register/steps/UsernameStep";
import Feather from "@expo/vector-icons/Feather";
import { generateProfilePicture } from "../../src/Schema";

export default function Register() {
  const router = useRouter();
  const { addUser, setCurrentUser, checkEmailExists, checkUsernameExists } =
    useUser();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [courses, setCourses] = useState([]);
  const [courseInput, setCourseInput] = useState("");
  const [courseError, setCourseError] = useState("");

  // Ensure email matches regex
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      return "Email is required";
    }
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  // Ensure password is at least 8 characters long, contains at least one uppercase letter, one lowercase letter, one number and matches confirm password
  const validatePassword = (pass, confirm) => {
    if (pass.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/[A-Z]/.test(pass)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/[a-z]/.test(pass)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/[0-9]/.test(pass)) {
      return "Password must contain at least one number";
    }
    if (confirm && pass !== confirm) {
      return "Passwords do not match";
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

  // If no errors, set email
  const handleEmailChange = (text) => {
    setEmail(text);
    setEmailError(validateEmail(text));
  };

  // If no errors proceed to next step
  const canProceed = () => {
    switch (step) {
      case 1:
        return email.trim().length > 0 && !emailError;
      case 2:
        return (
          password.length >= 8 && !passwordError && password === confirmPassword
        );
      case 3:
        return name.trim().length >= 2;
      case 4:
        return username.trim().length > 0 && !usernameError;
      case 5:
        return true;
    }
  };

  // If no errors set password
  const handlePasswordChange = (text) => {
    setPassword(text);
    setPasswordError(validatePassword(text, confirmPassword));
  };

  // If no errors set confirm password
  const handleConfirmPasswordChange = (text) => {
    setConfirmPassword(text);
    setPasswordError(validatePassword(password, text));
  };

  // If no errors set username
  const handleUsernameChange = (text) => {
    setUsername(text);
    setUsernameError(validateUsername(text));
  };

  // Add course validation function
  const validateCourse = (course) => {
    const courseRegex = /^[A-Za-z]{4}\d{4}$/;
    return courseRegex.test(course);
  };

  // Add course to courses if course is invalid display error
  const addCourse = () => {
    if (courseInput.trim()) {
      const formattedCourse = courseInput.trim().toUpperCase();
      if (!validateCourse(formattedCourse)) {
        setCourseError("Course does not exist enter a valid UNSW course code");
        return;
      }
      setCourses([...courses, formattedCourse]);
      setCourseInput("");
      setCourseError("");
    }
  };

  // If course is in courses remove it
  const removeCourse = (courseToRemove) => {
    setCourses(courses.filter((course) => course !== courseToRemove));
  };

  // If no errors add user to database
  const handleRegister = async () => {
    try {
      const newUser = {
        uid: Date.now().toString(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        username: username.trim().toLowerCase(),
        password: password,
        profilePicture: generateProfilePicture(name.trim()),
        calendar: {
          events: [],
        },
        profile: {
          aboutMe: "",
          currentCourses: courses,
          memberSince: new Date().toISOString(),
        },
        friends: {
          allFriends: [],
          incomingRequests: ["user123", "user101"], // Lauren Smith and Sarah Johnson
          pendingRequests: [],
        },
        settings: {
          theme: "Light",
          privacy: "FriendsOnly",
        },
        studySessions: [],
        notifications: [
          // Dummy notifications as app is beta
          {
            id: 1,
            type: "friend_request",
            uid: "user123",
            message: "sent you a friend request",
            timestamp: "5 mins ago",
            requiresAction: true,
            category: "friends",
          },
          {
            id: 3,
            type: "friend_request",
            uid: "user101",
            message: "sent you a friend request",
            timestamp: "15 mins ago",
            requiresAction: true,
            category: "friends",
          },
          {
            id: 4,
            type: "session_invite",
            uid: "user456",
            time: "4:00 PM",
            date: "Tomorrow",
            timestamp: "20 mins ago",
            requiresAction: true,
            category: "sessions",
          },
          {
            id: 7,
            type: "session_location",
            sessionName: "MATH1141 Study Group",
            location: "Room 205, Mathematics Building",
            timestamp: "30 mins ago",
            category: "sessions",
          },
          {
            id: 8,
            type: "session_location",
            sessionName: "Physics Group Study",
            location: "Physics Library, Level 2",
            timestamp: "1 hour ago",
            category: "sessions",
          },
          {
            id: 6,
            type: "session_invite",
            uid: "user123",
            time: "10:00 AM",
            date: "Saturday",
            timestamp: "2 hours ago",
            requiresAction: true,
            category: "sessions",
          },
          {
            id: 11,
            type: "session_reminder",
            sessionName: "Physics Group Study",
            time: "11:00 AM",
            date: "Tomorrow",
            timestamp: "2 hours ago",
            category: "sessions",
          },
        ],
      };

      await addUser(newUser);
      await setCurrentUser(newUser.uid);
      router.replace("/main/home");
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  // If on first step go back to login otherwise go back one step
  const handleBackPress = () => {
    if (step === 1) {
      router.back();
    } else {
      setStep((prev) => prev - 1);
    }
  };

  // Add email check before proceeding
  const handleEmailStep = async () => {
    const emailExists = await checkEmailExists(email);
    if (emailExists) {
      setEmailError("An account is already associated with this email");
      return;
    }
    setStep(step + 1);
  };

  // Add username check before proceeding
  const handleUsernameStep = async () => {
    const usernameExists = await checkUsernameExists(username);
    if (usernameExists) {
      setUsernameError("Username already exists");
      return;
    }
    setStep(step + 1);
  };

  // Render the current step
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <EmailStep
            value={email}
            onChangeText={handleEmailChange}
            error={emailError}
          />
        );
      case 2:
        return (
          <PasswordStep
            password={password}
            confirmPassword={confirmPassword}
            onPasswordChange={handlePasswordChange}
            onConfirmPasswordChange={handleConfirmPasswordChange}
            error={passwordError}
          />
        );
      case 3:
        return <NameStep value={name} onChangeText={setName} />;
      case 4:
        return (
          <UsernameStep
            value={username}
            onChangeText={handleUsernameChange}
            error={usernameError}
          />
        );
      case 5:
        return (
          <CoursesStep
            courses={courses}
            onAddCourse={addCourse}
            onRemoveCourse={removeCourse}
            courseInput={courseInput}
            setCourseInput={setCourseInput}
            error={courseError}
          />
        );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-background">
      <View className="flex-1">
        <View className="py-4 mt-8">
          <TouchableOpacity onPress={handleBackPress} className="px-4 mb-4">
            <Feather
              name="arrow-left"
              size={24}
              className="color-text-default dark:color-dark-text-default"
            />
          </TouchableOpacity>
          <ProgressBar currentStep={step} totalSteps={5} />
        </View>

        <View className="flex-1 px-5 mt-2">
          {renderStep()}

          <View className="absolute bottom-8 left-5 right-5">
            <TouchableOpacity
              className={`w-full py-4 rounded-xl ${
                canProceed()
                  ? "bg-purple-default dark:bg-dark-purple-default"
                  : "bg-text-dimmed dark:bg-dark-text-dimmed"
              }`}
              disabled={!canProceed()}
              onPress={() => {
                if (step === 1) {
                  handleEmailStep();
                } else if (step === 4) {
                  handleUsernameStep();
                } else if (step < 5) {
                  setStep((prev) => prev + 1);
                } else {
                  handleRegister();
                }
              }}
            >
              <Text className="text-background dark:text-dark-text-default font-semibold text-center text-lg">
                {step === 5 ? "Get Started" : "Next"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
