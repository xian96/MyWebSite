const express = require("express");
const router = express.Router({mergeParams: true});
const Campground = require("../models/campground");
const Comment = require("../models/comment");
const middleware = require("../middleware");

//comments new
router.get("/new", middleware.isLoggedIn, (req, res)=>{
	Campground.findById(req.params.id, (err, camp)=>{
		if(err || !camp){
			req.flash("error", "Something Went Wrong!");
			res.redirect("/campgrounds/"+ req.params.id);
		}
		else{
			// console.log("find the campground");
			res.render("comments/new", {campground: camp});
		}
	});
});

//comments create
router.post("/", middleware.isLoggedIn, (req, res)=>{
	Campground.findById(req.params.id, (err, camp)=>{
		if(err || !camp){
			req.flash("error", "Something Went Wrong!");
			res.redirect("/campgrounds/"+ req.params.id+"/new");
		}
		else{
			// console.log("find the campground");
			Comment.create(req.body.comment, (err, comment)=>{
				if(err){
					req.flash("error", "Something Went Wrong!");
					res.redirect("/campgrounds/"+ req.params.id+"/new");
				}
				else{
					//add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					camp.comments.push(comment);
					camp.save();
					req.flash("success", "successfully added comment!");
					res.redirect("/campgrounds/"+camp._id);
				}
			});
		}
	});
});

//comments edit
router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res)=>{
	Campground.findById(req.params.id, (err, camp)=>{
		if(err || !camp){
			req.flash("error", "Something Went Wrong!");
			res.redirect("/campgrounds/"+ req.params.id);
		}
		else{
			Comment.findById(req.params.comment_id, (err, foundComment)=>{
				if(err || !foundComment){
					req.flash("error", "Something Went Wrong!");
					res.redirect("/campgrounds/"+ req.params.id);
				}else{
					res.render("comments/edit", {campgroundId: req.params.id, comment: foundComment});
				}
			});
		}
	});

}); 

//comment update
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res)=>{
	Campground.findById(req.params.id, (err, camp)=>{
		if(err || !camp){
			req.flash("error", "Something Went Wrong!");
			res.redirect("/campgrounds/"+ req.params.id);
		}
		else{
			Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment)=>{
				if(err || !updatedComment){
					req.flash("error", "Something Went Wrong!");
					res.redirect("/campgrounds/"+req.params.id+"/comments/"+req.params.comment_id +"/edit");
				}else{
					req.flash("success", "successfully edited comment!");
					res.redirect("/campgrounds/"+req.params.id);
				}
			});
		}
	});

});

//comment destory route
router.delete("/:comment_id",  middleware.checkCommentOwnership, (req, res)=>{
	Campground.findById(req.params.id, (err, camp)=>{
		if(err || !camp){
			req.flash("error", "Something Went Wrong!");
			res.redirect("/campgrounds/"+ req.params.id);
		}
		else{
			Comment.findByIdAndRemove(req.params.comment_id, (err)=>{
				if(err){
					req.flash("error", "Something Went Wrong!");
					res.redirect("/campgrounds/"+ req.params.id);
				}else{
					req.flash("success", "successfully deleted comment!");
					res.redirect("/campgrounds/"+ req.params.id)
				}
			});
		}
	});
});

module.exports = router;