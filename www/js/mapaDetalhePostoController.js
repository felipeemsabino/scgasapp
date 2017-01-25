angular.module('starter.controllers')

.controller('MapaDetalhePostoCtrl', ['$scope', '$state', '$cordovaGeolocation', '$ionicLoading', '$http', '$stateParams', '$ionicPopup',
'$rootScope', '$ionicHistory', '$ionicSideMenuDelegate',
function($scope, $state, $cordovaGeolocation, $ionicLoading, $http, $stateParams, $ionicPopup, $rootScope, $ionicHistory, $ionicSideMenuDelegate) {

  /* Variaveis de controle */

  // Variavel representando origem e destino (posto) do usuario
  $scope.rota = {
    "origem": {"nome":"", "lat":"", "lng":""},
    "destino": {"nome":"", "lat":"", "lng":""}
  };

  // Posto enviado via parametro
  $scope.posto = $stateParams.paramPosto;

  // Verificacao de preco
  if(!$scope.posto.preco)
      $scope.posto.preco = 0.000;

  /* Eventos View */
  $scope.$on('$ionicView.afterEnter', function (e, data) {
    $ionicSideMenuDelegate.canDragContent(false)
    $scope.$root.showMenuIcon = false;

    console.log('entrou na view de detalhe');
  });

  $scope.$on('$ionicView.beforeLeave', function (e, data) {
    // Coloca o mapa do controller mapaPostosController.js como próximo a ser usado
    $scope.alteraMapa(null);
    
    console.log('saiu da view do detalhe');
  });

  $scope.show = function(mensagem) {
    $ionicLoading.show({
      template: mensagem,
      duration: 5000
    }).then(function(){});
  };
  $scope.hide = function(){
    $ionicLoading.hide().then(function(){});
  };

  // Atualiza o preço do posto que o usuario inseriu
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

  // Mostra popup para usuario inserir o preço e salvar
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

  // Traca rota da posicao do usuario ate o posto selecionado
  $scope.navegarPosto = function () {
    $scope.tracarRota();
  };

  $scope.resetLocationMarker = function () {
    $scope.locationMarker = null;
  };

  // Adiciona um marker para um posto especifico no mapa
  $scope.adicionaMarker = function (posto) {
    var latFormatada = parseFloat(posto.coordenadaX.replace(',','.'));
    var lngFormatada = parseFloat(posto.coordenadaY.replace(',','.'));
    var latLng = new google.maps.LatLng(latFormatada, lngFormatada);

    var marker = new google.maps.Marker({
        map: $scope.map,
        animation: google.maps.Animation.DROP,
        icon: posto.bandeiraPosto.nome == "Bandeira Branca" ? 'img/gas_default.png' : 'img/gas_default.png',
        position: latLng
    });
    $scope.map.setCenter(latLng);
  };
  // Trecho para criar o Mapa e todas as configurações necessárias
  jQuery(document).ready(function() {

    /* Inicio configurações do mapa */

      var mapOptions = {
        center: $scope.latlngInicial,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      var mapa = new google.maps.Map(document.getElementById("map2"), mapOptions);

      $scope.geocoder = new google.maps.Geocoder();

      $scope.directionsService = new google.maps.DirectionsService();

      $scope.directionsDisplay = new google.maps.DirectionsRenderer();

      $scope.directionsDisplay.setMap(mapa);

      //Reload markers every time the map moves
      google.maps.event.addListener(mapa, 'dragend', function(){});

       //Reload markers every time the zoom changes
      google.maps.event.addListener(mapa, 'zoom_changed', function(){});

      //Wait until the map is loaded
      google.maps.event.addListenerOnce(mapa, 'idle', function(){
        $scope.hide();

        // Seta coordenadas do usuario
        $scope.rota.origem.lat = $scope.position.coords.latitude;
        $scope.rota.origem.lng = $scope.position.coords.longitude;

        // Recupera o endereço do usuario
        $scope.recuperaLocalizacaoAtual($scope.rota.origem.lat, $scope.rota.origem.lng, true);

        // Seta lat e lng do destino e recupera endereço do mesmo
        $scope.rota.destino.lat = parseFloat($scope.posto.coordenadaX.replace(',','.'));
        $scope.rota.destino.lng = parseFloat($scope.posto.coordenadaY.replace(',','.'));
        $scope.recuperaLocalizacaoAtual($scope.rota.destino.lat, $scope.rota.destino.lng, false);
        $scope.alteraMapa(mapa);
        $scope.resetLocationMarker();
        $scope.adicionaMarker($scope.posto);
      });
    /* Fim configurações do mapa */

    $scope.recuperaLocalizacaoAtual = function (lat, lng, origem) {
      var latlng = {lat: parseFloat(lat), lng: parseFloat(lng)};
      $scope.geocoder.geocode({'location': latlng}, function(results, status) {
        if (status === 'OK') {
          if (results[1]) {
              if(origem) {
                $scope.rota.origem.nome = results[1].formatted_address;
              } else {
                $scope.rota.destino.nome = results[1].formatted_address;
              }

          } else {
            console.log('No results found');
          }
        } else {
          console.log('Geocoder failed due to: ' + status);
        }
      });
    };

    // Busca rota entre dois endereços
    $scope.tracarRota = function () {
      var request = { // Novo objeto google.maps.DirectionsRequest, contendo:
          origin: $scope.rota.origem.nome, // origem
          destination: $scope.rota.destino.nome, // destino
          travelMode: google.maps.TravelMode.DRIVING // meio de transporte, nesse caso, de carro
       };

       $scope.directionsService.route(request, function(result, status) {
          if (status == google.maps.DirectionsStatus.OK) { // Se deu tudo certo
             $scope.directionsDisplay.setDirections(result);
          } else {
            console.log(result);
          }
       });
    };

  });
}]);