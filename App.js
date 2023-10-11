import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import StackNavigation from "./StackNavigation";
import { UserContext } from "./UserContext";

export default function App() {
  return (
    <>
      <StatusBar hidden={true} />
      <UserContext>
        <StackNavigation />
      </UserContext>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
