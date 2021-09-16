const express = require('express');
const morgan = require("morgan");
const dotenv = require('dotenv').config();
const path = require('path');
const mongoose = require("mongoose");
const Users = require('./models/TaskModel');


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
    res.sendFile(path.join(__dirname,'/public','login.html'));
});

app.get('/index',(req,res) =>{
    res.sendFile(path.join(__dirname,'/public','todo.html'));
});

app.post('/:userId',(req,res)=>{

    Users.findOne({user_id:req.params.userId})
    .then((user)=>{
        if(user != null){
            console.log("user already present");
            res.statusCode = 200;
            res.json({email:user.email,status:'success',message:"user already present"});
        }
        else{
            Users.create(req.body)
            .then((user)=>{
                console.log("user added",user);
                res.statusCode = 200;
                res.json({status:'success',message:"user added to DB"});
            })
            .catch((err)=>{
                console.log('failed to post user');
                console.log(err);
                res.statusCode = 500;
                res.json({status:'fail',error:'some error occured try again'});
            })
        }
    })
    .catch((err)=>{
        console.log('failed to post user');
        console.log(err);
        res.statusCode = 500;
        res.json({status:'fail',error:'some error occured try again'});
    })
});

app.get('/:userId/all',(req,res)=>{
    Users.findOne({user_id:req.params.userId})
    .then((user)=>{
        console.log('fetched user',user);
        res.statusCode = 200;
        res.json({tasks:user.todo,status:"success",message:"tasks fetched successfully"});
    })
    .catch((err)=>{
        console.log('failed to fetch user\n');
        console.log(err);
        res.statusCode=500;
        res.json({status:'fail',error:'some error occured try again'});
    });
});

app.post('/:userId/add',(req,res)=>{
    Users.findOne({user_id:req.params.userId})
    .then((user)=>{
        console.log('fetched user',user);
        res.statusCode = 200;
        user.todo.push(req.body);
        user.save()
        .then(()=>{
            console.log("task posted successfully",user);
            res.json({status:"success",message:"tasks posted successfully"});  
        })
        .catch((err)=>{
            console.log('failed to post task for user\n');
            console.log(err);
            res.statusCode=500;
            res.json({status:'fail',error:'some error occured try again'});
        });
    })
    .catch((err)=>{
        console.log('failed to fetch user\n');
        console.log(err);
        res.statusCode=500;
        res.json({status:'fail',error:'some error occured try again'});
    });
});


app.put('/:userId/update/:taskId',(req,res)=>{

    Users.findOne({user_id:req.params.userId})
    .then((user)=>{
        if(user.todo.id(req.params.taskId) != null){
            console.log('fetched user',user);
            res.statusCode = 200;

            if(req.body.status != null){
                user.todo.id(req.params.taskId).status = req.body.status;
            }

            user.save()
            .then(()=>{
                console.log("task updated successfully",user);
                res.json({status:"success",message:"tasks updated successfully"});  
            })
            .catch((err)=>{
                console.log('failed to update task for user\n');
                console.log(err);
                res.statusCode=500;
                res.json({status:'fail',error:'some error occured try again'});
            });
        }
        else{
            res.statusCode = 404;
            throw new Error("todo not found");
        }
    })
    .catch((err)=>{
        console.log('failed to fetch user\n');
        console.log(err);
        res.statusCode=500;
        res.json({status:'fail',error:'some error occured try again'});
    });

});

app.delete('/:userId/delete/:taskId',(req,res)=>{
    Users.findOne({user_id:req.params.userId})
    .then((user)=>{
        if(user.todo.id(req.params.taskId) != null){
            console.log('fetched user',user);
            res.statusCode = 200;
            user.todo.id(req.params.taskId).remove();
            user.save()
            .then(()=>{
                console.log("task updated successfully",user);
                res.json({status:"success",message:"tasks updated successfully"});  
            })
            .catch((err)=>{
                console.log('failed to update task for user\n');
                console.log(err);
                res.statusCode=500;
                res.json({status:'fail',error:'some error occured try again'});
            });
        }
        else{
            res.statusCode = 404;
            throw new Error("todo not found");
        }
    })
    .catch((err)=>{
        console.log('failed to fetch user\n');
        console.log(err);
        res.statusCode=500;
        res.json({status:'fail',error:'some error occured try again'});
    });
});



app.use((req, res, next) => {
    res.statusCode = 404;
    res.send({message:"route not found",status:404});
});

app.listen(port,()=>{
    console.log(`server listening on port ${port}`);
})