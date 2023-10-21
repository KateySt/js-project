const messageModel = require("../models/messageModel");

const createMessage = async (req, res) => {
    const {chartId, senderId, text} = req.body;
    const message = new messageModel({
        chartId,
        senderId,
        text,
    });
    try {
        const response = await message.save();
        res.status(200).json(response);
    } catch (err) {
        console.log(err);
        res.status(500).json("Error");
    }
}

const getMessages = async (req, res) => {
    const {chartId} = req.params;

    try {
        const messages = await messageModel.find({chartId});
        res.status(200).json(messages);
    } catch (err) {
        console.log(err);
        res.status(500).json("Error");
    }
}

module.exports = {createMessage, getMessages};