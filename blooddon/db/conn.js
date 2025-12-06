let mongoose=require("mongoose");
let uri=`mongodb://0.0.0.0:27017/E-Rakt`;
let connDB=async()=>{
  try{
    mongoose.set("strictQuery",true)
  return mongoose.connect(uri);
  }catch(e){
    console.log(`cant connect db rn*${e}`)
  }
}
module.exports = connDB;
