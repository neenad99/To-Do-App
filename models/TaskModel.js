const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    content:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }
},{
    toJSON:{
        transform(doc,ret){
            delete ret.__v;
        }
    }
});

const UserSchema = new mongoose.Schema({
    user_id:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    todo:[TaskSchema]
});

const Users = mongoose.model("ToDo",UserSchema);

module.exports = Users;