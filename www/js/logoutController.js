angular.module('starter.controllers')

.controller('LogoutCtrl', ['$scope', '$stateParams', '$state', '$http', '$ionicPopup', '$ionicLoading','$ionicPlatform', '$location','$window',
function($scope, $stateParams, $state, $http, $ionicPopup, $ionicLoading,$ionicPlatform,$location,$window) {

  $scope.$on('$ionicView.enter', function() {
      try{
          $window.localStorage.clear();
          $state.go("app.user_login");      
      }catch(ex){
          alert(ex);
      }
  });
    
  $scope.init = function() {};

}]);
