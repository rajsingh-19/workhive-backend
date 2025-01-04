const express = require('express');
const router = express.Router();
const { registerHandler, loginHandler } = require("../controller/userController");

//      register route
router.post('/register', registerHandler);

//      signin routee
router.post('/signin', loginHandler);

module.exports = router;
