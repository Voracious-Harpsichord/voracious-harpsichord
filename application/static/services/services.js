angular.module('beautystack.services', [])

.factory('Products', function($http, Auth) {

  var userProducts = [];
  
  //Get all products for user
  var getAllProducts = function() {

    //Send GET request to /userProducts/:user_id
    return $http({
      method: 'GET',
      url: '/api/userProducts/' + Auth.userData.userid,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(function(resp) {
      userProducts = resp.data;
      return resp.data;
    });
  };

  //Add a product to user's stash
  var addProduct = function(product) {
    console.log('user data:', Auth.userData);
    
    //Send POST request to /userProducts/:user_id
    return $http({
      method: 'POST',
      url: '/api/userProducts/' + Auth.userData.userid,
      headers: {
        'Content-Type': 'application/json'
      },
      data: product
    })
    .then(function(resp) {
      console.log(resp.data);
      return resp.data;
    });
  };

  //Update a product in user's stash
  var updateProduct = function(product, newStatus) {

    //Send PUT request to /userProducts/:user_id
    return $http({
      method: 'PUT',
      url: '/api/userProducts/' + Auth.userData.userid,
      headers: {
        'Content-Type': 'application/json'
      },
      data: product
    });
  };

  return {
    getAllProducts: getAllProducts,
    addProduct: addProduct,
    updateProduct: updateProduct
  };
})

.factory('Auth', function($http) {

  var userData = {};
  userData.loggedIn = false;

  //Send POST request to /newUser when user signs up
  var signup = function(user) {
    return $http({
      method: 'POST',
      url: '/api/newUser',
      headers: {'Content-Type': 'application/json'},
      data: user
    })
    .then(function(resp) {
      angular.extend(userData, resp.data);
      userData.loggedIn = true;
      return resp;
    });
  };

  //Send POST request to /users when user signs in
  var signin = function(user) {
    return $http({
      method: 'POST',
      url: '/api/user',
      headers: {'Content-Type': 'application/json'},
      data: user
    })
    .then(function(resp) {
      angular.extend(userData, resp.data);
      userData.loggedIn = true;
      console.log(userData);
      return resp.data;
    });
  };

  //Check if beauty object is in local storage
  var isAuth = function() {
    return userData.loggedIn;
  };

  return {
    userData: userData,
    signup: signup,
    signin: signin,
    isAuth: isAuth
  };

});
