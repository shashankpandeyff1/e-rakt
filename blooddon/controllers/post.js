let CONTACT=require("../models/contact.js");
let USER=require("../models/user.js");
let DONOR=require("../models/donorreg.js");
let nodemailer=require("nodemailer");
let contact=async(req,res)=>{
  try{
    let session=req.session;
    let contact=new CONTACT({
      name:req.body.name,
      contact:req.body.contact,
      message:req.body.message,
    })
    let add=await contact.save();
    res.render("contact",{
      msg:"thanks for contacting us,we will connect with you very soon!",
      userstatus:session.userstatus
    })
  }catch(e){
    res.send(`<h1>${e}</h1>`)
  }
}
let adddonor=async(req,res)=>{
  try{
    let session=req.session;
    let uname=await USER.findOne({uname:req.body.uname});
    let email=await USER.findOne({mail:req.body.mail});
    let contact=await USER.findOne({con:req.body.con});
    if(uname){
      res.render("register",{
        msg:`${uname.uname} already exists.try other username.`
      })
    }else if(email){
      res.render("register",{
        msg:`${email.mail} already in use.try other email.`
      })
    }else if(contact){
      res.render("register",{
        msg:`${contact.con} already in use.try other number.`
      })
    }else if(req.body.con==req.body.econ){
      res.render("register",{
        msg:`user contact and emergency contact cannot be same.`
      })
    }else{
    let user=new USER({
      uname:req.body.uname,
      mail:req.body.mail,
      con:req.body.con,
      dob:req.body.dob,
      gender:req.body.gender,
      econ:req.body.econ,
    })
    let add=await user.save();
    req.session.admin=user;
    req.session.userstatus="loggedin";
  /*  res.render("index",{
      msg:`user registered successfully!`,
      userstatus:session.userstatus
    })*/
    let data=await DONOR.find();
    let donors=await DONOR.find().sort({"_id":-1});
    res.render("index",{
      donor:data,
      donors:donors,
    //  rmsg:`request sent successfully.`,
      userstatus:session.userstatus
    });
  }
  }catch(e){
    res.send(`<h1>${e}</h1>`);
    console.log(e);
  }
}
let authorize=async(req,res)=>{
  try{
    //mail -shashankspandey04@gmail.com
    //pass -yzhz qtah jmrw tvqt
    //yzhz qtah jmrw tvqt
    let email=req.body.mail;
    let cu1=await USER.findOne({mail:email,flag:1});
    let cu2=await USER.findOne({mail:email});
    let otp=Math.floor(100000 + Math.random() * 900000);
    if(cu1){
      req.session.admin=cu2;
      req.session.aotp=otp;
      let transporter=nodemailer.createTransport({
        service:'gmail',
        auth:{
          user:'shashankspandey04@gmail.com',
          pass:'yzhz qtah jmrw tvqt'
        },tls : { rejectUnauthorized: false }
      })
      let mailOptions={
        from:'shashankspandey04@gmail.com',
        to:`${cu2.mail}`,
        subject:'user login E-Rakt',
        text:`CODE:${otp}`,
      }
      transporter.sendMail(mailOptions,(err,res)=>{
        if(err){
          console.log(err);
        }else{
          console.log(`mail sent`)
        }
      })
      res.render("checkotp");
    }
    else if(cu2){
      req.session.admin=cu2;
      req.session.aotp=otp;
      let transporter=nodemailer.createTransport({
        service:'gmail',
        auth:{
          user:'shashankspandey04@gmail.com',
          pass:'yzhz qtah jmrw tvqt'
        },tls : { rejectUnauthorized: false }
      })
      let mailOptions={
        from:'shashankspandey04@gmail.com',
        to:`${cu2.mail}`,
        subject:'user login E-Rakt',
        text:`CODE:${otp}`,
      }
      transporter.sendMail(mailOptions,(err,res)=>{
        if(err){
          console.log(err);
        }else{
          console.log(`mail sent`)
        }
      })
      res.render("checkotp");
    }else{
      res.render("msg",{
        msg:'Email not registered with E-Rakt.*'
      })
    }
  }catch(e){
    res.render("msg",{
      msg:'login failed due to invalid credentials*'
    })
    console.log(e)
  }
}
let checkOTP=async(req,res)=>{
  try{
    let session=req.session;
    let uotp=session.aotp;
    let otp=req.body.otp;
    let nuser=await USER.findOne({uname:session.admin.uname});
    let nuser2=await USER.findOne({uname:session.admin.uname,flag:1});
    if(uotp==otp){
      if(nuser2){
        req.session.adminstatus="adminloggedin";
        req.session.userstatus="loggedin";
        let data=await DONOR.find();
        let donors=await DONOR.find().sort({"_id":-1});
        res.render("index",{
          donor:data,
          donors:donors,
        //  rmsg:`request sent successfully.`,
          userstatus:session.userstatus,
          adminstatus:session.adminstatus
        });
      }
      else if(nuser){
        req.session.userstatus="loggedin";
        let data=await DONOR.find();
        let donors=await DONOR.find().sort({"_id":-1});
        res.render("index",{
          donor:data,
          donors:donors,
        //  rmsg:`request sent successfully.`,
          userstatus:session.userstatus
        });
        /*res.render("index",{
          userstatus:"loggedin"
        })*/
      }else{
        res.render("msg",{
          msg:'invalid otp*'
        })
      }
    }else{
      res.render("msg",{
        msg:'invalid otp*'
      })
    }
  }catch(e){
    res.render("msg",{
      msg:'invalid otp*'
    })
    console.log(e);
  }
}
let donorinfo=async(req,res)=>{
  try{
    let session=req.session;
  /*  let cu=await USER.find({uname:session.admin.uname});
    if(cu){
      await DONOR.updateMany({full_name:session.admin.uname},{$set:{full_name:req.body.full_name,age:req.body.age,weight:req.body.weight,
      blood_group:req.body.blood_group,
      gender:session.admin.gender,
      last_donation:req.body.last_donation,
      available_date:req.body.available_date,
      district:req.body.district,
      notes:req.body.notes,}},{$upsert:true})
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
    }*/
    await DONOR.deleteOne({full_name:req.body.full_name})
    let donor=new DONOR({
      full_name:req.body.full_name,
      age:req.body.age,
      weight:req.body.weight,
      blood_group:req.body.blood_group,
      gender:session.admin.gender,
      last_donation:req.body.last_donation,
      available_date:req.body.available_date,
      district:req.body.district,
      notes:req.body.notes,
    })
    let add=await donor.save();
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
  //  res.send("ok")
  //  console.log("cu")
  //  console.log(cu)

  }catch(e){
    res.send(`<h1>${e}</h1>`)
  }
}
let filter=async(req,res)=>{
  try{
    let session=req.session;
    let bg=req.body.bg;
    let loc=req.body.loc;
    let data=await DONOR.find({blood_group:bg,district:loc});
    let donor=await DONOR.find();
    let donors=await DONOR.find().sort({"_id":-1});
    req.session.filter="applied";
    if(bg==undefined || bg==null || bg==''){
      let data=await DONOR.find({district:loc});
      res.render("index",{
        donor:donor,
        donors:data,
        filter:session.filter,
      });
    }else if(loc==undefined || loc==null || loc==''){
      let data=await DONOR.find({blood_group:bg});
      res.render("index",{
        donor:donor,
        donors:data,
        filter:session.filter,
        userstatus:session.userstatus
      });
    }else{
    res.render("index",{
      donor:donor,
      donors:data,
      filter:session.filter,
    });
  }
  }catch(e){
    res.send(`<h1>${e}</h1>`)
  }
}
module.exports = {contact,adddonor,authorize,checkOTP,donorinfo,filter};
