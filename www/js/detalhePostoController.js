angular.module('starter.controllers')

.controller('DetalhePostoCtrl', ['$scope', '$state', '$cordovaGeolocation', '$ionicLoading', '$http', '$stateParams', '$ionicPopup',

function($scope, $state, $cordovaGeolocation, $ionicLoading, $http, $stateParams, $ionicPopup) {

  $scope.posto = $stateParams.paramPosto;

  if(!$scope.posto.preco)
      $scope.posto.preco = 0.000;

  $scope.show = function(mensagem) {
    $ionicLoading.show({
      template: mensagem,
      duration: 5000
    }).then(function(){});
  };
  $scope.hide = function(){
    $ionicLoading.hide().then(function(){});
  };

  $scope.atualizarPrecoPosto = function () {
    $scope.show('Atualizando preço...');

    var storedUser = JSON.parse(window.localStorage.getItem("dadosUsuario"));
    var postParams = {
      "posto":{"id": $scope.posto.id},
      "usuario":{"id": storedUser.id},
      "valorGNV":$scope.posto.preco
    };

    var response = $http.post(
      'http://ec2-52-67-37-24.sa-east-1.compute.amazonaws.com:8080/scgas/rest/postoservice/atualizaPrecoCombustivel',
      postParams);
    response.success(function(data, status, headers, config) {
      $scope.hide();
      window.plugins.toast.show('Preço atualizado com sucesso!', 'long', 'center', function(a){}, function(b){});

      //alert('Preço atualizado com sucesso!');
      //alert('Retorno -> ' + JSON.stringify({data2: data}));
    });
    response.error(function(data, status, headers, config) {
      $scope.hide();
      window.plugins.toast.show('Ocorreram erros ao atualizar preço do gás. Tente novamente!', 'long', 'center', function(a){}, function(b){});
      //alert('Erro -> ' + JSON.stringify({data2: data}));
    });
  };
  $scope.showPopupPreco = function() {
    var myPopup = $ionicPopup.show({
      template: '<input type="number" ng-model="posto.preco">',
      title: 'Atualizar preço do posto',
      subTitle: 'Entre com o valor do preço do posto!',
      scope: $scope,
      buttons: [
        { text: 'Cancelar' },
        {
          text: '<b>Salvar</b>',
          type: 'button-positive',
          onTap: function(e) {
            if (!$scope.posto.preco) {
              //don't allow the user to close unless he enters wifi password
              window.plugins.toast.show('Favor digitar um valor!', 'long', 'center', function(a){}, function(b){});
              e.preventDefault();
            } else {
              $scope.atualizarPrecoPosto();
              return $scope.posto.preco;
            }
          }
        }
      ]
    });

    myPopup.then(function(res) {
      //console.log('Tapped!', res);
    });
  };
  try {
    // Configurações do mapa
    var options = {timeout: 10000, enableHighAccuracy: true};
    var latLng = new google.maps.LatLng(-19.886519200000002, -43.9908041);
    // Configurações do mapa e de localização do usuário
    var mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    $scope.map = new google.maps.Map(document.getElementById("map2"), mapOptions);
    google.maps.event.addListenerOnce($scope.map, 'idle', function(){
      $scope.hide();
      /*$scope.recuperaPostos();
      $scope.rota.origem.lat = position.coords.latitude;
      $scope.rota.origem.lng = position.coords.longitude;
      $scope.recuperaLocalizacaoAtual();*/
    });
  } catch(ex) {console.log(ex);}
}]);
