angular.module('starter.controllers')

.controller('FaleConoscoCtrl',  ['$scope', '$stateParams', '$state', '$http', '$ionicPopup', '$ionicLoading', '$ionicSideMenuDelegate', '$ionicHistory',

function($scope, $stateParams, $state, $http, $ionicPopup, $ionicLoading, $ionicSideMenuDelegate, $ionicHistory) {

  $scope.message = {
    titulo: "",
    textoContato: ""
  };

  $scope.$on('$ionicView.afterEnter', function() {
    $ionicSideMenuDelegate.canDragContent(false)
    $scope.$root.showMenuIcon = false;
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

  $scope.submitMessage = function () {
    //alert('submit2');
    $scope.show();
		var response = $http.post($scope.defaultURL+'/scgas/rest/noticiasservice/contato', $scope.message);

    // Response retornado com sucesso
    response.success(function(data, status, headers, config) {
      $scope.hide();
     // alert('Login Normal realizado com sucesso! -> '+JSON.stringify({data2: data}));

      window.plugins.toast.show('Mensagem enviada com sucesso!', 'long', 'center', function(a){}, function(b){});
		});

    // Response retornado com erros
		response.error(function(data, status, headers, config) {
      $scope.hide();

      var errorMessage = 'Ocorreram erros ao enviar a mensagem. Verifique os dados e tente novamente!';
      if(status == 500)
        errorMessage = 'Problemas com o servidor. Tente novamente mais tarde.';

      window.plugins.toast.show(errorMessage, 'long', 'center', function(a){}, function(b){});
		});
  };
}]);
