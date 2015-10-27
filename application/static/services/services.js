var services = angular.module('beautystash.services', []);

services.factory('Friends', function($http, Auth) {

  var userFriends = [
  {'name_first': 'Laura', 'name_last': 'Weaver', 'profilePic': '../photos/weaver.jpg'},
  {'name_first': 'John', 'name_last': 'Knox', 'profilePic': '../photos/knox.jpg'},
  {'name_first': 'Michael', 'name_last': 'Sova', 'profilePic': '../photos/sova.jpg'}
  ];

  var getFriends = function() {
    //check if userid exists first
    if (Auth.userData.userid) {
      //Send GET request to /userFriends/:user_id
      return $http({
        method: 'GET',
        url: '/api/userFriends' + Auth.userData.userid,
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(function(resp) {
        while(userFriends.length) {userFriends.pop();}
        resp.data.userFriends.forEach(function(item) {userFriends.push(item);});
        return resp.data;
      });
    }
  };

  var addFriend = function(user_id) {
    //Send POST request to /userFriends/:user_id
    return $http({
      method: 'POST',
      url: '/api/userFriends' + Auth.userData.userid,
      headers: {
        'Content-Type': 'application/json'
      },
      data: user_id
    })
    .then(function(resp) {
      return resp.data;
    });
  };

  return {
    getFriends: getFriends,
    addFriend: addFriend,
    userFriends: userFriends
  };
});

// services.factory('Sites', function($http, Auth) {

//   var userSites = [];

//   var getSites = function() {
//     //check if userid exists first
//     if (Auth.userData.userid) {
//       //Send GET request to /userSites/:user_id
//       return $http({
//         method: 'GET',
//         url: '/api/userSites' + Auth.userData.userid,
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       })
//       .then(function(resp) {
//         while(userSites.length) {userSites.pop();}
//         resp.data.userSites.forEach(function(item) {userSites.push(item);});
//         return resp.data;
//       });
//     }
//   };

  // var getSite = function() {
  //   return $http({
  //     method: 'GET',
  //     url: '/'
  //   });

//   });

//   var addSite = function(site) {
//     //Send POST request to /userSites/:user_id
//     return $http({
//       method: 'POST',
//       url: '/api/userSites/' + Auth.userData.userid,
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       data: site
//     })
//     .then(function(resp) {
//       return resp.data;
//     });
//   };

//   return {
//     getSites: getSites,
//     addSite: addSite
//   };
// });


services.factory('Products', function($http, Auth) {

  var userProducts = [];
  
  //Get all products for user
  var getAllProducts = function() {

    //check if userid exists first
    if (Auth.userData.userid) {
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
        return resp.data;
      });
    }
  };

  Auth.checkCookie()
  .then(function(resp) {
    if (resp.status === 200) {
      getAllProducts();
    }
  });

  //Add a product to user's stash
  var addProduct = function(product) {
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
    console.log(product)
    return $http({
      method: 'PUT',
      url: '/api/userProducts/' + Auth.userData.userid,
      headers: {
        'Content-Type': 'application/json'
      },
      data: product
    });
  };

  // //Retrieve product information for product profile page
  // var retrieveProduct = function(product_id) {

  //   //Send GET request to /api/products/:product_id
  //   return $http({
  //     method: 'GET',
  //     url: '/api/products/' + product_id,
  //     headers: {
  //       'Content-Type': 'application/json'
  //     }
  //   });
  // };

  var deleteProduct = function(product) {
    return $http({
      method: 'DELETE',
      url: '/api/userProducts/' + Auth.userData.userid,
      headers: {
        'Content-Type': 'application/json'
      },
      data: product
    });
  };

  return {
    userProducts: userProducts,
    getAllProducts: getAllProducts,
    addProduct: addProduct,
    editProduct: editProduct,
    deleteProduct: deleteProduct
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
        return resp;
      }
      //if status code is 204, then do nothing
      if (resp.status === 204) {
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
      //Use substring to get year
      userData.created_at = userData.created_at.substring(0, 4);
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

// services.factory('Cookie', function(Auth, Friends, Products) {
//   //Send GET request to /api/user upon loading services.js file in index.html
//   var checkCookie = function() {
//     return $http({
//       method: 'GET',
//       url: '/api/user',
//       headers: {'Content-Type': 'application/json'}
//     })
//     .then(function(resp) {
//       //if status code is 200, then extend userData
//       if (resp.status === 200) {
//         console.log('200');
//         angular.extend(Auth.userData, resp.data);
//         Auth.userData.loggedIn = true;
//         Auth.userData.created_at = Auth.userData.created_at.substring(0, 4);
//         Products.getAllProducts();
//         // Friends.getFriends();
//         return resp;
//       }
//       //if status code is 204, then do nothing
//       if (resp.status === 204) {
//         console.log('204');
//         return resp;
//       }
//     })
//     .catch(function(error) {
//       console.error(error);
//     });
//   };

//   checkCookie();

//   return {
//     checkCookie: checkCookie
//   };

// });
