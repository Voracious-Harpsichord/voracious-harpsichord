var stash = angular.module('beautystack.stash', []);

stash.controller('StashController', ['$scope', 'Products', 'Spinner', 
  function($scope, Products, Spinner) {
    $scope.stash = {};

    $scope.getAll = function() {
      //Create and start spinner
      var spinner = Spinner.create();
      spinner.spin(document.querySelector('.stash-spinner'));

      //Invoke entries factory get all method
      Products.getAll()
      .then(function(resp) {
        spinner.stop();
        $scope.products = resp;
      })
      .catch(function(err) {
        console.log('Error with getting stack:', err);
      });
    };

    $scope.addProduct = function() {
      Products.add();
      $scope.product = {};    
    }
  }
]);
