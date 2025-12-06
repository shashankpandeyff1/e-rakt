let mongoose=require("mongoose");
let donor=new mongoose.Schema({
  full_name:{
    type:String,
    required:true,
  },
  age:{
    type:String,
    required:true,
  },weight:{
    type:String,
    required:true,
  },
  blood_group:{
    type:String,
    required:true,
  },gender:{
    type:String,
    required:true,
  },
  last_donation:{
    type:String,
    required:true,
  },available_date:{
    type:String,
    required:true,
  },
  district:{
    type:String,
    required:true,
  },notes:{
    type:String,
    required:true,
  }
})
let DONOR=new mongoose.model("DONOR",donor);
module.exports = DONOR;
