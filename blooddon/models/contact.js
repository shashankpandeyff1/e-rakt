let mongoose=require("mongoose");
let contact=new mongoose.Schema({
  name:{
    type:String,
    required:true,
  },contact:{
    type:String,
    required:true,
    minLength:10,
  },message:{
    type:String,
    required:true,
  }
})
let CONTACT=new mongoose.model("CONTACT",contact);
module.exports = CONTACT;
