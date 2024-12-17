const express = require("express")
const {userSignUp} = require("../controllers/userController")
const multerUpload = require('../middlewares/multer')
const userRouter = express.Router();

userRouter.post('/signup',multerUpload,userSignUp)

module.exports = userRouter