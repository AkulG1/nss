var router = require('express').Router();
var User = require('../models/user'); // one dot for going out of router folder and one dot for refering to .models folder as usual
var passport = require('passport');
var async = require('async');
var passportConfig = require('../config/passport');

router.get('/login',function(req,res){
  //if user is logged in redirect him to home page
  if(req.user) return res.redirect('/');
  //if user is not logged in render login page
  res.render('accounts/login',{message:req.flash('loginMessage')});
});

router.post('/login',passport.authenticate('local-login',{
  successRedirect:'/profile',
  failureRedirect:'/login',
  failureFlash:true
}));

router.get('/profile', passportConfig.isAuthenticated, function(req, res, next) {
  User.findOne({ _id: req.user._id }, function(err, user) {
    if (err) return next(err);

    res.render('accounts/profile', { user: user });

  });
});


 router.get('/signup', function(req, res, next) {
   res.render('accounts/signup', {
     errors: req.flash('errors')
   });
 });

router.post('/signup', function(req, res, next) {
  var user = new User();
  user.name = req.body.name;
  user.email = req.body.email;
  user.password = req.body.password;
  var confirmPassword = req.body.passwordrepeat;

  if(user.name == '' || user.name == 'undefined')
  {
    req.flash('errors', 'Name is required for signup');
    return res.redirect('/signup');
  }
  if(user.email == '' || user.email == 'undefined')
  {
    req.flash('errors', 'Email is required for signup');
    return res.redirect('/signup');
  }
  if(user.password == '' || user.password == 'undefined')
  {
    req.flash('errors', 'Password is required for signup');
    return res.redirect('/signup');
  }
  if(confirmPassword == '' || confirmPassword == 'undefined')
  {
    req.flash('errors', 'Confirm Password is required for signup');
    return res.redirect('/signup');
  }

  if(confirmPassword != user.password)
  {
    req.flash('errors', 'Passwords do not match');
    return res.redirect('/signup');
  }
  user.year = req.body.year;
  user.scholar = req.body.scholar;
  user.rollno = req.body.rollno;
  user.picture = user.gravatar();

  User.findOne({ email: req.body.email }, function(err, existingUser) {
    if (existingUser) {
      req.flash('errors', 'Account with that email address already exists');
      return res.redirect('/signup');
    } else {
      user.save(function(err, user) {
        if (err) return next(err);

        req.logIn(user, function(err) {
          if (err) return next(err);
          res.redirect('/profile');

        })
      });
    }
  });
});

router.get('/logout',passportConfig.isAuthenticated,function(req,res,next){
  req.logout();
  res.redirect('/');
});

router.get('/edit-profile', passportConfig.isAuthenticated,function(req,res,next){
  res.render('accounts/edit-profile',{message : req.flash('success')});
});

router.post('/edit-profile', passportConfig.isAuthenticated,function(req,res,next){
  User.findOne({_id:req.user._id},function(err,user){
    if(err) return next(err);

    if(req.body.name) user.name = req.body.name;
    if(req.body.rollno) user.rollno = req.body.rollno;
    if(req.body.scholar) user.scholar = req.body.scholar;
    if(req.body.year) user.year = req.body.year;
    //if(req.body.password) user.password = req.body.password;

    user.save(function(err){
      if(err) return next(err);
      req.flash('success','Successfully Edited your profile');
      return res.redirect('edit-profile');
    });
  });
});


router.get('/change-password', passportConfig.isAuthenticated,function(req,res,next){
  res.render('accounts/change-password',{message : req.flash('success')});
});

router.post('/change-password', passportConfig.isAuthenticated,function(req,res,next){
  User.findOne({_id:req.user._id},function(err,user){
    if(err) return next(err);

    var password = req.body.password;
    var confirmPassword = req.body.passwordrepeat;
    if(password == '' || password=='undefined')
    {
      req.flash('success', 'New password field cannot be left empty');
      return res.redirect('/change-password');
    }

    if(confirmPassword == '' || confirmPassword=='undefined')
    {
      req.flash('success', 'Confirm New password field cannot be left empty');
      return res.redirect('/change-password');
    }

    if(password !== confirmPassword)
    {
      req.flash('success', 'Passwords do not match');
      return res.redirect('/change-password');
    }

    user.password = password;
    //if(req.body.password) user.password = req.body.password;

    user.save(function(err){
      if(err) return next(err);
      req.flash('success','Password changed Successfully');
      return res.redirect('/change-password');
    });
  });
});

module.exports = router;
