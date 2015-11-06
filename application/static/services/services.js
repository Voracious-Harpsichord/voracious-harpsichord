var services = angular.module('beautystash.services', []);

var photoOptions = ['product1.jpg', 'product2.jpg', 'product3.jpg', 'product4.jpg', 'product5.jpg', 'product6.jpg', 'product7.jpg', 'product8.jpg']

services.factory('Rec', function($http, Auth) {

  var loadUserRecs = function(userid) {
    return $http({
      method: 'GET',
      url: '/api/recommendations/' + userid,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(function(resp) {
      var userRecs = {}

      resp.data.universal.forEach(function(item) {
        if (item.product_image_url === "") {
          item.product_image_url = '/photos/' + photoOptions[Math.floor(Math.random()*photoOptions.length)]
        }
      })

      resp.data.personal.forEach(function(item) {
        if (item.product.product_image_url === "") {
          item.product_image_url = '/photos/' + photoOptions[Math.floor(Math.random()*photoOptions.length)]
        }
        
        item.recommender_first = item.from_user.name_first,
        item.recommender_last = item.from_user.name_last,
        item.recommender_id = item.from_user.userid,
        // user_photo = item.from_user.user.profile_pic,
        item.recommender_photo = 'photos/cynthia.jpg',
        item.location = item.from_user.location,
        item.time_stamp = item.from_user.created_at,
        item.comments = item.from_user.comments,
        item.image = item.product.imageUrl,
        item.product_id = item.product.product_id,
        item.product_name = item.product.product_name,
        item.brand_name = item.product.brand_name,
        item.product_size = item.product.product_size,
        item.product_notes = item.product.product_notes,
        item.product_color = item.product.product_color,
        item.product_category = item.product.product_category

      })

      userRecs.personal = resp.data.personal;
      userRecs.universal = resp.data.universal;
      return userRecs;
    })
    .catch(function(error) {
      console.error(error);
    });
  };

  var addRec = function(product, userId) {
    return $http({
      method: 'POST',
      url: '/api/recommendations/' + Auth.userData.userid,
      headers: {
        'Content-Type': 'application/json'
      },
      data: {product: product, to_user_id: userId}
    })
    .then(function(resp) {
      return resp.data; //newly added recommendation
    })
    .catch(function(error) {
      console.error(error);
    });
  };

  var recommendations = {};

  loadUserRecs(Auth.userData.userid)
    .then(function(userRecs) {
      recommendations.personal = userRecs.personal;
      recommendations.universal = userRecs.universal;
    });

  return {
    recommendations: recommendations,
    loadUserRecs:loadUserRecs,
    addRec: addRec
  };

});

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
      resp.data.userProducts.forEach(function(item) {
        if (item.product_image_url === "") {
          item.product_image_url = '/photos/' + photoOptions[Math.floor(Math.random()*photoOptions.length)]
        }
      })
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

services.factory('Feed', function($http) {
  var feeds = [];

  var loadEvents = function() {
    return $http({
      method: 'GET',
      url: '/api/events',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(function(resp) {
      while (feeds.length) {feeds.pop();}
      if (resp.data.events) {
        events = resp.data.events;
      }
      while (events.length) {
        feeds.push(events.pop());
      }
      //nothing needs to be chained after this,
      //just a courtesy return
      return feeds;
    })
    .catch(function(error) {
      console.error(error);
    });
  };

  return {
    loadEvents: loadEvents,
    feeds : feeds
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

  var getSitesWithID = function(userid) {
    //check if userid exists first
    if (userid) {
      //Send GET request to /userSites/:user_id
      return $http({
        method: 'GET',
        url: '/api/sites/' + userid,
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(function(resp) {
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
    userSites: userSites,
    getSitesWithID: getSitesWithID
  };
});


services.factory('Products', function($http, Auth, $q) {

  var getBrands = function(letter) {
    return $http({
      method:'GET',
      url: '/api/brands/' + letter,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(function(resp) {
      return resp.data;
    });
  };

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
        resp.data.userProducts.forEach(function(item) {
          if (item.product_image_url === "") {
            item.product_image_url = '/photos/' + photoOptions[Math.floor(Math.random()*photoOptions.length)]
          }
          userProducts.unshift(item);
        });
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
    getBrands: getBrands,
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
      if (userData.location === '') {
        userData.location = 'Elsewhere';
      }
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
      if (userData.location === '') {
        userData.location = 'Elsewhere';
      }
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
