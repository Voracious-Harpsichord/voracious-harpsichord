angular.module('beautystack.auth', [])

.controller('AuthController', ['$scope', '$window', '$state', 'Auth',
  function($scope, $window, $state, Auth) {

    $scope.user = {};
    $scope.loginStatus = false;
    
    $scope.signup = function() {
      //Invoke signup function from Auth factory
      Auth.signup($scope.user)
      .then(function(userid) {
        $scope.loginStatus = true;
        //Store userid in local storage
        $window.localStorage.setItem('beauty.userid', userid);
        //Transition to stash page
        $state.transitionTo('stash');
      })
      .catch(function(error) {
        console.error(error);
        $scope.error = error.data;
      });
    };

    $scope.signin = function() {
      //Invoke signin function from Auth factory
      Auth.signin($scope.user)
      .then(function(userid) {
        $scope.loginStatus = true;
        //Store userid in local storage
        $window.localStorage.setItem('beauty.userid', userid);
        //Transition to stash page
        $state.transitionTo('stash');
      })
      .catch(function(error) {
        console.error(error);
        $scope.error = error.data;
      });
    };

    $scope.signout = function() {
      //Remove userid stored in local storage
      $scope.loginStatus = false; 
      $window.localStorage.removeItem('beauty.userid', userid);
      //Transition to home page
      $state.transitionTo('home');
    }
  }
])
