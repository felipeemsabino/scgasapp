angular.module('starter.controllers')

.controller('RecuperarSenhaCtrl', ['$scope', '$stateParams', '$state', '$http', '$ionicPopup', '$ionicLoading',
function($scope, $stateParams, $state, $http, $ionicPopup, $ionicLoading) {

  $scope.$on('$ionicView.enter', function() {
    $scope.pin_received = false;
    $scope.user = {};
    $scope.user.email = "";
    $scope.user.pinSenha = "";
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

  $scope.recuperaPin = function() {
    //window.plugins.toast.show('recuperaPin=> '+JSON.stringify({data2: user}), 'long', 'center', function(a){}, function(b){});

    if($scope.user.email == ""){
      window.plugins.toast.show('Favor informar um email válido!', 'long', 'center', function(a){}, function(b){});
      return;
    }

    //alert(JSON.stringify({data2: $scope.user}));
    $scope.show();

		var response = $http.get('http://ec2-52-67-37-24.sa-east-1.compute.amazonaws.com:8080/scgas/rest/usuarioservice/geraPinSenha/'+$scope.user.email);

    // Response retornado com sucesso
    response.success(function(data, status, headers, config) {
      $scope.hide();

      window.plugins.toast.show('PIN para recuperação de senha foi enviado no email informado!', 'long', 'center', function(a){}, function(b){});

      $scope.pin_received = true;
		});

    // Response retornado com erros
		response.error(function(data, status, headers, config) {
        $scope.hide();

		   var errorMessage = 'Usuário não encontrado!';
		   if(status == 500)
			   errorMessage = 'Problemas com o servidor. Tente novamente mais tarde.';

        window.plugins.toast.show(errorMessage, 'long', 'center', function(a){}, function(b){});
		});
  };

  $scope.recuperaSenha = function() {
   // window.plugins.toast.show('recuperaSenha=> '+JSON.stringify({data2: user}), 'long', 'center', function(a){}, function(b){});

    if($scope.user.email == ""){
      window.plugins.toast.show('Favor informar um email válido!', 'long', 'center', function(a){}, function(b){});
      return;
    } else if($scope.user.pinSenha == ""){
      window.plugins.toast.show('Favor digitar o PIN enviado no email de cadastro!', 'long', 'center', function(a){}, function(b){});
      return;
    }

    $scope.show();

    var response = $http.post('http://ec2-52-67-37-24.sa-east-1.compute.amazonaws.com:8080/scgas/rest/usuarioservice/recuperaSenhaPorPIN',$scope.user);

    // Response retornado com sucesso
    response.success(function(data, status, headers, config) {
      $scope.hide();

      window.plugins.toast.show('Recuperação de senha realizada com sucesso!', 'long', 'center', function(a){}, function(b){});

      $state.go("app.playlists");
    });

    // Response retornado com erros
    response.error(function(data, status, headers, config) {
      $scope.hide();

      window.plugins.toast.show('Não foi possível recuperar a senha!', 'long', 'center', function(a){}, function(b){});
    });
  };
}]);
