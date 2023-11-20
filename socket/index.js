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
const {recipient} = require("./utils/socketController");
const fs = require('fs');

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
    if (!token) {
        return next(new Error("403 unauthorized"));
    }
    try {
        const decoded = jwt.verify(token, JWT_KEY);
        const user = await userModel.findById(decoded?._id);
        if (!user) return next(new Error("403 unauthorized\n do not find this user"));
        if (user) {
            const userId = user._id.toString();
            const groups = await chatModel.find({
                members: {$in: [userId]},
                groupName: {$exists: true}
            });
            for (const group of groups) {
                socket.join(group?._id.toString());
            }
        }
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return next(new Error("401 unauthorized\n token expired"));
        } else {
            return next(new Error("403 unauthorized\n invalid token"));
        }
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
        const chat = await chatModel.findOne({
            members: {$all: [firstId, secondId]},
            groupName: {$exists: false}
        });
        if (chat) return new Error("404");
        const newChat = new chatModel({members: [firstId, secondId]});
        const response = await newChat.save();
        userIo.to(socket.id).emit("getChat", response);
    });

    socket.on("createGroup", async (info, user) => {
        if (!info) return new Error("404");
        if (!info?.groupName) return new Error("404");
        if (info?.avatar !== '' && !validator.isURL(info?.avatar)) return new Error("404");
        const newGroup = new chatModel({
            groupName: info?.groupName,
            members: info?.members,
            avatar: info?.avatar,
        });
        const response = await newGroup.save();
        userIo.to(socket.id).emit("getGroup", response);
        for (const onlineUser of onlineUsers) {
            const chat = await chatModel.findOne({members: {$all: [onlineUser.userId, user._id]}});
            if (!chat) continue;
            socket.join(chat?._id);
            let resultRecipient = await recipient(onlineUser.userId);
            userIo.to(onlineUser.socketId).emit("getRecipient", resultRecipient);
        }
    });

    socket.on("updateGroup", async (info, user) => {
        if (!info) return new Error("404");
        const filter = {_id: info._id};
        const update = {$set: info};
        const updateGroup = await chatModel.updateOne(filter, update);
        userIo.to(socket.id).emit("getGroup", info);
        let users = [];
        for (const memberId of info.members) {
            const user = await userModel.findById(memberId);
            if (user) {
                users.push(user);
            }
        }
        userIo.to(socket.id).emit("getUsersChat", users);
        for (const onlineUser of onlineUsers) {
            const chat = await chatModel.findOne({members: {$all: [onlineUser.userId, user._id]}});
            if (!chat) continue;
            let resultRecipient = await recipient(onlineUser.userId);
            socket.join(chat?._id);
            userIo.to(onlineUser.socketId).emit("getRecipient", resultRecipient);
        }
    });

    socket.on("findUsersChat", async (chatId) => {
        if (!chatId) return new Error("404");
        const chat = await chatModel.findById(chatId);
        if (!chat) return new Error("404");
        const memberIds = chat.members;
        const users = await userModel.find({_id: {$in: memberIds}});
        userIo.to(socket.id).emit("getUsersChat", users);
    });

    socket.on("findUserChats", async (userId) => {
        const chats = await chatModel.find({members: {$in: [userId]}});
        userIo.to(socket.id).emit("getUserChats", chats);
    });

    socket.on("findRecipient", async (userId) => {
        let result = await recipient(userId);
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

    socket.on("sendMessage", async (message, groupId) => {
        if (!groupId) {
            const user = onlineUsers.find(user => user.userId === message.recipientId);
            if (!user) return new Error("404");
            userIo.to(user.socketId).emit("getMessage", message);
            userIo.to(user.socketId).emit("getNotification", {
                _id: Date.now(),
                senderId: message.senderId,
                chatId: message.chatId,
                isRead: false,
                date: new Date(),
            });
        } else {
            userIo.to(groupId).emit("getMessage", message);
            userIo.to(groupId).emit("getNotification", {
                _id: Date.now(),
                senderId: message.senderId,
                chatId: groupId,
                isRead: false,
                date: new Date(),
            });
        }
        for (const onlineUser of onlineUsers) {
            const chat = await chatModel.findOne({members: {$all: [onlineUser.userId, message.senderId]}});
            if (!chat) continue;
            let resultRecipient = await recipient(onlineUser.userId);
            userIo.to(onlineUser.socketId).emit("getRecipient", resultRecipient);
        }
    });

    socket.on("update", async (user) => {
        if (name.length < 3) return new Error("404");
        if ((!validator.isURL(user?.avatar)) || !user?.avatar) return new Error("404");
        const result = await userModel.updateOne(
            {_id: user._id},
            {$set: user}
        );
        for (const onlineUser of onlineUsers) {
            const chat = await chatModel.findOne({members: {$all: [onlineUser.userId, user._id]}});
            if (!chat) continue;
            let resultRecipient = await recipient(onlineUser.userId);
            userIo.to(onlineUser.socketId).emit("getRecipient", resultRecipient);
        }
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
        if (!name || !email || !password) return new Error("404");
        let user = await userModel.findOne({email});
        if (user) return new Error("404");
        if (name.length < 3) return new Error("404");
        if (!validator.isEmail(email)) return new Error("404");
        if (!validator.isStrongPassword(password)) return new Error("404");
        user = new userModel({name, email, password});
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();
        const token = createToken(user._id);
        io.to(socket.id).emit("getToken", token);
    });

    socket.on("login", async (userInfo) => {
        const {email, password} = userInfo;
        if (!email || !password) return new Error("404");
        const user = await userModel.findOne({email});
        if (!user) return new Error("404");
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) return new Error("404");
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