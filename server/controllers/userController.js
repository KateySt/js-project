const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
    const jwtkey = process.env.JWT_SECRET_KEY;
    return jwt.sign({_id}, jwtkey, {expiresIn: "3d"});
}
const registerUser = async (req, res) => {
    const {name, email, password} = req.body;
    try {
        if (!name || !email || !password)
            return res.status(400).json("All fields are required");

        let user = await userModel.findOne({email});

        if (user)
            return res.status(400).json("User already exists");

        if (!validator.isEmail(email))
            return res.status(400).json("Email must be a valid email");

        if (!validator.isStrongPassword(password))
            return res.status(400).json("Password must be a strong password");

        user = new userModel({name, email, password});

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const token = createToken(user._id);

        res.status(200).json({token: token});
    } catch (err) {
        console.log(err);
        res.status(500).json("Error");
    }
}

const loginUser = async (req, res) => {
    const {email, password} = req.body;
    try {
        if (!email || !password)
            return res.status(400).json("All fields are required");

        const user = await userModel.findOne({email});

        if (!user)
            return res.status(400).json("User does not exist");

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword)
            return res.status(400).json("Password is not true");

        const token = createToken(user._id);

        res.status(200).json({token: token});
    } catch (err) {
        console.log(err);
        res.status(500).json("Error");
    }
}

const findOneUser = async (req, res) => {
    const userId = req.params.userId;
    try {
        const user = await userModel.findById(userId);
        res.status(200).json(user);
    } catch (err) {
        console.log(err);
        res.status(500).json("Error");
    }
}

const findUsers = async (req, res) => {
    try {
        const users = await userModel.find();
        res.status(200).json(users);
    } catch (err) {
        console.log(err);
        res.status(500).json("Error");
    }
}

module.exports = {registerUser, loginUser, findOneUser, findUsers};