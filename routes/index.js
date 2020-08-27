var express    = require("express"),
	router     = express.Router(),
	User 	   = require("../models/user"),
	passport   = require("passport");

router.get("/",function(req,res) {
	
	res.render("landing");
	
});


//===========
//Auth routes
//===========

router.get("/register",function(req,res){
	res.render("register");
});
//handle sign uup
router.post("/register",function(req,res){
	User.register(new User({username:req.body.username}),req.body.password,function(err,user){
		if(err)
			{  
		
				
				req.flash("error",err.message);
			 	res.redirect("/register");
			}
		else
			{
				passport.authenticate("local")(req,res,function(){
				req.flash("success","Welcome! to Yelpcalm "+  user.username);
				res.redirect("/campgrounds");
							
				});
			}

		
	});
});

//login page

router.get("/login",function(req,res){
	
	res.render("login");
});

//for handling log in rquest

router.post("/login",passport.authenticate("local",{  //passport.authenticate is middleware
	
	successRedirect:"/campgrounds",
	failureRedirect:"/login"
}),function(req,res){
	
});

// logout route

router.get("/logout",function(req,res){
	req.logout();
	req.flash("success","successfull! logged you out!");
	res.redirect("/campgrounds");
});


function isLoggedIn(req,res,next){
	if(req.isAuthenticated())
	{
		return next();
	}
	res.redirect("/login");
};

module.exports = router; 
