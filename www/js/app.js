// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ngCordova', 'starter.controllers', 'ion-google-place','ui.utils.masks'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)

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

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  $ionicConfigProvider.tabs.position('top');

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

  .state('app.mapa_postos', {
    url: '/mapa_postos',
    views: {
      'menuContent': {
        templateUrl: 'templates/mapa_postos.html',
        controller: 'MapaPostosCtrl'
      }
    }
  })

  .state('app.mapa_detalhe_posto', {
    url: '/mapa_detalhe_posto',
    params: {paramPosto: null},
    views: {
      'menuContent': {
        templateUrl: 'templates/mapa_detalhe_posto.html',
        controller: 'MapaDetalhePostoCtrl'
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
          templateUrl: 'templates/playlists_atualizado.html',
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
  .state('app.calculadora_economia', {
    url: '/calculadora_economia',
    views: {
      'menuContent': {
        templateUrl: 'templates/calculadora_economia.html',
        controller: 'CalcEconomiaCtrl'
      }
    }
  })
  .state('app.retorno_investimento', {
    url: '/retorno_investimento',
    views: {
      'menuContent': {
        templateUrl: 'templates/retorno_investimento.html',
        controller: 'CalcRetornoInvestimentoCtrl'
      }
    }
  })
  .state('app.resultado_retorno_investimento', {
      url: '/resultado_retorno_investimento',
      params: {parametros: null},
      views: {
        'menuContent': {
          templateUrl: 'templates/resultado_retorno_investimento.html',
          controller: 'ResultadoRetornoInvestimentoCtrl'
        }
      }
    })

    .state('app.lista_noticias', {
      url: '/lista_noticias',
      params: {parametros: null},
      views: {
        'menuContent': {
          templateUrl: 'templates/lista_noticias.html',
          controller: 'NoticiasCtrl'
        }
      }
    })
    .state('app.detalhe_noticia', {
      url: '/detalhe_noticia',
      params: {paramNoticia: null},
      views: {
        'menuContent': {
          templateUrl: 'templates/detalheNoticia.html',
          controller: 'DetalheNoticiaCtrl'
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
	});
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/playlists');
});
