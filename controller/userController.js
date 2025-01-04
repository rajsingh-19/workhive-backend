const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UserModel = require("../models/user.schema");                 // Import the User model for database interaction

dotenv.config();                                                    // Load environment variables from .env file

const registerHandler = async (req, res) => {
    const {name, email, mobile, password} = req.body;
    const isUserExists = await UserModel.findOne({email});
    //          check if user already exists
    if(isUserExists) {
        return res.status(400).json({message: "User already exists"});
    }
    //          hash the password using bcrypt
    const salting = await bcrypt.genSalt(10);                              // Generate a salt for password hashing
    const hashPassword = await bcrypt.hash(password, salting);             // Hash the password with the salt
    try {
    //          create the User in the Model
    const newUser = new UserModel({
        name,
        email,
        mobile,
        password: hashPassword
    });
    //          save the new user to the database
        await newUser.save();                                           // Save the new user to the model (MongoDB)
        res.status(200).json({message: "User Created"});
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Error in creating user"});
    }
};

const loginHandler = async (req, res) => {
    const {email, password} = req.body;
    const isUserValid = await UserModel.findOne({email});
    //          check if user is present or not
    if(!isUserValid) {
        return res.status(400).json({message: "Email credential is wrong"});
    };
    //          check if the password is same or not
    const isPasswordValid = await bcrypt.compare(password, isUserValid.password);
    //          check if the password is valid or not
    if(!isPasswordValid) {
        return res.status(400).json({message: "Password credential is wrong"});
    };
    //          payload for the JWT token (information we want to encode into the token)
    const payload = {
        id: isUserValid._id                      // Include mongodb id in the token payload
    };
    //          create the JWT token with the payload, using a secret key from environment variables
    const token = jwt.sign(payload, process.env.JWT_SECRET);
    // res.cookie("token", token);             // Store the token in a cookie named "token"
    return res.json({status: true, message: "Login Successfully", token: token});
};

module.exports = {registerHandler, loginHandler};
