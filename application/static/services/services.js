angular.module('beautystack.services', [])

.factory('Products', ['$http', '$window', function($http, $window) {
  var getAll = function() {
    return $http({
      method: 'GET',
      url: '/userProducts/' + user_id,
      headers: {}
    })
    .then(function(resp) {
      return resp.data;
    });
  };

  var addProduct = function(product) {
    return $http({
      method: 'POST',
      url: '/userProducts/' + user_id,
      headers: {}.
      data: product
    });
  };

  var updateProduct = function(product) {
    return $http({
      method: 'PUT',
      url: '/userProducts/' + user_id,
      headers: {},
      data: product
    });
  };

  var deleteProduct = function(product) {
    return $http({
      method: 'DELETE',
      url: '/userProducts/' + user_id,
      headers: {}
    });
  };

  return {
    getAll: getAll,
    addProduct: addProduct,
    updateProduct: updateProduct,
    deleteProduct: deleteProduct
  };
}])

.factory('Auth', ['$http', '$window', function($http, $window) {

}])
