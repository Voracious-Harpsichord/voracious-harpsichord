var user = angular.module('beautystash.user', [
  'ui.bootstrap',
  'ui.bootstrap.tabs',
  'angularModalService',
  'ngMessages'
]);

user.controller('UserController', function($scope, $window, $stateParams, User, Products, Follow, Auth) {
  $scope.userId = $stateParams.userId
  $scope.user;
  $scope.userProducts;
  $scope.userFollowing;
  $scope.userFollowers;
  $scope.membershipYear;
  $scope.location;
  $scope.following = false

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
        for (var i=0; i < $scope.userFollowers.length; i++) {
          if ($scope.userFollowers[i].userid === Auth.userData.userid) {
            $scope.following = true
          }
        }
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
        $scope.userFollowers.push(Auth.userData)
        $scope.following = true
      })
      .catch(function(error) {
        console.error('Error with following user:', error);
      });
  };

  $scope.unfollow = function(user) {
    Follow.unfollow(user)
      .then(function(resp) {
        $scope.following = false
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
