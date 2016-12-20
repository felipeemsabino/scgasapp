// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ngCordova', 'starter.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    setupPush();
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

   .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.user_login', {
    url: '/user_login',
    views: {
      'menuContent': {
        templateUrl: 'templates/user_login.html',
        controller: 'LoginCtrl'
      }
    }
  })

  .state('app.new_account', {
    url: '/new_account',
    views: {
      'menuContent': {
        templateUrl: 'templates/new_account.html',
        controller: 'NovaContaCtrl'
      }
    }
  })

  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html'
      }
    }
  })

  .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html'
        }
      }
    })
    .state('app.playlists', {
      url: '/playlists',
      views: {
        'menuContent': {
          templateUrl: 'templates/playlists.html',
          controller: 'TelaInicialCtrl'
        }
      }
    })

  .state('app.single', {
    url: '/playlists/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlist.html',
        controller: 'PlaylistCtrl'
      }
    }
  })
  .state('app.sair', {
    url: '/sair',
    views: {
      'menuContent': {
        templateUrl: 'templates/sair.html',
        controller: 'LogoutCtrl'
      }
    }
  })

	.state('app.recuperar_senha', {
		url: '/recuperar_senha',
		views: {
			'menuContent': {
				templateUrl: 'templates/recuperar_senha.html',
				controller: 'RecuperarSenhaCtrl'
			}
		}
	})
	
	.state('app.mapa', {
		url: '/mapa',
		views: {
		  'menuContent': {
			templateUrl: 'templates/mapa.html',
			controller: 'MapaCtrl'
		  }
		}
});
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/playlists');
});


