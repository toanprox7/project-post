const express = require('express');
const router = express.Router();
const passport = require('passport');

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



module.exports = router;