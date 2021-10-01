const express = require("express")
const serverless = require("serverless-http")
const dotenv = require('dotenv');
const mongoose = require("mongoose");
const User = require('../models/user')
const bodyParser = require('body-parser')
const cors = require('cors')
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

app.use(cors())
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
    const {id, role}= req.body
    console.log(req.body);
    let newUser = new User();
    newUser.id= id
    newUser.role= role
    console.log('the userr', newUser);
    await newUser.save().then((result)=>{
        console.log("sucess");
        res.status(200).json({
            message:"User created",
            user:result
    })
    })
    .catch((err)=>{
        console.log('the err', err);
        res.status(500)
    })
})

router.post('/getUser', async(req,res)=>{
    //JSON.parse(
    const {id}=req.body
    console.log("bodyy", req.body);
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