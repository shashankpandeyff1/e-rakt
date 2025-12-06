let express=require("express");
let router=express.Router();
let nodemailer=require("nodemailer");
let session=require("express-session")
router.use(express.json());
router.use(express.urlencoded({extended:true}));
router.use(session({
  secret: 'nonono',
  resave: false,
  saveUninitialized: true,
}))
let {home,register,login,contactus,donors,beadonor,checkotp,logout,details,sendreq,mp,duser,dcon}=require("../controllers/home.js");
let {contact,adddonor,authorize,checkOTP,donorinfo,filter}=require("../controllers/post.js");
router.route("/").get(home);
router.route("/register").get(register);
router.route("/login").get(login);
router.route("/contactus").get(contactus);
router.route("/donors").get(donors);
router.route("/beadonor").get(beadonor);
router.route("/checkotp").get(checkotp);
router.route("/logout").get(logout);
router.route("/manageapp").get(mp);
router.route("/deleteuser/:id").get(duser);
router.route("/deletecontact/:id").get(dcon);
//post routers
router.route("/contact").post(contact);
router.route("/newdonor").post(adddonor);
router.route("/login").post(authorize);
router.route("/verifyotp").post(checkOTP);
router.route("/donorinfo").post(donorinfo);
router.route("/mydetails").get(details);
router.route("/filter").post(filter);
router.route("/sendrequest/:id").get(sendreq);
//router.route("/*").get(np);
module.exports = router;
