

import express from "express";
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const path = require("path");

const app = express();
const port = 8000;
const cors = require("cors");
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());

const jwt = require("jsonwebtoken");
// const secretKey = process.env.SECRET_KEY;

// app.get("/", (req, res) => {
//   res.send("Welcome to the server sanish!");
// });

mongoose
  .connect("mongodb+srv://shan:sanish@cluster0.kgoqlsl.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedtopology: true,
  })
  .then(() => {
    console.log("connected to Mongo DB");
  })
  .catch((err) => {
    console.log("Failed to connect to MongoDb", err);
  });

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

//testing
// Define a route to serve static files from the "files/" directory
app.use("/files", express.static(path.join(__dirname, "files")));

const User = require("./models/user");
const Message = require("./models/message");
const multer = require("multer");

const defaultUserImage =
  "https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg?w=740&t=st=1695743723~exp=1695744323~hmac=4d6be87de3922dfabc655661c703e64977a02e24c03ae41905cd99a8d9114c0f";
//endpoint for registering a User

app.post("/register", (req, res) => {
  // const { name, email, password, image } = req.body;
  const { name, email, password } = req.body;

  //creating new user object
  const newUser = new User({
    name,
    email,
    password,
    image: defaultUserImage,
  });

  //save the user to the database

  newUser
    .save()
    .then(() => {
      res.status(200).json({ Message: "User registered successfully" });
    })
    .catch((err) => {
      console.log("Error registering user", err);
      res.status(500).json({ Message: "Error registering the user!" });
    });
});

//function to create token for the user

const createToken = (userId) => {
  //set the token payload
  const payload = {
    userId: userId,
  };

  //generate the token with a secret key and expiration time
  const token = jwt.sign(payload, "Q$r2K6W8n!jCW%Zk", { expiresIn: "1h" });

  return token;
};
//endpoint for loggin in for that particular user.
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  //check if the email and password are provided
  if (!email || !password) {
    return res
      .status(404)
      .json({ message: "Email and password are required!!" });
  }

  //check if the provided email exist in the database

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        //user not foound
        return res.status(404).json({ message: "User not found" });
      }

      //compare the provided password with the one in database
      if (user.password !== password) {
        return res.status(404).json({ message: "Invalid password!!" });
      }

      const token = createToken(user._id);
      res.status(200).json({ token });
    })
    .catch((err) => {
      console.log("error in finding the user", err);
      res.status(500).json({ message: "Internal server error!" });
    });
});

//endpoint to access all the users excpet the user who is currently logged in

app.get("/users/:userId", (req, res) => {
  const loggedInUserId = req.params.userId;

  User.find({ _id: { $ne: loggedInUserId } })
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      console.log("Error retrieving users", err);
      res.status(500).json({ message: "Error retrieving users" });
    });
});

//endpoint for a user to send friendRequest

app.post("/friend-request", async (req, res) => {
  const { currentUserId, selectedUserId } = req.body;

  try {
    // update the recepient's frendRequest array
    await User.findByIdAndUpdate(selectedUserId, {
      $push: { friendRequests: currentUserId },
    });

    // update the sender's sentFriendRequest array
    await User.findByIdAndUpdate(currentUserId, {
      $push: { sentFriendRequests: selectedUserId },
    });

    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(500);
  }
});

//endpoint to show all the friend request of a particular user

app.get("/friend-request/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    //fetch the user document based on the UserId
    const user = await User.findById(userId)
      .populate("friendRequests", "name email image")
      .lean();
    const friendRequests = user.friendRequests;
    res.json(friendRequests);
  } catch (err) {
    console.log("error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//endpoint to accept a friend-request of a particular person

app.post("/friend-request/accept", async (req, res) => {
  try {
    const { senderId, recipientId } = req.body;

    //retrieve the document of the sender and the recipient
    const sender = await User.findById(senderId);
    const recipient = await User.findById(recipientId);

    sender.friends.push(recipientId);
    recipient.friends.push(senderId);

    sender.sentFriendRequests = sender.sentFriendRequests.filter(
      (request) => request.toString() !== recipientId.toString()
    );

    recipient.friendRequests = recipient.friendRequests.filter(
      (request) => request.toString() !== senderId.toString()
    );

    await sender.save();
    await recipient.save();

    res.status(200).json({ message: "Friend request accepted succesfully" });
  } catch (err) {
    console.log("error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

//endpoint to access all the friends of the logged user

app.get("/accepted-friends/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).populate(
      "friends",
      "name email image"
    );

    const acceptdFriends = user.friends;
    res.json(acceptdFriends);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server server" });
  }
});

// const multer = require("multer");

//configure multer for handeling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "files/"); //specify the desited destination folder
  },
  filename: function (req, file, cb) {
    //generate a unique filename for the uploaded file
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// endpoint to post Messages and store it inthe backend

app.post("/messages", upload.single("imageFile"), async (req, res) => {
  try {
    const { senderId, recepientId, messageType, messageText } = req.body;

    const newMessage = new Message({
      senderId,
      recepientId,
      messageType,
      message: messageText,
      // imageUrl: messageType === "image"? req.file.path : null,
      imageUrl:
        messageType === "image" ? req.file.path.replace(/\\/g, "/") : null,
      timeStamp: new Date(),
    });

    await newMessage.save();
    res.status(200).json({ message: "Message sent successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

//endpoint to get the userdetails to design the chatroom header section

app.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    //fetch the user data from the userId

    const recepientId = await User.findById(userId);
    res.json(recepientId);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

//endpoint to fetch the messages between two users in the chatroom.

app.get("/messages/:senderId/:recepientId", async (req, res) => {
  try {
    const { senderId, recepientId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: senderId, recepientId: recepientId },
        { senderId: recepientId, recepientId: senderId },
      ],
    }).populate("senderId", "_id name");
    res.json(messages);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// endpoint to delete the messages

app.post("/deleteMessages", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ message: "Invalid request body!!" });
    }

    await Message.deleteMany({ _id: { $in: messages } });

    res.json({ message: "Message delted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/friend-requests/sent/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId)
      .populate("sentFriendRequests", "name email image")
      .lean();
    const sentFriendRequests = user.sentFriendRequests;
    res.json(sentFriendRequests);
  } catch (err) {
    console.log("error ", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/friends/:userId", (req, res) => {
  try {
    const { userId } = req.params;
    User.findById(userId)
      .populate("friends")
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        const friendsIds = user.friends.map((friend) => friend._id);
        res.status(200).json(friendsIds);
      });
  } catch (err) {
    console.log("error ", err);
    res.status(500).json({ message: "Internal server error" });
  }
});
