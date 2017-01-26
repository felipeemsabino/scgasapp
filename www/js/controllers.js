angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $cordovaGeolocation) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  $scope.defaultURL = 'http://ec2-52-67-135-39.sa-east-1.compute.amazonaws.com:8080';
  
  //Coordenadas de SC
  $scope.latlngInicial = new google.maps.LatLng(-27.590682, -48.547002);
  $scope.position;
  $scope.locationMarker;
  $scope.map = null;
  $scope.mapAux = null;

  $scope.setMap = function (mapa) {
    $scope.map = mapa;
  };

  /*
   * Altera o mapa que está sendo utilizado. Se é passado null, então o mapa da pagina mapa_postos esta sendo utilizado,
   * caso contrario o mapa da pagina mapa_detalhe_posto estará sendo utilizado
   */
  $scope.alteraMapa = function (mapa) {
    if (mapa != null) { // mapa referente ao detalhe posto
      $scope.mapAux = $scope.map;
      $scope.map = mapa;
    } else {
      mapa = $scope.mapAux;
      $scope.mapAux = $scope.map;
      $scope.map = mapa;
    }
    console.log($scope.map);
  };

  var watchOptions = {timeout : 3000,  enableHighAccuracy: false};
  $cordovaGeolocation.watchPosition(watchOptions).then(null, function(err) {
      console.log('erro ao atualizar position');
  },
  function(position) {
    $scope.position = position;
    var lat  = $scope.position.coords.latitude;
    var long = $scope.position.coords.longitude;
    var latLng = new google.maps.LatLng(lat, long);

    /*if($scope.map != null) {
      console.log('atualizou posicao e mapa ta ok!');
      window.plugins.toast.show('atualizou posicao e mapa ta ok! lat '+lat+' lng '+long, 'long', 'center', function(a){}, function(b){});
    } else {
      console.log('atualizou posicao e mapa n ta ok!');
      window.plugins.toast.show('atualizou posicao e mapa n ta ok!', 'long', 'center', function(a){}, function(b){});
    }*/

    if($scope.map != null) {

      if($scope.locationMarker == null) {
        $scope.locationMarker = new google.maps.Marker({
            map: $scope.map,
            //animation: google.maps.Animation.DROP,
            position: latLng,
            icon: 'img/map_pointer.png'
        });
      } else {
        $scope.locationMarker.setPosition(latLng);
      }
    }
  });

  // Configurações geolocation
  var options = {timeout: 10000, enableHighAccuracy: true};
  $cordovaGeolocation.getCurrentPosition(options).then(
    function(position){
      $scope.position = position; // Seta coordenadas do atual do usuário
      console.log('Recuperou position');
    },
    function(error){
      console.log('Erro ao recuperar position');
      //alert("erro -> "+JSON.stringify({data2: error}));
      window.plugins.toast.show('Ocorreram erros ao carregar o mapa. Verifique se a localização está ativada e tente novamente!', 'long', 'center', function(a){}, function(b){});
      //alert('Ocorreram erros ao carregar o mapa. Verifique se a localização está ativada e tente novamente!');
  });
});
