import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import React, { useContext, useState } from "react";
import { UserType } from "../UserContext";

const User = ({ item }) => {
  const { userId, setUserId } = useContext(UserType);
  const [requestSent, setrequestSent] = useState(false);

  const sendFriendRequestHandler = async (currentUserId, selectedUserId) => {
    try {
      const response = await fetch("http://192.168.0.105:8000/friend-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentUserId, selectedUserId }),
      });

      if (response.ok) {
        setrequestSent(true);
        console.log("FriendReqSent");
      }
    } catch (err) {
      console.log("Error:", err);
    }
  };
  return (
    <Pressable style={styles.container}>
      <View>
        <Image style={styles.img} source={{ uri: item.image }} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
      </View>

      <Pressable
        style={styles.actionBtns}
        onPress={() => sendFriendRequestHandler(userId, item._id)}
      >
        <Text style={styles.actionBtnText}>Add Friend</Text>
      </Pressable>
    </Pressable>
  );
};

export default User;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    marginHorizontal: 5,
  },
  img: {
    width: 50,
    height: 50,
    borderRadius: 25,
    resizeMode: "cover",
    borderColor: "#fff",
    borderWidth: 0.1,
  },
  textContainer: {
    marginLeft: 10,
    flex: 1,
  },

  actionBtns: {
    backgroundColor: "#567189",
    padding: 10,
    borderRadius: 6,
    width: 100,
  },
  actionBtnText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 13,
  },

  userName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  userEmail: {
    marginTop: 3,
    color: "grey",
  },
});
