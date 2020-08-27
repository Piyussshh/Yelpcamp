var middlewareObj={};
var Campground=require("../models/campground");
var Comment=require("../models/comments");



middlewareObj.checkCampgroundOwnership=function(req,res,next){
	if(req.isAuthenticated())
	{
		Campground.findById(req.params.id,function(err,foundCampground){
			if(err)
			{
				req.flash("error","Campground not found!");
				res.redirect("back");
			}
			else
			{
				if(foundCampground.author.id.equals(req.user._id))
				   {
				   	next();
				   }
				else
				{
					req.flash("error","Permission Denied!");
					res.redirect("back");
				}
			
			}
		});
	}
	else
	{
		req.flash("error","you must be logged in to do that!");
		res.redirect("back");
	}
	
};

middlewareObj.checkCommetOwnership=function(req,res,next){
	if(req.isAuthenticated())
	{
		Comment.findById(req.params.comment_id,function(err,foundComment){
				if(err)
				{
					req.flash("error","Comment not found!");
					res.redirect("back");
				}
				else
				{
					if(foundComment.author.id.equals(req.user._id))
					   {
						next();
					   }
					else
					{ 
						req.flash("error","Permission denied! you are not the author");
						res.redirect("back");
					}

				}
		});
	}
	else
	{
		req.flash("error","you must be logged in to do that!");
		res.redirect("back");
	}
	
};


middlewareObj.isLoggedIn=function(req,res,next){
	if(req.isAuthenticated())
	{
		return next();
	}
	req.flash("error","You must logged in!");
	res.redirect("/login");
};



module.exports=middlewareObj;



