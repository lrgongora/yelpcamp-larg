var express           = require('express');
var router            = express.Router();
Campground            = require('../models/campground');
Comment               = require('../models/comment');
User                  = require('../models/user');
middleware            = require('../middleware');


router.get('/submissions', middleware.isLoggedIn, function(req, res){
        Campground.find({"author.username": req.user.username}, function(err, campgrounds){
            if(err || campgrounds == ""){
                req.flash("error", "No campgrounds found!");
                res.redirect("/campgrounds");
            } else {
                res.render('./dashboard/submissions', {campgrounds: campgrounds});
            }
        });
        
    
});












module.exports = router;