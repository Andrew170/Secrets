//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
var encrypt = require('mongoose-encryption');
const { encryptedChildren } = require("mongoose-encryption");


const app = express();

// GET API KEY FROM EXTERNAL FILE
// console.log(process.env.API_KEY);




app.use(express.static("public"));
// Sets view engine for ejs 
app.set("view engine", "ejs");
// accepts any Unicode encoding of the body and supports automatic inflation of gzip and deflate encodings (REQUIRED CODE FOR BODYPARSER)
app.use(bodyParser.urlencoded({
    extended:true
}));

// makes use of npm module mongoose to start server on mongodb
mongoose.connect("mongodb://localhost:27017/userDB", {useNewURlParser:true});



const userSchema = new mongoose.Schema ({
    email : String,
    password : String
});



userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

const User = new mongoose.model("User", userSchema);






// makes a get request to home route and uses home.ejs
app.get("/",function(req, res){
    res.render("home");
});
// makes a get request to /login route and uses login.ejs when login href triggered from home route
app.get("/login",function(req, res){
    res.render("login");
});
// makes a get request to /register route and uses register.ejs when register href triggered from home route
app.get("/register",function(req, res){
    res.render("register");
});


// catches when submit button is triggered and posts the data to the database
app.post("/register", function(req, res){
    // makes use of the setup schema and creates a new user entry for the database
    const newUser = new User({
        // sets up the keys for the database and the information that is typed in from the username and password inputs
        email : req.body.username,
        password: req.body.password
    });

    newUser.save(function(err){
        if (err){
            console.log(err);
        } else {
            res.render("secrets");
        }
    });

});



app.post("/login", function(req, res){
    const username = req.body.username;
    const password = req.body.password;
    
    User.findOne({email: username}, function(err, foundUser){
        if(err){
            console.log(err);
        }else{
            if(foundUser){
                if (foundUser.password === password){
                    res.render("secrets");

                }
            }
        }
    });
});

















app.listen(3000, function(){
    console.log("Server running on port 3000.")
});