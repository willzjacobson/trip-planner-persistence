'use strict';
/* global $ mapModule */

var daysModule = (function(){

  var exports = {},
      days = [],
      currentDay = days[0];

  function addDay () {
    var dayNum = days.length + 1;
    $.ajax({
        method: 'POST',
        url: '/days/api/'+dayNum,
        success: function (responseData) {
          console.log("Day ", dayNum, " was added");
          switchDay(dayNum);
          renderDayButtons();
          getDays()
        },
        error: function (errorObj) {
          console.log(errorObj);
          // return errorObj
        }
    });

    // days.push({
    //   hotels: [],
    //   restaurants: [],
    //   activities: []
    // });

  }

  function switchDay (index) {
    var $title = $('#day-title');
    console.log("days in switchDay is ", days);
    if (index >= days.length) index = days.length - 1;
    $title.children('span').remove();
    $title.prepend('<span>Day ' + (index + 1) + '</span>');
    currentDay = days[index];
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

  exports.addAttraction = function(attraction) {
    if (currentDay[attraction.type].indexOf(attraction) !== -1) return;
    currentDay[attraction.type].push(attraction);
    renderDay(currentDay);
  };

  exports.removeAttraction = function (attraction) {
    var index = currentDay[attraction.type].indexOf(attraction);
    if (index === -1) return;
    currentDay[attraction.type].splice(index, 1);
    renderDay(currentDay);
  };

  function renderDay(day) {
    mapModule.eraseMarkers();
    day = day || currentDay;
    Object.keys(day).forEach(function(type){
      var $list = $('#itinerary ul[data-type="' + type + '"]');
      $list.empty();
      day[type].forEach(function(attraction){
        $list.append(itineraryHTML(attraction));
        mapModule.drawAttraction(attraction);
      });
    });
  }

  function itineraryHTML (attraction) {
    return '<div class="itinerary-item><span class="title>' + attraction.name + '</span><button data-id="' + attraction._id + '" data-type="' + attraction.type + '" class="btn btn-xs btn-danger remove btn-circle">x</button></div>';
  }

  $(document).ready(function(){
    getDays(function(){
      switchDay(0);
    });
    // switchDay(0);
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
            days = responseData
            currentDay = responseData[0];
            cb();
          }
          console.log("response date: ", responseData);
          console.log("typeof response date: ", typeof responseData);
           // cb();
        },
        error: function (errorObj) {
            new Error(errorObj);
        }
    });
  }

}());
