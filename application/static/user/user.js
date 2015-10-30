var user = angular.module('beautystash.user', [
  'ui.bootstrap',
  'ui.bootstrap.tabs',
  'angularModalService',
  'ngMessages'
]);

user.controller('UserController', function($scope, $window, $stateParams, User, Products) {
  $scope.userId = $stateParams.userId
  $scope.user;
  $scope.products;

  $scope.tabs = [
    {name: 'Stash', path: 'stash'},
    {name: 'Explore Products', path: 'explore'},
    {name: 'Friends', path: 'friends'},
    {name: 'Wishlist', path: 'wishlist'},
    {name: 'Recommendations', path: 'recs'},
    {name: 'Blogs', path: 'blogs'}
  ];

  getUserData = function(userId) {
    User.getInfo($scope.userId)
      .then(function(data) {
        $scope.user = data.user;
        $scope.products = data.userProducts;
      })
  }

  getUserData($scope.userId)

})

user.filter('wishlistFilter', function() {
  return function(input) {
    var output = [];
    angular.forEach(input, function(product) {
      if (product.product_status === 'Wishlist') {
        output.push(product);
      }
    });
    return output;
  };
});

user.filter('finishedFilter', function() {
  return function(input) {
    var output = [];
    angular.forEach(input, function(product) {
      if (product.product_status === 'Finished') {
        output.push(product);
      }
    });
    return output;
  };
});

user.filter('myStashFilter', function() {
  return function(input) {
    var output = [];
    angular.forEach(input, function(product) {
      if (product.product_status === 'Own' || product.product_status === null) {
        output.push(product);
      }
    });
    return output;
  };
});
