'use strict';
/* global $ mapModule */

var daysModule = (function(){

  var exports = {},
      days = [],
      currentDay = days[0];

  function addDay () {
    var dayNum = days.length + 1;
    console.log("days in addDay", days);
    console.log("dayNum in addDay", dayNum);
    $.ajax({
        method: 'POST',
        url: '/api/days/'+dayNum,
        success: function (responseData) {
          renderDayButtons();
          getDays(function(){
            switchDay(dayNum);
          })
        },
        error: function (errorObj) {
          console.error(errorObj);
        }
    });
  }

  function switchDay (index) {
    var $title = $('#day-title');
    if (index >= days.length) index = days.length - 1;
    $title.children('span').remove();
    $title.prepend('<span>Day ' + (index+1) + '</span>');
    currentDay = days[index];
    console.log("Current day in switchDay" , currentDay);
    renderDay();
    renderDayButtons();
  }

  function removeCurrentDay () {
    if (days.length === 1) return;
    var index = days.indexOf(currentDay);
    days.splice(index, 1);
    switchDay(index);
  }

  function renderDayButtons () {
    var $daySelect = $('#day-select');
    $daySelect.empty();
    days.forEach(function(day, i){
      $daySelect.append(daySelectHTML(day, i, day === currentDay));
    });
    $daySelect.append('<button class="btn btn-circle day-btn new-day-btn">+</button>');
  }

  function daySelectHTML (day, i, isCurrentDay) {
    return '<button class="btn btn-circle day-btn' + (isCurrentDay ? ' current-day' : '') + '">' + (i + 1) + '</button>';
  }

  // exports.addAttraction = function(attraction) {
  //   // if (attraction.type === "hotel") 
  //   // console.log("currentDay[attraction.type]", currentDay[attraction.type])
  //   // if (currentDay[attraction.type].indexOf(attraction) !== -1) return;
  //   // currentDay[attraction.type].push(attraction);
  //   // console.log("days in add attraction", days);
  //   // console.log("Current Day",currentDay);
  //   renderDay(currentDay);
  // };

  // exports.removeAttraction = function (attraction) {
  //   // var index = currentDay[attraction.type].indexOf(attraction);
  //   // if (index === -1) return;
  //   // currentDay[attraction.type].splice(index, 1);
  //   renderDay(currentDay);
  // };

  exports.updateDay = function(dayNum, updatedDay){
    days[dayNum] = updatedDay;
    currentDay = updatedDay;
    renderDay(currentDay);
  }


  function renderDay(day) {
    mapModule.eraseMarkers();
    day = day || currentDay;
    $('#itinerary ul[data-type="hotels"]').empty();
    Object.keys(day).forEach(function(type){
      if (type !== '_id' && type !== 'number' && type !== '__v') {
        var $list = $('#itinerary ul[data-type="' + type + '"]');
        $list.empty();
        if (type === 'hotel') {
          var $list = $('#itinerary ul[data-type="' + type + 's"]');
          $list.empty();          
          day[type].type = type + "s";

          $list.append(itineraryHTML(day[type]));

          mapModule.drawAttraction(day[type]);
        } 
        else {
          day[type].forEach(function(attraction){
            attraction.type = type;
            $list.append(itineraryHTML(attraction));
            mapModule.drawAttraction(attraction);
          });
        }
      } 
    });
  }

  function itineraryHTML (attraction) {
    console.log(attraction.type);
    return '<div class="itinerary-item><span class="title>' + attraction.name + '</span><button data-id="' + attraction._id + '" data-type="' + attraction.type + '" class="btn btn-xs btn-danger remove btn-circle">x</button></div>';
  }

  $(document).ready(function(){
    getDays(function(){
      switchDay(0);
    });
    $('.day-buttons').on('click', '.new-day-btn', addDay);
    $('.day-buttons').on('click', 'button:not(.new-day-btn)', function() {
      switchDay($(this).index());
    });
    $('#day-title').on('click', '.remove', removeCurrentDay);
  });

  return exports;

  function getDays(cb) {
    $.ajax({
        method: 'GET',
        url: '/api/days',
        success: function (responseData) {
          if (responseData.length === 0){
            addDay();
          }
          else {
            days = responseData;
            currentDay = responseData[0];
            if (cb) cb();
          }
           // cb();
        },
        error: function (errorObj) {
            console.error(errorObj);
        }
    });
  }

}());
