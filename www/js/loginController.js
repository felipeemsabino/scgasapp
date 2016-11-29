angular.module('starter.controllers')

.controller('LoginCtrl', ['$scope', '$stateParams', '$state', '$http', '$ionicPopup', '$ionicLoading',
function($scope, $stateParams, $state, $http, $ionicPopup, $ionicLoading) {
  $scope.list = [];
  $scope.user = {
    email: "",
    senha: ""
  };
	$scope.init = function() {
    $ionicLoading.show({
      template: 'Carregando...'
    });

    if(window.localStorage.getItem("dadosUsuario") != null) {
      var user = JSON.parse(window.localStorage.getItem("dadosUsuario"));
      //$state.go("app.playlists");
    } else {
      //alert('Nada encontrado no localStorage');
    }
    $ionicLoading.hide();
  };

  /*
  * Executa a autenticação do usuário no servidor.
  */
	$scope.submit = function(user) {
    //alert('submit');
    $ionicLoading.show({
      template: 'Carregando...'
    });

		var response = $http.post('http://ec2-52-67-37-24.sa-east-1.compute.amazonaws.com:8080/scgas/rest/usuarioservice/autentica', user);

    // Response retornado com sucesso
    response.success(function(data, status, headers, config) {

      window.localStorage.setItem("dadosUsuario", data); // Sobrescreve registro de login

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

    if(window.localStorage.getItem("dadosUsuario") != null) {

          var user = JSON.parse(window.localStorage.getItem("dadosUsuario"));
          if(user.tokenFacebook == null || user.tokenFacebook == "") {
            window.plugins.toast.show('Usuário não cadastrado via Facebook!', 'long', 'center', function(a){}, function(b){});
          } else {
            var response = $http.get('http://ec2-52-67-37-24.sa-east-1.compute.amazonaws.com:8080/scgas/rest/usuarioservice/autenticaFacebook/'+user.tokenFacebook, {timeout: 5000});
            response.success(function(data, status, headers, config) {
              //alert('Login realizado com sucesso! -> '+JSON.stringify({data2: data}));
              $ionicLoading.hide();

              $state.go("app.playlists");
            });
            response.error(function(data, status, headers, config) {
              //alert(JSON.stringify({data2: data}));
              $ionicLoading.hide();

              window.plugins.toast.show('Erro ao realizar login utilizando Facebook!', 'long', 'center', function(a){}, function(b){});
            });
          }
    } else {
        $state.go("app.user_login");
    }
    $ionicLoading.hide();
	};
  $scope.doGoogleLogin = function() {

    //alert('doGoogleLogin');

		$ionicLoading.show({
		  template: 'Carregando...'
		});

    if(window.localStorage.getItem("dadosUsuario") != null) {

          var user = JSON.parse(window.localStorage.getItem("dadosUsuario"));
          //alert('buscou info do storage'+JSON.stringify({data2: user}));

          if(user.tokenGmail == null || user.tokenGmail == "") {
            window.plugins.toast.show('Usuário não cadastrado via GooglePlus!', 'long', 'center', function(a){}, function(b){});
          } else {
            var response = $http.get('http://ec2-52-67-37-24.sa-east-1.compute.amazonaws.com:8080/scgas/rest/usuarioservice/autenticaGmail/'+user.tokenGmail, {timeout: 5000});
            response.success(function(data, status, headers, config) {
              //alert('Sucesso' + JSON.stringify({data2: data}));
              $ionicLoading.hide();

              $state.go("app.playlists");
        		});
        		response.error(function(data, status, headers, config) {
              //alert(JSON.stringify({data2: data}));
              $ionicLoading.hide();

              window.plugins.toast.show('Erro ao realizar login utilizando GooglePlus!', 'long', 'center', function(a){}, function(b){});
        		});
          }
    } else {
        $state.go("app.user_login");
    }
    $ionicLoading.hide();
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
