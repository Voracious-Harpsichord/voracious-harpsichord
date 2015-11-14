var stash = angular.module('beautystash.profile', [
  'ui.bootstrap',
  'ui.bootstrap.tabs',
  'angularModalService',
  'ngMessages',
  'autocomplete'
]);

stash.controller('ProfileController', function ($scope, $window, Products, Follow, Sites, Rec, $stateParams, Auth, ModalService) {

  $scope.searchedBrandsWithProducts;
  $scope.searchedBrands = [];
  $scope.searchProducts = [];

  $scope.getBrands = function(firstLetter) {
    if (firstLetter !== null) {
      Products.getBrands(firstLetter)
        .then(function(brands) {
          $scope.searchedBrands = Object.keys(brands);
          $scope.searchedBrandsWithProducts = brands;
        })
        .catch(function(error) {
          console.error(error);
        });
    }
  };

  $scope.selectBrandProducts = function() {
    if ($scope.searchedBrandsWithProducts && $scope.searchedBrandsWithProducts[$scope.newProduct.brand_name]) {
      var products = $scope.searchedBrandsWithProducts[$scope.newProduct.brand_name];
      $scope.searchProducts = [];
      for (var i=0; i < products.length; i++) {
        $scope.searchProducts.push(products[i].product_name);
      }
    }
  };

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
    }
  };

  var photoOptions = ['product1.jpg', 'product2.jpg', 'product3.jpg', 'product4.jpg', 'product5.jpg', 'product6.jpg', 'product7.jpg', 'product8.jpg']
  var photoOptionsBlogs = ['photo1.jpg', 'photo2.jpg', 'photo3.jpg', 'photo4.jpg', 'photo5.jpg', 'photo6.jpg', 'photo7.jpg', 'photo8.jpg', 'photo9.jpg', 'photo10.jpg', 'photo11.jpg', 'photo12.jpg', 'photo13.jpg', 'photo14.jpg', 'photo15.jpg', 'photo16.jpg', 'photo17.jpg', 'photo18.jpg', 'photo19.jpg', 'photo20.jpg', 'photo21.jpg', 'photo22.jpg', 'photo23.jpg', 'photo24.jpg', 'photo25.jpg', 'photo26.jpg', 'photo27.jpg', 'photo28.jpg', 'photo27.jpg','photo29.jpg','photo30.jpg','photo31.jpg','photo32.jpg','photo33.jpg','photo34.jpg','photo35.jpg','photo36.jpg','photo37.jpg','photo38.jpg','photo39.jpg','photo40.jpg','photo41.jpg','photo42.jpg','photo43.jpg','photo44.jpg','photo45.jpg','photo46.jpg','photo47.jpg','photo48.jpg','photo49.jpg','photo50.jpg','photo51.jpg','photo52.jpg','photo53.jpg','photo54.jpg','photo55.jpg','photo56.jpg','photo57.jpg','photo58.jpg','photo59.jpg','photo60.jpg','photo61.jpg','photo62.jpg','photo63.jpg','photo64.jpg','photo65.jpg','photo66.jpg','photo67.jpg','photo68.jpg','photo69.jpg','photo70.jpg', 'photo71.jpg','photo72.jpg','photo73.jpg']

  $scope.addProduct = function(product) {
    if (product.brand_name !== null && product.product_name !== null) {
      Products.addProduct(product)
      .then(function(addedProduct) {
        var product = addedProduct;
        if (!(product.product_image_url)) {
          product.product_image_url = '/photos/' + photoOptions[Math.floor(Math.random()*photoOptions.length)];
        }
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
    if ($scope.products[$scope.currentItemIndex].product_image_url === "") {
      $scope.products[$scope.currentItemIndex].product_image_url = '/photos/' + photoOptions[Math.floor(Math.random()*photoOptions.length)];
    }
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
        console.log(response)
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
  $scope.personalRecs = Rec.recommendations.personal;

  //Blogs and Article Variable and Controllers

  $scope.sites = Sites.userSites;
  $scope.sites.forEach(function (site) {
    site.image = site.image || '/photos/' + photoOptionsBlogs[Math.floor(Math.random()*photoOptionsBlogs.length)];
  });
  $scope.site = {};

  $scope.addSiteModeFn = function(bool) {
    $scope.addSiteMode = bool;
  };

  $scope.addSite = function(site) {
    Sites.addSite(site)
      .then(function(addedSite) {
        $scope.sites.unshift(addedSite);
        resetFields();
      })
      .catch(function(error) {
        console.error('Error with adding site:', error);
        $scope.error = error.data;
        resetFields();
      });
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
