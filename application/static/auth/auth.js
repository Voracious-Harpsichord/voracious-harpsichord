angular.module('beautystack.auth', [])

.controller('AuthController', ['$scope', '$window', '$state', 'Auth', 'Spinner',
  function($scope, $window, $state, Auth, Spinner) {

    $scope.user = {};
    // $scope.name = $window.localStorage.getItem('beauty.username');

    $scope.signin = function() {
      //Create and start spinner
      var spinner = Spinner.create();
      spinner.spin(document.querySelector('.spinner'));

    }



  }


  ])
