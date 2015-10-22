var stash = angular.module('beautystack.profile', []);

stash.controller('ProfileController', function ($scope, Products, $stateParams, Auth) {
    $scope.user = Auth.userData;
    $scope.newProduct = {};
    $scope.newProduct.brand_name = '';
    $scope.newProduct.product_name = '';
    $scope.tabs = [
      {name: 'My Stash', path: 'stash'}, 
      {name: 'Explore Your Products', path: 'explore'}, 
      {name: 'Friends', path: 'friends'}, 
      {name: 'Wishlist', path: 'wishlist'},
      {name: 'Recommendations', path: 'recs'}, 
      {name: 'Blogs', path: 'blogs'}
    ]

    //Display all products in user's stash
    $scope.products = Products.userProducts;

    //Add a product 
    $scope.addProduct = function() {
      Products.addProduct($scope.newProduct)
      .then(function(addedProduct) {
        $scope.newProduct.brand_name = '';
        $scope.newProduct.product_name = '';
        $scope.products.push(addedProduct);
      })
      .catch(function(error) {
        console.error('Error with adding product:', error);
      });
    };

  });
