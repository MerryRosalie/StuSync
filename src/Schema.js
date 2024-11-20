// Schema expected structure
export const BreakActivityTemplate = {
  title: "",
  description: "",
};

export const TimerTemplate = {
  studyDuration: 0,
  breakDuration: 0,
  breakActivities: [], // Array of BreakActivity
};

export const TextTemplate = {
  messageId: "",
  message: "",
  senderUid: "",
  timestamp: "",
  voiceUri: null,
  reply: null,
  images: [],
  poll: false,
  button: false,
};

export const ChatTemplate = {
  messages: [], // Array of Text
};

export const StudySessionTemplate = {
  sessionId: "",
  date: "",
  time: "",
  location: "",
  members: [], // Array of strings (uids)
  chat: ChatTemplate,
  timer: TimerTemplate,
  active: false,
};

export const EventTemplate = {
  eventId: "",
  title: "",
  date: "",
  startTime: "",
  endTime: "",
  description: "",
};

export const CalendarTemplate = {
  events: [], // Array of Event
};

export const SettingsTemplate = {
  theme: "Light", // 'Light' or 'Dark'
  privacy: "FriendsOnly", // 'FriendsOnly' or 'FriendsAndCoursemates'
};

export const FriendsTemplate = {
  allFriends: [], // Array of strings (uids)
  incomingRequests: [], // Array of strings (uids)
  pendingRequests: [], // Array of strings (uids)
};

export const ProfileTemplate = {
  aboutMe: "",
  currentCourses: [], // Array of strings
  memberSince: "",
};

export const NotificationTemplate = {
  id: "",
  type: "", // "friend_request" | "session_invite" | "session_location" | "session_reminder"
  user: {
    uid: "",
    name: "",
    avatar: "",
  },
  message: "",
  timestamp: "",
  requiresAction: false,
  category: "", // "friends" | "sessions"
  time: "",
  date: "",
  location: "",
  sessionName: "",
};

export const UserTemplate = {
  uid: "",
  name: "",
  email: "",
  username: "",
  password: "",
  profilePicture: "https://ui-avatars.com/api/?background=random",
  profile: ProfileTemplate,
  friends: FriendsTemplate,
  settings: SettingsTemplate,
  calendar: CalendarTemplate,
  studySessions: [], // Array of StudySession
  notifications: [], // Array of Notification
};

export const UserStoreTemplate = {
  activeUser: null, // string or null
  users: {}, // Object mapping uid to User
};

// Optional: Helper function to validate object structure
export const isValidUser = (user) => {
  try {
    return (
      user.uid &&
      user.name &&
      user.email &&
      user.username &&
      user.password &&
      user.profile &&
      user.friends &&
      user.settings &&
      user.calendar &&
      Array.isArray(user.studySessions) &&
      Array.isArray(user.notifications)
    );
  } catch (error) {
    return false;
  }
};

export const generateProfilePicture = (name) => {
  return `https://ui-avatars.com/api/?name=${name}&background=random`;
};
