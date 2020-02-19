const Campground = require("../models/campground");
const Comment = require("../models/comment");
//all the middleware
const middlewareObj = {};

middlewareObj.isLoggedIn = (req, res, next)=>{
	if(req.isAuthenticated()){
		next();
	}else{
		req.flash("error", "You need login to do that!");
		res.redirect("/login");
	}
};

middlewareObj.checkCommentOwnership = (req, res, next)=>{
	if(req.isAuthenticated()){		
		Comment.findById(req.params.comment_id, (err, foundedComment)=>{
		if(err || !foundedComment){
			req.flash("error", "Comment not found");
			res.redirect("/campgrounds/"+ req.params.id);
		}else{
			if(req.user._id.equals(foundedComment.author.id)){
				next();
			}else{
				req.flash("error", "You don't have the permition to do that!");
				res.redirect("/campgrounds/"+ req.params.id);
			}
		}
	});
	}else{
		req.flash("error", "You need login to do that!");
		res.redirect("/campgrounds/"+ req.params.id);
	}
};

middlewareObj.checkCampgroundOwnership = (req, res, next)=>{
	if(req.isAuthenticated()){		
		Campground.findById(req.params.id, (err, campgroundFounded)=>{
		if(err || !campgroundFounded){
			req.flash("error", "Campground not found");
			res.redirect("/campgrounds/"+ req.params.id);
		}else{
			if(req.user._id.equals(campgroundFounded.author.id)){
				next();
			}else{
				req.flash("error", "You don't have the permition to do that!");
				res.redirect("/campgrounds/"+ req.params.id);
			}
		}
	});
	}else{
		req.flash("error", "You need login to do that!");
		res.redirect("/campgrounds/"+ req.params.id);
	}
};

module.exports = middlewareObj;