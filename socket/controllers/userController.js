const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const {Server} = require("socket.io");

const createToken = (_id) => {
    const jwtkey = process.env.JWT_SECRET_KEY;
    return jwt.sign({_id}, jwtkey, {expiresIn: "3d"});
}

const registerUser = (socket) => {
    socket.on("register", async (userInfo) => {
        const {name, email, password} = userInfo;
        console.log(userInfo)
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
        console.log(user)
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const token = createToken(user._id);
        console.log(token)
        io.emit("getToken", token);
    });
}

const loginUser = (socket) => {
    socket.on("login", async (userInfo) => {
        console.log(userInfo)
        const {email, password} = userInfo;

        if (!email || !password)
            return;

        const user = await userModel.findOne({email});
        console.log(user)
        if (!user)
            return;

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword)
            return;

        const token = createToken(user._id);
        console.log(token)
        io.emit("getToken", token);
    });
}

const findOneUser = async () => {

}

const findUsers = async () => {

}

module.exports = {registerUser, loginUser};