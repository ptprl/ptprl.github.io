angular.module('GoogleCalendar', []).directive('googleCalendar', function(){
  return {
    restrict: 'E',
    scope: {
      gcConfig: '=',
      hash: '=?'
    },
    templateUrl: 'google-calendar.html',
    controller: function($filter, $http, $scope) {

      if (!$scope.gcConfig.google_key) {
        throw('Missing required config google_key');
      };

      if (!$scope.gcConfig.calendar_id) {
        throw('Missing required config calendar_id');
      };

      var defaults = {
        max: 3,
        hideTitle: false,
        dateTimeFilter: 'd. MMM HH.mm',
        dateFilter: 'd. MMM',
        htmlDesc: true,
        calendar_name: false
      };

      $scope.gcConfig = angular.extend(defaults, $scope.gcConfig);

      fulldayFilter = function(date) {
        return $filter('date')(date, $scope.gcConfig.dateFilter)
      };

      timedFilter = function(date) {
        return $filter('date')(date, $scope.gcConfig.dateTimeFilter);
      };

      start_time = function(event){
        if (event.start.date) {
          return fulldayFilter(event.start.date);
        } else if (event.start.dateTime) {
          return timedFilter(event.start.dateTime);
        };
      };

      end_time = function(event){
        if (event.end.date) {
          var d = new Date(event.end.date)
          return fulldayFilter(d);
        } else if (event.end.dateTime) {
          return timedFilter(event.end.dateTime);
        };
      };

      var today = new Date();
      today.setHours(0,0,0,0);
      var url = "https://www.googleapis.com/calendar/v3/calendars/" + $scope.gcConfig.calendar_id + "/events?orderBy=startTime&singleEvents=true&timeMin=" + (today.toISOString()) + "&maxResults=" + $scope.gcConfig.max + "&key=" + $scope.gcConfig.google_key;

      $http.get(url).success(function(data){
        $scope.calendar = data;

        $scope.calendar.html = "https://www.google.com/calendar/embed?src=" + $scope.gcConfig.calendar_id
        $scope.calendar.ical = "webcal://www.google.com/calendar/ical/" + $scope.gcConfig.calendar_id + "/public/basic.ics"

        if (!$scope.gcConfig.hideTitle && !$scope.gcConfig.calendar_name)
          angular.extend($scope.gcConfig, { calendar_name: data.summary })

        angular.forEach($scope.calendar.items, function(item) {
          item.startTime = start_time(item);
          item.endTime =  end_time(item);
          if (item.start.date) {
            item.startDate = new Date(item.start.date);
          } else {
            item.startDate = new Date(item.start.dateTime);
          };
        });
        $scope.$parent.all_calendars.push($scope.calendar.items);
      });
    }

  };
});
