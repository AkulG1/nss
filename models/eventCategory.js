var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventCategorySchema = new Schema({
  name:{type:String,unique:true},
  priority:Number
});

module.exports = mongoose.model('eventCategory',eventCategorySchema);
