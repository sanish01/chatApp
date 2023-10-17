import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

export default function UserChat({ item }) {
  const navigation = useNavigation();
  return (
    <Pressable
      onPress={() =>
        navigation.navigate("ChatMessage", {
          recepientId: item._id,
        })
      }
      style={styles.messageContainer}
    >
      <Image source={{ uri: item.image }} style={styles.Pimage} />
      <View style={{ marginLeft: 5, flex: 1 }}>
        <Text style={{ fontSize: 15, fontWeight: "700" }}>{item.name}</Text>
        <Text style={{ color: "grey", fontWeight: "500", marginTop: 5 }}>
          Message comes here
        </Text>
      </View>
      <Text style={{ fontSize: 12, color: "#585858", fontWeight: "400" }}>
        10:45 am
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    padding: 10,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    borderBottomColor: "#D0D0D0",
    borderBottomWidth: 0.5,
  },

  Pimage: {
    height: 50,
    width: 50,
    borderRadius: 25,
  },
});
