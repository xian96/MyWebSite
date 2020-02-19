const express 		= require("express"),
	  app 			= express(),
	  bodyParser 	= require("body-parser"),
	  mongoose 		= require("mongoose"),
	  flash 		= require("connect-flash"),
	  passport 		= require("passport"),
	  localStrategy	= require("passport-local"),
	  methodOverride= require("method-override"),
	  Campground 	= require("./models/campground"),
	  Comment   	= require("./models/comment"),
	  User		 	= require("./models/user"),
	  session		= require("express-session"), 
	  seedDB 		= require("./seed");

//require route
const campgroundRoutes	= require("./routes/campgrounds"),
	  commentRoutes		= require("./routes/comments"),
	  indexRoutes 		= require("./routes/index");

mongoose.connect(`mongodb+srv://jason:${process.env.MONGO_ATLAS_API_KEY}@cluster0-vjudr.mongodb.net/test?retryWrites=true&w=majority`,{
	useNewUrlParser: true,
	useCreateIndex: true
}).then(()=>{
	console.log("connected!");
}).catch((err)=>{
	console.log(err.message);
});

app.use(express.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();//seed dataseeseebase

//Passport configuration
app.use(session({
		secret: "password is secret you should not know!",
		resave: false,
		saveUninitialize: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
})

// auth route
app.use("/", indexRoutes)
//campgrounds
app.use("/campgrounds", campgroundRoutes)
//Comment route
app.use("/campgrounds/:id/comments", commentRoutes)

app.use("*", (req, res)=>{
	res.status(404).json("not found");
});

app.listen(process.env.PORT || 3000, process.env.IP, (req,res) => {
	console.log("app server has been start listening:");
	console.log("https://webbootcamp-fhstd.run-us-west2.goorm.io");
})