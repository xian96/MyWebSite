const express 		= require("express");
const Campground 	= require("../models/campground");
const router 		= express.Router();
const middleware 	= require("../middleware");
//index
router.get("/", (req,res) =>{
	Campground.find({},(err,allCamps)=>{
		if(err){
			req.flash("error", "Something Went Wrong!");
			console.log(err);
			res.redirect("/");
		}
		else{
			res.render("campgrounds/index",{campgrounds: allCamps});
		}
	});
});

//new
router.get("/new", middleware.isLoggedIn, (req, res)=>{
	res.render("campgrounds/new");
});

//create
router.post("/", middleware.isLoggedIn, (req, res) =>{
	// res.send("post to campgrounds");
	const name = req.body.name;
	const price = req.body.price;
	const image = req.body.image;
	const description = req.body.description;
	const author = {
		id: req.user._id,
		username: req.user.username
	};
	const newCamp = {
		name:name,
		price:price,
		image:image,
		author: author,
		description:description
	}
	Campground.create(newCamp, (err, newCreatedCamp)=>{
		if(err){
			req.flash("error", "Something Went Wrong!");
			console.log(err);
			res.redirect("/");

		}
		else{
			res.redirect("/campgrounds");
		}
	});
});

//show
router.get("/:id", (req, res)=>{
	let id = req.params.id;
	Campground.findById(id).populate("comments").exec((err, camp)=>{
		if(err || !camp){
			req.flash("error", "Something Went Wrong!");
			res.redirect("/campgrounds");
		}
		else{
			// console.log(req.user._id + " " + camp.author.id);
			// console.log(typeof req.user._id + " " + typeof camp.author.id);
			// console.log(req.user._id.equals(camp.author.id));
			res.render("campgrounds/show", {campground: camp});
		}
	});
});

//edit campground
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res)=>{
	Campground.findById(req.params.id, (err, campgroundFounded)=>{
		if(err){
			req.flash("error", "Something Went Wrong!");
			res.redirect("/campgrounds/"+req.params.id);
		}else{
			res.render("campgrounds/edit", {campground: campgroundFounded});
		}
	});
});

//update campground
router.put("/:id", middleware.checkCampgroundOwnership, (req, res)=>{
	//find and update
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, campgroundFounded)=>{
		if(err){
			req.flash("error", "Something Went Wrong!");
			res.redirect("/campgrounds/"+ req.params.id);
		}else{
			res.redirect("/campgrounds/"+ req.params.id);
		}
	})
});

//destory campground route
router.delete("/:id", middleware.checkCampgroundOwnership, (req, res)=>{
	Campground.findByIdAndRemove(req.params.id, (err)=>{
		if(err){
			req.flash("error", "Something Went Wrong!");
			res.redirect("/campgrounds/"+ req.params.id);
		}else{
			res.redirect("/campgrounds/");
		}
	})
})

//middleware

module.exports = router;