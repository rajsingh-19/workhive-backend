const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const userRoute = require('./routes/user');
const jobRoute = require('./routes/job');
const connectMongoDB = require('./config/dbconfig');

const app = express();
connectMongoDB();
dotenv.config();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/user', userRoute);
app.use('/api/job', jobRoute);

//          Home route to check if the sevrer is up nd running
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'try.html'));
});

//          wait for the db connection before starting the server
mongoose.connection.once('open', () => {
    console.log("DB Connected");
    //      starting the server after the db connection is established
    app.listen(PORT, () => {
        console.log("Server is runnning on the port", PORT);
    });    
});

//          error handling for db connection issues
mongoose.connection.on('error', (err) => {
    console.error(`DB Connection Error${err}`);
});
