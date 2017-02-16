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

  $scope.calcularEconomia = function () {
    $scope.parametros.mostrarResultado = true;

    $scope.parametros.resultadoEtanol = (($scope.parametros.consumoMedioEtanol/$scope.parametros.consumoMedioGNV)*
        $scope.parametros.precoGNV).toFixed(3);
    $scope.parametros.resultadoGasolina = (($scope.parametros.consumoMedioGasolina/$scope.parametros.consumoMedioGNV)*
        $scope.parametros.precoGNV).toFixed(3);
  };




}]);
