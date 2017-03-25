angular.module('ptp', ['ngSanitize','GoogleCalendar']);

angular.module('ptp').config([
  '$compileProvider',
  function( $compileProvider ) {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|webcal):/);
  }
]);

angular.module('ptp').controller('googleCtrl', function($scope, $filter){
  rl_google_key = 'AIzaSyB0ZQbtnxFW7P_xLWACEAHYd5DKHSSncQ4'

  $scope.all_calendars = [];

  $scope.ptp = {
    google_key: rl_google_key,
    calendar_id: 'k408le6f3id7pibsbd1tb1qkls@group.calendar.google.com'
  };
 
  $scope.rlcs = {
    google_key: rl_google_key,
    calendar_id: 'ldd0c499r50jljq19kjerkc628@group.calendar.google.com'
  };

  $scope.calendars = function() {
    var merged = [].concat.apply([], $scope.all_calendars);
    //$filter('orderBy')(merged, 'start.startTime');
    return merged;
  };

});
