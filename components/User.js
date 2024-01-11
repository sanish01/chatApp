import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { UserType } from "../UserContext";

const User = ({ item }) => {
  const { userId, setUserId } = useContext(UserType);
  const [requestSent, setrequestSent] = useState(false);

  const [friendRequest, setFriendRequest] = useState([]);
  const [userFriends, setUserFriends] = useState([]);

  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        const response = await fetch(
          `http://192.168.1.90:8000/friend-requests/sent/${userId}`
        );
        const data = await response.json();
        if (response.ok) {
          setFriendRequest(data);
        } else {
          console.log("error", response.status);
        }
      } catch (error) {
        console.log("error, ", error);
      }
    };

    fetchFriendRequests();
  }, []);

  useEffect(() => {
    const fetchUserFriends = async () => {
      try {
        const response = await fetch(
          `http://192.168.1.90:8000/friends/${userId}`
        );
        const data = await response.json();

        if (response.ok) {
          setUserFriends(data);
        } else {
          console.log("Error retrieving friendRequests ", response.status);
        }
      } catch (err) {
        console.log("error", err);
      }
    };
    fetchUserFriends();
  }, []);

  const sendFriendRequestHandler = async (currentUserId, selectedUserId) => {
    try {
      const response = await fetch("http://192.168.1.90:8000/friend-request", {
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

  console.log("Friend request sent, ", friendRequest);
  console.log("User friends, ", userFriends);
  return (
    <Pressable style={styles.container}>
      <View>
        <Image style={styles.img} source={{ uri: item.image }} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
      </View>

      {userFriends.includes(item._id) ? (
        <Pressable
          style={{
            backgroundColor: "#82CD47",
            padding: 10,
            width: 100,
            borderRadius: 6,
          }}
        >
          <Text style={{ textAlign: "center", color: "white" }}>Friends</Text>
        </Pressable>  
      ) : requestSent ||
        friendRequest.some((friend) => friend._id === item._id) ? (
        <Pressable
          style={{
            backgroundColor: "grey",
            padding: 10,
            borderRadius: 6,
            width: 100,
          }}
        >
          <Text style={{ textAlign: "center", color: "white", fontSize: 13 }}>
            Request Sent
          </Text>
        </Pressable>
      ) : (
        <Pressable
          style={styles.actionBtns}
          onPress={() => sendFriendRequestHandler(userId, item._id)}
        >
          <Text style={styles.actionBtnText}>Add Friend</Text>
        </Pressable>
      )}
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
