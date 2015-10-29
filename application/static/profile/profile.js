var stash = angular.module('beautystash.profile', [
  'ui.bootstrap',
  'ui.bootstrap.tabs',
  'angularModalService',
  'ngMessages'
]);

stash.controller('ProfileController', function ($scope, $window, Products, Follow, Sites, $stateParams, Auth, ModalService) {
  //General variables
  $scope.user = Auth.userData;
  //Display all products in user's stash
  $scope.products = Products.userProducts;

  $scope.newProduct = {
    product_id: null,
    product_name: null,
    brand_name: null,
    product_size: null,
    product_status:null,
    product_notes: null,
    product_color: null,
    product_category: null
  };

  $scope.tabs = [
    {name: 'Stash', path: 'stash'},
    {name: 'Explore Your Products', path: 'explore'},
    {name: 'Friends', path: 'friends'},
    {name: 'Wishlist', path: 'wishlist'},
    {name: 'Recommendations', path: 'recs'},
    {name: 'Blogs', path: 'blogs'}
  ];

  resetFields = function() {
    $scope.newProduct.product_id = null;
    $scope.newProduct.brand_name = null;
    $scope.newProduct.product_name = null;
    $scope.newProduct.product_notes = null;
    $scope.newProduct.product_color = null;
    $scope.newProduct.product_size = null;
    $scope.newProduct.product_status = null;
    $scope.newProduct.product_category = null;
  };

  //Variables and fns relating to adding product 
  $scope.addProductMode = false;

  $scope.addProductModeFn = function(bool) {
    $scope.addProductMode = bool;
    if ($scope.addProductMode === true) {
      $scope.filter = '';
    };
  };

  $scope.addProduct = function(product) {
    if (product.brand_name !== null && product.product_name !== null) {   
      Products.addProduct(product)
      .then(function(addedProduct) {
        $scope.products.unshift(addedProduct);
        resetFields();
      })
      .catch(function(error) {
        console.error('Error with adding product:', error);
        resetFields();
      });
    }
  };

  //Variables and fns relating to editing product 
  $scope.editMode = false;

  $scope.editModeFn = function(product) {
    $scope.editMode = true;
    $scope.newProduct = angular.copy(product);
    $scope.currentItemIndex = $scope.products.indexOf(product);
  };

  $scope.editProductModal = function(product) {
    $scope.editModeFn(product);
    ModalService.showModal({
      templateUrl: "profile/profile.editModal.html",
      controller: "ModalController",
      inputs: {
        product: product
      }
    }).then(function(modal) {
      modal.element.modal();
      modal.close.then(function(product) {
        console.log('Modal Closes:', product);
        $scope.editProduct(product);
      });
    });
  };

  $scope.editProduct = function(product) {
    $scope.products[$scope.currentItemIndex] = angular.copy(product).product;
    $scope.editMode = false;
    Products.editProduct(product)
      .then(function(editedProduct){
        resetFields();
      })
      .catch(function(error) {
        console.error('Error with editing product:', error);
      });
  };

  //Variables and fns relating to delete product

  $scope.deleteMode = false;

  $scope.deleteModeFn = function(product) {
    $scope.deleteMode = true;
    $scope.currentItemIndex = $scope.products.indexOf(product);
  };

  $scope.deleteProductModal = function(product) {
    $scope.deleteModeFn(product);
    ModalService.showModal({
      templateUrl: "profile/profile.deleteModal.html",
      controller: "ModalController",
      inputs: {
        product: product
      }
    }).then(function(modal) {
      modal.element.modal();
      modal.close.then(function(product) {
        $scope.deleteProduct(product);
      });
    });
  };

  $scope.deleteProduct = function(product) {
    $scope.products.splice($scope.currentItemIndex, 1);
    $scope.editMode = false;
    Products.deleteProduct(product.product)
      .then(function(response) {
        console.log('Product Deletion Success');
      })
      .catch(function(error) {
        console.error('Error with deleting product:', error);
      });
  };


  $scope.followers = Follow.userFollowers;
  $scope.following = Follow.userFollowing;
  
  $scope.follow = function() {
    // console.log('userid', Auth.userData.userid);
    // $scope.friends.push({
    //   'name_first': 'Cynthia', 'name_last': 'Chen', 'profilePic': '../photos/chen.jpg', 'status': 'Following'
    // });
    Follow.follow({'user_id': 1})
      .then(function(user) {
        $scope.following.push(user);
      })
      .catch(function(error) {
        console.error('Error with following user:', error);
      });
  };

  $scope.unfollow = function() {
    Follow.unfollow({'user_id': 1})
      .then(function(resp) {
        $scope.following.filter(function(userObject) {
          return userObject.userid !== resp.data.user_id;
        });
      })
      .catch(function(error) {
        console.error('Error with unfollowing user:', error);
      });
  };

  // $scope.sites = Sites.userSites;
  $scope.sites = [];
  $scope.site = {};
  $scope.site.url = '';

  $scope.addSiteModeFn = function(bool) {
    $scope.addSiteMode = bool;
    // if ($scope.addSiteMode === true) {
    //   $scope.filter = '';
    // }
  };

  $scope.addSite = function(site) {
    $scope.sites.push({'name': 'BeautyBlog', 'url': site.url, 'article': site.type});
    Sites.getSite(site.url)
      .then(function(resp) {
        console.log(resp);
      });
    console.log($scope.sites);
    $scope.site.url = '';
    // Sites.addSite()
    //   .then(function(addedSite) {
    //     $scope.sites.push(addedSite);
    //   })
    //   .catch(function(error) {
    //     console.error('Error with adding site:', error);
    //   });
  };
});

stash.controller('ModalController', function($scope, $element, product, close) {

  $scope.product = {};

  $scope.product.product_id = product.product_id;
  $scope.product.brand_name = product.brand_name;
  $scope.product.product_name = product.product_name;
  $scope.product.product_notes = product.product_notes;
  $scope.product.product_color = product.product_color;
  $scope.product.product_size = product.product_size;
  $scope.product.product_status = product.product_status;
  $scope.product.product_category = product.product_category;

  $scope.close = function() {
    close({product: $scope.product}, 500);
  };

  $scope.cancel = function() {
    $element.modal('hide');
  };
});

stash.filter('wishlistFilter', function() {
  return function(input) {
    var output = [];
    angular.forEach(input, function(product) {
      if (product.product_status === 'Wishlist') {
        output.push(product);
      }
    });
    return output;
  };
});

stash.filter('finishedFilter', function() {
  return function(input) {
    var output = [];
    angular.forEach(input, function(product) {
      if (product.product_status === 'Finished') {
        output.push(product);
      }
    });
    return output;
  };
});

stash.filter('myStashFilter', function() {
  return function(input) {
    var output = [];
    angular.forEach(input, function(product) {
      if (product.product_status === 'Own' || product.product_status === null) {
        output.push(product);
      }
    });
    return output;
  };
});
