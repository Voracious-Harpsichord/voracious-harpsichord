var stash = angular.module('beautystash.profile', []);

stash.controller('ProfileController', function ($scope, Products, $stateParams, Auth) {
    $scope.user = Auth.userData;
    //Display all products in user's stash
    $scope.products = Products.userProducts;
    $scope.editMode = false;
    $scope.filter;
    $scope.currentItemIndex;

    $scope.newProduct = {
      product_id: '',
      product_name: '',
      brand_name: '',
      product_size: '',
      product_status:'',
      product_notes: '',
      product_color: '',
      product_category: ''
    };

    $scope.tabs = [
      {name: 'Stash', path: 'stash'}, 
      {name: 'Explore Your Products', path: 'explore'}, 
      {name: 'Friends', path: 'friends'}, 
      {name: 'Wishlist', path: 'wishlist'},
      {name: 'Recommendations', path: 'recs'}, 
      {name: 'Blogs', path: 'blogs'}
    ]

    //Add a product 
    $scope.addProduct = function(product) {
      console.log(product)
      Products.addProduct(product)
      .then(function(addedProduct) {
        console.log(addedProduct)
        $scope.products.push(addedProduct);
        $scope.newProduct.product_id = '';
        $scope.newProduct.brand_name = '';
        $scope.newProduct.product_name = '';
        $scope.newProduct.notes = '';
      })
      .catch(function(error) {
        console.error('Error with adding product:', error);
        $scope.newProduct.product_id = '';
        $scope.newProduct.brand_name = '';
        $scope.newProduct.product_name = '';
        $scope.newProduct.notes = '';
        $scope.newProduct.product_color = '';
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
          $scope.newProduct.product_id = '';
          $scope.newProduct.brand_name = '';
          $scope.newProduct.product_name = '';
          $scope.newProduct.notes = '';
          $scope.newProduct.product_color = '';
        })
        .catch(function(error) {
          console.error('Error with editing product:', error);
          $scope.newProduct.product_id = '';
          $scope.newProduct.brand_name = '';
          $scope.newProduct.product_name = '';
          $scope.newProduct.notes = '';
          $scope.newProduct.product_color = '';
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

stash.filter('universalFilter', function() {
})
