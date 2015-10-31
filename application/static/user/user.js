var user = angular.module('beautystash.user', [
  'ui.bootstrap',
  'ui.bootstrap.tabs',
  'angularModalService',
  'ngMessages'
]);

user.controller('UserController', function($scope, $window, $stateParams, User, Products, Follow) {
  $scope.userId = $stateParams.userId
  $scope.user;
  $scope.userProducts;
  $scope.userFollowing;
  $scope.userFollowers;
  $scope.membershipYear;
  $scope.location;

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
        $scope.userProducts = data.userProducts;
        $scope.membershipYear = $scope.user.created_at.substring(0, 4);
        console.log($scope.user)
        if (data.user.location === '') {
          $scope.location = 'Elsewhere'
        }
      })
      .catch(function(error) {
        console.error(error)
      })
  }

  getUserFollowingFollowers = function(userId) {
    Follow.getUserFollowersFollowing(userId)
      .then(function(data) {
        $scope.userFollowing = data.following;
        $scope.userFollowers = data.followers;
      })
      .catch(function(error) {
        console.error(error)
      })
  }

  getUserData($scope.userId)
  getUserFollowingFollowers($scope.userId)

  $scope.follow = function(user) {
    Follow.follow(user)
      .then(function(user) {
        console.log('success')
      })
      .catch(function(error) {
        console.error('Error with following user:', error);
      });
  };

  $scope.unfollow = function(user) {
    Follow.unfollow(user)
      .then(function(resp) {
        $scope.following.filter(function(userObject) {
          return userObject.userid !== resp.data.user_id;
        });
      })
      .catch(function(error) {
        console.error('Error with unfollowing user:', error);
      });
  };
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

user.filter('stashFilter', function() {
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
