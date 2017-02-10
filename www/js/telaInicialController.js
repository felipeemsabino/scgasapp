angular.module('starter.controllers')

.controller('TelaInicialCtrl', ['$scope', '$stateParams', '$state', '$http', '$ionicSideMenuDelegate', '$ionicLoading', '$ionicPlatform',
function($scope, $stateParams, $state, $http, $ionicSideMenuDelegate, $ionicLoading, $ionicPlatform) {

  $scope.$on('$ionicView.beforeEnter', function (e, data) {
    //alert('tela inicial '+ window.localStorage.getItem("dadosUsuario"));
    $ionicSideMenuDelegate.canDragContent(true);

    $scope.$root.showMenuIcon = true;

    if(window.localStorage.getItem("dadosUsuario") === null || window.localStorage.getItem("dadosUsuario") === 'null'
      || window.localStorage.getItem("dadosUsuario") === '') {
        $state.go("app.user_login");
    } else {
        var user = JSON.parse(window.localStorage.getItem("dadosUsuario"));
    }
  });

  $scope.carregaRetornoInvestimento = function (){
    $state.go("app.retorno_investimento");
  };

  $scope.carregaCalcEconomia = function (){
    $state.go("app.calculadora_economia");
  };

  $scope.carregaMapa = function() {
    //$state.go("app.mapa");
    $state.go("app.mapa_postos");
  };

  $scope.init = function() {

    var customBackButton = function() {};

    // registerBackButtonAction() returns a function which can be used to deregister it
    var deregisterBackButtonAction = $ionicPlatform.registerBackButtonAction(
        customBackButton, 101
    );

    $scope.$on('$destroy', function() {
        deregisterBackButtonAction();
    });

  };
}]);
