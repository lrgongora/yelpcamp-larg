var express           = require('express');
var router            = express.Router();
Campground            = require('../models/campground');
Comment               = require('../models/comment');
User                  = require('../models/user');
middleware            = require('../middleware');


app.get('/submissions', middleware.isLoggedIn, function(req, res){
    if(err){
        console.log(err);
        req.flash("error", "Something went wrong!");
        res.redirect("/campgrounds");
    } else {
        Campground.find({name: req.user.username}, function(err, campgrounds){
            if(err || campground == ""){
                req.flash("error", "No campgrounds found!");
                res.redirect("/campgrounds");
            } else {
                res.render('./dashboard/submissions', {campgrounds: campgrounds});
            }
        });
        
    }
});












module.exports = router;