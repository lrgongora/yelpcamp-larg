var express           = require('express');
var router            = express.Router();
Campground            = require('../models/campground');
Comment               = require('../models/comment');
User                  = require('../models/user');
middleware            = require('../middleware');



//=================
//CAMPGROUND ROUTES
//=================

//SHOW ALL CAMPGROUNDS

router.get('/', function(req, res){
  Campground.find({}, function(err, campgrounds){
    console.log(req.user);
    if(err) {
      console.log(err)
    } else {
      res.render('./campgrounds/index', {campgrounds: campgrounds});

    }
  });
});

//RETRIEVE NEW CAMPGROUND FORM

router.get('/new',middleware.isLoggedIn, function(req, res){
  res.render('./campgrounds/new');
})

//CREATE NEW CAMPGROUND

router.post('/',middleware.isLoggedIn, function(req, res){
  if(req.body.campground.name, req.body.campground.image, req.body.campground.price, req.body.campground.description == ""){
    req.flash("error", "Please, submit a valid campground.");
    return res.redirect("/campgrounds/new");
  }
  var author = {
    id: req.user._id,
    username: req.user.username
  }
  var newCampground = req.body.campground;
  newCampground.author = author;
  console.log(newCampground);
  Campground.create(newCampground, function(err, campground){
    if(err) {
      console.log('An error has occurred!')
    } else {
      req.flash("success", "New campground added!");
      res.redirect('/campgrounds');
    }
  })
});

//SHOW ROUTE (INDIVIDUAL CAMPGROUND)

router.get('/:id', function(req, res){
  Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground){
    if(err || !foundCampground) {
      req.flash("error", "Campground not found!");
      res.redirect('back');
    } else {
      res.render('./campgrounds/show', {campground: foundCampground});
    }
  });
});

//EDIT FORM ROUTE

router.get('/:id/edit',middleware.checkEmptyCampground,middleware.checkCampgroundOwnership, function(req, res){
      res.render('./campgrounds/edit');
});

//UPDATE LOGIC
router.put('/:id',middleware.checkEmptyCampground,middleware.checkCampgroundOwnership, function(req, res){
  if(req.body.campground.name, req.body.campground.image, req.body.campground.price, req.body.campground.description == ""){
    req.flash("error", "Missing information!");
    return res.redirect("/campgrounds/new");
  }
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
    if(err){
      console.log(err);
      req.flash("error", "Something went wrong!");
      res.redirect('back');
    } else {
      req.flash("success", "Saved!");
      res.redirect('/campgrounds/' + req.params.id);
    }
  });
});

//DELETE

router.delete('/:id',middleware.checkCampgroundOwnership, function(req, res){
  Campground.findByIdAndDelete(req.params.id, function(err, campground){
    if(err){
      console.log(err);
      res.redirect('/campgrounds/' + req.params.id);
    } else {
      Comment.deleteMany({_id: {$in: campground.comments}}, function(err){
        if(err){
          console.log(err);
        } else {
          res.redirect('/campgrounds');
        }
      })
    }
  });
});


module.exports = router;

