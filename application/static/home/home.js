var home = angular.module('beautystash.home', ['infinite-scroll'])

home.controller('HomeController', function($scope, Feed){
    $scope.items = [];
    $scope.counter = 0;

    // $scope.initialFeedLoad = function() {
    //     Feed.loadEvents()
    //         .then(function() {
                
    //         })
    // }

    $scope.loadMore = function() {
        for (var i = 0; i < 15; i++) {
            $scope.items.push(++$scope.counter);
        };
    }
    $scope.loadMore();
}); 
