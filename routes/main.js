var router = require('express').Router();
var User = require('../models/user');
var Config = require('../config/secret');
var Events = require('../models/event');
let EventCategory = require('../models/eventCategory');
var RecentNews = require('../models/recentNews');
var Gallery = require('../models/gallery');
var stripe = require('stripe')('sk_test_JvxDXJ0cUTuzyqL2jonZ5xNK');
var async = require('async');
var passport = require('passport');
var passportConfig = require('../config/passport');


// function paginate(req,res,next){
//   var perPage = 9;
//   var page = req.params.page;
//
//   Product
//   .find()
//   .skip(perPage * page)
//   .limit(perPage)
//   .populate('category')
//   .exec(function(err,products){
//     if(err) return next(err);
//     Product.count().exec(function(err,count){
//       if(err) return next(err);
//       res.render('main/product-main',{
//         products:products,
//         pages:count / perPage
//       });
//     });
//   });
// }
//
// Product.createMapping(function(err, mapping) {
//   if (err) {
//     console.log("error creating mapping");
//     console.log(err);
//   } else {
//     console.log("Mapping created");
//     console.log(mapping);
//   }
// });
//
// var stream = Product.synchronize();
// var count = 0;
//
// stream.on('data', function() {
//   count++;
// });
//
// stream.on('close', function() {
//   console.log("Indexed " + count + " documents");
// });
//
// stream.on('error', function(err) {
//   console.log(err);
// });
//
// router.get('/cart', function(req, res, next) {
//   Cart
//     .findOne({ owner: req.user._id })
//     .populate('items.item')
//     .exec(function(err, foundCart) {
//       if (err) return next(err);
//       res.render('main/cart', {
//         foundCart: foundCart,
//         message:req.flash('remove')
//       });
//     });
// });
//


router.get('/event/:id', function(req, res, next) {
  Events.findById({ _id: req.params.id }, function(err, foundEvent) {
    if (err) return next(err);
    res.render('main/event', {
       foundEvent : foundEvent
      //console.log(foundEvent + " babluuuuuu");
    });
  });
});


// router.get('/event',function(req,res){
//   res.render('main/event');
// });
//
// router.post('/remove', function(req, res, next) {
//   Cart.findOne({ owner: req.user._id }, function(err, foundCart) {
//     foundCart.items.pull(String(req.body.item));
//
//     foundCart.total = (foundCart.total - parseFloat(req.body.price)).toFixed(2);
//     foundCart.save(function(err, found) {
//       if (err) return next(err);
//       req.flash('remove', 'Successfully removed');
//       res.redirect('/cart');
//     });
//   });
// });
//
// router.post('/search',function(req,res,next){
//   res.redirect('/search?q='+req.body.q);
// });
//
// router.get('/search',function(req,res,next){
//   if(req.query.q){
//     Product.search({
//       query_string : {query:req.query.q}
//     },function(err,results){
//       if(err) return next(err);
//       var data = results.hits.hits.map(function(hit){
//         return hit;
//       });
//       res.render('main/search-result',{
//         query:req.query.q,
//         data:data
//       });
//     });
//   }
// });

router.get('/',function(req,res,next){
  // if(req.user){
  //   paginate(req,res,next);
  // }else{
  //   res.render('main/home');
  // }

  RecentNews
  .find({})
  .sort({ priority: -1 })
  .exec(function(err, recentNews) {
    if (err) return next(err);
    res.render('main/home', {
      recentNews : recentNews
    });
  });
  //res.render('main/home');
});

router.get('/event', passportConfig.isAuthenticated,function(req,res,next){
  res.render('postContent/event', {
    errors: req.flash('errors')
  });
});

// router.get('/page/:page',function(req,res,next){
//   paginate(req,res,next);
// });

router.get('/about',function(req,res){
  res.render('main/about');
});

router.get('/contact',function(req,res){
  res.render('main/contact',{
    errors: req.flash('errors')
  });
});

router.get('/gallery',function(req,res){
  var path = require('path')
var fs = require('fs')


  Events
  .find({}, function(err, events){
    if(err){
      console.log(err);  
    } else {
       res.render("main/gallery", {events:events});
      }

});
});


router.get('/volunteer',function(req,res){
  res.render('main/volunteer');
});


router.get('/members',function(req,res){
  res.render('main/members');
});





router.post("/event", function(req, res){
       var eventCategory        = req.body.eventCategory;
       var name                 = req.body.name;
       var priority             = req.body.priority;
       let para                 = req.body.para;
       let impact               = req.body.impact;
       let image1               = req.body.image1;
       let image2               = req.body.image2;
       
       var newEvent    = {
                         eventCategory    : eventCategory,  
                         name             : name,
                         priority         : priority,
                         paragraph        : para,
                         impact           : impact,
                         image1           : image1,
                         image2           : image2
                  }      
   Events.create(newEvent, function(err, newlyCreated){            
            if(err){
              console.log(err);
            } else {
              console.log("success");
              res.redirect('/');
            }
    });    
  });


router.post("/eventsCategory", function(req, res){
       var name        = req.body.name;
       var priority    = req.body.priority;
       var newEvent    = {
                         
                         name        : name,
                         priority    : priority,
                                           }      
   EventCategory.create(newEvent, function(err, newlyCreated){            
            if(err){
              console.log(err+ "pintu");
            } else {
              console.log("babluu");
            }
    });    
  });





router.get('/events/recent', function(req, res, next) {
  Events
  .find({}, function(err, events){
    if(err){
      console.log(err);  
    } else {
       res.render("main/recent", {events:events});
      }

});
});



router.get('/events/upcoming', function(req, res, next) {
  Events
  .find({}, function(err, events){
    if(err){
      console.log(err);  
    } else {
       res.render("main/upcoming", {events:events});
      }

});
});



router.get('/events/regular', function(req, res, next) {
  Events
  .find({}, function(err, events){
    if(err){
      console.log(err);  
    } else {
       res.render("main/regular", {events:events});
      }

});
});



router.get('/events/camp', function(req, res, next) {
  Events
  .find({}, function(err, events){
    if(err){
      console.log(err);  
    } else {
       res.render("main/camp", {events:events});
      }

});
});



router.get('/events/past', function(req, res, next) {
  Events
  .find({}, function(err, events){
    if(err){
      console.log(err);  
    } else {
       res.render("main/past", {events:events});
      }

});
});



router.post('/contact', function(req, res, next) {
  if(req.body.name == '' || req.body.name == 'undefined')
  {
    req.flash('errors', 'Name is required for sending message');
    return res.redirect('/contact');
  }

  if(req.body.email == '' || req.body.email == 'undefined')
  {
    req.flash('errors', 'Email is required for sending message');
    return res.redirect('/contact');
  }

  if(req.body.message == '' || req.body.message == 'undefined')
  {
    req.flash('errors', 'Please enter a message');
    return res.redirect('/contact');
  }

  var helper = require('sendgrid').mail;

  var str = "Name : " + req.body.name;
  str+="<br>Email : " + req.body.email;
  str+="<br>Contact No : "+ req.body.mobile;
  str+="<br>Message : " + req.body.message;

  from_email = new helper.Email(req.body.email);
  to_email = new helper.Email("nssdtu.web@gmail.com");
  subject = "Message from Contact Page";
  content = new helper.Content("text/html", str);
  mail = new helper.Mail(from_email, subject, to_email, content);

  var sg = require('sendgrid')(Config.SENDGRID_API_KEY);
  var request = sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: mail.toJSON()
  });

  sg.API(request, function(error, response) {
    if(error) {
      req.flash('errors', 'Message cannot be sent. Try again later');
      return res.redirect('/contact');
    }

    req.flash('errors', 'Message Sent Successfully. We will contact you shortly.');
    return res.redirect('/contact');

  });
});

module.exports = router;