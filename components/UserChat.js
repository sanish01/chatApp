import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

export default function UserChat({ item }) {
    const navigation = useNavigation();
  return (
    <Pressable onPress={() => navigation.navigate("ChatMessage")}>
      <Image source={{ uri: item.image }} style={styles.Pimage} />
      <Text>Hello testing</Text>
      <Text>10:45 am</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  Pimage: {
    height: 50,
    width: 50,
    borderRadius: 25,
  },
});
