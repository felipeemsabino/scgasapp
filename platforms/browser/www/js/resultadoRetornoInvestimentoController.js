angular.module('starter.controllers')

.controller('ResultadoRetornoInvestimentoCtrl', ['$scope', '$stateParams', '$state', '$http', '$ionicPopup', '$ionicLoading',
'$ionicPlatform', '$location','$window', '$ionicSideMenuDelegate', '$locale',
function($scope, $stateParams, $state, $http, $ionicPopup, $ionicLoading,$ionicPlatform,$location,$window,
$ionicSideMenuDelegate, $locale) {

  // parametros para montar tela de resultado
  $scope.parametros = $stateParams.parametros;
  console.log($scope.parametros);
  $scope.$on('$ionicView.afterEnter', function() {
    $ionicSideMenuDelegate.canDragContent(false)
    $scope.$root.showMenuIcon = false;
  });
}]);
