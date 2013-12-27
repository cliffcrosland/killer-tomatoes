$(function () {
  $("#departureDateTime").datetimepicker({
    timeFormat: 'h:mm tt',
    controlType: 'select'
  });

  $("#departureAirport").autocomplete({
    source: '/airports',
    minLength: 2
  });
});

