var services = angular.module('beautystash.services', []);

// services.factory('Recs', function($http, Auth) {

//   var userUniversalRecs = [];
//   var userPersonalizedRecs = [];

//   //Get user's univeral recs
//   var getUniversal = function() {
//   }


// };

services.factory('User', function($http) {
  var getInfo = function(userid) {
    return $http({
      method: 'GET',
      url: '/api/profile/' + userid,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(function(resp) {
      return resp.data;
    })
    .catch(function(error) {
      console.error(error);
    });
  };

  return {
    getInfo: getInfo
  };
});

services.factory('Follow', function($http, Auth) {

  var getProfileFollowersFollowing = function() {
    if (Auth.userData.userid) {
      return $http({
        method: 'GET',
        url: '/api/user/follow/' + Auth.userData.userid,
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(function(resp) {
        return resp.data;
      });
    }
  };

  var userFollowing = {};
  var userFollowers = {};

  var getUserFollowersFollowing = function(user_id) {
    if (Auth.userData.userid) {
      return $http({
        method: 'GET',
        url: '/api/user/follow/' + user_id,
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(function(resp) {
        for (key in resp.data.following) {
          userFollowing[resp.data.following[key]] = true;
        }
        for (key in resp.data.followers) {
          userFollowers[resp.data.followers[key]] = true;
        }
        console.log(resp.data);
        return {following: resp.data.following, followers: resp.data.followers};
      });
    }
  };

  //To follow someone
  var follow = function(user) {
    //Send POST request to /api/user/following/:user_id
    return $http({
      method: 'POST',
      url: '/api/user/follow/' + Auth.userData.userid,
      headers: {
        'Content-Type': 'application/json'
      },
      data: user
    })
    .then(function(resp) {
      return resp.data;
    });
  };

  //To unfollow someone
  var unfollow = function(user) {
    //Send DELETE request /api/user/following/:user_id
    return $http({
      method: 'DELETE',
      url: '/api/user/follow/' + Auth.userData.userid,
      headers: {
        'Content-Type': 'application/json'
      },
      data: user
    })
    .then(function(resp) {
      return resp.data;
    });
  };

  return {
    getProfileFollowersFollowing: getProfileFollowersFollowing,
    getUserFollowersFollowing: getUserFollowersFollowing,
    userFollowing: userFollowing,
    userFollowers: userFollowers,
    follow: follow,
    unfollow: unfollow
  };
});

services.factory('Sites', function($http, Auth) {

  var userSites = [];

  var getSites = function() {
    //check if userid exists first
    if (Auth.userData.userid) {
      //Send GET request to /userSites/:user_id
      return $http({
        method: 'GET',
        url: '/api/sites/' + Auth.userData.userid,
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(function(resp) {
        while(userSites.length) {userSites.pop();}
        resp.data.sites.forEach(function(item) {userSites.push(item);});
        return resp.data;
      });
    }
  };

  Auth.checkCookie()
  .then(function(resp) {
    if (resp.status === 200) {
      getSites();
    }
  });

  var addSite = function(site) {
    //Send POST request to /userSites/:user_id
    return $http({
      method: 'POST',
      url: '/api/sites/' + Auth.userData.userid,
      headers: {
        'Content-Type': 'application/json'
      },
      data: site
    })
    .then(function(resp) {
      return resp.data;
    });
  };

  return {
    getSites: getSites,
    addSite: addSite,
    userSites: userSites
  };
});


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
    return $http({
      method: 'PUT',
      url: '/api/userProducts/' + Auth.userData.userid,
      headers: {
        'Content-Type': 'application/json'
      },
      data: product
    });
  };

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
