angular.module('starter.controllers')

.controller('LoginCtrl', ['$scope', '$stateParams', '$state', '$http', '$ionicPopup', '$ionicLoading',
function($scope, $stateParams, $state, $http, $ionicPopup, $ionicLoading) {
  $scope.list = [];
  $scope.user = {
    email: "",
    senha: ""
  };
	$scope.init = function() {

    /*$ionicLoading.show({
      template: 'Carregando...'
    });

    if(window.localStorage.getItem("dadosUsuario") != null) {
      $ionicLoading.hide();
      var user = JSON.parse(window.localStorage.getItem("dadosUsuario"));

      $state.go("app.playlists");
    } else {
      //alert('Nada encontrado no localStorage');
    }
    $ionicLoading.hide();*/
  };

  /*
  * Executa a autenticação do usuário no servidor.
  */
	$scope.submitLogin = function() {
    alert('submit2');
    $ionicLoading.show({
      template: 'Carregando...'
    });

		var response = $http.post('http://ec2-52-67-37-24.sa-east-1.compute.amazonaws.com:8080/scgas/rest/usuarioservice/autentica', $scope.user);

    // Response retornado com sucesso
    response.success(function(data, status, headers, config) {

      window.localStorage.setItem("dadosUsuario", JSON.stringify(data)); // Sobrescreve registro de login

      window.plugins.toast.show('Login realizado com sucesso!', 'long', 'center', function(a){}, function(b){});

      $ionicLoading.hide();

      $state.go("app.playlists");
		});

    // Response retornado com erros
		response.error(function(data, status, headers, config) {
			   var errorMessage = 'Usuário e/ou senha inválidos. Verifique os dados e tente novamente!';
			   if(status == 500)
				   errorMessage = 'Problemas com o servidor. Tente novamente mais tarde.';

        $ionicLoading.hide();

        window.plugins.toast.show(errorMessage, 'long', 'center', function(a){}, function(b){});
		});
	};

  /*
  * Executa a autenticação do usuário no servidor utilizando o Facebook.
  */
	$scope.doFacebookLogin = function() {

    //alert('doFacebookLogin');

		$ionicLoading.show({
		  template: 'Carregando...'
		});

    facebookConnectPlugin.login(["email"], function(response) {
      //alert('chegou response'+JSON.stringify({data: response}));
      if (response.authResponse) {
        //alert('chegou response.authResponse');
        facebookConnectPlugin.api('/me', null,
        function(response) {
          //alert('Dados recuperados do FB para Login,' +JSON.stringify({data: response}));
          var response = $http.get('http://ec2-52-67-37-24.sa-east-1.compute.amazonaws.com:8080/scgas/rest/usuarioservice/autenticaFacebook/'+response.id, {timeout: 5000});
          response.success(function(data, status, headers, config) {
            //alert('Login realizado com sucesso! -> '+JSON.stringify({data2: data}));
            $ionicLoading.hide();
            window.localStorage.setItem("dadosUsuario", JSON.stringify(data)); // Sobrescreve registro de login
            $state.go("app.playlists");
          });
          response.error(function(data, status, headers, config) {
            //alert(JSON.stringify({data2: data}));
            $ionicLoading.hide();
            window.plugins.toast.show('Erro ao realizar login utilizando Facebook!', 'long', 'center', function(a){}, function(b){});
          });
        });
      }
    });
    $ionicLoading.hide();
	};

  $scope.doGoogleLogin = function() {

		$ionicLoading.show({
		  template: 'Carregando...'
		});

    window.plugins.googleplus.login( {},
      function (obj) {
        //alert('Dados recuperados do G+ para Login, ' + JSON.stringify({data: obj}));

        var response = $http.get('http://ec2-52-67-37-24.sa-east-1.compute.amazonaws.com:8080/scgas/rest/usuarioservice/autenticaGmail/'+obj.userId, {timeout: 5000});
        response.success(function(data, status, headers, config) {
          //alert('Sucesso' + JSON.stringify({data2: data}));
          $ionicLoading.hide();
          window.localStorage.setItem("dadosUsuario", JSON.stringify(data)); // Sobrescreve registro de login
          $state.go("app.playlists");
        });
        response.error(function(data, status, headers, config) {
          //alert(JSON.stringify({data2: data}));
          $ionicLoading.hide();
          window.plugins.toast.show('Erro ao realizar login utilizando GooglePlus!', 'long', 'center', function(a){}, function(b){});
        });
      },
      function (msg) {
        window.plugins.toast.show('Erro ao recuperar dados do Google+!', 'long', 'center', function(a){}, function(b){});
        //alert('Erro ao trazer dados do Google+, ' + JSON.stringify({data: msg}));
      }
    );

    $ionicLoading.hide();
    $scope.submit($scope.newUserData);
	};

  $scope.cadastrarUsuario = function() {
    //alert('cadastrarUsuario');

    $ionicLoading.show({
      template: 'Carregando...'
    });

    $state.go("app.new_account");

    $ionicLoading.hide();
  };

  $scope.recuperarSenha = function() {
    //alert('recuperarSenha');

    $ionicLoading.show({
      template: 'Carregando...'
    });

    $state.go("app.recuperar_senha");

    $ionicLoading.hide();
  };
}]);
