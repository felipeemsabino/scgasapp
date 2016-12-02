angular.module('starter.controllers')

.controller('RecuperarSenhaCtrl', ['$scope', '$stateParams', '$state', '$http', '$ionicPopup', '$ionicLoading',
function($scope, $stateParams, $state, $http, $ionicPopup, $ionicLoading) {
  $scope.pin_received = false;

  $scope.user = {
    email: "",
    pinSenha: ""
  };

  $scope.init = function() {};

  $scope.recuperaPin = function(user) {
    //window.plugins.toast.show('recuperaPin=> '+JSON.stringify({data2: user}), 'long', 'center', function(a){}, function(b){});

    $ionicLoading.show({
      template: 'Carregando...'
    });

    if(user.email == ""){
      $ionicLoading.hide();
      window.plugins.toast.show('Favor informar um email válido!', 'long', 'center', function(a){}, function(b){});
      return;
    }

		var response = $http.get('http://ec2-52-67-37-24.sa-east-1.compute.amazonaws.com:8080/scgas/rest/usuarioservice/geraPinSenha/'+user.email, {timeout: 5000});

    // Response retornado com sucesso
    response.success(function(data, status, headers, config) {

      window.plugins.toast.show('PIN para recuperação de senha foi enviado no email informado!', 'long', 'center', function(a){}, function(b){});

      $ionicLoading.hide();

      $scope.pin_received = true;
		});

    // Response retornado com erros
		response.error(function(data, status, headers, config) {
			   var errorMessage = 'Usuário não encontrado!';
			   if(status == 500)
				   errorMessage = 'Problemas com o servidor. Tente novamente mais tarde.';

        $ionicLoading.hide();

        window.plugins.toast.show(errorMessage, 'long', 'center', function(a){}, function(b){});
		});
    $ionicLoading.hide();

  };

  $scope.recuperaSenha = function(user) {
   // window.plugins.toast.show('recuperaSenha=> '+JSON.stringify({data2: user}), 'long', 'center', function(a){}, function(b){});

    $ionicLoading.show({
      template: 'Carregando...'
    });

    if(user.email == ""){
      $ionicLoading.hide();
      window.plugins.toast.show('Favor informar um email válido!', 'long', 'center', function(a){}, function(b){});
      return;
    } else if(user.pinSenha == ""){
              $ionicLoading.hide();
              window.plugins.toast.show('Favor digitar o PIN enviado no email de cadastro!', 'long', 'center', function(a){}, function(b){});
              return;
            }

    var response = $http.post('http://ec2-52-67-37-24.sa-east-1.compute.amazonaws.com:8080/scgas/rest/usuarioservice/recuperaSenhaPorPIN',user);

    // Response retornado com sucesso
    response.success(function(data, status, headers, config) {

      window.plugins.toast.show('Recuperação de senha realizada com sucesso!', 'long', 'center', function(a){}, function(b){});
     
      $ionicLoading.hide();

      $state.go("app.playlists");
    });

    // Response retornado com erros
    response.error(function(data, status, headers, config) {
         var errorMessage = 'Não foi possível recuperar a senha!';
         
        $ionicLoading.hide();

        window.plugins.toast.show(errorMessage, 'long', 'center', function(a){}, function(b){});
    });
    $ionicLoading.hide();
  };

}]);
