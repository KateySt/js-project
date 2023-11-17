const chatModel = require("../models/chatModel");
const messageModel = require("../models/messageModel");
const userModel = require("../models/userModel");

async function recipient(userId) {
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
    return result;
}

module.exports = {recipient}