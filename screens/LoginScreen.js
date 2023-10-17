import {
  Alert,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigation = useNavigation();

  useEffect(() => {
    const checkUserLoginStatus = async () => {
      try{
        const token = await AsyncStorage.getItem("authToken");
        
        if(token){
          navigation.replace("Home")
        }
      }
      catch(err){
        console.log("error", err);
      }
    };

    checkUserLoginStatus();
  }, []);

  const loginHandler = () => {
    const user = {
      email: email,
      password: password,
    };

    const apiBaseUrl = "http://192.168.1.90:8000";

    axios.post(apiBaseUrl + "/login", user).then((response) => {
      console.log(response);
      const token = response.data.token;
      AsyncStorage.setItem("authToken", token);
      console.log("Login successful");
      navigation.replace("Home");
    })
    .catch((error)=>{
      Alert.alert("Login error", "Invalid email or password");
      console.log("Login Error", error);
      console.log(email, password);
    })
  };
  return (
    <View style={styles.container}>
      <KeyboardAvoidingView>
        <View style={styles.heading}>
          <Text style={styles.mainHeadingText}>Sign in</Text>
          <Text style={styles.subHeadingText}>Sign In to your account</Text>
        </View>
        <View style={styles.fomContainer}>
          <View style={styles.inputHolder}>
            <Text style={styles.textlabels}>Email</Text>
            <TextInput
              value={email}
              onChangeText={(text) => setEmail(text)}
              style={styles.input}
              placeholder="Enter your email id"
            />
          </View>
          <View style={styles.inputHolder}>
            <Text style={styles.textlabels}>Password</Text>
            <TextInput
              value={password}
              onChangeText={(text) => setPassword(text)}
              style={styles.input}
              placeholder="**********"
              secureTextEntry={true}
            />
          </View>
          <View style={{ alignItems: "center", marginTop: 25 }}>
            <TouchableOpacity style={styles.button} onPress={loginHandler}>
              <Text
                style={{
                  color: "#fff",
                  fontSize: 18,
                  padding: 10,
                  opacity: 0.9,
                }}
              >
                Login
              </Text>
            </TouchableOpacity>
            <Text style={{ color: "grey", fontSize: 16 }}>
              Don't have an account?{" "}
              <Text onPress={() => navigation.navigate("Register")}>
                Sign Up
              </Text>
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    marginTop: 50,
    padding: 15,
  },
  heading: {
    alignItems: "center",
    marginBottom: 50,
  },

  mainHeadingText: {
    fontSize: 22,
    color: "#1111a2",
    fontWeight: "700",
  },
  subHeadingText: {
    marginTop: 5,
    fontWeight: "700",
    fontSize: 16,
  },

  fomContainer: {
    marginHorizontal: 25,
  },
  textlabels: {
    color: "#002",
    fontSize: 16,
    fontWeight: "700",
  },
  inputHolder: {
    padding: 5,
    marginBottom: 15,
  },

  input: {
    padding: 1,
    borderBottomWidth: 1,
    borderBottomColor: "grey",
    lineHeight: 22,
  },

  button: {
    justifyContent: "center",
    alignItems: "center",
    width: 200,
    backgroundColor: "#005",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 5,
    marginBottom: 15,
  },
});
