angular.module('starter.controllers')

.controller('MapaDetalhePostoCtrl', ['$scope', '$state', '$cordovaGeolocation', '$ionicLoading', '$http', '$stateParams', '$ionicPopup',
'$rootScope', '$ionicHistory', '$ionicSideMenuDelegate','$cordovaLaunchNavigator',
function($scope, $state, $cordovaGeolocation, $ionicLoading, $http, $stateParams, $ionicPopup, $rootScope, $ionicHistory, $ionicSideMenuDelegate,$cordovaLaunchNavigator) {

  /* Variaveis de controle */

  // Variavel representando origem e destino (posto) do usuario
  $scope.rota = {
    "origem": {"nome":"", "lat":"", "lng":""},
    "destino": {"nome":"", "lat":"", "lng":""}
  };

  $scope.flagResizeMapa = false;
  $scope.topResize = false;
  // Posto enviado via parametro
  $scope.posto = $stateParams.paramPosto;
  $scope.novoPreco = {'preco':''};
  $scope.posto.preco = parseFloat($scope.posto.preco) == 0 ? '00,00' : $scope.posto.preco;

  $scope.urlImagemx24 = $scope.defaultURL+'/images/'+$scope.posto.bandeiraPosto.urlImgBandeira;
  $scope.urlImagemx48 = $scope.urlImagemx24.replace(".png","_x48.png");

  // flag para mascara
  $scope.flag = false;

  // Verificacao de preco
  $scope.novoPreco.preco = 'R$ 00,00';
  $scope.distanciaFormatada = $scope.posto.distanciaPosto.match(/^-?\d+(?:\.\d{0,2})?/)[0].replace(".",",");

  /* Eventos View */
  $scope.$on('$ionicView.afterEnter', function (e, data) {
    $scope.setNavigationMode(false); // reseta navigation mode flag

    $ionicSideMenuDelegate.canDragContent(false)
    $scope.$root.showMenuIcon = false;

    console.log('entrou na view de detalhe');
  });

  $scope.$on('$ionicView.beforeLeave', function (e, data) {
    // Coloca o mapa do controller mapaPostosController.js como próximo a ser usado
    $scope.setNavigationMode(false); // reseta navigation mode flag

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
      "valorGNV": $('.dinheiro').val().replace(",",".")
    };

    var response = $http.post(
      $scope.defaultURL+'/scgas/rest/postoservice/atualizaPrecoCombustivel',
      postParams);
    response.success(function(data, status, headers, config) {
      $scope.hide();
      window.plugins.toast.show('Preço atualizado com sucesso!', 'long', 'center', function(a){}, function(b){});

      //alert('Preço atualizado com sucesso!');
      //alert('Retorno -> ' + JSON.stringify({data2: data}));

      $scope.posto.usuarioUltimaAtualizacao = JSON.parse(window.localStorage.getItem("dadosUsuario")).nome;
      $scope.posto.preco = data.valorGNV.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0].replace(".",",");
    });
    response.error(function(data, status, headers, config) {
      $scope.hide();
      window.plugins.toast.show('Ocorreram erros ao atualizar preço do gás. Tente novamente!', 'long', 'center', function(a){}, function(b){});
      //alert('Erro -> ' + JSON.stringify({data2: data}));
    });
  };

  // Aplica mascara no campos
  $scope.aplicaMascara = function () {
    //http://www.rafaelwendel.com/2012/07/mascara-para-campos-monetarios-com-jquery-maskmoney/
    if(!$scope.flag) {
      $("input.dinheiro").maskMoney({showSymbol:true, symbol:"R$ ", decimal:",", thousands:"."});
    }

    $scope.flag = true;
  };

  // Mostra popup para usuario inserir o preço e salvar

  $scope.showPopupPreco = function() {
    var myPopup = $ionicPopup.show({
      template: '<input type="text" ng-model="novoPreco.preco" class="dinheiro" ng-change="aplicaMascara();"> ',
      title: 'Atualizar preço do posto',
      subTitle: 'Entre com o valor do preço do posto!',
      scope: $scope,
      buttons: [
        { text: 'Cancelar' },
        {
          text: '<b>Salvar</b>',
          type: 'button-positive',
          onTap: function(e) {
            if (!$('.dinheiro').val() || $('.dinheiro').val() == "R$ 00,00" || parseFloat($('.dinheiro').val().replace(",","."))>99.99) {
              //don't allow the user to close unless he enters wifi password
              window.plugins.toast.show('Favor digitar um valor maior que zero e menor que R$ 99,99!', 'long', 'center', function(a){}, function(b){});
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
      $scope.flag = false;// reseta flag para mascara de dinheiro
    });

  };

  // Traca rota da posicao do usuario ate o posto selecionado
 /* $scope.abrirNavegador = function () {
    alert('Abrir no navegador');
  };*/

   $scope.abrirNavegador = function() {

    var destination = [$scope.posto.coordenadaX.replace(',','.'), $scope.posto.coordenadaY.replace(',','.')];
	var start = null;
    $cordovaLaunchNavigator.navigate(destination, start).then(function() {
    }, function (err) {
       alert(err);
      console.error(err);
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
        icon: $scope.urlImagemx24,
        position: latLng
    });
    $scope.map.setCenter(latLng);
  };
  // Trecho para criar o Mapa e todas as configurações necessárias
  jQuery(document).ready(function() {

    /* Inicio configurações do mapa */
      $("#btnResizeLess").hide();
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
             $scope.setNavigationMode(true);  // habilita modo navegação
          } else {
            console.log(result);
          }
       });
    };
	$scope.resizeMaps = function () {
		console.log($scope.flagResizeMapa);
		if(!$scope.flagResizeMapa) {
			$('.hide-row-when-map').css( "display", "none" );

			$('#map2').css( "position", "fixed" );
			$('#map2').css( "width", "100%" );
			$('#map2').css( "height", "100%" );
			google.maps.event.trigger($scope.map, 'resize');
      $("#btnResize").hide();
      $("#btnResizeLess").css('background-color', 'rgba(0, 0, 0, 0.5)');
      $("#btnResizeLess").css({ top: '-130px' });
      $("#btnResizeLess").show();
        $scope.map.setZoom(15);

		} else {
			//location.reload();

			//$('#map2').remove();
			$('#map2').css( "overflow", "hidden" );
			$('#map2').css( "position", "relative" );
			$('#map2').css( "height", "140px" );
			google.maps.event.trigger($scope.map, 'resize');

			$('.hide-row-when-map').css( "display", "" );
      $("#btnResize").show();
      $("#btnResizeLess").hide();

		}
		$scope.flagResizeMapa = !$scope.flagResizeMapa;
	 };
  });
}]);
