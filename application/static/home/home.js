var home = angular.module('beautystash.home', ['infinite-scroll'])

home.controller('HomeController', function($scope){
    $scope.items = [];
    $scope.counter = 0;

    $scope.loadMore = function () {
        for (var i = 0; i < 15; i++) {
            $scope.items.push(++$scope.counter);
        };
    }
    $scope.loadMore();
}); 
