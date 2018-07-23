const express = require('express');
const router = express.Router();
const passport = require('passport');


router.get('/auth/admin', function (req,res,next) {

res.render('admin',{user:req.session.fullname});
});

router.get('/', function (req,res,next) {
res.render('index');
});

router.get('/auth/facebook', passport.authenticate('facebook', {session:true,
    scope: ['public_profile']
}));

router.get('/auth/facebook/callback', passport.authenticate('facebook',{session:true}), function (req,res,next) {
    req.session.fullname = req.user.dataValues.fullname;
    res.redirect('/auth/admin');
});



module.exports = router;