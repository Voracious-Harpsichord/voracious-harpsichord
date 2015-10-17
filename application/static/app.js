var app = angular.module('beautystack',[
  'beautystack.services', 
  'beautystack.home', 
  'beautystack.product', 
  'beautystack.auth', 
  'beautystack.stash', 
  'ui.router'
]);

app.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider.state('home', {
    //Parent state of home; load home.html, set controller
    url: '/',
    views: {
      'nav': {
        templateUrl: 'nav/nav.html',
        controller: 'AuthController'
      },
      'page': {
        templateUrl: 'home/home.html',
        controller: 'HomeController'
      }
    },
    data: {
      requireLogin: false
    }
  })

  $stateProvider.state('stash', {
    url: '/stash',
    views: {
      'nav': {
        templateUrl: 'nav/nav.html',
        controller: 'AuthController'
      },
      'page': {
        templateUrl: 'stash/stash.html',
        controller: 'StashController'
      }
    },
    data: {
      requireLogin: true
    }
  })

  $stateProvider.state('product', {
    url: '/product',
    views: {
      'nav': {
        templateUrl: 'nav/nav.html',
        controller: 'AuthController'
      },
      'page': {
        templateUrl: 'product/product.html',
        controller: 'ProductController'
      }
    },
    data: {
      requireLogin: false
    }
  })

  $stateProvider.state('signin', {
    url: '/signin',
    views: {
      'page': {
        templateUrl: 'auth/signin.html',
        controller: 'AuthController'
      }
    },
    data: {
      requireLogin: false
    }
  })

  $stateProvider.state('signup', {
    url: '/signup',
    views: {
      'page': {
        templateUrl: 'auth/signup.html',
        controller: 'AuthController'
      }
    },
    data: {
      requireLogin: false
    }
  });

  $urlRouterProvider.otherwise('/');
})

app.run(function($rootScope, $location, $state, Auth) {
  //Listens to state change and determines if user is authenticated
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
    //If state requires authentication and user is not authenticated
    if (toState.data.requireLogin && !Auth.isAuth()) {
      //Prevent state transition from happening
      event.preventDefault();
      //Transition state to home page
      $state.transitionTo('home');
    }
  })
})
