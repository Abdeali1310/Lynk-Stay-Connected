import { Types } from "mongoose";

const mongoose = require("mongoose");

const chatSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    groupChat:{
        type:Boolean,
        default:false,
    },
    creator:{
        type:Types.ObjectId,
        ref:"User",
    },
    members:[
        {
            type:Types.ObjectId,
            ref:"User",
        }
    ]

},{
    timestamps:true,
})

const Chat = mongoose.model('Chat',chatSchema);

export default Chat;