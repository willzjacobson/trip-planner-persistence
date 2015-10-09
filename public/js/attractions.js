'use strict';
/* global $ daysModule all_hotels all_restaurants all_activities */

$(document).ready(function() {

  var attractionsByType = {
    hotels:      all_hotels,
    restaurants: all_restaurants,
    activities:  all_activities
  };

  function findByTypeAndId (type, id) {
    var attractions = attractionsByType[type],
        selected;
    attractions.some(function(attraction){
      if (attraction._id === id) {
        selected = attraction;
        selected.type = type;
        return true;
      }
    });
    return selected;
  }

  // adding an attraction
  $('#attraction-select').on('click', 'button', function() {
    var $button = $(this),
        type = $button.data('type'),
        attractions = attractionsByType[type],
        id = $button.siblings('select').val();
        var currentDayNum = +$(".current-day").text()
        $.ajax({
            method: 'PUT',
            url: '/api/days/' + currentDayNum + '/' + type + '/' + id,
            success: function (updatedDay) {
              daysModule.updateDay(currentDayNum-1,updatedDay);
              // if (type === "hotels"){
              //   updatedDay.hotel.type = "hotel";
              //   daysModule.addAttraction(updatedDay.hotel);
              // }
              // else {
              //   updatedDay[type].forEach(function(attraction){
              //     if (attraction._id === id){
              //       attraction.type = type;
              //       daysModule.addAttraction(attraction);
              //     }
              //   })
              // }
            },
            error: function (errorObj) {
              console.error(errorObj);
            }
        });
  });

  $('#itinerary').on('click', 'button', function() {
    var $button = $(this),
        type = $button.data('type'),
        id = $button.data('id');

        var currentDayNum = +$(".current-day").text()

        $.ajax({
            method: 'DELETE',
            url: '/api/days/' + currentDayNum + '/' + type + '/' + id,
            success: function (updatedDay) {
              daysModule.updateDay(currentDayNum-1,updatedDay);
              // if (type === "hotels"){
              //   updatedDay.hotel.type = "hotel";
              //   daysModule.addAttraction(updatedDay.hotel);
              // }
              // else {
              //   updatedDay[type].forEach(function(attraction){
              //     if (attraction._id === id){
              //       attraction.type = type;
              //       daysModule.addAttraction(attraction);
              //     }
              //   })
              // }
            },
            error: function (errorObj) {
              console.error(errorObj);
            }
        });        
    // daysModule.removeAttraction(findByTypeAndId(type, id));
  });

});
