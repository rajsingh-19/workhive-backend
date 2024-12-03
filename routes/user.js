const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const UserModel = require('../models/user.schema');              // Import the User model for database interaction

dotenv.config();                                                 // Load environment variables from .env file

router.post('/register', async (req, res) => {
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
});

module.exports = router;
