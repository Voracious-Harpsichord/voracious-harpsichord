angular.module('beautystack.product', [])

.controller('ProductController', function ($scope, Products) {
    
    var getProductInfo = function() {
      Products.retrieveProduct();
    };
});
