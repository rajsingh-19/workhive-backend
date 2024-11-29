const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

const connectMongoDB = require('./config/dbconfig');

const app = express();
connectMongoDB();
dotenv.config();

const PORT = process.env.PORT || 3001;

app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'try.html'));
});


app.listen(PORT, () => {
    console.log("Server is runnning on the port", PORT);
    mongoose.connection.once('open', () => {
        console.log("DB Connected");
    });
});



