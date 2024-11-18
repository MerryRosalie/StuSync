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
  message: "",
  senderUid: "",
  timestamp: "",
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

export const UserTemplate = {
  uid: "",
  name: "",
  email: "",
  username: "",
  password: "",
  profilePicture: "",
  profile: ProfileTemplate,
  friends: FriendsTemplate,
  settings: SettingsTemplate,
  calendar: CalendarTemplate,
  studySessions: [], // Array of StudySession
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
      Array.isArray(user.studySessions)
    );
  } catch (error) {
    return false;
  }
};

export const generateProfilePicture = (name) => {
  return `https://ui-avatars.com/api/?name=${name}&background=random`;
};
