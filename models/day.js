var mongoose = require('mongoose');
var PlaceSchema = require('./place').schema;

var DaySchema = new mongoose.Schema({
  number: Number,
  hotel: {type: mongoose.Schema.Types.ObjectId, ref: 'Hotel'},
  restaurants: [{type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant'}],
  activities: [{type: mongoose.Schema.Types.ObjectId, ref: 'Activity'}]
})

function toCommaString(amenities) {
  return amenities.join(', ');
}

function fromCommaString(amenities) {
  return amenities.split(', ');
}

module.exports = mongoose.model('Day', DaySchema);