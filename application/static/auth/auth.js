angular.module('beautystack.auth', [])

.controller('AuthController', function($scope, $window, $state, Auth, Products, $document) {

    $scope.user = Auth.userData;
    $scope.loginStatus = Auth.userData.loggedIn;
    
    //Invoke getAllProducts function from Products factory immediately
    Products.getAllProducts();

    $scope.signup = function() {
      //Invoke signup function from Auth factory
      Auth.signup($scope.user)
      .then(function() {
        //Fetch user's products
        Products.getAllProducts();
        //Delete password property on $scope.user
        delete $scope.user.password;
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
        //Delete password property on $scope.user
        delete $scope.user.password;
        //Transition to stash page
        $state.go('home');
      })
      .catch(function(error) {
        console.error(error);
        $scope.error = error.data;
      });
    };

    $scope.signout = function() {
      for (var key in Auth.userData) {
        delete Auth.userData[key];
      }
      Auth.userData.loggedIn = false;
      $state.go('home');
    };
});
