let USER=require("../models/user.js")
let CONTACT=require("../models/contact.js");
let DONOR=require("../models/donorreg.js");
let nodemailer=require("nodemailer")
let REQ=require("../models/req.js")
let home=async(req,res)=>{
  try{
    let session=req.session;
    let data=await DONOR.find();
    let donors=await DONOR.find().sort({"_id":-1});
    res.render("index",{
      donor:data,
      donors:donors,
      userstatus:session.userstatus,
    });
    console.log(donors)
  }catch(e){
    console.log(`${e}`)
  }
}
let register=async(req,res)=>{
  try{
    res.render("register");
  }catch(e){
    console.log(`${e}`)
  }
}
let login=async(req,res)=>{
  try{
    res.render("login");
  }catch(e){
    console.log(`${e}`)
  }
}
let contactus=async(req,res)=>{
  try{
    let session=req.session;
    res.render("contact",{
      userstatus:session.userstatus
    });
  }catch(e){
    console.log(`${e}`)
  }
}
let donors=async(req,res)=>{
  try{
    let session=req.session;
    let data=await DONOR.find();
    let donors=await DONOR.find().sort({"_id":-1});
    res.render("donors",{
      donor:data,
      donors:donors,
      userstatus:session.userstatus
    });
  }catch(e){
    console.log(`${e}`)
  }
}
let beadonor=async(req,res)=>{
  try{
    let session=req.session;
    if(session.admin){
      let info=await USER.findOne({uname:session.admin.uname}).limit(1);
      let bd=await DONOR.find({uname:info.uname}).limit(1);
      const today = new Date();
      const birthDate = new Date(info.dob);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      const dayDiff = today.getDate() - birthDate.getDate();
      if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
       age--;  }
      res.render("beadonor",{
        uname:info.uname,
        age:age,
        data:bd,
        userstatus:session.userstatus
      });
    }else{
      res.render("login")
    }
  }catch(e){
    console.log(`${e}`)
  }
}
let checkotp=async(req,res)=>{
  try{
    res.render("checkotp");
  }catch(e){
    console.log(`${e}`)
  }
}
let logout=async(req,res)=>{
  try{
    req.session.destroy((err)=>{
      res.render("index")
    })
  }catch(e){
    res.render("msg",{
      msg:'logout failed*'
    })
  }
}
let details=async(req,res)=>{
  try{
    let session=req.session;
    let data=await DONOR.find({full_name:session.admin.uname}).limit(1);
    let ud=await USER.find({uname:session.admin.uname}).limit(1);
    let ml=await REQ.find({sender:session.admin.uname})
    if(session.admin){
    res.render("details",{
      data:data,
      userstatus:session.userstatus,
      adminstatus:session.adminstatus,
      ud:ud,
      ml:ml,
    })
  }else{
    res.render("login")
  }
  }catch(e){
    res.render("msg",{
      msg:'cant fetch info rn*'
    })
  }
}
let sendreq=async(req,res)=>{
  try{

    let session=req.session;
    if(session.admin){
      let cuser=await USER.findOne({uname:session.admin.uname});
      let ouser=await USER.findOne({uname:req.params.id});
      let ouser2=await DONOR.findOne({full_name:req.params.id});
      let transporter=nodemailer.createTransport({
        service:'gmail',
        auth:{
          user:'shashankspandey04@gmail.com',
          pass:'yzhz qtah jmrw tvqt'
        },tls : { rejectUnauthorized: false }
      })
      let mailOptions={
        from:'shashankspandey04@gmail.com',
        to:`${ouser.mail}`,
        subject:'Blood Donation',
        text:`Hey ${ouser.uname} hope you are doing well. ${cuser.mail} has sent you a request for blood donation. You can get in touch with them if you're interested!`,
      }
      transporter.sendMail(mailOptions,(err,res)=>{
        if(err){
          console.log(err);
        }else{
          console.log(`mail sent`)
        }
      })
      let data=await DONOR.find();
      let donors=await DONOR.find().sort({"_id":-1});
      let requ=new REQ({
        sender:cuser.uname,
        receiver:ouser.uname,
        blood_group:ouser2.blood_group,
        district:ouser2.district
      })
      let reqs=await requ.save();
      res.render("index",{
        donor:data,
        donors:donors,
        rmsg:`request sent successfully.`,
        userstatus:session.userstatus
      });
    }else{
      res.render("login");
    }

  }catch(e){
    res.render("msg",{
      msg:'cant fetch info rn*'
    })
    console.log(e);
  }
}
/*let np=async(req,res)=>{
  try{
    /*let user=new USER({
      uname:"shashankadmin123",
      mail:"shashankspandey04@gmail.com",
      con:"9429821008",
      dob:"2004-06-01",
      gender:"male",
      econ:"8866330251",
      flag:1,
    })
    let add=await user.save();
    res.send("<h1>ok</h1>")*/
  /*  res.render("msg",{
      msg:"ERROR 404 PAGE NOT FOUND*"
    })
  }catch(e){
    res.send(`${e}`)
  }
}*/
let mp=async(req,res)=>{
  try{
    let session=req.session;
    if(session.admin){
      let user=await USER.find();
      let contact=await CONTACT.find();
      res.render("manageapp",{
        user:user,
        contact:contact
      })
    }else{
      res.render("login")
    }
  }catch(e){
    res.send(`<${e}`)
  }
}
let duser=async(req,res)=>{
  try{
    await USER.deleteOne({uname:req.params.id});
    let session=req.session;
    if(session.admin){
      let user=await USER.find();
      let contact=await CONTACT.find();
      res.render("manageapp",{
        user:user,
        contact:contact
      })
    }else{
      res.render("login")
    }
  }catch(e){
    res.send(`<${e}`)
  }
}
let dcon=async(req,res)=>{
  try{
    await CONTACT.deleteOne({_id:req.params.id});
    let session=req.session;
    if(session.admin){
      let user=await USER.find();
      let contact=await CONTACT.find();
      res.render("manageapp",{
        user:user,
        contact:contact
      })
    }else{
      res.render("login")
    }
  }catch(e){
    res.send(`<${e}`)
  }
}
module.exports = {home,register,login,contactus,donors,beadonor,checkotp,logout,details,sendreq,mp,duser,dcon};
