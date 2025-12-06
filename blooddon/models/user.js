let mongoose=require("mongoose");
let user=new mongoose.Schema({
  uname:{
    type:String,
    required:true,
  },mail:{
    type:String,
    required:true,
  },con:{
    type:String,
    required:true,
    minLength:10,
  },dob:{
    type:String,
    required:true,
  },gender:{
    type:String,
    required:true,
  },econ:{
    type:String,
    required:true,
  },flag:{
    type:Number
  }
})
let USER=new mongoose.model("USER",user);
module.exports = USER;
