angular.module('beautystash.product', [])

.controller('ProductController', function ($scope, Products) {
    
    var getProductInfo = function() {
      Products.retrieveProduct();
    };
});
