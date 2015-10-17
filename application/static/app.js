var app = angular.module('beautystack',
  ['beautystack.services', 'beautystack.home', 'beautystack.auth', 'beautystack.product', 'beautystack.stash', 'ui.router']);

app.config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('home', {
        //Parent state of home; load home.html, set controller
        url: '/',

        views: {
          nav: {
            templateUrl: './nav/nav.html',
            controller: 'AuthController'
          },

          page: {
            templateUrl: './home/home.html',
            controller: 'HomeController',
          }
        },

        data: {
          requireLogin: false
        }
      })
      .state('stash', {
        url: '/stash',

        views: {

          nav: {
            templateUrl: './nav/nav.html',
            controller: 'AuthController'
          },

          page: {
            templateUrl: './stash/stash.html',
            controller: 'stashController'
          }
        },

        data: {
          requireLogin: true
        }
      })
      .state('product', {
        url: '/product',
        
        views: {

          nav: {
            templateUrl: './nav/nav.html',
            controller: 'AuthController'
          },

          page: {
            templateUrl: './product/product.html',
            controller: 'productController'
          }
        },

        data: {
          requireLogin: false
        }
      })
      .state('signin', {
        url: '/signin',

        views: {

          page: {
            templateUrl: './auth/signin.html',
            controller: 'AuthController'
          }
        },

        data: {
          requireLogin: false
        }
      })
      .state('signup', {
        url: '/signup',

        views: {

          page: {
            templateUrl: './auth/signup.html',
            controller: 'AuthController'
          }
        },

        data: {
          requireLogin: false
        }
      });

      $urlRouterProvider.otherwise('/');

  }]);
