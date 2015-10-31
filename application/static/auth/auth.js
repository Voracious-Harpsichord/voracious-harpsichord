angular.module('beautystash.auth', [])

.controller('AuthController', function($scope, $window, $state, Auth, Products, Follow, Sites, $document) {

    $scope.user = Auth.userData;
    $scope.loginStatus = Auth.userData.loggedIn;

    $scope.signup = function() {
      if ($scope.user.username === undefined || $scope.user.password === undefined || $scope.user.email === undefined) {
        console.error = 'Enter a valid username, password, and email address';
      } else {
        $scope.user.location = $scope.user.city + ', ' + $scope.user.state;
        //Invoke signup function from Auth factory
        Auth.signup($scope.user)
        .then(function() {
          console.log('user data', $scope.user);
          //Fetch user's products
          Products.getAllProducts();
          //Fetch user followers and following
          // Follow.getFollowers();
          // Follow.getFollowing();
          //Delete password property on $scope.user
          delete $scope.user.password;
          //Transition to stash page
          $state.go('home');
        })
        .catch(function(error) {
          console.error(error);
          $scope.error = error.data;
        });
      }
    };

    $scope.signin = function() {
      if ($scope.user.username === undefined || $scope.user.password === undefined) {
        $scope.error = 'Enter a valid username and password';
      } else {
        //Invoke signin function from Auth factory
        Auth.signin($scope.user)
        .then(function() {
          //Fetch user's products
          Products.getAllProducts();
          //Fetch user followers and following
          // Follow.getFollowers();
          // Follow.getFollowing();
          //Fetch user sites data
          Sites.getSites();
          //Delete password property on $scope.user
          delete $scope.user.password;
          //Transition to stash page
          $state.go('home');
        })
        .catch(function(error) {
          $scope.error = error.data;
        });
      }
    };

    $scope.signout = function() {
      Auth.signout()
      .catch(function(err) {
        console.error(err);
      });
      $state.go('signin');
    };
});
