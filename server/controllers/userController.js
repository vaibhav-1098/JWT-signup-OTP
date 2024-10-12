const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../config/emailConfig");
require("dotenv").config();

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    if (name == password) {
        return res.status(400).send({ msg: "name and password must be unique", success: false });
    }
    try {
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).send({ msg: "email already exists", success: false });
        }

        const otp = Math.floor(1000 + Math.random() * 9000);
        const hashedPassword = await bcrypt.hash(password, 10);

        const token = jwt.sign(
            { name, email, password: hashedPassword, otp },
            process.env.SECRET_KEY,
            { expiresIn: "5m" }
        );

        await sendEmail(
            email,
            "Email Verification",
            `Your OTP for verification is ${otp}. Please verify within 5 minutes.`
        );

        return res.send({
            success: true,
            msg: "OTP sent to your email.",
            token,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ success: false, msg: "error sending OTP" });
    }
};

const verifyOtp = async (req, res) => {
    const { otp, token } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        if (decoded.otp == otp) {
            let newUser = {
                name: decoded.name,
                email: decoded.email,
                password: decoded.password,
            };

            newUser = await userModel.create({
                ...newUser,
            });

            const token = jwt.sign({ id: newUser._id }, process.env.SECRET_KEY, {
                expiresIn: "10d",
            });

            return res.send({
                success: true,
                msg: "registration successful",
                newUser,
                token,
            });
        } else {
            return res.status(400).send({
                success: false,
                msg: "Invalid OTP",
            });
        }
    } catch (error) {
        return res.status(400).send({
            success: false,
            msg: "Invalid OTP",
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await userModel.findOne({ email });
        if (!existingUser) {
            return res.status(400).send({ msg: "email not found", success: false });
        }
        const passwordMatch = await bcrypt.compare(password, existingUser.password);
        if (!passwordMatch) {
            return res.status(400).send({ msg: "wrong email or password", success: false });
        }
        const token = jwt.sign({ id: existingUser._id }, process.env.SECRET_KEY, {
            expiresIn: "10d",
        });
        res.send({ msg: "login successful", success: true, existingUser, token });
    } catch (error) {
        res.status(500).send({ msg: "an error occurred", success: false });
    }
};

module.exports = {
    registerUser,
    loginUser,
    verifyOtp,
};
