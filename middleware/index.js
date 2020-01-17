var middlewareObj = {};

middlewareObj.isLoggedIn = function (req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  req.flash('error', 'Please, login first!');
  res.redirect('/login');
};


middlewareObj.checkCampgroundOwnership = function(req, res, next){
  if(req.isAuthenticated()){
    Campground.findById(req.body.campgroundID || req.params.id, function(err, foundCampground){
      if(err || !foundCampground){
        req.flash("error", "Campground not found!");
        res.redirect('back');
      } else {
        if(foundCampground.author.id.equals(req.user._id) || req.user.isAdmin == true){
          next();
        } else {
          req.flash("error", "Insufficient permissions!");
          res.redirect('back');
        }
      }
    });
  } else {
    req.flash('error', 'Please, login first!');
    res.redirect('back');
  }
};


middlewareObj.checkCommentOwnership = function(req, res, next){
  if(req.isAuthenticated()){
    Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err || !foundComment){
        console.log(err);
        req.flash("error", "Comment not found!");
        res.redirect('back');
      } else {
        if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin == true){
          next();
        } else {
          req.flash("error", "Insufficient permissions!");
          res.redirect('back');
        }
      }
    });
  } else {
    res.redirect('/login');
  }
};

middlewareObj.checkEmptyCampground = function(req, res, next){
  Campground.findById(req.params.id, function(err, foundCampground){
    if(err || !foundCampground){
      req.flash("error", "Campground not found!");
      res.redirect('back');
    } else {
      res.locals.campground = foundCampground;
      next();
}})};

middlewareObj.isAdmin = function(req, res, next){
  if(req.isAuthenticated()){
    if(req.user.isAdmin === true){
      next();
    } else {
      req.flash("error", "Insufficient permissions!");
      res.redirect('/campgrounds');
    }
  } else {
    req.flash("error", "Please, login first!");
    res.redirect('/login');
  }
}

module.exports = middlewareObj
