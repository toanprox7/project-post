const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user-models');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');



router.use('/auth', function (req,res,next) {

    next()
});
router.get('/auth/admin', function (req,res,next) {

res.render('admin',{user:req.session.fullname});
});

router.get('/auth/logout', function (req,res,next) {
    req.session=null;
res.redirect('/');
});

router.get('/', function (req,res,next) {
res.render('login');
});

router.get('/auth/facebook', passport.authenticate('facebook', {session:true,
    scope: ['public_profile']
}));

router.get('/auth/facebook/callback', passport.authenticate('facebook',{session:true}), function (req,res,next) {
    req.session.fullname = req.user.dataValues.fullname;
    res.redirect('/auth/admin');
});

router.get('/auth/google', passport.authenticate('google', {session:true,
    scope: ['profile']
}));

router.get('/auth/google/callback', passport.authenticate('google',{session:true}), function (req,res,next) {
    req.session.fullname = req.user.dataValues.fullname;
    res.redirect('/auth/admin');
});

router.get('/auth/checkMail',function (req,res,next) {
    res.render('checkMail');
});

router.post('/',function (req,res,next) {
    let username = req.body.username;
    let password = req.body.password;

    User.findOne({where:{username:username,password:password,status:"active"}})
        .then(function (success) {
            if (success){
                console.log(success);
                req.session.fullname = success.dataValues.fullname;
                return res.redirect('/auth/admin')
            }else{
                return res.redirect('/');
            }
        })
});

router.get('/auth/register',function (req,res,next) {
    res.render('register');
});

router.get('/auth/register/verify/:getVerifyToken',function (req,res,next) {
    User.update({"status":"active"},{where:{"token":req.params.getVerifyToken}}).then(function (dat) {
        res.render('successReg');
    })
});

router.post('/auth/register', function (req,res,next) {
    let username = req.body.username,
        password = req.body.password,
        email = req.body.email,
        fullname = req.body.fullname;

    var tokenRegister = jwt.sign({ foo: 'bar' }, 'shhhhh');
    var linkVerifyReg ="http://localhost:3000/auth/register/verify/"+tokenRegister;
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: "toanpro7x@gmail.com", // generated ethereal user
            pass: "lncbhenspsdlgous" // generated ethereal password
        }
    });

// setup email data with unicode symbols
    let mailOptions = {
        from: '"Hackers"<toanpro7x@gmail.com>', // sender address
        to: email, // list of receivers
        subject: 'Hello ✔', // Subject line
        text: 'Hello world?', // plain text body
        html: '<b>Hello ban?</b> ban vui long xac nhan link dang ky giup minh voi nhe <a href="'+linkVerifyReg+'">'+linkVerifyReg+'</a>'
        // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }else{
            console.log('messenge was sent');
        }

    });

    User.findOrCreate({where:{username:username}, defaults:{password:password,email:email,fullname:fullname,quyen:1,status:'unactive',token:tokenRegister}})
        .spread(function (user,created) {
            if (user){
                console.log(user);
               return res.redirect('/auth/checkMail');
            } else if (created == false) {
                console.log(created);
               return res.redirect('/auth/register')
            }
        })
        .catch(function (err) {
            console.log(err);
        })
});


module.exports = router;