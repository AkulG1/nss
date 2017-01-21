var router = require('express').Router();
var User = require('../models/user');
var Config = require('../config/secret');
var Events = require('../models/event');
var RecentNews = require('../models/recentNews');
var Gallery = require('../models/gallery');
//var Cart = require('../models/cart');
var stripe = require('stripe')('sk_test_JvxDXJ0cUTuzyqL2jonZ5xNK');
var async = require('async');

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
  RecentNews.find({}, function(err, recentNews) {
    if (err) return next(err);
    res.render('main/home', {
      recentNews : recentNews
    });
  });
  //res.render('main/home');
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
  Gallery.find({},function(err,gallery){
    if(err) return next(err);
    res.render('main/gallery',{ gallery : gallery });
  });
});

// router.get('/events',function(req,res){
//   res.render('main/events');
// });

router.get('/volunteer',function(req,res){
  res.render('main/volunteer');
});


// // '/:id' is used to specify that this id can vary in request . The function below is creating dynamic links
router.get('/events/:id', function(req, res, next) {
  Events
    .find({ eventCategory: req.params.id })
    .populate('eventCategory') // there may be error here
    .exec(function(err, events) {
      if (err) return next(err);
      res.render('main/events', {
        events : events
      });
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

    req.flash('errors', 'Message Sent Successfully. We will contact you shortly.')
    return res.redirect('/contact');
    // console.log(response.statusCode)
    // console.log(response.body)
    // console.log(response.headers)
  });

});



//
//
// router.get('/product/:id', function(req, res, next) {
//   Product.findById({ _id: req.params.id }, function(err, product) {
//     if (err) return next(err);
//     res.render('main/product', {
//       product: product
//     });
//   });
// });
//
// router.post('/payment', function(req, res, next) {
//
//   var stripeToken = req.body.stripeToken;
//   var currentCharges = Math.round(req.body.stripeMoney * 100);
//   stripe.customers.create({
//     source: stripeToken,
//   }).then(function(customer) {
//     return stripe.charges.create({
//       amount: currentCharges,
//       currency: 'usd',
//       customer: customer.id
//     });
//   }).then(function(charge) {
//     async.waterfall([
//       function(callback) {
//         Cart.findOne({ owner: req.user._id }, function(err, cart) {
//           callback(err, cart);
//         });
//       },
//       function(cart, callback) {
//         User.findOne({ _id: req.user._id }, function(err, user) {
//           if (user) {
//             for (var i = 0; i < cart.items.length; i++) {
//               user.history.push({
//                 item: cart.items[i].item,
//                 paid: cart.items[i].price
//               });
//             }
//
//             user.save(function(err, user) {
//               if (err) return next(err);
//               callback(err, user);
//             });
//           }
//         });
//       },
//       function(user) {
//         Cart.update({ owner: user._id }, { $set: { items: [], total: 0 }}, function(err, updated) {
//           if (updated) {
//             res.redirect('/profile');
//           }
//         });
//       }
//     ]);
//   });
//
//
// });


module.exports = router;
