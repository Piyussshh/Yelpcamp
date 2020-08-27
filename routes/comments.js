var express    = require("express"),
	router     = express.Router(),
	Campground =require("../models/campground"),
	Comment    =require("../models/comments"),
	middleware=require("../middleware");




//=========================//=========================comments======================================


router.get("/campgrounds/:id/comments/new",middleware.isLoggedIn,function(req,res){
	
	Campground.findById(req.params.id,function(err,campgrounds){
		
		if(err)
			{
				req.flash("error","Campground not found!")
				console.log(err);
			}
		else{ 
		        res.render("comments/new" , {campgrounds:campgrounds});
			}
	});
	
	
});

router.post("/campgrounds/:id/comments",function(req,res){
	
	Campground.findById(req.params.id,function(err,campground){
		if(err)
			{
				console.log(err);
			}
		else{
			Comment.create(req.body.comment,function(err,comment){
				
				if(err)
					{
						req.flash("error","Oops! something went wrong!");
						console.log(err);
					}
				else
					{
						comment.author.id=req.user._id;
						comment.author.username=req.user.username;

                        comment.save();
						campground.comments.push(comment);
						campground.save();
						req.flash("success","Comment created successfully!");
						res.redirect('/campgrounds/'+campground._id);
					}
				
			});
		}
	});
});

//============================Edit page! ======================//
router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.checkCommetOwnership , function(req,res){
	Comment.findById(req.params.comment_id,function(err,foundComment){
		if(err)
			{
				req.flash("error","Comment not find!");
				res.redirect("back");
			}
		else
			{
				res.render("comments/edit" ,{campground_id:req.params.id , comment:foundComment});
			}
	});
	
});
// handling the comments

router.put("/campgrounds/:id/comments/:comment_id", middleware.checkCommetOwnership , function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updated){
		if(err)
			{
				req.flash("error","Something went wrong!");
				res.redirect("back");
			}
		else{
			
			req.flash("success","Updated! successfully");
			res.redirect("/campgrounds/"+req.params.id);
		}
	});
});

// ================   Delete routes ================

router.delete("/campgrounds/:id/comments/:comment_id",middleware.checkCommetOwnership ,function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id,function(err,deleted){
		if(err)
		  {
			  req.flash("error","Oops! something went wrong!")
			  res.redirect("back");
		  }
		else
		{
			req.flash("success","Deleted! successfully");
			res.redirect("/campgrounds/"+req.params.id);
		}
	});
});



module.exports=router;

