const {Server} = require("socket.io");
const io = new Server({cors: "http://localhost:5173"});
const mongoose = require("mongoose");
const userModel = require("./models/userModel");
const validator = require("validator");
const bcrypt = require("bcrypt");
const {registerUser, loginUser} = require("./controllers/userController");
const jwt = require("jsonwebtoken");
const messageModel = require("./models/messageModel");
const chatModel = require("./models/chatModel");


require("dotenv").config();


const PORT = process.env.PORT || 3000;
const URI = process.env.ATLAS_URI;


const createToken = (_id) => {
    const jwtkey = process.env.JWT_SECRET_KEY;
    return jwt.sign({_id}, jwtkey, {expiresIn: "3d"});
};


let onlineUsers = [];

io.on("connection", (socket) => {
    console.log("new connection", socket.id)
//register
    socket.on("register", async (userInfo) => {
        const {name, email, password} = userInfo;
        if (!name || !email || !password)
            return;

        let user = await userModel.findOne({email});

        if (user)
            return;

        if (!validator.isEmail(email))
            return;

        if (!validator.isStrongPassword(password))
            return;

        user = new userModel({name, email, password});

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const token = createToken(user._id);

        io.to(socket.id).emit("getToken", token);
    });

//login
    socket.on("login", async (userInfo) => {
        const {email, password} = userInfo;

        if (!email || !password)
            return;

        const user = await userModel.findOne({email});

        if (!user)
            return;

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword)
            return;

        const token = createToken(user._id);

        io.to(socket.id).emit("getToken", token);
    });
//find user one
    socket.on("find", async (userId) => {
        const user = await userModel.findById(userId);

        io.to(socket.id).emit("getUser", user);
    });
//find all users
    socket.on("findAll", async () => {
        const users = await userModel.find();

        io.to(socket.id).emit("getUsers", users);
    });

    //--------------chat------------

    //creat chat
    socket.on("createChat", async (chatInfo) => {
        const {firstId, secondId} = chatInfo;
        const chat = await chatModel.findOne({members: {$all: [firstId, secondId]}});

        if (chat) return;

        const newChat = new chatModel({members: [firstId, secondId]});

        const response = await newChat.save();

        io.to(socket.id).emit("getChat", response);
    });

    //find User Chats
    socket.on("findUserChats", async (userId) => {
        const chats = await chatModel.find({members: {$in: [userId]}});

        io.to(socket.id).emit("getUserChats", chats);
    });

    //find recipient
    socket.on("findRecipient", async (userId) => {
        const chats = await chatModel.find({members: {$in: [userId]}});

        let result = [];
        for (const chatsKey in chats) {
            const chat = chats[chatsKey];
            const recipientId = chat?.members.find(id => id !== userId);
            const user = await userModel.findById(recipientId);
            const chatId = chat?._id;
            const lastMessage = await messageModel
                .find({chatId})
                .sort({createdAt: -1})
                .limit(1)
                .exec();
            const updatedUser = {
                chat,
                _id: user._id,
                name: user.name,
                email: user.email,
                message: lastMessage,
            };
            result = [...result, updatedUser];
        }
        io.to(socket.id).emit("getRecipient", result);
    });

    //find Chat
    socket.on("findChat", async (chatInfo) => {
        const {firstId, secondId} = chatInfo;
        const chat = await chatModel.findOne({members: {$all: [firstId, secondId]}});

        io.to(socket.id).emit("getFindChat", chat);
    });

    //--------------message------------

//creat message
    socket.on("creatMessage", async (chat) => {
        const {chatId, senderId, text} = chat;
        const message = new messageModel({
            chatId,
            senderId,
            text,
        });

        const response = await message.save();
        io.to(socket.id).emit("getCreatedMessage", response);
    });

//get message
    socket.on("getMessages", async (chatId) => {
        const messages = await messageModel.find({chatId});

        io.to(socket.id).emit("getMessagesById", messages);
    });

//---------------------
//online user
    socket.on("addNewUser", (userId) => {
        !onlineUsers.some(user => user.userId === userId) &&
        onlineUsers.push({
            userId,
            socketId: socket.id
        });
        io.emit("getOnlineUsers", onlineUsers);
    });
    // Notification
    socket.on("sendMessage", (message) => {
        const user = onlineUsers.find(user => user.userId === message.recipientId);
        if (!user) return;
        io.to(user.socketId).emit("getMessage", message);
        io.to(user.socketId).emit("getNotification", {
            senderId: message.senderId,
            isRead: false,
            date: new Date(),
        });
    });

    socket.on("disconnect", () => {
        onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
        io.emit("getOnlineUsers", onlineUsers);
    });
});

io.listen(PORT);

mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("MongoDB connection establish"))
    .catch((err) => console.log("MongoDB connection failed:" + err.message))