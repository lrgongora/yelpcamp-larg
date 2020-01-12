var express = require('express');
var router = express.Router();
passport              = require('passport');
    passportLocalStrategy = require('passport-local');
    passportLocalMongoose = require('passport-local');
Campground            = require('../models/campground');
Comment               = require('../models/comment');
User                  = require('../models/user');

//============
//AUTH ROUTES
//============

//REGISTER FORM
router.get('/register', function(req, res){
  res.render('register');
});

//REGISTER PROCESSING
router.post('/register', function(req, res){
  User.find({email: req.body.email}, function(err, user){
    console.log(user);
    if(err){
      console.log(err);
    } else {
      if(user == ""){
        var newUser = {username: req.body.username, firstName: req.body.firstName, lastName: req.body.lastName, email: req.body.email}
        User.register(new User(newUser), req.body.password, function(err, user){
          if(err){
            console.log(err);
            req.flash("error", err.message);
            return res.redirect('/register');
          }
          passport.authenticate('local')(req, res, function(){
            req.flash("success", "Welcome to YelpCamp, " + req.body.username + "!");
            res.redirect('/campgrounds');
          });
        });
      } else {
        req.flash("error", "This email is already registered. Please, login.");
        res.redirect("/login");
      }
    }
  })
});

//LOGIN FORM
router.get('/login', function(req, res){
  res.render('login');
})

//LOGIN PROCESSING
router.post('/login',passport.authenticate('local', {
  successRedirect: '/campgrounds',
  failureRedirect: '/login'
}), function(req, res){

})

//LOGOUT
router.get('/logout', function(req, res){
  req.logOut();
  req.flash('success', 'Logged out successfully!');
  res.redirect('/campgrounds');
})

module.exports = router;