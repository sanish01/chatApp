import { StyleSheet, Text, View , Image} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { UserType } from "../UserContext";
import { useNavigation } from "@react-navigation/native";
import UserChat from "../components/UserChat";

const ChatScreens = () => {
  const [acceptedFriends, setAcceptedFriends] = useState([]);
  const { userId, setUserId } = useContext(UserType);
  const navigation = useNavigation();

  useEffect(() => {
    const acceptedFriendsList = async () => {
      try {
        const response = await fetch(
          `http://192.168.0.105:8000/accepted-friends/${userId}`
        );
        const data = await response.json();

        if (response.ok){
            setAcceptedFriends(data);
        }
      } catch (err) {
        console.log("Error showing the accepted Friends", err);
      }
    };

    acceptedFriendsList();
  }, []);

    console.log(acceptedFriends);
  return (
    <View>
      {acceptedFriends.map((friend, key) => (
        <UserChat key={key} item={friend} />
      ))}
    </View>
  );
};

export default ChatScreens;

const styles = StyleSheet.create({});
