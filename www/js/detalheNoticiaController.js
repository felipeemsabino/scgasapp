angular.module('starter.controllers')

.controller('DetalheNoticiaCtrl', ['$scope', '$stateParams', '$state', '$http', '$ionicPopup', '$ionicLoading',
'$ionicPlatform', '$location','$window', '$ionicSideMenuDelegate', '$locale',
function($scope, $stateParams, $state, $http, $ionicPopup, $ionicLoading,$ionicPlatform,$location,$window,
$ionicSideMenuDelegate, $locale) {

  // parametros para montar tela de resultado
  $scope.objNoticia = $stateParams.paramNoticia;
  $scope.$on('$ionicView.afterEnter', function() {
    $ionicSideMenuDelegate.canDragContent(false)
    $scope.$root.showMenuIcon = false;
  });
}]);
