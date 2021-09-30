const express = require("express")
const serverless = require("serverless-http")
const dotenv = require('dotenv');
const mongoose = require("mongoose");
const User = require('../models/user')
const bodyParser = require('body-parser')

dotenv.config()
mongoose.connect('mongodb+srv://rivkaF:1234@cluster0.j5jer.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
)
mongoose.connection.on("error", err => {
    console.log("err", err)
  })
mongoose.connection.on("connected", () => {
    console.log("connected");
});
const app = express();

app.use(bodyParser.urlencoded({
    extended: true,
    defer: true
  }));
const router = express.Router()

router.get('/test', (req,res)=>{
    console.log("tttt");
    res.json({
        'hello':'hi'})})

router.post('/addUser', async(req,res)=>{
    const {id, role}= JSON.parse(req.body.toString())
    let newUser = new User();
    newUser.id= id
    newUser.role= role
    await newUser.save().then((result)=>{
        res.status(200).json({
            message:"User created",
            res:result
    })
    })
    .catch((err)=>{
        res.status(500)
    })
})

router.post('/getUser', async(req,res)=>{
    const {id}= JSON.parse(req.body.toString())
    User.findOne({id:id})
    .then((result)=>{
        if(result)
            res.status(200).json({user:result})
        else
            res.status(210).json('user does not exist')
    })
    .catch((err)=>res.status(500).json(err))

})


app.use('/.netlify/functions/api',router)
module.exports.handler = serverless(app)