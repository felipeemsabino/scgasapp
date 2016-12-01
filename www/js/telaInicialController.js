angular.module('starter.controllers')

.controller('TelaInicialCtrl', ['$scope', '$stateParams', '$state', '$http', '$ionicPopup', '$ionicLoading','$ionicPlatform',
function($scope, $stateParams, $state, $http, $ionicPopup, $ionicLoading,$ionicPlatform) {

  $scope.init = function() {

    var customBackButton = function() {};

    // registerBackButtonAction() returns a function which can be used to deregister it
    var deregisterBackButtonAction = $ionicPlatform.registerBackButtonAction(
        customBackButton, 101
    );

    $scope.$on('$destroy', function() {
        deregisterBackButtonAction();
    });

    if(window.localStorage.getItem("dadosUsuario") != null) {
          var user = JSON.parse(window.localStorage.getItem("dadosUsuario"));
    } else {
        $state.go("app.user_login");
    }
  };

}]);
