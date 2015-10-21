var profile = angular.module('beautystack.settings', []);

profile.controller('SettingsController', function ($scope, Products) {
  $scope.newProduct = '';
  $scope.user = {}

  $scope.getUser = function(){
  //Hard coded until factory is complete
    $scope.user = {
      firstName: 'Laura', 
      lastName: 'Weaver',
      email: 'laura.maclay.weaver@gmail.com',
      age: 25, 
      location: 'San Francisco, CA',
      photo: '../photos/testProfilePhoto.jpg',
      username: 'lauraweaver',
      description: 'I am a real human who likes skincare a bit too much.'
    };
  };
})
