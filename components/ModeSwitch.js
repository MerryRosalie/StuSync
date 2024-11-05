import { useColorScheme } from "nativewind";
import { Switch } from "react-native";

export default function ModeSwitch() {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  return <Switch value={colorScheme === "dark"} onChange={toggleColorScheme} />;
}
