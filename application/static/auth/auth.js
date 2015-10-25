angular.module('beautystash.auth', [])

.controller('AuthController', function($scope, $window, $state, Auth, Products, $document) {

    $scope.user = Auth.userData;
    $scope.loginStatus = Auth.userData.loggedIn;

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
      Auth.signout()
      .catch(function(err) {
        console.error(err);
      });
      $state.go('signin');
    };
});
