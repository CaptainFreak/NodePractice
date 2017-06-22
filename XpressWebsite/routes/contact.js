var express = require('express');
var router = express.Router();
var nodemailer=require('nodemailer');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('contact', { title: 'Contact' });
});

router.post('/send',function(req,res,next){
	var transporter = nodemailer.createTransport({ 
    host: 'smtpout.secureserver.net', 
    port: 465, 
    auth: { user: 'mail', pass: 'pass' },
    secure: true
});

	var mailOptions={
		from:'FROM',
		to:'TO',
		subject:'Web Test',
		text:'submission NAme:'+req.body.Name+'email'+req.body.Email+'measssage:'+req.body.message,
		html:'<p><ul><li>'+req.body.name+'</li></ul></p>'
	
	}
	transporter.sendMail(mailOptions,function(err,info){

		if(err){
			console.log(err);
			res.redirect('/');
		}
		else{
			console.log(info.response);
			res.redirect('/');
		}
	});
});
module.exports = router;
