var express    = require("express"),
	app        = express(), 
	bodyParser = require("body-parser"), 
	mongoose   = require("mongoose"),
	flash	   = require("connect-flash"),
	passport   = require("passport"),
	LocalStrategy = require("passport-local"),
	methodOverride= require("method-override"),
    Campground = require("./models/campground"), //schema
	Comment    = require("./models/comments"),
	User       = require("./models/user"),
	seedDB     = require("./seeds");


var campgroundRoutes = require("./routes/campgrounds"),
	commentRoutes	 = require("./routes/comments"),
	indexRoutes		 = require("./routes/index");

//  seedDB();  seeding the database
//mongoose.connect("mongodb://localhost:27017/yelp_calm",{ useNewUrlParser: true});
mongoose.connect("mongodb+srv://Piyush:piyush@firstcluster.bylyy.mongodb.net/Yelp_calm?retryWrites=true&w=majority",{ useNewUrlParser: true});


app.use(bodyParser.urlencoded({extended:true}));


app.set("view engine","ejs");

app.use(express.static(__dirname + "/public"));

//passport configuration

app.use(require("express-session")({
	secret:"once again rusty wins",
	resave:false,
	saveUninitialized:false
}));

app.use(flash());
app.use(methodOverride("_method"));
								   
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error	   = req.flash("error");
	res.locals.success	   = req.flash("success");
	next();
});





//schema setup


// Campground.create({
// 	name:"Mclord gunj",
// 	image:"https://images.pexels.com/photos/1061640/pexels-photo-1061640.jpeg?auto=compress&cs=tinysrgb&h=350",
// 	description:"Very nice to be , but there is very cold!!"
// },function(err,camp){
// 	if(err)
// 		{
// 			console.log("oops! Error occured");
// 		}
// 	else{
// 		console.log("Save succeed!");
// 		console.log(camp);
// 	}
// });

// var campgrounds = [
// 		{name:"Mclord gunj", image:"https://images.pexels.com/photos/1061640/pexels-photo-1061640.jpeg?auto=compress&cs=tinysrgb&h=350"},                  
// 		{name:"kasaul", image:"https://images.pexels.com/photos/6757/feet-morning-adventure-camping.jpg?auto=compress&cs=tinysrgb&h=350"},
// 		{name:"Kanchenjunga",image:"https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg?auto=compress&cs=tinysrgb&h=350"},
// 	    		{name:"Mclord gunj", image:"https://images.pexels.com/photos/1061640/pexels-photo-1061640.jpeg?auto=compress&cs=tinysrgb&h=350"},                  
// 		{name:"kasaul", image:"https://images.pexels.com/photos/6757/feet-morning-adventure-camping.jpg?auto=compress&cs=tinysrgb&h=350"},
// 		{name:"Kanchenjunga",image:"https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg?auto=compress&cs=tinysrgb&h=350"}
// 	];


app.use(campgroundRoutes);
app.use(commentRoutes);
app.use(indexRoutes);

app.listen(process.env.PORT||3000 , process.env.IP , function(){
	console.log("Yelpcalm started!");
});



