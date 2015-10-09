var express = require('express');
var router = express.Router();
var models = require('../../models');
var Hotel = models.Hotel;
var Restaurant = models.Restaurant;
var Activity = models.Activity;
var Day = models.Day;
var Promise = require('bluebird');

// Get for all days
router.get('/', function(req, res) {
  Day.find().populate('hotel restaurants activities').exec().then(function(dayData){
    res.send(dayData);
  },
  function (err){
    res.status(500).end(err);
  })
})

// get info for one day
router.get('/:dayNum', function(req, res) {
  Day.findOne({number:req.params.dayNum}).exec().then(function(dayData){
    res.send(dayData);
  },
  function (err){
    res.status(500).end(err);
  })
})

// add a day
router.post('/:dayNum', function(req,res){
  var newDay = new Day({number: req.params.dayNum});
  newDay.save().then(function(){
    res.end();
  });
})

// get delete given day
router.delete('/:dayNum', function(req,res){
  Day.remove({number: req.params.dayNum}).then(function(){
    res.end();
  });
})


// add info for given attraction and id;
router.put('/:dayNum/:type/:id', function(req,res){
  Day.findOne({number: req.params.dayNum})
  .then(function(day) {
    var type = req.params.type;
    if (type === "hotels"){
      day.hotel = req.params.id;
    }
    else {
      var plansOfThisType = day[req.params.type];
      plansOfThisType.push(req.params.id);
    }
    day.save().then(function() {
      Day.findOne({number: req.params.dayNum}).populate('hotel restaurants activities').exec()
      .then(function(populatedDay) {
        res.json(populatedDay);
      })
    });
  })
})

// delete info for a given attraction type and id 
router.delete('/:dayNum/:type/:id', function(req,res){

  Day.findOne({number: req.params.dayNum})
  .then(function(day) {
    var plansOfThisType = day[req.params.type];    
    if (req.params.type == "hotels") {
      // console.log("")
      // console.log("I am deleting this fucking hotel", day.hotel);
      delete day.hotel;
      // console.log("I hope I deleted this fucking hotel", day.hotel);

    }
    else {
      var indexOfPlan = plansOfThisType.indexOf(req.params.id);
      var afterSplice = plansOfThisType.splice(indexOfPlan,1)
    }

    day.save().then(function() {
      Day.findOne({number: req.params.dayNum}).populate('hotel restaurants activities').exec()
      .then(function(populatedDay) {
        res.json(populatedDay);
      })
    });
  })
  
})




module.exports = router;
