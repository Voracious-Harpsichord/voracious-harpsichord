var stash = angular.module('beautystack.profile', []);

stash.controller('ProfileController', function ($scope, Products, $stateParams, Auth) {
    $scope.user = Auth.userData;
    //Display all products in user's stash
    $scope.products = Products.userProducts;
    $scope.editMode = false;
    $scope.filter;
    $scope.currentItemIndex;

    $scope.newProduct = {
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
      {name: 'Explore Products', path: 'explore'}, 
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
        $scope.products.push(addedProduct);
        $scope.newProduct.brand_name = '';
        $scope.newProduct.product_name = '';
        $scope.newProduct.notes = '';
      })
      .catch(function(error) {
        console.error('Error with adding product:', error);
      });
    };

    $scope.editModeFn = function(product) {
      $scope.editMode = true
      $scope.newProduct = angular.copy(product);
      $scope.currentItemIndex = $scope.products.indexOf(product);
    }

    $scope.editProduct = function(product) {
      $scope.products[$scope.currentItemIndex] = angular.copy(product)
      $scope.editMode = false
      Products.editProduct(product)
        .then(function(editedProduct){
          $scope.newProduct.brand_name = '';
          $scope.newProduct.product_name = '';
          $scope.newProduct.notes = '';
        })
        .catch(function(error) {
          console.error('Error with editing product:', error);
        })
    }

    $scope.search = function(product) {
      $scope.filter = product
    }
  });
