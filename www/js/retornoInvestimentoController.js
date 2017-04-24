angular.module('starter.controllers')

.controller('CalcRetornoInvestimentoCtrl', ['$scope', '$stateParams', '$state', '$http', '$ionicPopup', '$ionicLoading',
'$ionicPlatform', '$location','$window', '$ionicSideMenuDelegate', '$locale',
function($scope, $stateParams, $state, $http, $ionicPopup, $ionicLoading,$ionicPlatform,$location,$window,
$ionicSideMenuDelegate, $locale) {

  $scope.parametros = {
    "consumoMedioGNV": 13.2,      // parametro estatico
    "consumoMedioGasolina":10.7, // parametro estatico
    "consumoMedioEtanol": 7.5,    // parametro estatico
    "precoKitGNV": 3500.00,
    "valorInspecao": 250.00,
    "kmRodadoMes": 200.00,
    "precoGNV": 2.8,
    "precoGasolina": 3.9,
    "precoEtanol": 3.7
  };
  // valores para teste
  /*$scope.parametros = {
    "consumoMedioGNV": 13.2,      // parametro estatico
    "consumoMedioGasolina": 10.7, // parametro estatico
    "consumoMedioEtanol": 7.5,    // parametro estatico
    "precoKitGNV": 3500,
    "valorInspecao": 250,
    "kmRodadoMes": 200,
    "precoGNV": 2.8,
    "precoGasolina": 3.9,
    "precoEtanol": 3.7
  };*/

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
    $('#precoGNV').maskMoney();
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
    if($scope.validaParametros() == true){
      $scope.calculaResultados();
      $state.go("app.resultado_retorno_investimento", {parametros: $scope.resultados});
    }
  };

  $scope.validaParametros = function () {
    if($scope.parametros.kmRodadoMes <= 0.00){
      window.plugins.toast.show('Valor para KM rodado mês é inválido!', 'long', 'center', function(a){}, function(b){});
      return false;
    }
    if($scope.parametros.consumoMedioGasolina <= 0.00){
      window.plugins.toast.show('Valor para consumo médio gasolina é inválido!', 'long', 'center', function(a){}, function(b){});
      return false;
    }
    if($scope.parametros.consumoMedioGNV <= 0.00){
      window.plugins.toast.show('Valor para consumo médio GNV é inválido!', 'long', 'center', function(a){}, function(b){});
      return false;
    }

    if($scope.parametros.precoGasolina <= 0.00){
      window.plugins.toast.show('Valor para preço de gasolina é inválido!', 'long', 'center', function(a){}, function(b){});
      return false;
    }

    if($scope.parametros.precoGNV <= 0.00){
      window.plugins.toast.show('Valor para preço de GNV é inválido!', 'long', 'center', function(a){}, function(b){});
      return false;
    }
    if($scope.parametros.precoEtanol <= 0.00){
      window.plugins.toast.show('Valor para preço de etanol é inválido!', 'long', 'center', function(a){}, function(b){});
      return false;
    }

    if($scope.parametros.gmGNV <= 0.00){
      window.plugins.toast.show('Valor GNV é inválido!', 'long', 'center', function(a){}, function(b){});
      return false;
    }

    if($scope.parametros.valorInspecao <= 0.00){
      window.plugins.toast.show('Valor para inspeção é inválido!', 'long', 'center', function(a){}, function(b){});
      return false;
    }

//Etanol falta validar
    if($scope.parametros.precoKitGNV <= 0.00){
      window.plugins.toast.show('Valor para Kit GNV é inválido!', 'long', 'center', function(a){}, function(b){});
      return false;
    }


    if($scope.parametros.consumoMedioEtanol <= 0.00){
      window.plugins.toast.show('Valor para Etanol é inválido!', 'long', 'center', function(a){}, function(b){});
      return false;
    }


    return true;
  }


  $scope.calculaResultados = function () {



        // consumo mensal gasolina
      $scope.resultados.cmGasolina = ($scope.parametros.kmRodadoMes/$scope.parametros.consumoMedioGasolina).toFixed(3);
        // consumo mensal GNV
      $scope.resultados.cmGNV = ($scope.parametros.kmRodadoMes/$scope.parametros.consumoMedioGNV).toFixed(3);
       // consumo mensal etanol
      $scope.resultados.cmEtanol = ($scope.parametros.kmRodadoMes/$scope.parametros.consumoMedioEtanol).toFixed(3);
        // gasto mensal gasolina
      $scope.resultados.gmGasolina = ($scope.resultados.cmGasolina*$scope.parametros.precoGasolina).toFixed(3);
        // gasto mensal GNV
      $scope.resultados.gmGNV = ($scope.resultados.cmGNV*$scope.parametros.precoGNV).toFixed(3);
        // gasto mensal etanol
      $scope.resultados.gmEtanol = ($scope.resultados.cmEtanol*$scope.parametros.precoEtanol).toFixed(3);
        // custo por km gasolina
      $scope.resultados.cpkmGasolina = ($scope.resultados.gmGasolina/$scope.parametros.kmRodadoMes).toFixed(3);
        // custo por km GNV
      $scope.resultados.cpkmGNV = ($scope.resultados.gmGNV/$scope.parametros.kmRodadoMes).toFixed(3);
        // custo por km etanol
      $scope.resultados.cpkmEtanol = ($scope.resultados.gmEtanol/$scope.parametros.kmRodadoMes).toFixed(3);
        // economia mensal gasolina
      $scope.resultados.emGasolina = ($scope.resultados.gmGasolina-$scope.resultados.gmGNV).toFixed(3);
        // economia mensal etanol
      $scope.resultados.emEtanol = ($scope.resultados.gmEtanol-$scope.resultados.gmGNV).toFixed(3);
        // tempo retorno gasolina
      $scope.resultados.trGasolina = (($scope.parametros.precoKitGNV + $scope.parametros.valorInspecao)/$scope.resultados.emGasolina).toFixed(3);
        // tempo retorno etanol
      $scope.resultados.trEtanol =   (($scope.parametros.precoKitGNV + $scope.parametros.valorInspecao)/$scope.resultados.emEtanol).toFixed(3);
  };
}]);
