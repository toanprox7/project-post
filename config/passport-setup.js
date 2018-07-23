var passport = require('passport'),
    User = require('../models/user-models'),
    //  Profile = require('../routes/profile-routes')
     FacebookStrategy = require('passport-facebook').Strategy;



passport.serializeUser(function (users,done) {
    done(null,users.id);
});

passport.deserializeUser(function (id,done) {
    User.findById(id).then(function (users) {
        done(null,users)
    });
});


passport.use(new FacebookStrategy({
        clientID:"2198978167027408",
        clientSecret:"6e769293b873fd5fb96ccc819b7217aa",
        callbackURL: "http://localhost:3000/auth/facebook/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        User.findOrCreate({where:{fullname:profile.displayName},defaults:{fullname:profile.displayName}})
            .spread(function (user,created) {
                console.log(user.get({plain:true}))
                console.log(created);
                done(null,user)
            })
            .catch(function (err) {
                return done(null,err)
            })
    }
));

