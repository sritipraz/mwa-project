const express=require('express');
const router=express.Router();
const { login, signup } = require("../controllers/usersController");
const emailVerification = require('../middlewares/emailVerification');

router.post('/login',login)
router.post('/signup', emailVerification, signup)

module.exports=router;