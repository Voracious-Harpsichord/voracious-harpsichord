var stash = angular.module('beautystack.stash', []);

stash.controller('StashController',
  function ($scope, Products) {
    $scope.newProduct = '';

    //Display all products in user's stash
    $scope.products = Products.userProducts;

    //Add a product 
    $scope.addProduct = function() {
      var product = {'brand_name': 'Sephora', 'product_name': $scope.newProduct};
      Products.addProduct(product)
      .then(function(addedProduct) {
        $scope.newProduct = '';
        $scope.products.push(addedProduct);
      })
      .catch(function(error) {
        console.error('Error with adding product:', error);
      });
    };

  });
