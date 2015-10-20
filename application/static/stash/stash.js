var stash = angular.module('beautystack.stash', []);

stash.controller('StashController',
  function ($scope, Products) {
    $scope.newProduct = '';

    //Fetch all products in user's stash
    $scope.getAll = function() {
      //Invoke getAllProducts function from Products factory
      Products.getAllProducts()
      .then(function(resp) {
        $scope.products = resp.data;
      })
      .catch(function(error) {
        console.error('Error with getting products:', error);
      });
    };

    //Add a product 
    $scope.addProduct = function() {
      var product = {'brand_name': 'Sephora', 'product_name': $scope.newProduct};
      Products.addProduct(product)
      .then(function(resp) {
        $scope.newProduct = '';
        $scope.products.push(resp.data);
        console.log('scope.products:', $scope.products);
      })
      .catch(function(error) {
        console.error('Error with adding product:', error);
      });
    };

    $scope.getAll();
  });
