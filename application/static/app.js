var app = angular.module('beautystash',[
  'beautystash.services',
  'beautystash.home',
  'beautystash.product',
  'beautystash.auth',
  'beautystash.settings',
  'beautystash.profile',
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
  });

  $stateProvider.state('about', {
    url: '/about',
    views: {
      'page': {
        templateUrl: 'about/about.html'
      }
    },
    data: {
      requireLogin: false
    }
  });

  $stateProvider.state('profile', {
    url: '/profile',
    views: {
      'nav': {
        templateUrl: 'nav/nav.html',
        controller: 'AuthController'
      },
      'page': {
        templateUrl: 'profile/profile.html',
        controller: 'ProfileController'
      }
    },
    data: {
      requireLogin: true
    }
  });

  $stateProvider.state('settings', {
    url: '/settings',
    views: {
      'nav': {
        templateUrl: 'nav/nav.html',
        controller: 'AuthController'
      },
      'page': {
        templateUrl: 'settings/settings.html',
        controller: 'ProfileController'
      }
    },
    data: {
      requireLogin: true
    }
  });

  $stateProvider.state('profile.stash', {
    url: '/stash',
    views: {
      'subview': {
        templateUrl: 'profile/profile.stash.html',
        controller: 'ProfileController'
      }
    }
  });

  $stateProvider.state('profile.explore', {
    url: '/explore',
    views: {
      'subview': {
        templateUrl: 'profile/profile.exploreStash.html',
        controller: 'ProfileController'
      }
    }
  });

  $stateProvider.state('profile.recs', {
    url: '/recs',
    views: {
      'subview': {
        templateUrl: 'profile/profile.recs.html',
        controller: 'ProfileController'
      }
    }
  });

  $stateProvider.state('profile.wishlist', {
    url: '/wishlist',
    views: {
      'subview': {
        templateUrl: 'profile/profile.wishlist.html',
        controller: 'ProfileController'
      }
    }
  });

  $stateProvider.state('profile.friends', {
    url: '/friends',
    views: {
      'subview': {
        templateUrl: 'profile/profile.friends.html',
        controller: 'ProfileController'
      }
    }
  });

  $stateProvider.state('profile.blogs', {
    url: '/blogs',
    views: {
      'subview': {
        templateUrl: 'profile/profile.blogs.html',
        controller: 'ProfileController'
      }
    }
  });

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
  });

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
  });

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
});

app.run(function($rootScope, $location, $state, Auth) {
  //Listens to state change and determines if user is authenticated
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
    //If state requires authentication and user is not authenticated
    if (toState.data.requireLogin && !Auth.isAuth()) {
      //Prevent state transition from happening
      event.preventDefault();
      //Transition state to home page
      $state.go('home');
    }
  });
});

app.directive("scroll", function ($window) {
    return function(scope, element, attrs) {
        angular.element($window).bind("scroll", function() {
             if (this.pageYOffset >= 400) {
                 scope.showContent = true;
             } else {
                 scope.showContent = false;
             }
            scope.$apply();
        });
    };
});
