import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { UserType } from "../UserContext";

export default function UserChat({ item }) {
  const navigation = useNavigation();
  const { userId, setUserId } = useContext(UserType);
  const [messages, setMessages] = useState([]);

  const fetchMessage = async () => {
    try {
      const response = await fetch(
        `http://192.168.1.90:8000/messages/${userId}/${item._id}`
      );
      const data = await response.json();

      if (response.ok) {
        setMessages(data);
      } else {
        console.log("Error showing messages", response.status.message);
      }
    } catch (err) {
      console.log("Error retreving message", err);
    }
  };
  useEffect(() => {
    fetchMessage();
  }, []);

  const fetchLastMessages = () => {
    const userMessages = messages.filter(
      (message) => message.messageType === "text"
    );

    const msgLength = userMessages.length;
    return userMessages[msgLength - 1];
  };

  const lastMessages = fetchLastMessages();
  console.log(lastMessages);

  const formatTime = (time) => {
    const options = { hour: "numeric", minute: "numeric" };
    return new Date(time).toLocaleString("en-US", options);
  };

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
        {lastMessages && 
        <Text style={{ color: "grey", fontWeight: "500", marginTop: 5 }}>
          {lastMessages?.message}
        </Text>}
        </View>
      <Text style={{ fontSize: 12, color: "#585858", fontWeight: "400" }}>
        {lastMessages && formatTime(lastMessages?.timeStamp)}
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

