var express = require('express');
var router = express.Router();
var User=require('../models/user');
var passport=require("passport");
var LocalStrategy=require("passport-local");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
  res.render('register',{"title":"Register"});
});


router.get('/login', function(req, res, next) {
  res.render('login',{"title":"Login"});
});

router.post('/register',function(req,res,next){
	var name=req.body.name;
	var email=req.body.email;
	var username=req.body.username;
	var password=req.body.password;
	var password2=req.body.password2;

	if(req.files){
		console.log("Uploading file..");

		var profilrImageOriginalName=req.files.image.originalname;
		var profileImageName=req.files.image.name;
		var profileimageMime=req.files.image.mimetype;
		var profileimagePath=req.files.image.path;
		var profileimageExt=req.files.image.extension;
		var profileimagesize=req.files.image.size;
	}else{

		var profileImageName='noImage.png';

	}

	req.checkBody('name','name field is required').notEmpty();
	req.checkBody('email','email field is required').notEmpty();
	req.checkBody('email','Emailis not invalid').isEmail();
	req.checkBody('username','Username is required').notEmpty();
	req.checkBody('password','Password is required').notEmpty();
	req.checkBody('password2','Password should Match').equals(req.body.password);

	var errors=req.validationErrors();

	if(errors){
		res.render('register',{
			errors:errors,
			name:name,
			email:email,
			username:username,
			password:password,
			password2:password2,

		});
	}
	else{
		var newUser=new User({
			name:name,
			email:email,
			username:username,
			password:password,
			profileimage: profileImageName	
		});

		User.createUser(newUser,function(err,user){
			if(err) throw err;
			console.log(user);
		});

		req.flash('succes','You are succesfully registered');
		res.location('/');
		res.redirect('/');
	}

});

passport.serializeUser(function(user,done){
	done(null,user.id);
});


passport.deserializeUser(function(id,done){
	User.getUserById(id,function(err,user){
		done(err,user);
	});
});

passport.use(new LocalStrategy(
		function(username,password,done){
			User.getUserByUsername(username,function(err,user){

				if(err) throw err;
				if(!user){
					console.log("Unknown User...");
					return done(null,false,{message:'Unknown User'});
				}

				User.comparePassword(password,user.password,function(err,isMatch){

					if(err)
						throw err;
					if(isMatch){
						return done(null,user);
					}
					else{
						console.log('Invalid Password');
						return done(null,false,{message:'Invalid Password'});
					}

				});

			});

		}
	));

router.post('/login',passport.authenticate('local',{failureRedirect:'/users/login',failureFlash:'Invalid Username or password'}),function(req,res){

	console.log('Authentication Succesfull..');
	req.flash('succes','You are logged in..');
	res.redirect('/');

});	

router.get('/logout',function(req,res){
	req.logout();
	req.flash('succes','You are logged out!');
	res.redirect('/users/login');
});

module.exports = router;
