var app = angular.module('beautystack',
  ['beautystack.services', 'beautystack.home', 'beautystack.auth', 'beautystack.product', 'beautystack.stash', 'ui.router']);

app.config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('home', {
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

  }])

.run(function($rootScope, $location, $state, Auth) {
  //Listens to state change and determines if user is authenticated
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
    //If state requires authentication and user is not authenticated
    if (toState.data.requireLogin && !Auth.isAuth() {
      //Prevent state transition from happening
      event.preventDefault();
      //Transition state to home page
      $state.transitionTo('home');
    })
  })
})
