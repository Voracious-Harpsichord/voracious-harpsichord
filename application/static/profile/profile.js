var stash = angular.module('beautystash.profile', [
  'ui.bootstrap',
  'ui.bootstrap.tabs'
]);

stash.controller('ProfileController', function ($scope, $window, Products, $stateParams, Auth, filterFilter) {

  // $scope.alertMe = function() {
  //   setTimeout(function() {
  //     $window.alert('You\'ve selected the alert tab!');
  //   });
  // };

  $scope.user = Auth.userData;
  //Display all products in user's stash
  $scope.products = Products.userProducts;
  $scope.editMode = false;
  $scope.filter;
  $scope.currentItemIndex;

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

  $scope.tabs = [
    {name: 'Stash', path: 'stash'}, 
    {name: 'Explore Your Products', path: 'explore'}, 
    {name: 'Friends', path: 'friends'}, 
    {name: 'Wishlist', path: 'wishlist'},
    {name: 'Recommendations', path: 'recs'}, 
    {name: 'Blogs', path: 'blogs'}
  ]

  resetFields = function() {
    $scope.newProduct.product_id = null;
    $scope.newProduct.brand_name = null;
    $scope.newProduct.product_name = null;
    $scope.newProduct.notes = null;
    $scope.newProduct.product_color = null;
    $scope.newProduct.product_size = null
    $scope.newProduct.product_status = null
    $scope.newProduct.product_category = null
  }

  $scope.addProductMode = false

  $scope.addProductModeFn = function(bool) {
    $scope.addProductMode = bool    
  }

  //Add a product 
  $scope.addProduct = function(product) {
    Products.addProduct(product)
    .then(function(addedProduct) {
      $scope.products.unshift(addedProduct);
      resetFields();
    })
    .catch(function(error) {
      console.error('Error with adding product:', error);
      resetFields();
    });
  };

  $scope.editModeFn = function(product) {
    $scope.editMode = true
    $scope.newProduct = angular.copy(product);
    $scope.currentItemIndex = $scope.products.indexOf(product);
  }

  $scope.editProduct = function(product) {
    console.log(product)
    $scope.products[$scope.currentItemIndex] = angular.copy(product)
    $scope.editMode = false
    Products.editProduct(product)
      .then(function(editedProduct){
        console.log(editedProduct)
        resetFields();
      })
      .catch(function(error) {
        console.error('Error with editing product:', error);
        resetFields();
      })
  }

  $scope.deleteProduct = function(product) {
    $scope.currentItemIndex = $scope.products.indexOf(product);
    Products.deleteProduct(product)
      .then(function(response) {
        $scope.products.splice($scope.currentItemIndex, 1)
        console.log($scope.products)
      })
      .catch(function(error) {
        console.error('Error with deleting product:', error);
      })
  }
  });

stash.filter('wishlistFilter', function() {
  return function(input) {
    var output = []
    angular.forEach(input, function(product) {
      if (product.product_status === 'Wishlist') {
        output.push(product)
      }
    })
    return output
  }
})

stash.filter('finishedFilter', function() {
  return function(input) {
    var output = []
    angular.forEach(input, function(product) {
      if (product.product_status === 'Finished') {
        output.push(product)
      }
    })
    return output
  }
})

stash.filter('myStashFilter', function() {
  return function(input) {
    var output = []
    angular.forEach(input, function(product) {
      if (product.product_status === 'Own' || product.product_status === null) {
        output.push(product)
      }
    })
    return output
  }
})
