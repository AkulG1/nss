var mongoose = require('mongoose');
var mongoosastic = require('mongoosastic');
var Schema = mongoose.Schema;

var RecentNewsSchema = new Schema({
  heading : String,
  content:String,
  priority: Number,
  link: String,
  date : String
});
//
// EventSchema.plugin(mongoosastic,{
//   hosts:[
//     'localhost:9200'
//   ]
// });

module.exports = mongoose.model('RecentNews',RecentNewsSchema);
