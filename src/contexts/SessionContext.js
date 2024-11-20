// src/contexts/SessionContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "./UserContext";
import { useRouter } from "expo-router";

const VOTE_DURATION = 10; // 60 seconds for voting

const SessionContext = createContext({});

export function SessionProvider({ children }) {
  const { currentUser, addUser, allUsers } = useUser();
  const router = useRouter();

  const [activeSession, setActiveSession] = useState(null);
  const [sessionStatus, setSessionStatus] = useState({
    isActive: false, // Session is currently active
    selectedLocation: null, // Selected location of the session
    locationPollActive: false, // Location poll is currently active
    locationPollTimeLeft: VOTE_DURATION, // Time left on the location poll
    pomodoroActive: false, // Pomodoro timer is currently active
    pomodoroTimeLeft: 25 * 60, // Time left on the pomodoro timer
    breakActive: false, // Break timer is currently active
    breakTimeLeft: 5 * 60, // Time left on the break timer
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
  }, [currentUser, allUsers]);

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

  // Debug timer
  useEffect(() => {
    console.log("location poll", sessionStatus.locationPollTimeLeft);
    console.log("pomodoro timer", sessionStatus.pomodoroTimeLeft);
    console.log("break time", sessionStatus.breakTimeLeft);
  }, [sessionStatus]);

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
          locationPollActive: true,
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
            await addUser(updatedUser);
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
          ...activeSession.timer,
          studyDuration,
          breakDuration,
        },
      };

      await Promise.all(
        activeSession.members.map(async (memberId) => {
          const user = allUsers[memberId];
          if (user) {
            const updatedUser = {
              ...user,
              studySessions: user.studySessions.map((session) =>
                session.sessionId === activeSession.sessionId
                  ? updatedSession
                  : session
              ),
            };
            await addUser(updatedUser);
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

  // Set location after poll
  const setSessionLocation = async (location) => {
    try {
      // Create the updated session object
      const updatedSession = {
        ...activeSession,
        location, // Ensure we're setting the location directly
      };

      console.log("Updating session with location:", location);
      console.log("Previous session:", activeSession);
      console.log("Updated session:", updatedSession);

      // First update the local state
      setActiveSession(updatedSession);
      setSessionStatus((prev) => ({
        ...prev,
        selectedLocation: location,
        locationPollActive: false,
      }));

      // Then update all members' data
      await Promise.all(
        activeSession.members.map(async (memberId) => {
          const user = allUsers[memberId];
          if (!user) return;

          // Find and update the specific session in user's sessions
          const userUpdatedSessions = user.studySessions.map((session) =>
            session.sessionId === activeSession.sessionId
              ? updatedSession
              : session
          );

          const updatedUser = {
            ...user,
            studySessions: userUpdatedSessions,
          };

          // Debug logs
          console.log(
            `Updating user ${memberId} sessions:`,
            userUpdatedSessions
          );

          await addUser(updatedUser);
        })
      );

      console.log("Final activeSession state:", updatedSession);
    } catch (error) {
      console.error("Error setting session location:", error);
      throw error;
    }
  };

  // Start the location poll
  const startLocationPoll = () => {
    setSessionStatus((prev) => ({
      ...prev,
      locationPollActive: true,
      locationPollTimeLeft: VOTE_DURATION,
    }));
  };

  // Start the pomodoro timer
  const startPomodoroTimer = () => {
    setSessionStatus((prev) => ({
      ...prev,
      locationPollActive: false,
      pomodoroActive: true,
      pomodoroTimeLeft: 25 * 60,
      timerSettings: {
        studyDuration: 25 * 60,
        breakDuration: 5 * 60,
      },
    }));
  };

  // Start the break timer
  const startBreakTimer = () => {
    setSessionStatus((prev) => ({
      ...prev,
      locationPollActive: false,
      pomodoroActive: false,
      pomodoroTimeLeft: 25 * 60,
      breakActive: true,
      breakTimeLeft: 5 * 60,
      timerSettings: {
        studyDuration: 25 * 60,
        breakDuration: 5 * 60,
      },
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
        activeSession.members.map(async (memberId) => {
          const user = allUsers[memberId];
          if (user) {
            const updatedUser = {
              ...user,
              studySessions: user.studySessions.map((session) =>
                session.sessionId === activeSession.sessionId
                  ? updatedSession
                  : session
              ),
            };
            await addUser(updatedUser);
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
        pomodoroTimeLeft: 25 * 60, // Time left on the pomodoro timer
        breakActive: false, // Break timer is currently active
        breakTimeLeft: 5 * 60, // Time left on the break timer
        timer: {
          studyDuration: 25 * 60,
          breakDuration: 5 * 60,
        },
      });

      router.push("/home");
    } catch (error) {
      console.error("Error ending session:", error);
      throw error;
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
        endSession,
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
