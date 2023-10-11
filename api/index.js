const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;

const app = express();
const port = process.env.PORT || 8000;
const cors = require("cors");
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());

const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY;

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

const User = require("./models/user");
const Message = require("./models/message");

//endpoint for registering a User

app.post("/register", (req, res) => {
  const { name, email, password, image } = req.body;

  //creating new user object
  const newUser = new User({ name, email, password, image });

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
  const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });

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
