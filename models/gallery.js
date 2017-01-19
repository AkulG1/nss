var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GallerySchema = new Schema({
  name:{type:String,default:''},
  content:{type:String,default:''},
  image:{type:String,default:''}
});

module.exports = mongoose.model('Gallery',GallerySchema);
