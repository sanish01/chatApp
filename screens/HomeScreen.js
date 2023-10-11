import { StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Octicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { UserType } from "../UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import jwt_decode from "jwt-decode";
import User from "../components/User";

const HomeScreen = () => {
  const navigation = useNavigation();
  const { userId, setUserId } = useContext(UserType);
  const [users, setUsers] = useState([]);

  const LogoutHandler = async () => {
    try {
      await AsyncStorage.removeItem("authToken");
      navigation.replace("Login");
    } catch (err) {
      console.log("Error during logout:", err);
    }
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerLeft: () => <Text style={styles.headerleft}> HappyChat</Text>,
      headerRight: () => (
        <View style={styles.headerRight}>
          <Ionicons name="chatbox-ellipses-outline" size={24} color="black" onPress={() => navigation.navigate("Chats")} />
          <Octicons name="people" size={24} color="black" onPress={()=> navigation.navigate('Friends')}/>
          <MaterialIcons
            name="logout"
            size={24}
            color="black"
            onPress={LogoutHandler}
          />
        </View>
      ),
    });
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = await AsyncStorage.getItem("authToken");

      // install the dependencies jwt-decode to decode the token
      const decodedToken = jwt_decode(token);
      const userId = decodedToken.userId;
      setUserId(userId);

      const apiBaseUrl = "http://192.168.0.105:8000";
      axios
        .get(`${apiBaseUrl}/users/${userId}`)
        .then((response) => {
          // console.log(response.data);
          setUsers(response.data);
        })
        .catch((err) => {
          console.log("error retrieving users", err);
        });
    };
    fetchUsers();
  }, []);

  console.log("Users are: ", users);
  return (
    <View>
      <View style={styles.usersContainer}>
        {users.map((item, index) => (
          <User key={index} item={item} />
        ))}
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  headerleft: {
    fontSize: 18,
    fontWeight: "bold",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  usersContainer: {
    padding: 5,
  },
});
