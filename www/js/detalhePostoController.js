angular.module('starter.controllers')

.controller('DetalhePostoCtrl', ['$scope', '$state', '$cordovaGeolocation', '$ionicLoading', '$http', '$stateParams',

function($scope, $state, $cordovaGeolocation, $ionicLoading, $http, $stateParams) {

  $scope.posto = $stateParams.paramPosto;

  if(!$scope.posto.preco)
      $scope.posto.preco = 0.000;

  $scope.atualizarPrecoPosto = function () {
    var storedUser = JSON.parse(window.localStorage.getItem("dadosUsuario"));
    var postParams = {
      "posto":{"id": $scope.posto.id},
      "usuario":{"id": storedUser.id},
      "valorGNV":$scope.posto.preco
    };
    
    var response = $http.post(
      'http://ec2-52-67-37-24.sa-east-1.compute.amazonaws.com:8080/scgas/rest/postoservice/atualizaPrecoCombustivel',
      postParams);
    response.success(function(data, status, headers, config) {
      alert('Preço atualizado com sucesso!');
      alert('Retorno -> ' + JSON.stringify({data2: data}));
    });
    response.error(function(data, status, headers, config) {
      window.plugins.toast.show('Ocorreram erros ao atualizar preço do gás. Tente novamente!', 'long', 'center', function(a){}, function(b){});
      alert('Erro -> ' + JSON.stringify({data2: data}));
    });
  };
}]);
