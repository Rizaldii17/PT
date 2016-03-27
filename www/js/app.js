// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('healthy', ['ionic','healthy.services','healthy.controllers','firebase'])

.run(function(Auth,$location,$rootScope) {
    var mdlUpgradeDom = false;
    setInterval(function() {
      if (mdlUpgradeDom) {
        componentHandler.upgradeDom();
        mdlUpgradeDom = false;
      }
    }, 0);

    var observer = new MutationObserver(function () {
      mdlUpgradeDom = true;
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    Auth.$onAuth(function (authData) {
            if (authData) {
                $location.path("/dash/pasien");
            } else {
                
                $location.path('/login');
            }
    });

      $rootScope.$on("$stateChangeError", function (event, toState, toParams, fromState, fromParams, error) {
        // We can catch the error thrown when the $requireAuth promise is rejected
        // and redirect the user back to the home page
        if (error === "AUTH_REQUIRED") {
            $location.path("/login");
        }
    });


}) 

.config(function($stateProvider, $urlRouterProvider) {
  

  $stateProvider

  // setup an abstract state for the tabs directive
    
    .state('login', {
    url: '/login',
    templateUrl: 'templates/login/login.html',
    controller :'loginCtrl' ,
    resolve: {
            // controller will not be loaded until $waitForAuth resolves
            // Auth refers to our $firebaseAuth wrapper in the example above
            "currentAuth": ["Auth",
                function (Auth) {
                    // $waitForAuth returns a promise so the resolve waits for it to complete
                    return Auth.$waitForAuth();
        }]
        }
  })

     

    .state('dash', {
    url: '/dash',
    templateUrl: 'templates/dash.html',
    abstract :true,
    controller: 'AplCtrl' ,
     resolve: {
            // controller will not be loaded until $requireAuth resolves
            // Auth refers to our $firebaseAuth wrapper in the example above
            "currentAuth": ["Auth",
                function (Auth) {
                    // $requireAuth returns a promise so the resolve waits for it to complete
                    // If the promise is rejected, it will throw a $stateChangeError (see above)
                    return Auth.$requireAuth();
      }]
        }
    
  })


     .state('dash.pasien', {
    url: '/pasien',
    views: {
      'tab-dash': {
        templateUrl: 'templates/pasien/pasien.html',
        controller: 'AplCtrl'
      }
    }
  })

   .state('dash.detailpasien', {
    url: '/pasien/detail',
    views: {
      'tab-dash': {
        templateUrl: 'templates/pasien/detail-pasien.html',
        controller: 'AplCtrl'
      }
    }
  })


 .state('dash.home', {
    url: '/home',
    views: {
      'tab-dash': {
        templateUrl: 'templates/home/home.html',
        controller: 'AplCtrl'
      }
    }
  })
 

 
        .state('dash.dokter', {
    url: '/dokter',
    views: {
      'tab-dash': {
        templateUrl: 'templates/dokter/dokter.html',
        controller: 'AplCtrl'
      }
    }
  })
 
 
    .state('not404', {
    url: '/blah',
    templateUrl: 'templates/blah.html',
    controller : 'BlahCtrl'
    
  });

 $urlRouterProvider.otherwise('/blah');

});

