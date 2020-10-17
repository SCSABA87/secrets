require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

mongoose.connect("mongodb://localhost:27017/secretusersDB",{useNewUrlParser: true,useUnifiedTopology: true});

console.log(process.env.API_KEY)

const userSchema = new mongoose.Schema({
  email:String,
  password:String,
});



userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password']   });

const User = new mongoose.model("User",userSchema);



app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/",function(req,res){
  res.render("home");
});

app.get("/login",function(req,res){
  res.render("login");
});

app.post("/login",function(req,res){
  const username = req.body.username;
  const password = req.body.password;

User.findOne({email:username},function(err,foundUser){
  if(!err){
    if(foundUser){
      if(foundUser.password === password){
        res.render("secrets")
      }
    }else{
      res.send("<h1>User not found</h1>")
    }
  }
})

});


app.get("/register",function(req,res){
  res.render("register");
});

app.post("/register",function(req,res){

const username = req.body.username;
const password = req.body.password;

const user = new User({
  email:username,
  password:password
});

user.save();

res.redirect("/login")

});

app.listen(3000,function(){
  console.log("Server running on port 3000")
});
