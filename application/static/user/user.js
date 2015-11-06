var user = angular.module('beautystash.user', [
  'ui.bootstrap',
  'ui.bootstrap.tabs',
  'angularModalService',
  'ngMessages',
  'angularMoment'
]);

user.controller('UserController', function ($scope, $window, $stateParams, User, Products, Follow, Auth, Rec, Sites) {
  $scope.userId = $stateParams.userId;
  $scope.user;
  $scope.userProducts;
  $scope.userFollowing;
  $scope.userFollowers;
  $scope.membershipYear;
  $scope.location;
  $scope.following = false;
  $scope.userRecs_universal;
  $scope.userRecs_personal = [];
  $scope.sites = [];

  $scope.tabs = [
    {name: 'Stash', path: 'stash'},
    {name: 'Explore Products', path: 'explore'},
    {name: 'Friends', path: 'friends'},
    {name: 'Wishlist', path: 'wishlist'},
    {name: 'Recommendations', path: 'recs'},
    {name: 'Blogs', path: 'blogs'}
  ];

  $scope.newProduct = {
    product_id: null,
    product_name: null,
    brand_name: null,
    product_size: null,
    product_status:null,
    product_notes: null,
    product_color: null,
    product_category: null
  };

  resetFields = function() {
    $scope.newProduct.product_id = null;
    $scope.newProduct.brand_name = null;
    $scope.newProduct.product_name = null;
    $scope.newProduct.product_notes = null;
    $scope.newProduct.product_color = null;
    $scope.newProduct.product_size = null;
    $scope.newProduct.product_status = null;
    $scope.newProduct.product_category = null;
  };

  $scope.searchedBrandsWithProducts;
  $scope.searchedBrands = [];
  $scope.searchProducts = [];

  $scope.getBrands = function(firstLetter) {
    if (firstLetter !== null) {
      Products.getBrands(firstLetter)
        .then(function(brands) {
          $scope.searchedBrands = Object.keys(brands);
          $scope.searchedBrandsWithProducts = brands;
        })
        .catch(function(error) {
          console.error(error);
        });
    }
  };

  $scope.selectBrandProducts = function() {
    if ($scope.searchedBrandsWithProducts[$scope.newProduct.brand_name]) {
      var products = $scope.searchedBrandsWithProducts[$scope.newProduct.brand_name]
      $scope.searchProducts = []
      for (var i=0; i < products.length; i++) {
        $scope.searchProducts.push(products[i].product_name)
      }
    }
  };

  $scope.addRecommendation = function(product) {
    var userid = $scope.userId;
    if (product.brand_name !== null && product.product_name !== null) {
      Rec.addRec(product, userid)
      .then(function(addedProduct) {
        $scope.userProducts.unshift(addedProduct);
        resetFields();
      })
      .catch(function(error) {
        console.error('Error with adding product:', error);
        resetFields();
      });
    }
  };

  getUserRecs = function(userId) {
    Rec.loadUserRecs(userId)
      .then(function(data) {
        $scope.userRecs_universal = data.universal;
        $scope.userRecs_personal = data.personal;
      });
  };

  getUserData = function(userId) {
    User.getInfo($scope.userId)
      .then(function(data) {
        $scope.user = data.user;
        $scope.userProducts = data.userProducts;
        $scope.membershipYear = $scope.user.created_at.substring(0, 4);
      })
      .catch(function(error) {
        console.error(error);
      });
  };

  getUserFollowingFollowers = function(userId) {
    Follow.getUserFollowersFollowing(userId)
      .then(function(data) {
        $scope.userFollowing = data.following;
        $scope.userFollowers = data.followers;
        for (var i=0; i < $scope.userFollowers.length; i++) {
          if ($scope.userFollowers[i].userid === Auth.userData.userid) {
            $scope.following = true;
          }
        }
      })
      .catch(function(error) {
        console.error(error);
      });
  };

  getUserSites = function(userId) {
    Sites.getSitesWithID(userId)
      .then(function(data) {
        $scope.sites = data.sites;
      })
      .catch(function(error) {
        console.error(error);
      });
  };

  getUserData($scope.userId);
  getUserRecs($scope.userId);
  getUserFollowingFollowers($scope.userId);
  getUserSites($scope.userId);

  $scope.follow = function(user) {
    Follow.follow(user)
      .then(function(user) {
        $scope.userFollowers.push(Auth.userData);
        $scope.following = true;
      })
      .catch(function(error) {
        console.error('Error with following user:', error);
      });
  };

  $scope.unfollow = function(user) {
    Follow.unfollow(user)
      .then(function(resp) {
        $scope.following = false;
      })
      .catch(function(error) {
        console.error('Error with unfollowing user:', error);
      });
  };
});

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

user.filter('recsFilter', function() {
  return function(input) {
    var output = [];
    angular.forEach(input, function(product) {
      if (product.product_status === 'Recommendation') {
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
