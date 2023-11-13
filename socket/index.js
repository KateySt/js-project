const {Server} = require("socket.io");
const io = new Server({cors: "http://localhost:5173"});
const mongoose = require("mongoose");
const userModel = require("./models/userModel");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const messageModel = require("./models/messageModel");
const chatModel = require("./models/chatModel");
const {Error} = require("mongoose");

require("dotenv").config();

const PORT = process.env.PORT || 3000;
const URI = process.env.ATLAS_URI;
const JWT_KEY = process.env.JWT_SECRET_KEY;

const userIo = io.of("/users");

let onlineUsers = [];
const createToken = (_id) => {
    return jwt.sign({_id}, JWT_KEY, {expiresIn: "3d"});
}
userIo.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    if (token) {
        const decoded = jwt.verify(token, JWT_KEY);
        const user = await userModel.findById(decoded?._id);
        if (!user) next(new Error("403 unauthorized\n do not find this user"));
        next();
    } else {
        next(new Error("403 unauthorized"));
    }
});
userIo.on("connection", (socket) => {
    console.log("====> new connection", socket.id)

    socket.on("findAll", async () => {
        const users = await userModel.find();
        userIo.to(socket.id).emit("getUsers", users);
    });

    socket.on("createChat", async (chatInfo) => {
        const {firstId, secondId} = chatInfo;
        const chat = await chatModel.findOne({members: {$all: [firstId, secondId]}});
        if (chat) return;
        const newChat = new chatModel({members: [firstId, secondId]});
        const response = await newChat.save();
        userIo.to(socket.id).emit("getChat", response);
    });

    socket.on("createGroup", async (info) => {
        if (!info) return;
        const newGroup = new chatModel({
            groupName: info?.groupName,
            members: info?.members
        });
        const response = await newGroup.save();
        console.log(response)
        userIo.to(socket.id).emit("getGroup", response);
    });

    socket.on("findUserChats", async (userId) => {
        const chats = await chatModel.find({members: {$in: [userId]}});
        userIo.to(socket.id).emit("getUserChats", chats);
    });

    socket.on("findRecipient", async (userId) => {
        const chats = await chatModel.find({members: {$in: [userId]}});
        let result = [];
        for (const chatsKey in chats) {
            const chat = chats[chatsKey];
            if (chat?.groupName) {
                const chatId = chat?._id;
                const message = await messageModel
                    .find({chatId})
                    .sort({createdAt: -1})
                    .limit(1)
                    .exec();
                const updatedUser = {
                    chat,
                    message,
                };
                result = [...result, updatedUser];
            }
            if (!chat?.groupName) {
                const recipientId = chat?.members.find(id => id !== userId);
                const user = await userModel.findById(recipientId);
                const chatId = chat?._id;
                const message = await messageModel
                    .find({chatId})
                    .sort({createdAt: -1})
                    .limit(1)
                    .exec();
                const updatedUser = {
                    chat,
                    user,
                    message,
                };
                result = [...result, updatedUser];
            }
        }
        userIo.to(socket.id).emit("getRecipient", result);
    });

    socket.on("findChat", async (chatInfo) => {
        const {firstId, secondId} = chatInfo;
        const chat = await chatModel.findOne({members: {$all: [firstId, secondId]}});
        userIo.to(socket.id).emit("getFindChat", chat);
    });

    socket.on("creatMessage", async (chat) => {
        const {chatId, senderId, text} = chat;
        const message = new messageModel({
            chatId,
            senderId,
            text,
        });
        const response = await message.save();
        userIo.to(socket.id).emit("getCreatedMessage", response);
    });

    socket.on("getMessages", async (chatId) => {
        const messages = await messageModel.find({chatId});
        userIo.to(socket.id).emit("getMessagesById", messages);
    });

    socket.on("addNewUser", (userId) => {
        !onlineUsers.some(user => user.userId === userId) &&
        onlineUsers.push({
            userId,
            socketId: socket.id
        });
        userIo.emit("getOnlineUsers", onlineUsers);
    });

    socket.on("sendMessage", (message, groupId) => {
        if (!groupId) {
            const user = onlineUsers.find(user => user.userId === message.recipientId);
            if (!user) return;
            userIo.to(user.socketId).emit("getMessage", message);
            userIo.to(user.socketId).emit("getNotification", {
                _id: Date.now(),
                senderId: message.senderId,
                chatId: message.chatId,
                isRead: false,
                date: new Date(),
            });
        } else {
            socket.join(groupId);
            userIo.to(groupId).emit("getMessage", message);
            userIo.to(groupId).emit("getNotification", {
                _id: Date.now(),
                senderId: message.senderId,
                chatId: groupId,
                isRead: false,
                date: new Date(),
            });
        }
    });

    socket.on("update", async (user) => {
        const result = await userModel.updateOne(
            { _id: user._id },
            { $set: user }
        );
        io.to(socket.id).emit("getUser", result);
    });

    socket.on("disconnect", () => {
        onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
        userIo.emit("getOnlineUsers", onlineUsers);
    });
});

io.on("connection", (socket) => {
    console.log("new connection", socket.id)

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

    socket.on("find", async (userId) => {
        const user = await userModel.findById(userId);
        io.to(socket.id).emit("getUser", user);
    });

    socket.on("disconnect", () => {
        console.log("disconnect ", socket.id)
    });
});

io.listen(PORT);

mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("MongoDB connection establish"))
    .catch((err) => console.log("MongoDB connection failed:" + err.message))