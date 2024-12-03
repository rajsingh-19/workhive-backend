const mongoose = require('mongoose');
//          defining the schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    mobile: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});
//          defining the model
const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
