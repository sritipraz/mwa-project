const jwt = require("jsonwebtoken");
const { SECRET, FRONTEND_URL } = require("../config.json");
const usersModel = require("../models/usersModel");

module.exports = async (req, res, next) => {
  try {
    const { token } = req.params;
    const decoded = await jwt.verify(token, SECRET);
    if (decoded) {
      await usersModel.findOneAndUpdate(
        { email: decoded.email },
        { isVerified: true }
      );
      res.status(301).redirect(FRONTEND_URL + "/login");
    }
  } catch (error) {
    if (error.message == "jwt expired") {
      res.status(301).redirect(FRONTEND_URL + "/error");
    } else {
      next(error);
    }
  }
};
