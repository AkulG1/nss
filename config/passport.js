var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;  // this library is for local login system
var User = require('../models/user');
//serialize and deserialize
passport.serializeUser(function(user,done){
  done(null,user._id);
});

passport.deserializeUser(function(id,done){
  User.findById(id,function(err,user){
    done(err,user);
  });
});

//middleware
// 'local-login' is just a name given to middleware
passport.use('local-login',new LocalStrategy({
  usernameField:'email',
  passwordField:'password',
  passReqToCallback:true
},function(req,email,password,done){
  User.findOne({email:email},function(err,user){
    if(err) return done(err);

    if(!user){
      return done(null,false,req.flash('loginMessage','No user exists with this email .'));
    }

    //comparePassword is the method which we declared in UserSchema database
    if(!user.comparePassword(password)){
      return done(null,false,req.flash('loginMessage','Wrong Password'));
    }
    return done(null,user);
  });
}));

//custom function to validate
exports.isAuthenticated = function(req,res,next){
  if(req.isAuthenticated()){
    //if user is authenticated allow him whatever route he want to take
    return next();
  }
  res.redirect('/login');
}
