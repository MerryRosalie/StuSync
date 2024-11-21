import { Tabs, Redirect } from "expo-router";
import TabBar from "../../components/TabBar";
import { useUser } from "../../src/contexts/UserContext";

export default function RootLayout() {
  const { currentUser } = useUser();

  if (!currentUser) {
    return <Redirect href="/auth/login" />;
  }

  return (
    <Tabs initialRouteName="home" tabBar={(props) => <TabBar {...props} />}>
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
          tabBarShowLabel: false,
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: "Calendar",
          headerShown: false,
          tabBarShowLabel: false,
        }}
      />
      <Tabs.Screen
        name="alert"
        options={{
          title: "Alert",
          headerShown: false,
          tabBarShowLabel: false,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarShowLabel: false,
        }}
      />
    </Tabs>
  );
}
