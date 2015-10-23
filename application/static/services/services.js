var services = angular.module('beautystack.services', []);

services.factory('Products', function($http, Auth) {

  var userProducts = [];
  
  //Get all products for user
  var getAllProducts = function() {
    console.log('getAllProducts was invoked!');

    //check if userid exists first
    if (Auth.userData.userid) {
      //Send GET request to /userProducts/:user_id
      return $http({
        method: 'GET',
        url: '/api/userProducts/' + Auth.userData.userid,
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(function(resp) {
        while(userProducts.length) {userProducts.pop();}
        resp.data.userProducts.forEach(function(item) {userProducts.push(item);});
        // console.log(userProducts);
        return resp.data;
      });
    }
  };

  Auth.checkCookie()
  .then(function(resp) {
    if (resp.status === 200) {
      getAllProducts()
      .then(function(resp) {
        console.log('cookie checked!', userProducts);
      });
    }
  });

  //Add a product to user's stash
  var addProduct = function(product) {
    
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
      return resp.data;
    });
  };

  //Update a product in user's stash
  var editProduct = function(product) {
    console.log(product);
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

  //Retrieve prouct information for product profile page
  var retrieveProduct = function(product_id) {

    //Send GET request to /api/products/:product_id
    return $http({
      method: 'GET',
      url: '/api/products/' + product_id,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  };

  return {
    userProducts: userProducts,
    getAllProducts: getAllProducts,
    addProduct: addProduct,
    editProduct: editProduct,
    retrieveProduct: retrieveProduct
  };
});

services.factory('Auth', function($http) {

  var userData = {};
  userData.loggedIn = false;

  //Send GET request to /api/user upon loading services.js file in index.html
  var checkCookie = function() {
    return $http({
      method: 'GET',
      url: '/api/user',
      headers: {'Content-Type': 'application/json'}
    })
    .then(function(resp) {
      //if status code is 200, then extend userData
      if (resp.status === 200) {
        angular.extend(userData, resp.data);
        userData.loggedIn = true;
        userData.created_at = userData.created_at.substring(0, 4);
        console.log('200 resp');
        return resp;
      }
      //if status code is 204, then do nothing
      if (resp.status === 204) {
        console.log('204 resp');
        return resp;
      }
    })
    .catch(function(error) {
      console.error(error);
    });
  };

  checkCookie();

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
      //Use substring to get year
      userData.created_at = userData.created_at.substring(0, 4);
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
      userData.created_at = userData.created_at.substring(0, 4);
      console.log(userData.created_at);
      return resp.data;
    });
  };

  var signout = function() {
    for (var key in userData) {
      delete userData[key];
    }
    userData.loggedIn = false;
    return $http({
      method: 'DELETE',
      url: '/api/user',
      headers: {'Content-Type': 'application/json'},
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
    signout: signout,
    isAuth: isAuth,
    checkCookie: checkCookie
  };
});
