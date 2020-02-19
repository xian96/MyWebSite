const express = require("express")
const router = express.Router();
const User 			= require("../models/user"),
	  passport 		= require("passport");


//root route
router.get("/", (req, res) =>{
	// res.render("landing.ejs");
	res.render("landing");
});

//show register form
router.get('/register', (req, res)=>{
	res.render("register");
});

//handel sign up logic
router.post('/register', (req, res)=>{
	const newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, (err, registeredUser)=>{
		if(err){
			req.flash("error", err.message);
			res.redirect('register');
		}
		else{
			passport.authenticate("local")(req, res, ()=>{
				req.flash("success", "welcome! "+ registeredUser.username);
				res.redirect('/campgrounds');
			});			
		}
	});
});

//show login form
router.get('/login', (req, res)=>{
	res.render("login");
});
//handle the login logic
router.post('/login', 
		 passport.authenticate("local", {
			//TODO: how to put flash here ! For the login note!
			//TODO: how to put flash here ! For the login note!
			successRedirect: "/campgrounds", 
			failureRedirect: "/login"
		}), 
		 (req, res)=>{
			res	.send("not success not failure, Something went wrong!");
});

//logout
router.get("/logout", (req, res)=>{
	req.logout();
	req.flash("success", "logged you out");
	res.redirect('/');
});


module.exports = router;