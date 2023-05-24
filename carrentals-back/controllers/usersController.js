const bcrypt = require('bcrypt');
const jwt_client = require('jsonwebtoken')
const usersModel = require('../models/usersModel');

const { SECRET } = require('../config.json')
/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns json with token
 */
module.exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user_db = await usersModel.findOne({ email })
        if (user_db) {
            const match = await bcrypt.compare(password, user_db.password)
            if (!match) {
                return next(new Error('User authentication failed'))
            }
            if (!user_db.isVerified) {
                return next(new Error('User not verified'))
            }
            const token = jwt_client.sign({
                user_id: user_db._id,
                fullname: user_db.fullname,
                email: user_db.email,
                isAdmin: user_db.isAdmin,
                isVerified: user_db.isVerified
            }, SECRET);

            res.json({ success: true, results: token })
        }
        else {
            return next(new Error('User not found'));
        }
    } catch (error) {
        next(error)
    }
}
/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns json that contains fullname,,email,password
 */
module.exports.signup = async (req, res, next) => {
    try {

        const new_user = req.body;
        const hashed_password = await bcrypt.hash(new_user.password, 10);
        const results = await usersModel.create({
            ...new_user, password: hashed_password
        })
        res.json({ success: true, results })
    } catch (error) {
        next(error)
    }
}