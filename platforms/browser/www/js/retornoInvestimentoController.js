angular.module('starter.controllers')

.controller('CalcRetornoInvestimentoCtrl', ['$scope', '$stateParams', '$state', '$http', '$ionicPopup', '$ionicLoading',
'$ionicPlatform', '$location','$window', '$ionicSideMenuDelegate', '$locale',
function($scope, $stateParams, $state, $http, $ionicPopup, $ionicLoading,$ionicPlatform,$location,$window,
$ionicSideMenuDelegate, $locale) {

  $scope.parametros = {
    "consumoMedioGNV": 13.2,      // parametro estatico
    "consumoMedioGasolina": 10.7, // parametro estatico
    "consumoMedioEtanol": 7.5,    // parametro estatico
    "precoKitGNV": 3500,
    "kmRodadoMes": 200,
    "precoGNV": 2.8,
    "precoGasolina": 3.9,
    "precoEtanol": 3.7
  };

  $scope.resultados = {
    "cmGasolina": 0.0,
    "cmGNV": 0.0,
    "cmEtanol": 0.0,
    "gmGasolina": 0.0,
    "gmGNV": 0.0,
    "gmEtanol": 0.0,
    "cpkmGasolina": 0.0,
    "cpkmGNV": 0.0,
    "cpkmEtanol": 0.0,
    "emGasolina": 0.0,
    "emEtanol": 0.0,
    "trGasolina": 0.0,
    "trEtanol": 0.0
  };

  $scope.$on('$ionicView.afterEnter', function() {
    $ionicSideMenuDelegate.canDragContent(false)
    $scope.$root.showMenuIcon = false;

  /**  alert('Mascara valores');
    $('#precoGNC').maskMoney();
    $('#precoGasolina').maskMoney();
    $('#prcEtanol').maskMoney();
    $('#prcKitGnv').maskMoney();
    $('#kmMes').maskMoney();
    $('#csmMedioGnv').maskMoney();
    $('#csmMedioGasolina').maskMoney();
    $('#csmMedioEtanol').maskMoney();
*/
  });

  $scope.calcularEconomia = function () {
    $scope.calculaResultados();
    $state.go("app.resultado_retorno_investimento", {parametros: $scope.resultados});
  };
  $scope.calculaResultados = function () {

        // consumo mensal gasolina
      $scope.resultados.cmGasolina = ($scope.parametros.kmRodadoMes/$scope.parametros.consumoMedioGasolina).toFixed(2);
        // consumo mensal GNV
      $scope.resultados.cmGNV = ($scope.parametros.kmRodadoMes/$scope.parametros.consumoMedioGNV).toFixed(2);
       // consumo mensal etanol
      $scope.resultados.cmEtanol = ($scope.parametros.kmRodadoMes/$scope.parametros.consumoMedioEtanol).toFixed(2);
        // gasto mensal gasolina
      $scope.resultados.gmGasolina = ($scope.resultados.cmGasolina*$scope.parametros.precoGasolina).toFixed(2);
        // gasto mensal GNV
      $scope.resultados.gmGNV = ($scope.resultados.cmGNV*$scope.parametros.precoGNV).toFixed(2);
        // gasto mensal etanol
      $scope.resultados.gmEtanol = ($scope.resultados.cmEtanol*$scope.parametros.precoEtanol).toFixed(2);
        // custo por km gasolina
      $scope.resultados.cpkmGasolina = ($scope.resultados.gmGasolina/$scope.parametros.kmRodadoMes).toFixed(2);
        // custo por km GNV
      $scope.resultados.cpkmGNV = ($scope.resultados.gmGNV/$scope.parametros.kmRodadoMes).toFixed(2);
        // custo por km etanol
      $scope.resultados.cpkmEtanol = ($scope.resultados.gmEtanol/$scope.parametros.kmRodadoMes).toFixed(2);
        // economia mensal gasolina
      $scope.resultados.emGasolina = ($scope.resultados.gmGasolina-$scope.resultados.gmGNV).toFixed(2);
        // economia mensal etanol
      $scope.resultados.emEtanol = ($scope.resultados.gmEtanol-$scope.resultados.gmGNV).toFixed(2);
        // tempo retorno gasolina
      $scope.resultados.trGasolina = ($scope.parametros.precoKitGNV/$scope.resultados.emGasolina).toFixed(2);
        // tempo retorno etanol
      $scope.resultados.trEtanol = ($scope.parametros.precoKitGNV/$scope.resultados.emEtanol).toFixed(2);
  };
}]);
