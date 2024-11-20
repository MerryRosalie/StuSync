import React, { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "./UserContext";

const VOTE_DURATION = 10; // BETA: 30 seconds for voting

const SessionContext = createContext({});

export function SessionProvider({ children }) {
  const { currentUser, editUser, allUsers } = useUser();

  const [activeSession, setActiveSession] = useState(null);
  const [sessionStatus, setSessionStatus] = useState({
    isActive: false, // Session is currently active
    selectedLocation: null, // Selected location of the session
    locationPollActive: false, // Location poll is currently active
    locationPollTimeLeft: VOTE_DURATION, // Time left on the location poll
    pomodoroActive: false, // Pomodoro timer is currently active
    breakActive: false, // Break timer is currently active
    isEnding: false,
    timer: {
      studyDuration: 25 * 60,
      breakDuration: 5 * 60,
    },
  });

  // Load active session on mount
  useEffect(() => {
    if (currentUser?.studySessions) {
      const active = currentUser.studySessions.find(
        (session) => session.active
      );
      if (active) {
        setActiveSession(active);
        setSessionStatus((prev) => ({
          ...prev,
          isActive: true,
          selectedLocation: active.location || null,
          timer: active.timer || {
            studyDuration: 25 * 60,
            breakDuration: 5 * 60,
          },
        }));
      }
    }
  }, [currentUser?.studySessions]);

  // Location poll timer effect
  useEffect(() => {
    let intervalId;
    if (sessionStatus.locationPollActive && !sessionStatus.selectedLocation) {
      intervalId = setInterval(() => {
        setSessionStatus((prev) => ({
          ...prev,
          locationPollTimeLeft: prev.locationPollTimeLeft - 1,
        }));
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [sessionStatus.locationPollActive, sessionStatus.selectedLocation]);

  // Start a new session
  const startSession = async (sessionData) => {
    try {
      const newSession = {
        sessionId: `session_${Date.now()}`,
        date: sessionData.date,
        time: sessionData.time,
        location: "",
        members: sessionData.members,
        chat: {
          messages: [],
        },
        timer: {
          studyDuration: 25 * 60,
          breakDuration: 5 * 60,
          currentPhase: "study",
        },
        active: true,
      };

      // Update all involved users
      await Promise.all(
        sessionData.members.map(async (memberId) => {
          const user = allUsers[memberId];
          if (user) {
            const updatedUser = {
              ...user,
              studySessions: [...user.studySessions, newSession],
            };
            await editUser(updatedUser.uid, updatedUser);
          }
        })
      );

      setActiveSession(newSession);
      setSessionStatus((prev) => ({
        ...prev,
        isActive: true,
        locationPollActive: true,
        locationPollTimeLeft: VOTE_DURATION,
      }));

      return newSession;
    } catch (error) {
      console.error("Error starting session:", error);
      throw error;
    }
  };

  // Update timer settings
  const updateTimerSettings = async (studyDuration, breakDuration) => {
    try {
      const updatedSession = {
        ...activeSession,
        timer: {
          ...activeSession?.timer,
          studyDuration,
          breakDuration,
        },
      };

      await Promise.all(
        activeSession?.members.map(async (memberId) => {
          const user = allUsers[memberId];
          if (user) {
            const updatedUser = {
              ...user,
              studySessions: user.studySessions.map((session) =>
                session.sessionId === activeSession?.sessionId
                  ? updatedSession
                  : session
              ),
            };
            await editUser(updatedUser.uid, updatedUser);
          }
        })
      );

      setActiveSession(updatedSession);
      setSessionStatus((prev) => ({
        ...prev,
        timer: { studyDuration, breakDuration },
      }));
    } catch (error) {
      console.error("Error updating timer settings:", error);
      throw error;
    }
  };

  useEffect(() => {
    console.log("Updated activeSession:", activeSession);
  }, [activeSession]);

  useEffect(() => {
    console.log("Updated sessionStatus:", sessionStatus);
  }, [sessionStatus]);

  // Set location after poll
  const setSessionLocation = async (location) => {
    console.log("Location set to", location);
    try {
      const updatedSession = {
        ...activeSession,
        location: location, // Ensure location is set correctly
      };

      // Update local state first
      setActiveSession(updatedSession);

      setSessionStatus((prev) => {
        return {
          ...prev,
          selectedLocation: location,
          locationPollActive: false,
        };
      });

      // Update all members' data with the new session
      await Promise.all(
        activeSession?.members.map(async (memberId) => {
          const user = allUsers[memberId];
          if (!user) return;

          const updatedUser = {
            ...user,
            studySessions: user.studySessions.map((session) =>
              session.sessionId === activeSession?.sessionId
                ? updatedSession
                : session
            ),
          };

          await editUser(updatedUser.uid, updatedUser);
        })
      );

      // Force refresh current user's session
      const updatedCurrentUser = {
        ...currentUser,
        studySessions: currentUser.studySessions.map((session) =>
          session.sessionId === activeSession?.sessionId
            ? updatedSession
            : session
        ),
      };
      await editUser(currentUser.uid, updatedCurrentUser);
    } catch (error) {
      console.error("Error setting session location:", error);
      throw error;
    }
  };

  // Start the location poll
  const startLocationPoll = () => {
    console.log("Location Poll starts");
    setSessionStatus((prev) => ({
      ...prev,
      locationPollActive: true,
      locationPollTimeLeft: VOTE_DURATION,
    }));
  };

  // Start the pomodoro timer
  const startPomodoroTimer = () => {
    console.log("Pomodoro timer starts");
    setSessionStatus((prev) => ({
      ...prev,
      locationPollActive: false,
      pomodoroActive: true,
    }));
  };

  // Start the break timer
  const startBreakTimer = () => {
    console.log("Break time starts");
    setSessionStatus((prev) => ({
      ...prev,
      locationPollActive: false,
      pomodoroActive: false,
      breakActive: true,
    }));
  };

  const readyToEndSession = () => {
    console.log("Session is Ending");
    setSessionStatus((prev) => ({
      ...prev,
      locationPollActive: false,
      pomodoroActive: false,
      breakActive: false,
      isEnding: true,
    }));
  };

  // End the session
  const endSession = async () => {
    try {
      const updatedSession = {
        ...activeSession,
        active: false,
      };

      await Promise.all(
        activeSession?.members.map(async (memberId) => {
          const user = allUsers[memberId];
          if (user) {
            const updatedUser = {
              ...user,
              studySessions: user.studySessions.map((session) =>
                session.sessionId === activeSession?.sessionId
                  ? updatedSession
                  : session
              ),
            };
            await editUser(updatedUser.uid, updatedUser);
          }
        })
      );

      setActiveSession(null);
      setSessionStatus({
        isActive: false, // Session is currently active
        selectedLocation: null, // Selected location of the session
        locationPollActive: false, // Location poll is currently active
        locationPollTimeLeft: VOTE_DURATION, // Time left on the location poll
        pomodoroActive: false, // Pomodoro timer is currently active
        breakActive: false, // Break timer is currently active
        isEnding: false,
        timer: {
          studyDuration: 25 * 60,
          breakDuration: 5 * 60,
        },
      });
    } catch (error) {
      console.error("Error ending session:", error);
      throw error;
    }
  };

  const leaveSession = async () => {
    try {
      if (!activeSession) {
        throw new Error("No active session to leave");
      }

      // Create updated session with current user removed from members
      const updatedSession = {
        ...activeSession,
        members: activeSession?.members.filter(
          (memberId) => memberId !== currentUser.uid
        ),
      };

      // If this was the last member, mark session as inactive
      if (updatedSession.members.length === 0) {
        updatedSession.active = false;
      }

      // Update the session for all remaining members
      await Promise.all(
        activeSession?.members.map(async (memberId) => {
          // Skip the leaving user
          if (memberId === currentUser.uid) return;

          const user = allUsers[memberId];
          if (user) {
            const updatedUser = {
              ...user,
              studySessions: user.studySessions.map((session) =>
                session.sessionId === activeSession?.sessionId
                  ? updatedSession
                  : session
              ),
            };
            await editUser(updatedUser.uid, updatedUser);
          }
        })
      );

      // Update the leaving user's session list
      // Mark the session as inactive for the leaving user
      const leavingUserSession = {
        ...activeSession,
        active: false,
      };

      const updatedCurrentUser = {
        ...currentUser,
        studySessions: currentUser.studySessions.map((session) =>
          session.sessionId === activeSession?.sessionId
            ? leavingUserSession
            : session
        ),
      };

      await editUser(currentUser.uid, updatedCurrentUser);

      // Reset local state
      setActiveSession(null);
      setSessionStatus({
        isActive: false,
        selectedLocation: null,
        locationPollActive: false,
        locationPollTimeLeft: VOTE_DURATION,
        pomodoroActive: false,
        breakActive: false,
        isEnding: false,
        timer: {
          studyDuration: 25 * 60,
          breakDuration: 5 * 60,
        },
      });

      return true;
    } catch (error) {
      console.error("Error leaving session:", error);
      throw error;
    }
  };

  const addChatToSession = async (chat, sessionId) => {
    try {
      // Validate sessionId matches active session
      if (sessionId !== activeSession?.sessionId) {
        console.warn("Attempting to add chat to inactive session");
        return;
      }

      // Create updated session with new chat
      const updatedSession = {
        ...activeSession,
        chat: {
          messages: [...activeSession?.chat.messages, chat],
        },
      };

      // Update local state first
      setActiveSession(updatedSession);

      // Update to all members
      await Promise.all(
        activeSession?.members.map(async (memberId) => {
          const user = allUsers[memberId];
          if (user) {
            const updatedUser = {
              ...user,
              studySessions: user.studySessions.map((session) =>
                session.sessionId === activeSession?.sessionId
                  ? updatedSession
                  : session
              ),
            };
            await editUser(updatedUser.uid, updatedUser);
          }
        })
      );

      // Update current user to ensure consistency
      const updatedCurrentUser = {
        ...currentUser,
        studySessions: currentUser.studySessions.map((session) =>
          session.sessionId === activeSession?.sessionId
            ? updatedSession
            : session
        ),
      };
      await editUser(currentUser.uid, updatedCurrentUser);
    } catch (error) {
      console.error("Error adding chat to session:", error);
    }
  };

  return (
    <SessionContext.Provider
      value={{
        activeSession,
        sessionStatus,
        startSession,
        updateTimerSettings,
        setSessionLocation,
        startLocationPoll,
        startPomodoroTimer,
        startBreakTimer,
        readyToEndSession,
        endSession,
        leaveSession,
        addChatToSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
