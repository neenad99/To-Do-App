const express = require('express');
const morgan = require("morgan");
const dotenv = require('dotenv').config();
const path = require('path');
const mongoose = require("mongoose");
const Tasks = require('./models/TaskModel');


mongoose.connect(process.env.MONGO_DB_URL, {useNewUrlParser: true,useUnifiedTopology: true}).then(()=>{  
    console.log('connected to mongodb');
}).catch((err)=>{
    console.log('failed to connect to mongodb\n',err);
});

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({extended:false})); 
app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));

app.get('/',(req,res) =>{
    res.sendFile(path.join(__dirname,'/public','todo.html'));
});

app.get('/all',(req,res)=>{
    Tasks.find()
    .then((tasks)=>{
        console.log('fetched all tasks');
        res.statusCode = 200;
        res.json({tasks:tasks,status:"success",message:"task fetched successfully"});
    })
    .catch((err)=>{
        console.log('failed to fetch all memes\n');
        console.log(err);
        res.statusCode=500;
        res.json({status:'fail',error:'some error occured try again'});
    })
});

app.post('/add',(req,res)=>{
    Tasks.create(req.body)
    .then((task)=>{
        console.log("created task",task);
        res.statusCode=201;
        res.json({status:"success",message:"task added successfully"});
    })
    .catch((err)=>{
        console.log("failed to post task",err);
        res.statusCode=500;
        res.json({status:'fail',error:'some error occured try again'});
    })
});


app.put('/update/:taskId',(req,res)=>{
    Tasks.findByIdAndUpdate({_id:req.params.taskId},{$set:req.body},{new:true,useFindAndModify:false})
    .then((task)=>{
        res.statusCode = 200;
        res.json({status:"success",message:"task updated successfully"});
    })
    .catch((err)=>{
        console.log('failed to update task \n',err);
        res.statusCode=500;
        res.json({status:'fail',error:'some error occured try again'});
    })
});

app.delete('/delete/:taskId',(req,res)=>{
    const id = req.params.taskId;
    Tasks.findByIdAndRemove(id, err => {
        if (err){
            console.log('failed to delete task \n',err);
            res.statusCode = 500;
            res.json({status:'fail',error:"some error occured try again"});
        }
        else{
            res.statusCode = 200;
            res.json({status:"success",message:"task deleted successfully"});
        }
})
});



app.use((req, res, next) => {
    res.statusCode = 404;
    res.send({message:"route not found",status:404});
});

app.listen(port,()=>{
    console.log(`server listening on port ${port}`);
})