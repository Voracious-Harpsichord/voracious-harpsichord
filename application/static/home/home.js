var home = angular.module('beautystash.home', ['infinite-scroll'])

home.controller('HomeController', function($scope, Feed){
  $scope.items = [];
  $scope.counter = 0;

  $scope.loadMore = function() {
    Feed.loadEvents()
      .then(function(feed) {
        $scope.items.concat(feed)
      })
  }
  $scope.loadMore();
}); 
