var stash = angular.module('beautystack.stash', []);

stash.controller('StashController', ['$scope', 'Products',
  function($scope, Products) {
    $scope.products = {};
    $scope.product = {};

    $scope.getAll = function() {

      //Invoke getAllProducts function from Products factory
      Products.getAllProducts()
      .then(function(resp) {
        $scope.products = resp;
        console.log('Fetching products');
      })
      .catch(function(err) {
        console.error('Error with getting products:', err);
      });
    };

    $scope.addProduct = function() {
      Products.addProduct(JSON.stringify($scope.product));
      console.log('Product added');
      $scope.product = {};
    };
  }
]);
