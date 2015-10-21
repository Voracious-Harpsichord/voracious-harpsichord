var stash = angular.module('beautystack.profile', []);

stash.controller('ProfileController', function ($scope, Products, $stateParams) {
    $scope.newProduct = '';
    $scope.user = {};
    $scope.tabs = [
      {name: 'My Stash', path: 'stash'}, 
      {name: 'Explore Your Products', path: 'explore'}, 
      {name: 'Friends', path: 'friends'}, 
      {name: 'Wishlist', path: 'wishlist'},
      {name: 'Recommendations', path: 'recs'}, 
      {name: 'Blogs', path: 'blogs'}
    ]

    $scope.getCurrentUser = function() {
      $scope.user = {
        firstName: 'Laura', 
        lastName: 'Weaver',
        email: 'laura.maclay.weaver@gmail.com',
        age: 25, 
        location: 'San Francisco, CA',
        photo: '../photos/testProfilePhoto.jpg',
        username: 'lauraweaver',
        createdAt: 2015,
        description: 'I am a real human who likes skincare a bit too much.'
      };
    };

    //Fetch all products in user's stash
    $scope.getAll = function() {
      //Invoke getAllProducts function from Products factory
      Products.getAllProducts()
      .then(function(resp) {
        $scope.products = resp.data;
      })
      .catch(function(error) {
        console.error('Error with getting products:', error);
      });
    };

    //Add a product 
    $scope.addProduct = function() {
      var product = {'brand_name': 'Sephora', 'product_name': $scope.newProduct};
      Products.addProduct(product)
      .then(function(resp) {
        $scope.newProduct = '';
        $scope.products.push(resp.data);
        console.log('scope.products:', $scope.products);
      })
      .catch(function(error) {
        console.error('Error with adding product:', error);
      });
    };

    $scope.getCurrentUser()
    // $scope.getAll();
  });
