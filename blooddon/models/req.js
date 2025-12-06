let mongoose=require("mongoose");
let req=new mongoose.Schema({
  sender:{
    type:String,
    required:true,
  },
  receiver:{
    type:String,
    required:true,
  },
  blood_group:{
    type:String,
    required:true,
  },
  district:{
    type:String,
    required:true,
  }
})
let REQ=new mongoose.model("REQ",req);
module.exports = REQ;
