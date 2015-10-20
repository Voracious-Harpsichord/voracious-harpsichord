angular.module('beautystack.auth', [])

.controller('AuthController', function($scope, $window, $state, Auth, $document) {

    $scope.user = {};
    $scope.loginStatus = false;

    var wnd = $window;
    var doc = $document[0];

    $scope.showNav = false;
    wnd.onscroll = function () {
        var scrollY = wnd.scrollY
            || doc.documentElement.scrollTop
            || doc.body.scrollTop;
        $scope.showNav = scrollY <= 800;
    };
    
    $scope.signup = function() {
      //Invoke signup function from Auth factory
      Auth.signup($scope.user)
      .then(function(userid, name) {
        //Change loginStatus to true
        $scope.loginStatus = true;
        //Store userid in local storage
        $window.localStorage.setItem('beauty.userid', userid);
        //Assign name property on user object
        $scope.user.name = name;
        //Transition to stash page
        $state.transitionTo('home');
      })
      .catch(function(error) {
        console.error(error);
        $scope.error = error.data;
      });
    };

    $scope.signin = function() {
      //Invoke signin function from Auth factory
      Auth.signin($scope.user, name)
      .then(function(userid) {
        //Change loginStatus to true
        $scope.loginStatus = true;
        //Store userid in local storage
        $window.localStorage.setItem('beauty.userid', userid);
        //Assign name property on user object
        $scope.user.name = name;
        //Transition to stash page
        $state.transitionTo('home');
      })
      .catch(function(error) {
        console.error(error);
        $scope.error = error.data;
      });
    };

    $scope.signout = function() {
      //Change loginStatus to false
      $scope.loginStatus = false;
      //Remove userid stored in local storage
      $window.localStorage.removeItem('beauty.userid', userid);
      //Transition to home page
      $state.transitionTo('home');
    };
});
