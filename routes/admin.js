var express           = require('express');
var router            = express.Router();
passport              = require('passport');
passportLocalStrategy = require('passport-local');
passportLocalMongoose = require('passport-local');
Campground            = require('../models/campground');
Comment               = require('../models/comment');
User                  = require('../models/user');
middleware            = require('../middleware');


router.get('/manageUsers',middleware.isAdmin, function(req, res){
  User.find({}, function(err, users){
    if(err){
      req.flash("error", "Something went wrong!");
      res.redirect('/campgrounds');
    } else {
      res.render('./admin/manageUser', {users: users});
    }
  });
});

module.exports = router;