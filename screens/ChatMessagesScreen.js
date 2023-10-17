import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  Pressable,
  Image,
} from "react-native";
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { Entypo } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import EmojiSelector from "react-native-emoji-selector";
import { UserType } from "../UserContext";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

const ChatMessagesScreen = () => {
  const [showEmoji, setShowEmoji] = useState(false);
  const route = useRoute();
  const { recepientId } = route.params;
  const handleEmojiPress = () => {
    setShowEmoji(!showEmoji);
  };

  const [recepientData, setRecepientData] = useState("");
  const [message, setMessage] = useState("");
  const { userId, setUserId } = useContext(UserType);
  const [selectedImage, setSelectedImage] = useState("");
  const [fetchedMessages, setFetchedMessages] = useState([]);

  const navigation = useNavigation();

  const fetchMessage = async () => {
    try {
      const response = await fetch(
        `http://192.168.1.90:8000/messages/${userId}/${recepientId}`
      );
      const data = await response.json();

      if (response.ok) {
        setFetchedMessages(data);
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
  useEffect(() => {
    const fetchRecepientData = async () => {
      try {
        const response = await fetch(
          `http://192.168.1.90:8000/user/${recepientId}`
        );
        const data = await response.json();
        setRecepientData(data);
      } catch (err) {
        console.log("Error retrieving details", err);
      }
    };
    fetchRecepientData();
  }, []);

  const handleMessageSend = async (messageType, imageUri) => {
    try {
      const formData = new FormData();
      formData.append("senderId", userId);
      formData.append("recepientId", recepientId);

      //if the message type is image or a normal text

      if (messageType == "image") {
        formData.append("messageType", "image");
        formData.append("imageUrl", {
          uri: imageUri,
          name: "image.jpg",
          type: "image/jpeg",
        });
      } else {
        formData.append("messageType", "text"),
          formData.append("messageText", message);
      }

      const response = await fetch("http://192.168.1.90:8000/messages", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setMessage("");
        setSelectedImage("");
        fetchMessage();
      }
    } catch (err) {
      console.log("Error in sending the message", err);
    }
  };

  console.log(fetchedMessages);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerLeft: () => (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <AntDesign
            name="back"
            size={22}
            color="black"
            onPress={() => navigation.goBack()}
          />
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            <Image
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                resizeMode: "cover",
              }}
              source={{ uri: recepientData.image }}
            />
            <Text style={{ fontSize: 16, fontWeight: "700", marginLeft: 5 }}>
              {recepientData.name}
            </Text>
          </View>
        </View>
      ),
    });
  }, [recepientData]);

  const formatTime = (time) =>{
    const options = {hour: "numeric", minute: "numeric"};
    return new Date(time).toLocaleString("en-US", options);
  }
  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#F0F0F0" }}>
      <ScrollView>
        {fetchedMessages.map((item, key) => {
          if (item.messageType == "text") {
            return (
              <Pressable
                key={key}
                style={
                  item?.senderId?._id === userId
                    ? {
                        alignSelf: "flex-end",
                        margin: 10,
                        borderRadius: 7,
                        maxWidth: "60%",
                        backgroundColor: "#DCF8C6",
                        padding: 10,
                      }
                    : {
                        alignSelf: "flex-start",
                        margin: 10,
                        borderRadius: 7,
                        maxWidth: "60%",
                        backgroundColor: "white",
                        padding: 10,
                      }
                }
              >
                <Text style={{textAlign: 'left', fontSize: 14}}>{item?.message}</Text>
                <Text style={{color: 'grey', fontSize: 9, marginTop:5, textAlign:'right'}}>{formatTime(item.timeStamp)}</Text>
              </Pressable>
            );
          }
        })}
      </ScrollView>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 10,
          paddingVertical: 10,
          borderTopWidth: 0.7,
          borderTopColor: "#dddddd",
          marginBottom: showEmoji ? 0 : 15,
        }}
      >
        {/* for enabling the emoji, install the dependencies as "npm install react-native-emoji-selector" */}
        <Entypo
          name="emoji-happy"
          size={24}
          color="grey"
          onPress={handleEmojiPress}
        />
        <TextInput
          value={message}
          onChangeText={(text) => setMessage(text)}
          style={{
            flex: 1,
            height: 40,
            borderWidth: 1,
            borderColor: "#dddddd",
            borderRadius: 20,
            paddingHorizontal: 10,
            marginHorizontal: 10,
          }}
          placeholder="Type your message...."
          placeholderTextColor={"grey"}
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            marginHorizontal: 8,
          }}
        >
          <Entypo name="camera" size={24} color="grey" />
          <Feather name="mic" size={24} color="grey" />
        </View>
        <Pressable
          onPress={() => handleMessageSend("text")}
          style={{
            backgroundColor: "#0000b3",
            paddingVertical: 6,
            paddingHorizontal: 16,
            borderRadius: 15,
          }}
        >
          <Feather name="send" size={18} color="white" />
        </Pressable>
      </View>
      {showEmoji && (
        <EmojiSelector
          onEmojiSelected={(emoji) => {
            setMessage((prevMessage) => prevMessage + emoji);
          }}
          style={{ height: 250 }}
        ></EmojiSelector>
      )}
    </KeyboardAvoidingView>
  );
};

export default ChatMessagesScreen;
