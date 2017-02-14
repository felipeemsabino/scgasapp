angular.module('starter.controllers')
.controller('NoticiasCtrl', ['$scope', '$ionicTabsDelegate', '$stateParams', '$state', '$http', '$ionicSideMenuDelegate',
'$ionicLoading', '$ionicPlatform', '$compile', '$ionicPopup', 'orderByFilter',
function($scope, $ionicTabsDelegate, $stateParams, $state, $http, $ionicSideMenuDelegate, $ionicLoading, $ionicPlatform, $compile,
$ionicPopup, orderBy){
   
   $scope.arrNoticias = [];
    // Mostrar popup carregando
    
// Mostrar popup carregando
  $scope.show = function(popUpDuration) {
    $ionicLoading.show({
      template: 'Carregando...',
      duration: popUpDuration > 0 ? popUpDuration : 5000
    }).then(function(){});
  };

  // Ocultar popup carregando
  $scope.hide = function(){
    $ionicLoading.hide().then(function(){});
  };
  
    
  // Listener para após entrar na pagina
  $scope.$on('$ionicView.afterEnter', function (e, data) {
      
    $scope.setNavigationMode(false); // reseta navigation mode flag
    $ionicSideMenuDelegate.canDragContent(false)
    $scope.$root.showMenuIcon = false;
      $scope.show(1000);
    $scope.loadNews();

  });

  // Listener para antes de sair da pagina
  $scope.$on('$ionicView.beforeLeave', function (e, data) {
    $scope.setNavigationMode(false); // reseta navigation mode flag
  });
    
// Carregarnoticias
  $scope.loadNews = function(){
     
      var responseRecuperaNoticias = $http.get($scope.defaultURL+'/scgas/rest/noticiasservice/listaTodasNoticiasApp/0/100', {timeout: 5000});
      responseRecuperaNoticias.success(function(data, status, headers, config) {
           // alert('resultado de postos! -> '+JSON.stringify({data: data}));
            $scope.arrNoticias = data;
            $scope.hide();
            
            //alert('markers posicionados');
          });
       responseRecuperaNoticias.error(function(data, status, headers, config) {
              
            //alert('Erro ao recuperar postos! -> '+JSON.stringify({data2: data}));
           $scope.hide();
            window.plugins.toast.show('Ocorreram erros ao carregar noticias', 'long', 'center', function(a){}, function(b){});
          });
     };
}]);
