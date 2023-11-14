import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  Pressable,
  Image,
} from "react-native";
import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Entypo } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import EmojiSelector from "react-native-emoji-selector";
import { UserType } from "../UserContext";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons, FontAwesome } from "@expo/vector-icons";

const ChatMessagesScreen = () => {
  const [showEmoji, setShowEmoji] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const route = useRoute();
  const { recepientId } = route.params;
  const handleEmojiPress = () => {
    setShowEmoji(!showEmoji);
  };

  const [recepientData, setRecepientData] = useState("");
  const [message, setMessage] = useState("");
  const { userId, setUserId } = useContext(UserType);
  const [selectedImage, setSelectedImage] = useState([]);
  const [fetchedMessages, setFetchedMessages] = useState([]);

  const scrollViewRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, []);

  const scrollToBottom = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: false });
    }
  };


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
        formData.append("imageFile", {
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

  // console.log(fetchedMessages);

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
          {selectedMessages.length > 0 ? (
            <View>
              <Text style={{ fontSize: 16, fontWeight: "500" }}>
                <Text style={{ fontWeight: "700" }}>Selected:</Text>{" "}
                {selectedMessages.length}
              </Text>
            </View>
          ) : (
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
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
          )}
        </View>
      ),
      headerRight: () => (
        <View>
          {selectedMessages.length > 0 ? (
            <View
              style={{
                flexDirection: "row",
                gap: 10,
                alignItems: "center",
                marginRight: 10,
              }}
            >
              <Ionicons name="md-arrow-redo-sharp" size={22} color="black" />
              <Ionicons name="md-arrow-undo" size={22} color="black" />
              <FontAwesome name="star" size={22} color="black" />
              <MaterialIcons
                name="delete"
                onPress={() => deleteMessages(selectedMessages)}
                size={22}
                color="black"
              />
            </View>
          ) : null}
        </View>
      ),
    });
  }, [recepientData, selectedMessages]);

  const deleteMessages = async (messageIds) => {
    try {
      const response = await fetch("http://192.168.1.90:8000/deleteMessages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: messageIds }),
      });

      if (response.ok) {
        setSelectedMessages((prevMessage) =>
          prevMessage.filter((id) => !messageIds.includes(id))
        );
        fetchMessage();
      } else {
        console.log("Error deleting messages", response.status);
      }
    } catch (err) {
      console.log("error deleting message", err);
    }
  };

  const formatTime = (time) => {
    const options = { hour: "numeric", minute: "numeric" };
    return new Date(time).toLocaleString("en-US", options);
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [9,20],
      quality: 1,
    });

    // console.log(result);

    if (!result.canceled) {
      handleMessageSend("image", result.uri);
    }
  };

  const handleSelectMessage = (message) => {
    //check if the message is already selected
    const isSelected = selectedMessages.includes(message._id);

    if (isSelected) {
      setSelectedMessages((previousMessage) =>
        previousMessage.filter((id) => id !== message._id)
      );
    } else {
      setSelectedMessages((previousMessage) => [
        ...previousMessage,
        message._id,
      ]);
    }
  };

  console.log("selected messages ", selectedMessages);
  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#F0F0F0" }}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{ flexGrow: 1 }}
        onContentSizeChange={scrollToBottom}
      >
        {fetchedMessages.map((item, key) => {
          if (item.messageType === "text") {
            const isSelected = selectedMessages.includes(item._id);
            return (
              <Pressable
                onLongPress={() => handleSelectMessage(item)}
                key={key}
                style={[
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
                      },
                  isSelected && { width: "100%", backgroundColor: "#F0FFFF" },
                ]}
              >
                <Text
                  style={{
                    textAlign: isSelected ? "right" : "left",
                    fontSize: 14,
                  }}
                >
                  {item?.message}
                </Text>
                <Text
                  style={{
                    color: "grey",
                    fontSize: 9,
                    marginTop: 5,
                    textAlign: "right",
                  }}
                >
                  {formatTime(item.timeStamp)}
                </Text>
              </Pressable>
            );
          }
          if (item.messageType === "image") {
            const baseUrl = "http://192.168.1.90:8000/";
            const imageUrl = item.imageUrl;
            // console.log(imageUrl);
            // const filename = imageUrl.split("\\").pop();
            const source = baseUrl + imageUrl;
            // console.log("source is", source);

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
                <View>
                  <Image
                    source={{ uri: source }}
                    style={{ width: 200, height: 200, borderRadius: 7 }}
                    resizeMode="cover"
                  />
                  <Text
                    style={{
                      textAlign: "right",
                      color: "white",
                      fontSize: 9,
                      marginTop: 5,
                      position: "absolute",
                      // bottom: 0,
                      right: 10,
                      marginTop: 5,
                    }}
                  >
                    {formatTime(item.timeStamp)}
                  </Text>
                </View>
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
          <Entypo name="camera" size={24} color="grey" onPress={pickImage} />
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
