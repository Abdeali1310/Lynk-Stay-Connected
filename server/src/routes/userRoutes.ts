const express = require("express")
const {userSignUp,userLogin,getMyProfile,userLogout} = require("../controllers/userController")
const multerUpload = require('../middlewares/multer')
const userRouter = express.Router();
const {isAuthenticated} = require("../middlewares/auth")

userRouter.post('/signup',multerUpload,userSignUp)
userRouter.post('/login',userLogin)

//authenticated routes
userRouter.get("/me",isAuthenticated,getMyProfile)
userRouter.get("/logout",isAuthenticated,userLogout)
module.exports = userRouter