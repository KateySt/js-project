const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
    groupName: {type: String, minlength: 3, maxlength: 20},
    members: Array,
    avatar: {type: String},
}, {
    timestamps: true,
});

const chatModel = mongoose.model("Chat", chatSchema);

module.exports = chatModel;