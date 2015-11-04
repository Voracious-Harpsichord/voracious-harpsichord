var stash = angular.module('beautystash.profile', [
  'ui.bootstrap',
  'ui.bootstrap.tabs',
  'angularModalService',
  'ngMessages',
  'autocomplete'
]);

stash.controller('ProfileController', function ($scope, $window, Products, Follow, Sites, Rec, $stateParams, Auth, ModalService) {

  $scope.searchedBrandsWithProducts
  $scope.searchedBrands = []
  $scope.searchProducts = []

  $scope.getBrands = function(firstLetter) {
    if (firstLetter.length === 1) {
      Products.getBrands(firstLetter)
        .then(function(brands) {
          $scope.searchedBrands = Object.keys(brands)
          $scope.searchedBrandsWithProducts = brands
        })
        .catch(function(error) {
          console.log(error)
        })
    } else {
      console.error('too many letters')
    }
  }

  $scope.selectBrandProducts = function() {
    var products = $scope.searchedBrandsWithProducts[$scope.newProduct.brand_name]
    $scope.searchProducts = []
    for (var i=0; i < products.length; i++) {
      $scope.searchProducts.push(products[i].product_name)
    }
  }

  $scope.user = Auth.userData;
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
    $scope.error = null;
    $scope.site.url = null;
    $scope.site.comment = null;
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
        $scope.editProduct(product);
      });
    });
  };

  $scope.editProduct = function(product) {
    $scope.products[$scope.currentItemIndex] = angular.copy(product).product;
    $scope.editMode = false;
    Products.editProduct(product)
      .then(function(editedProduct){
        $scope.products[$scope.currentItemIndex] = editedProduct.data;
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
      })
      .catch(function(error) {
        console.error('Error with deleting product:', error);
      });
  };

  // Following Variable and Controllers

  $scope.profileFollowers;
  $scope.profileFollowing;

  getFollowersFollowing = function() {
    Follow.getProfileFollowersFollowing()
      .then(function(data) {
        $scope.profileFollowing = data.following;
        $scope.profileFollowers = data.followers;
      });
  };

  getFollowersFollowing();

  //Recommendations

  $scope.universalRecs = Rec.recommendations.universal;
  $scope.personalRecs = Rec.recommendations.personal;

  //Blogs and Article Variable and Controllers

  $scope.sites = Sites.userSites;
  $scope.site = {};

  $scope.addSiteModeFn = function(bool) {
    $scope.addSiteMode = bool;
  };

  $scope.addSite = function(site) {
    Sites.addSite(site)
      .then(function(addedSite) {
        $scope.sites.push(addedSite);
        resetFields();
      })
      .catch(function(error) {
        console.error('Error with adding site:', error);
        $scope.error = error.data;
        resetFields();
      });
  };
});

<<<<<<< HEAD

=======
>>>>>>> fixed tree
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
