var express = require('express');
var router = express.Router();
var mongo=require('mongodb');
var db=require('monk')('localhost/nodeblog');
var multer=require('multer');

router.get('/show/:id',function(req,res,next){
	var posts=db.get("posts");

	posts.find({_id:req.params.id},{},function(err,post){
		
		res.render('show',{
			"post":post[0]
		});
	});

});


router.get('/add',function(req,res,next){

	var categories=db.get("categories");
	categories.find({},{},function(err,categories){
		res.render('addpost',{
			"title":"Add Posts..",
			"categories":categories
		});
	})

		
});


router.post('/add',function(req,res,next){

	var title=req.body.title;
	var category=req.body.category;
	var body=req.body.body;
	var author=req.body.author;
	var date=new Date();

	if(req.files){
		var mainImageOriginalName=req.files.mainimage.originalname;
		var mainImageName=req.files.mainimage.name;
		var mainImageMime=req.files.mainimage.mimetype;
		var mainImagePath=req.files.mainimage.path;
		var mainImageExt=req.files.mainimage.extension;
		var mainImageSize=req.files.mainimage.size;

	}else{
		var mainImageName="noimage.png";
	}

	req.checkBody('title','Title feild Is required').notEmpty();
	req.checkBody('body','Body Feild is required');

	var errors=req.validationErrors();

	if(errors){

		res.render('addpost',{
			"errors":errors,
			"title":title,
			"body":body

		});

	}else{
		var posts=db.get('posts');

		posts.insert({
			"title":title,
			"body":body,
			"category":category,
			"date":date,
			"author":author,
			"mainimage":mainImageName
		},function(err,post){
			if(err){
				res.send("There was Some Error");
			}else{
				req.flash("succes",'Post Succesfull');
				res.location('/');
				res.redirect('/');
			}

		});

	}


});

router.post('/addcomment',function(req,res,next){

	var name=req.body.name;
	var email=req.body.email;
	var body=req.body.body;
	var postid=req.body.postid;
	var commentdate=new Date();


	req.checkBody('name','name feild Is required').notEmpty();
	req.checkBody('email','email Feild is required').notEmpty();
	req.checkBody('email','Email is Invalid').isEmail();
	req.checkBody('body','Body Feild is required').notEmpty();
	
	var errors=req.validationErrors();

	if(errors){

		var posts=db.get('posts');
		posts.find({_id:postid},{},function(err,post){
			res.render('show',{
			"errors":errors,
			"post":post

		});

		});
		
	}else{

		var comment={"name":name,"email":email,"body":body,"commentdate":commentdate};

		var posts=db.get('posts');
		console.log(postid);
		posts.update(
			{
				"_id":postid
			},
			{
				$push:{
					"comments":comment
				}
			},

			function(err,doc){

				if(err)
					throw err;
				else{
					req.flash('succes',"Comment Posted");
					res.location('/posts/show/'+postid);
					res.redirect('/posts/show/'+postid);
				
				}
			}

			);

	}


});


module.exports=router;