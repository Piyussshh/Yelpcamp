var express = require("express"),
	router	= express.Router(),
	Campground=require("../models/campground"),
	middleware=require("../middleware");

	
// Campground routes
	
router.get("/campgrounds",function(req,res){
	
	
	//res.render("campgrounds", { campgrounds:campgrounds});
	//get all campgrounds from mongodb;
	Campground.find({},function(err,allcamp){
		
		if(err)
			{
				console.log("Oops error occured!");
			}
		else{
			res.render("campgrounds/index",{campgrounds:allcamp});
		}
		
	});
});


//Create  add a new form to database


router.post("/campgrounds",middleware.isLoggedIn,function(req,res){
	//get data from form an add here
	//redirect
	
	var name = req.body.name;
	var price= req.body.price;
	var image= req.body.image;
	var description=req.body.description;
	var author={
		id:req.user._id,
		username:req.user.username
	}
	var newCampgrounds={name:name ,price:price, image:image , description:description,author:author};
	

	
	// campgrounds.push(newCampgrounds);
	//Create a new campgrounds and save it to database
	
	Campground.create(newCampgrounds,function(err,newlyCreated){
		if(err)
			{
				console.log("Oops An error occured");
			}
		else{
			
			res.redirect("/campgrounds"); 
		}
	});
});
	
	
	//EDIT ROUTE FILE
	
	router.get("/campgrounds/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
		
		Campground.findById(req.params.id, function(err,foundCampground)
		{ 
		  if(err)
			  {
				  res.redirect("/campgrounds");
			  }
		  else
			  {
				  res.render("campgrounds/edit",{campgrounds:foundCampground});
			  }
			
			 
		});
		
	});

    router.put("/campgrounds/:id",middleware.checkCampgroundOwnership,function(req,res){
		Campground.findByIdAndUpdate(req.params.id,req.body.campgrounds,function(err,updatedCampground){
			if(err)
				{
					res.redirect("/campgrounds");
				}
			else{
					res.redirect("/campgrounds/" + req.params.id);
				}
		});
	});
	
	//DELETE ROUTE FILE
	
	router.delete("/campgrounds/:id",middleware.checkCampgroundOwnership,function(req,res){
		Campground.findByIdAndRemove(req.params.id,function(err,removed){
			if(err)
				{
					res.redirect("/campgrounds");
				}
			else
				{
					res.redirect("/campgrounds")
				}
		});
	});
	


router.get("/campgrounds/new", middleware.isLoggedIn, function(req,res)
	   {
	res.render("campgrounds/new");
});

router.get("/campgrounds/:id",function(req,res){
	
	Campground.findById(req.params.id).populate("comments").exec( function(err,foundCampground){
		
		if(err)
			{
				console.log(err);
			}
		else
			{
				res.render("campgrounds/show",{campground: foundCampground});
			}
	});
});


module.exports=router;