//using epress
const express = require('express');

//using mongoose 
const mongoose = require('mongoose');

const cors = require('cors')
//create an instace of epress
const app = express();

app.use(express.json())
app.use(cors())

//Sample in-memory storage for todo itemss
// const todos = [];

//connecting mongoose 
const mongoUrl = "mongodb+srv://sudharsan6078:Z9RzXh8voMaICybh@todo.y50h4.mongodb.net/";
mongoose.connect(mongoUrl,{
    connectTimeoutMS: 50000,
    serverSelectionTimeoutMS: 50000,
});
// Z9RzXh8voMaICybh

//create schema
const totoSchema = new mongoose.Schema({
    title: {
        required: true,
        type: String
    },
    description: String,
})

//creating model

const todoModel = mongoose.model('todo', totoSchema);

//Create a new todo item
app.post("/todos" , async (req,res)=>{
    // data from user 
    const newUser = new todoModel(req.body);
    // db login 
    try{
        const savedata = await newUser.save();
        res.status(201).json(savedata);
    }
    // data to frontend 
    catch(err){
        res.status(400).json({message: err.mesage});
    }
    // const newTodo = {
    //     id: todos.length + 1,
    //     title,
    //     description
    // };
    // todos.push(newTodo);
    // console.log(todos);
    // res.status(201).json(newTodo);
})

//get the item 
app.get("/todos", async(req,res)=>{
    try{
        const getdata = await todoModel.find();
        res.status(200).json(getdata);
    }
    catch(err){
        res.status(500).json({message: err.message})
    }
    
})


//update a todo item
app.put("/todos/:id", async (req,res)=>{
    // const getdata = new todoModel(req.body);
    try{
        const {title , description} = req.body;
        const id = req.params.id;
        const updaedTodo = await todoModel.findByIdAndUpdate(
            id,
            {title , description},
            { new: true }  //show the updated value in json
        )
        if(!updaedTodo){
            return res.status(404).json({message:"todo not found"});
        }
        res.json(updaedTodo);
    }
    catch(err){
        res.json({message: err.message})
    }
})


//detele todo item
app.delete("/todos/:id", async (req,res)=>{
    try{
        const id = req.params.id;
        const deletedata = await todoModel.findByIdAndDelete(id);   
        res.status(204).json({deletedata , message:"deleted sucessfull"});
    }
    catch(err){
        res.json({message: err.mesage})
    }
})


//Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});