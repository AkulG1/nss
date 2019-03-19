var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventCategorySchema = new Schema({
 // name:{type:String},
  name:String,
  priority:Number
});

module.exports = mongoose.model('eventCategory',eventCategorySchema);
