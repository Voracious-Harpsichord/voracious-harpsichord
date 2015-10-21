angular.module('beautystack.auth', [])

.controller('AuthController', function($scope, $state, Auth, Products, $document) {

    $scope.user = {};
    $scope.loginStatus = Auth.userData.loggedIn;
    $scope.user.name = Auth.userData.name;
    
    $scope.signup = function() {
      //Invoke signup function from Auth factory
      Auth.signup($scope.user)
      .then(function() {
        //Fetch user's products
        Products.getAllProducts();
        //Transition to stash page
        $state.go('home');
      })
      .catch(function(error) {
        console.error(error);
        $scope.error = error.data;
      });
    };

    $scope.signin = function() {
      //Invoke signin function from Auth factory
      Auth.signin($scope.user)
      .then(function() {
        //Fetch user's products
        Products.getAllProducts();
        //Transition to stash page
        $state.go('home');
      })
      .catch(function(error) {
        console.error(error);
        $scope.error = error.data;
      });
    };

    $scope.signout = function() {
      Auth.userData = {};
      Auth.userData.loggedIn = false;
      $state.go('home');
    };
});


