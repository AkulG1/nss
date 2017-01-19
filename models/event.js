var mongoose = require('mongoose');
var mongoosastic = require('mongoosastic');
var Schema = mongoose.Schema;

var EventSchema = new Schema({
  eventCategory: {type:Schema.Types.ObjectId,ref:'eventCategory'},
  name:String,
  content:[{
    paragraph:{type:String, default:""},
  }],
  images:[{
    image:{type:String, default:""},
  }]
});
//
// EventSchema.plugin(mongoosastic,{
//   hosts:[
//     'localhost:9200'
//   ]
// });

module.exports = mongoose.model('Event',EventSchema);
