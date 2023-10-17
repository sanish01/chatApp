import { View, Text, Pressable, Image } from "react-native";
import React, { useContext } from "react";
import { UserType } from "../UserContext";
import { useNavigation } from "@react-navigation/native";

const FriendRequest = ({ item, friendRequest, setFriendRequest }) => {
  const { userId, setUserId } = useContext(UserType);
  const navigation = useNavigation();
  const acceptFriendReq = async (friendRequestId) => {
    try {
      const response = await fetch(
        "http://192.168.1.90:8000/friend-request/accept",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            senderId: friendRequestId,
            recipientId: userId,
          }),
        }
      );

      if (response.ok) {
        console.log("Friend req accepted !!");
        setFriendRequest(
          friendRequest.filter((request) => request._id !== friendRequestId)
        );
        navigation.navigate("Chats");
      }
    } catch (err) {
      console.log(" Error accepting friend request", err);
    }
  };
  return (
    <Pressable
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 15,
      }}
    >
      <Image
        source={{ uri: item.image }}
        style={{ height: 50, width: 50, borderRadius: 25 }}
      />
      <Text
        style={{ flex: 1, marginLeft: 10, fontWeight: "bold", fontSize: 15 }}
      >
        {item.name} sent you a friend request !!
      </Text>
      <Pressable
        onPress={() => acceptFriendReq(item._id)}
        style={{
          backgroundColor: "#0066b2",
          padding: 10,
          width: 75,
          borderRadius: 8,
        }}
      >
        <Text style={{ textAlign: "center", color: "white" }}>Accept</Text>
      </Pressable>
    </Pressable>
  );
};

export default FriendRequest;
