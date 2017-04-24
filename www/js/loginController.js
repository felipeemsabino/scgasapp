angular.module('starter.controllers')

.controller('LoginCtrl', ['$scope', '$stateParams', '$state', '$http', '$ionicPopup', '$ionicLoading', '$ionicSideMenuDelegate', '$ionicHistory',

function($scope, $stateParams, $state, $http, $ionicPopup, $ionicLoading, $ionicSideMenuDelegate, $ionicHistory) {
  $scope.list = [];
  $scope.user = {
    email: "",
    senha: ""
  };

  $ionicSideMenuDelegate.canDragContent(false);
  $scope.$on('$ionicView.beforeEnter', function (e, data) {
    $scope.$root.showMenuIcon = false;

    $scope.user = {
        email: "",
        senha: ""
    };
  });

  // Associando configuração da tela de carregando para o escopo
  $scope.show = function() {
    $ionicLoading.show({
      template: 'Carregando...',
      duration: 5000
    }).then(function(){});
  };
  $scope.hide = function(){
    $ionicLoading.hide().then(function(){});
  };

	$scope.init = function() {};

  /*
  * Executa a autenticação do usuário no servidor.
  */
	$scope.submitLogin = function() {
    //alert('submit2');
    $scope.show();
		var response = $http.post($scope.defaultURL+'/scgas/rest/usuarioservice/autentica', $scope.user);

    // Response retornado com sucesso
    response.success(function(data, status, headers, config) {
      $scope.hide();
     // alert('Login Normal realizado com sucesso! -> '+JSON.stringify({data2: data}));
      window.localStorage.setItem("dadosUsuario", JSON.stringify(data)); // Sobrescreve registro de login

      window.plugins.toast.show('Login realizado com sucesso!', 'long', 'center', function(a){}, function(b){});

      $state.go("app.playlists");
		});

    // Response retornado com erros
		response.error(function(data, status, headers, config) {
      $scope.hide();

      var errorMessage = 'Usuário e/ou senha inválidos. Verifique os dados e tente novamente!';
      if(status == 500)
        errorMessage = 'Problemas com o servidor. Tente novamente mais tarde.';

      window.plugins.toast.show(errorMessage, 'long', 'center', function(a){}, function(b){});
		});
	};

  /*
  * Executa a autenticação do usuário no servidor utilizando o Facebook.
  */
	$scope.doFacebookLogin = function() {

    //alert('doFacebookLogin');

    facebookConnectPlugin.login(["email"], function(response) {
      //alert('chegou response'+JSON.stringify({data: response}));
      if (response.authResponse) {
        //alert('chegou response.authResponse');
        facebookConnectPlugin.api('/me', null,
        function(response) {
          //alert('Dados recuperados do FB para Login,' +JSON.stringify({data: response}));
          $scope.show();

          var responseAutentica = $http.get($scope.defaultURL+'/scgas/rest/usuarioservice/autenticaFacebook/'+response.id, {timeout: 5000});
          responseAutentica.success(function(data, status, headers, config) {
            $scope.hide();

          //  alert('Login realizado com sucesso! -> '+JSON.stringify({data2: data}));

            window.localStorage.setItem("dadosUsuario", JSON.stringify(data)); // Sobrescreve registro de login
            $state.go("app.playlists");
          });
          responseAutentica.error(function(data, status, headers, config) {
            $scope.hide();

            //alert(JSON.stringify({data2: data}));
            if(status == 500){
              window.plugins.toast.show('Erro ao realizar login utilizando Facebook!', 'long', 'center', function(a){}, function(b){});
            } else if(status == 404) { // usuario nao encontrado, entao faz cadastro ***NOVO FLUXO***
              // Parte 1 - Recupera dados do usuario e seta no json
              var newUserData = {};
              var storedUser = JSON.parse(window.localStorage.getItem("dadosUsuario"));
              newUserData.nome = response.name;
              newUserData.email = response.email != null ? response.email : "";
              newUserData.tokenFacebook = response.id;
              //alert(JSON.stringify({newUserData2: newUserData}));

              // Parte 2 - Cadastra o usuário chamando o serviço de cadastro.
              $scope.show();

              var responseCadastroUsuario = $http.post(
                $scope.defaultURL+'/scgas/rest/usuarioservice/cadastrarusuario',
                newUserData);
                responseCadastroUsuario.success(function(data, status, headers, config) {
                  $scope.hide();

                  window.localStorage.setItem("dadosUsuario", JSON.stringify(data));

                  window.plugins.toast.show('Dados inseridos com sucesso!', 'long', 'center', function(a){}, function(b){});

                  var navegarTelaInicial = window.localStorage.getItem("dadosUsuario") == null ? false : true;

                  if(navegarTelaInicial)
                    $state.go("app.playlists");
                });
                responseCadastroUsuario.error(function(data, status, headers, config) {
                  $scope.hide();

                  window.plugins.toast.show('Ocorreram erros ao cadastrar usuário. Tente novamente!', 'long', 'center', function(a){}, function(b){});
                  //alert('Erro -> ' + JSON.stringify({data2: data}));
                });
            }
          });
        });
      }
    });
	};

  $scope.doGoogleLogin = function() {

    window.plugins.googleplus.login( {},
      function (obj) {
        //alert('Dados recuperados do G+ para Login, ' + JSON.stringify({data: obj}));
        $scope.show();
        var response = $http.get($scope.defaultURL+'/scgas/rest/usuarioservice/autenticaGmail/'+obj.userId);
        response.success(function(data, status, headers, config) {
          $scope.hide();

          //alert('Sucesso' + JSON.stringify({data2: data}));
          window.localStorage.setItem("dadosUsuario", JSON.stringify(data)); // Sobrescreve registro de login
          $state.go("app.playlists");
        });
        response.error(function(data, status, headers, config) {
          $scope.hide();

          //alert(JSON.stringify({data2: data}));
          //alert(status);alert(JSON.stringify({status2: status}));
          if(status == 500) {
            window.plugins.toast.show('Erro ao realizar login utilizando GooglePlus!', 'long', 'center', function(a){}, function(b){});
          } else if(status == 404) { // usuario nao encontrado, entao faz cadastro ***NOVO FLUXO***

            // Parte 1 - Recupera dados do usuario e seta no json
            var newUserData = {};
            var storedUser = JSON.parse(window.localStorage.getItem("dadosUsuario"));
            newUserData.nome = obj.displayName;
            newUserData.email = obj.email;
            newUserData.tokenGmail = obj.userId;

            //alert(JSON.stringify({status2: newUserData}));
            // Parte 2 - Cadastra o usuário chamando o serviço de cadastro.
            $scope.show();
            var responseCadastroUsuario = $http.post($scope.defaultURL+'/scgas/rest/usuarioservice/cadastrarusuario', newUserData);
            responseCadastroUsuario.success(function(data, status, headers, config) {
              $scope.hide();

              window.localStorage.setItem("dadosUsuario", JSON.stringify(data));

              //window.plugins.toast.show('Dados inseridos com sucesso!', 'long', 'center', function(a){}, function(b){});

              var navegarTelaInicial = window.localStorage.getItem("dadosUsuario") == null ? false : true;

              if(navegarTelaInicial)
                $state.go("app.playlists");
            });
            responseCadastroUsuario.error(function(data, status, headers, config) {
              $scope.hide();

              window.plugins.toast.show('Ocorreram erros ao cadastrar usuário. Tente novamente!', 'long', 'center', function(a){}, function(b){});
              //alert('Erro -> ' + JSON.stringify({data2: data}));
            });
          }

        });
      },
      function (msg) {
        
        window.plugins.toast.show('Erro ao recuperar dados do Google+!', 'long', 'center', function(a){}, function(b){});
        //alert('Erro ao trazer dados do Google+, ' + JSON.stringify({data: msg}));
      }
    );
    $scope.submit($scope.newUserData);
	};

  $scope.cadastrarUsuario = function() {
    //alert('cadastrarUsuario');
    $state.go("app.new_account");
  };

  $scope.recuperarSenha = function() {
    //alert('recuperarSenha');
    $state.go("app.recuperar_senha");
  };
}]);
