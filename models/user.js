var mongoose = require('mongoose');  // it connects nodejs and mongodb
var bcrypt = require('bcrypt-nodejs'); // it is library that hashes passwords etc
var crypto = require('crypto'); // no need to install this library it is built-in nodejs
var Schema = mongoose.Schema;
// The user schema attributes / characteristics / fields
var UserSchema = new Schema({
  email:{type:String ,unique:true,lowercase:true},
  password: String,
  name:String,
  picture:{type:String,default:''},
  rollno:{type:String ,default:''},
  year:{type:Number,default:0},
  scholar:{type:String,default:''},
  eventsRecord:[{
    eventName:{type:String, default:""},
    eventHours: { type: Number, default:0},
    eventDate : {type:String, default:""}
  }],
  totalHours:{type:Number,default:0}
});

//Hash the password before we even save it to the database
//pre is mongoose method which is available for all schemas. It contains actions for what is to be done prior to storing it in db
UserSchema.pre('save',function(next){
    var user = this;
    if(!user.isModified('password')) return next();
    //10 is the no of rounds of salt
    //salt is the output of genSalt
    //genSalt is methos of bcrypt library to generate salt
    bcrypt.genSalt(10,function(err,salt){
      if(err) return next(err);
      //call method to generate hash
      bcrypt.hash(user.password,salt,null,function(err,hash){
        if(err) return next(err);
        user.password = hash;
        next();
      });
    });
});

//compare password in the database and the one entered  by user
// comparePassword is a user defined method on schema . To declare it use 'methods' first
UserSchema.methods.comparePassword = function(password){
  //here function parameter 'password' is the passowrd that user types in
  return bcrypt.compareSync(password,this.password);
}

UserSchema.methods.gravatar = function(size){
  if(!this.size) size=200;
  if(!this.email) return 'https://gravatar.com/avatar/?s='+size+'&d=retro';
  var md5 = crypto.createHash('md5').update(this.email).digest('hex');
  return 'https://gravatar.com/avatar/'+md5+'?s='+size+'&d=retro';
}

//this is done so that other files like server.js etc can use this schema
module.exports = mongoose.model('User',UserSchema); // first parameter is user second is schema name
