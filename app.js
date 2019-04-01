var express     = require('express'),
    app         = express(),
    bodyParser  = require('body-parser'),
    mongoose    = require('mongoose'),
    Restaurent = require('./models/restaurent'),
    Comment = require('./models/comment'),
    methodOverride = require("method-override"),
    seedDB      = require('./seeds'),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    User = require("./models/user");
 
 var commentRoutes = require("./routes/comments");
 var restaurentRoutes = require("./routes/restaurents");
 var authRoutes = require("./routes/index");   
//seedDB();

mongoose.connect("mongodb://localhost:27017/yelprestaurent",{useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(methodOverride("_method"));
app.use(require("express-session")({
    secret:"Rushikesh",
    resave : false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(express.static(__dirname + "/public"));
app.use(function(req,res, next){
    res.locals.currentUser= req.user;
    next();
})
app.use(authRoutes);
app.use(commentRoutes);
app.use(restaurentRoutes);



app.listen(3000,function(){
    console.log(" Server has started");
});