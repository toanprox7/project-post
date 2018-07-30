const express = require('express');
const router = express.Router();
const passport = require('passport');
const db =require('../models/index');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: "toanpro7x@gmail.com", // generated ethereal user
        pass: "lncbhenspsdlgous" // generated ethereal password
    }
});

// router.use('/auth/:test', function (req,res,next) {
//     if (!req.session.fullname){
//         console.log("khong ton tai session");
//     }
//     next();
// });


router.get('/auth/forget/reset/:tokenReset', function (req,res,next) {
    let tokenReset = req.params.tokenReset;
    jwt.verify(tokenReset, 'shhhhh', function (err,decoded) {
        if (decoded){
            res.render('chargePass');
        } else{
            res.send('ma token da het han vui long thu reset lai');
        }
    })
});


router.post('/auth/forget/reset/:tokenReset', function (req,res,next) {
    let password = req.body.password;
    let confirmPassword = req.body.confirmPassword;
    if (password === confirmPassword){
        db.Users.update({password:password},{where:{email:req.session.email}})
            .then(function (user) {
                console.log('success');
                req.session =null;
                res.send('ban da doi mat khau thanh cong');
            })
            .catch(function (err) {
            throw err
        })
        
    }else{
        res.redirect('/auth/forget/reset/:tokenReset');
    }

});

router.get('/auth/forget', function (req,res,next) {
    res.render('forget');
});

router.post('/auth/forget', function (req,res,next) {
    let email =req.body.email;
    let TokenReset = jwt.sign({ foo: 'bar' }, 'shhhhh',{ expiresIn: 60*60 });
    var linkReset = "http://localhost:3000/auth/forget/reset/"+TokenReset;
    db.Users.findOne({where:{email:email}})
        .then(function (user) {
            if (user){
                email= req.session.email;
               console.log(user.dataValues.email);
                let transporter = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 587,
                    secure: false, // true for 465, false for other ports
                    auth: {
                        user: "toanpro7x@gmail.com", // generated ethereal user
                        pass: "lncbhenspsdlgous" // generated ethereal password
                    }
                });

                let mailOptions = {
                    from: '"Hackers"<toanpro7x@gmail.com>', // sender address
                    to: user.dataValues.email, // list of receivers
                    subject: 'Hello ✔', // Subject line
                    text: 'Hello world?', // plain text body
                    html: '<b>Hello ban?</b> Ban click vao links duoi kia la se duoc doi pass ngay <a href="'+linkReset+'">'+linkReset+'</a>'
                    // html body
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }else{
                        console.log('messenge was sent');
                    }
                });
                res.send("Ban vui long kiem tra lai gmail cua ban");

            } else{
                console.log('khong tim thay user nao co email nay ca');
                return res.redirect('/auth/forget')
            }
        })
        .catch(function (err) {
        throw err
    })
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

    db.Users.findOne({where:{username:username,password:password,status:"active"}})
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
    db.Users.update({"status":"active"},{where:{"token":req.params.getVerifyToken}}).then(function (dat) {
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

    db.Users.findOrCreate({where:{username:username}, defaults:{password:password,email:email,fullname:fullname,quyen:1,status:'unactive',token:tokenRegister}})
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