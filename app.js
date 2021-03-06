var express               = require('express');
    app                   = express();
    bodyParser            = require('body-parser');
    passport              = require('passport');
    passportLocalStrategy = require('passport-local');
    passportLocalMongoose = require('passport-local');
    cookieParser          = require('cookie-parser');
    methodOverride        = require('method-override');
    expressSanitizer      = require('express-sanitizer');
    morgan                = require('morgan');
    request               = require('request');
    mongoose              = require('mongoose');
    Campground            = require('./models/campground');
    Comment               = require('./models/comment');
    User                  = require('./models/user');
    seedDb                = require('./seeds');
    campgroundRoutes      = require('./routes/campgrounds');
    commentRoutes         = require('./routes/comments');
    authRoutes            = require('./routes/auth');
    adminRoutes           = require('./routes/admin');
    dashboardRoutes       = require('./routes/dashboard');
    flash                 = require('connect-flash');
    moment                = require('moment');

// seedDb();

var mongoURI;

mongoose.connect(mongoURI,{useNewUrlParser: true, useUnifiedTopology: true}, function(err){
  if(err) {
    console.log("DB is not accessible!")
  }
});

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(expressSanitizer());
app.use(bodyParser.urlencoded({extended: true}));
app.use(require('express-session')({
  secret: "This is the most amazing commercial",
  resave: false,
  saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new passportLocalStrategy(User.authenticate()));
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  res.locals.moment  = moment;
  next();
});
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);
app.use('/', authRoutes);
app.use('/admin', adminRoutes);
app.use('/dashboard', dashboardRoutes);

app.get('/', function(req, res){
  res.render('landing');
});

app.listen(process.env.PORT, process.env.IP,function(err){
  if(err){
    console.log(err);
  } else {
    console.log("Server is Up and Running...");
    console.log("Port: " + process.env.PORT + " and IP: " + process.env.IP);
  }

});
