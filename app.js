const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');
const userRoutes = require('./routes/user-routes');
const passportSetup = require('./config/passport-setup');
const cookieSession = require('cookie-session');
const path = require('path');
const passport = require('passport');

// config nunjucks
nunjucks.configure('views',{
    autoescape:true,
    express:app
});

//setip views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

//initialize passport
app.use(passport.initialize());
app.use(passport.session());


//create middleware for homepage
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,'public')));
app.use(cookieSession({maxAge:24*60*60*1000, keys:["aasgjdhashd"]}));
app.use('/',userRoutes);


//create port listen server
app.listen(process.env.PORT || 3000, function (req,res,err) {
    if (err) {
        console.log(err)
    } else{
        console.log('server running on port 3000');
    }
});

module.exports =app;
