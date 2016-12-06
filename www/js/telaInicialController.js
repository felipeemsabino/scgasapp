angular.module('starter.controllers')

.controller('TelaInicialCtrl', ['$scope', '$stateParams', '$state', '$http', '$ionicSideMenuDelegate', '$ionicLoading', '$ionicPlatform',
function($scope, $stateParams, $state, $http, $ionicSideMenuDelegate, $ionicLoading, $ionicPlatform) {

  $scope.$on('$ionicView.beforeEnter', function (e, data) {
    /*if (data.enableBack) {
        $scope.$root.showMenuIcon = true;
    } else {*/
    //$ionicHistory.clearHistory();
    $ionicSideMenuDelegate.canDragContent(true);
    $scope.$root.showMenuIcon = true;
    //}
  });

  $scope.init = function() {


    if(window.localStorage.getItem("dadosUsuario") != 'null') {
          var user = JSON.parse(window.localStorage.getItem("dadosUsuario"));
    } else {
        $state.go("app.user_login");
    }

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
