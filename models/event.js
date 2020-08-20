var mongoose = require('mongoose');
var mongoosastic = require('mongoosastic');
var Schema = mongoose.Schema;

var EventSchema = new Schema({
  //eventCategory: {type:Schema.Types.ObjectId,ref:'eventCategory'},
  // content:[{
  //   paragraph:{type:String, default:""},
  // }],
  eventCategory: String,
  department: String,
  name:String,
  paragraph:String,
  impact: String,
  image1:{ contentType: String, data: Buffer},
  image2:{ contentType: String, data: Buffer},
  priority:Number
});
//
// EventSchema.plugin(mongoosastic,{
//   hosts:[
//     'localhost:9200'
//   ]
// });

module.exports = mongoose.model('Event',EventSchema);
