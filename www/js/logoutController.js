angular.module('starter.controllers')

.controller('LogoutCtrl', ['$scope', '$stateParams', '$state', '$http', '$ionicPopup', '$ionicLoading','$ionicPlatform',
function($scope, $stateParams, $state, $http, $ionicPopup, $ionicLoading,$ionicPlatform) {

  $scope.init = function() {

      
      window.localStorage.setItem("dadosUsuario",null); // Sobrescreve registro de login
      $state.go("app.user_login");
  };

}]);

