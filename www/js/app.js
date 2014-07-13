angular.module('botaniser', ['ionic', 'botaniser.controllers', 'botaniser.services'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if(window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }

        if(window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})

.config(function($stateProvider, $urlRouterProvider) {
    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    // setup an abstract state for the tabs directive
    .state('app', {
        url: "/app",
        abstract: true,
        templateUrl: "templates/tabs.html"
    })

    // Each tab has its own nav history stack:
    .state('app.home', {
        url: '/home',
        views: {
            'app-home': {
                templateUrl: 'templates/home.html',
                controller: 'HomeCtrl'
            }
        }
    })

    // Each tab has its own nav history stack:
    .state('app.entry', {
        url: '/entry',
        views: {
            'app-entry': {
                templateUrl: 'templates/entry.html',
                controller: 'EntryCtrl'
            }
        }
    })

    // Species near me and details page
    .state('app.species', {
        url: '/speciesList',
        views: {
            'app-species': {
                templateUrl: 'templates/species.html',
                controller: 'SpeciesCtrl'
            }
        }
    })
    .state('app.species-detail', {
        url: '/species/:speciesId',
        views: {
            'app-species': {
                templateUrl: 'templates/species-detail.html',
                controller: 'SpeciesDetailCtrl'
            }
        }
    })

    .state('app.leaderboard', {
        url: '/leaderboard',
        views: {
            'app-leaderboard': {
                templateUrl: 'templates/leaderboard.html',
                controller: 'LeaderboardCtrl'
            }
        }
    })

    .state('app.about', {
        url: '/about',
        views: {
            'app-about': {
                templateUrl: 'templates/about.html',
                controller: 'AboutCtrl'
            }
        }
    })

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/home');
});

