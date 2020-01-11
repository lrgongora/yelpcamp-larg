var express           = require('express');
var router            = express.Router({mergeParams: true});
Campground            = require('../models/campground');
Comment               = require('../models/comment');
User                  = require('../models/user');
middleware            = require('../middleware');

//============
//COMMENT ROUTES
//============

//NEW COMMENT ROUTE

router.get('/new',middleware.isLoggedIn, function(req, res){
  //FIND CAMPGROUND IN DB
  Campground.findById(req.params.id, function(err, campground){
    if(err){
      console.log(err);
    }else{
      console.log(campground);
      res.render('./comments/new', {campground: campground});
    }
  });
});

//CREATE COMMENT ROUTE

router.post('/',middleware.checkEmptyCampground,middleware.isLoggedIn, function(req, res){
  var user = req.user;
  Campground.findById(req.params.id, function(err, campground){
    if(err){
      console.log('Error finding campground');
    }else{
      if(req.body.comment.text == ""){
        req.flash("error", "Comments cannot be blank!");
        return res.redirect('/campgrounds/' + req.params.id + '/comments/new');
      }
      req.body.comment.text = req.sanitize(req.body.comment.text);
      Comment.create(req.body.comment, function(err, comment){
        if(err){
          req.flash("error", "Something went wrong!");
          req.redirect('back');
        }else{
          console.log('Comment successfully created');
          comment.author.id = user._id;
          comment.author.username = user.username;
          comment.save();
          campground.comments.push(comment);
          campground.save();
          console.log('Comment successfully associated to campground');
          console.log(campground);
          res.redirect('/campgrounds/' + campground._id)
        }
      })
    }
  });
});

//UPDATE COMMENT FORM

router.get('/:comment_id/edit',middleware.checkCommentOwnership, function(req, res){

  Comment.findById(req.params.comment_id, function(err, foundComment){
    if(err || !foundComment){
      req.flash("error", "Comment not found!");
      res.redirect('back');
    } else {
    res.render('./comments/edit', {campground_id: req.params.id, comment: foundComment});
  }});

});

//UPDATE LOGIC

router.put('/:comment_id',middleware.checkCommentOwnership,function(req, res){
  console.log(req.body.comment);
  if(req.body.comment.text == ""){
    req.flash("error", "Comments cannot be blank!");
    return res.redirect('/campgrounds/' + req.params.id + '/comments/new');
  }
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
    if(err || !updatedComment){
      req.flash("error", "Something went wrong!");
      res.redirect('back');
      res.redirect('back');
    } else {
      req.flash("success", "Saved!");
      res.redirect('/campgrounds/' + req.params.id);
    }
  });
  });

//DELETE LOGIC


router.delete('/:comment_id',middleware.checkCommentOwnership, function(req, res){
  Comment.findByIdAndDelete(req.params.comment_id, function(err, deletedComment){
    if(err){
      res.redirect('back');
    } else {
      res.redirect('/campgrounds/' + req.params.id);
    }
  });
  });

module.exports = router;