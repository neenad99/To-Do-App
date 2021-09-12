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

const Tasks = mongoose.model("Task",TaskSchema);

module.exports = Tasks;