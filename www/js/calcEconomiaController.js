var myApp = angular.module('starter.controllers')

.controller('CalcEconomiaCtrl', ['$scope', '$stateParams', '$state', '$http', '$ionicPopup', '$ionicLoading',
'$ionicPlatform', '$location','$window', '$ionicSideMenuDelegate', '$locale',
function($scope, $stateParams, $state, $http, $ionicPopup, $ionicLoading,$ionicPlatform,$location,$window,
$ionicSideMenuDelegate, $locale) {

  $scope.parametros = {
    "precoGNV": '',
    "consumoMedioGNV": 13.2,
    "consumoMedioGasolina": 10.7,
    "consumoMedioEtanol": 7.5,
    "mostrarResultado": false,
    "resultadoGasolina": 0.0,
    "resultadoEtanol": 0.0
  };


  $scope.$on('$ionicView.afterEnter', function() {
    $ionicSideMenuDelegate.canDragContent(false)
    $scope.$root.showMenuIcon = false;

  });
  $scope.validaParametros = function () {
    if($scope.parametros.consumoMedioEtanol <= 0.00){
      window.plugins.toast.show('Valor para consumo médio de Etanol é inválido!', 'long', 'center', function(a){}, function(b){});
      return false;
    }
    if($scope.parametros.consumoMedioGNV <= 0.00){
      window.plugins.toast.show('Valor para consumo médio de GNV é inválido!', 'long', 'center', function(a){}, function(b){});
      return false;
    }
    if($scope.parametros.precoGNV <= 0.00){
      window.plugins.toast.show('Valor para preço de GNV é inválido!', 'long', 'center', function(a){}, function(b){});
      return false;
    }

    if($scope.parametros.consumoMedioGasolina <= 0.00){
      window.plugins.toast.show('Valor para consumo médio é inválido!', 'long', 'center', function(a){}, function(b){});
      return false;
    }

    return true;
  }

  $scope.calcularEconomia = function () {

    if($scope.validaParametros() == true){
      $scope.parametros.mostrarResultado = true;
      $scope.parametros.resultadoEtanol = (($scope.parametros.consumoMedioEtanol/$scope.parametros.consumoMedioGNV)*
          $scope.parametros.precoGNV).toFixed(3);
      $scope.parametros.resultadoGasolina = (($scope.parametros.consumoMedioGasolina/$scope.parametros.consumoMedioGNV)*
          $scope.parametros.precoGNV).toFixed(3);
    }

  };




}]);
