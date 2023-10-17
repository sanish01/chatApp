import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState("");

  const navigation = useNavigation();

  const handleRegister = () => {
    const user = {
      name: name,
      email: email,
      password: password,
      image: image,
    };

    if (
      user.email.trim() === "" ||
      user.image.trim() === "" ||
      user.name.trim() === "" ||
      user.password.trim() === ""
    ) {
      setName("");
      setEmail("");
      setPassword("");
      setImage("");
      return Alert.alert("Invalid Input", "The values should not be blank");
    }

    const apiBaseUrl = "http://192.168.1.90:8000"; // this is the local ip address to test from the mobile since local host is not working while testing from expogo
    // send a post request to the backend API to register a user
    axios
      // .post("http://localhost:8000/register", user)
      .post(apiBaseUrl + "/register", user)
      .then((response) => {
        console.log(response);
        Alert.alert(
          "Registration successful",
          "You have been registered successfully"
        );
        setName("");
        setEmail("");
        setPassword("");
        setImage("");
        navigation.goBack();
      })
      .catch((err) => {
        Alert.alert(
          "Registration error!!",
          "An error has been occured while registring"
        );
        console.log("Registration failed", err);
      });
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView>
        <View style={styles.heading}>
          <Text style={styles.mainHeadingText}>Register</Text>
          <Text style={styles.subHeadingText}>Register your account</Text>
        </View>
        <View style={styles.fomContainer}>
          <View style={styles.inputHolder}>
            <Text style={styles.textlabels}>Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your Name"
              value={name}
              onChangeText={(value) => setName(value)}
            />
          </View>
          <View style={styles.inputHolder}>
            <Text style={styles.textlabels}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email id"
              value={email}
              onChangeText={(value) => setEmail(value)}
            />
          </View>
          <View style={styles.inputHolder}>
            <Text style={styles.textlabels}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="**********"
              secureTextEntry={true}
              value={password}
              onChangeText={(value) => setPassword(value)}
            />
          </View>
          <View style={styles.inputHolder}>
            <Text style={styles.textlabels}>Image</Text>
            <TextInput
              style={styles.input}
              placeholder="Image"
              value={image}
              onChangeText={(value) => setImage(value)}
            />
          </View>
          <View style={{ alignItems: "center", marginTop: 25 }}>
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
              <Text
                style={{
                  color: "#fff",
                  fontSize: 18,
                  padding: 10,
                  opacity: 0.9,
                }}
              >
                Register
              </Text>
            </TouchableOpacity>
            <Text style={{ color: "grey", fontSize: 16 }}>
              Already have an account?{" "}
              <Text onPress={() => navigation.goBack()}>Sign In</Text>
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
