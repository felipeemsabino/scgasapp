angular.module('starter.controllers')

.controller('TelaInicialCtrl', ['$scope', '$stateParams', '$state', '$http', '$ionicPopup', '$ionicLoading',
function($scope, $stateParams, $state, $http, $ionicPopup, $ionicLoading) {

  $scope.init = function() {
    if(window.localStorage.getItem("dadosUsuario") != null) {
          var user = JSON.parse(window.localStorage.getItem("dadosUsuario"));
    } else {
        $state.go("app.user_login");
    }
  };

}]);
