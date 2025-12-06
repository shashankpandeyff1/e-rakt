let express=require("express");
let app=express();
let hbs=require("hbs");
let af=require("./routers/router.js");
let connDB=require("./db/conn.js");
let port=process.env.PORT || 8000;
app.set("view engine","hbs");
app.use("/",af);
app.use(express.static(__dirname + "/public"))
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.get("/",async(req,res)=>{
  res.send(`<h1>donate blood,save lives!</h1>`);
})
app.get(/(.*)/,async(req,res)=>{
res.render("msg",{
  msg:'ERROR 404:PAGE NOT FOUND'
})
})
let startapp=async()=>{
  try{
    await connDB();
    console.log("db connected successfully!!!");
    app.listen(port,()=>{
      console.log(`app listening on port ${port}`);
    })
  }catch(e){
    console.log(`cant start server rn*${e}`);
  }
}
startapp();
