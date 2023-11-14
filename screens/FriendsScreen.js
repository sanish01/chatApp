import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserType } from "../UserContext";
import FriendRequest from "../components/FriendRequest";

const FriendsScreen = () => {
  const { userId, setUserId } = useContext(UserType);

  const [friendRequest, setFriendRequest] = useState([]);
  useEffect(() => {
    fetchFriendRequest();
  }, []);

  const fetchFriendRequest = async () => {
    try {
      const response = await axios.get(
        `http://192.168.1.90:8000/friend-request/${userId}`
      );
      if (response.status === 200) {
        const friendRequestData = response.data.map((friendRequest) => ({
          _id: friendRequest._id,
          name: friendRequest.name,
          email: friendRequest.email,
          image: friendRequest.image,
        }));
        setFriendRequest(friendRequestData);
      }
    } catch (err) {
      console.log("error retrieving friend request", err);
    }
  };

  console.log(friendRequest);
  return (
    <View style={styles.conatiner}>
      {/* {friendRequest.length === 0 && (<Text style={{fontSize: 18, textAlign: 'left', fontWeight: '600', marginLeft: 15, marginTop: 15}}>No New Friend Request !!!</Text>)} */}
      {friendRequest.length > 0 && (
        <Text style={styles.firstText}>Your friend requests !!</Text>
      )}
      {friendRequest.length > 0 ? (
        friendRequest.map((item, index) => (
          <FriendRequest
            key={index}
            item={item}
            friendRequest={friendRequest}
            setFriendRequest={setFriendRequest}
          />
        ))
      ) : (
        <Text
          style={{
            fontSize: 18,
            textAlign: "left",
            fontWeight: "600",
            marginLeft: 15,
            marginTop: 15,
          }}
        >
          No New Friend Request !!!
        </Text>
      )}
    </View>
  );
};

export default FriendsScreen;

const styles = StyleSheet.create({
  conatiner: {
    padding: 10,
    marginHorizontal: 8,
  },
  firstText: {
    fontSize: 16,
    color: "black",
    fontWeight: "bold",
    opacity: 0.75,
    marginLeft: 5,
  },
});
