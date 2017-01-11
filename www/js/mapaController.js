angular.module('starter.controllers')

.controller('MapaCtrl', ['$scope', '$state', '$cordovaGeolocation', '$ionicLoading', '$http', '$ionicPopup',
'$ionicTabsDelegate', 'orderByFilter',

function($scope, $state, $cordovaGeolocation, $ionicLoading, $http, $ionicPopup, $ionicTabsDelegate, orderBy) {
  try {

    $scope.habilitarPesquisaEnd = false;
    $scope.habilitarBotaoRota = true;
    $scope.habilitarBotaoOrdenar = false;
    $scope.tabAtiva = 0;
    $scope.allMarkers = []; // array para armazenar os markers do mapa
    $scope.arrPostos = []; // array para armazenar os postos recuperados do serviço
    $scope.rota = {
      "origem": {"nome":"", "lat":"", "lng":""},
      "destino": {"nome":"", "lat":"", "lng":""}
    };
    $scope.bandeiras = [ // array para armazenar as bandeiras cadastradas. consumir serviço
     {"nome":"Bandeira Branca", "id":"ban", "selecionado":true},
     {"nome":"Raízen Mime", "id":"rai", "selecionado":true},
     {"nome":"Ipiranga", "id":"ipi", "selecionado":true},
     {"nome":"BR", "id":"br", "selecionado":true},
     {"nome":"RDP", "id":"rdp", "selecionado":true},
     {"nome":"Alesat", "id":"ale", "selecionado":true},
     {"nome":"American Oil", "id":"ame", "selecionado":true}
   ];

    // Mostrar popup carregando
    $scope.show = function() {
      $ionicLoading.show({
        template: 'Carregando...',
        duration: 5000
      }).then(function(){});
    };
    // Ocultar popup carregando
    $scope.hide = function(){
      $ionicLoading.hide().then(function(){});
    };

    // Omitir botão de menu ao entrar na tela
    $scope.$on('$ionicView.beforeEnter', function (e, data) {
      $scope.$root.showMenuIcon = false;
    });

    /* Início de bloco "load more" para carregar os postos sob demanda na tela de lista de postos*/
    $scope.$on('$stateChangeSuccess', function() {
      //$scope.loadMore();
    });
    $scope.loadMore = function() {
      //alert('loadMore');
      /*$http.get('/more-items').success(function(items) {
        useItems(items);
        $scope.$broadcast('scroll.infiniteScrollComplete');
      });*/
    };
    $scope.moreDataCanBeLoaded = function() {
      return true;
    };
    /* Fim de bloco "load more"*/

    $scope.localizacaoAlterada = function (location) {
      //alert('localizacaoAlterada -> '+location);
    };

     // Mostra o popup com os filtros de bandeira para o mapa
    $scope.showPopupFiltroBandeira = function() {
      var myPopup = $ionicPopup.show({
        template: '<ion-checkbox ng-repeat="bandeira in bandeiras" ng-model="bandeira.selecionado">{{bandeira.nome}}</ion-checkbox>',
        title: 'Filtrar por bandeira',
        subTitle: 'Selecione a(s) bandeira(s):',
        scope: $scope,
        buttons: [
          { text: 'Cancelar' },
          {
            text: '<b>Ok</b>',
            type: 'button-positive',
            onTap: function(e) {
              $scope.show();
              aplicaFiltroBandeira();
              $scope.hide();
            }
          }
        ]
      });

      myPopup.then(function(res) {
        //console.log('Tapped!', res);
      });
    };

    // Inicia fluxo para filtrar os markers do mapa de acordo com a bandeira
    $scope.filtrarPostosBandeira = function () {
      $scope.showPopupFiltroBandeira();
    };

    /* Coloca no map os markers que possuem bandeiras escolhidas no filtro e retirada do mapa os markers cuja bandeira não
     foi escolhida no filtro */
    function aplicaFiltroBandeira () {
      var arrayAuxiliar = [];
      if($scope.tabAtiva == 0) {
        arrayAuxiliar = $scope.allMarkers; // copia cada marker referente ao posto para o array auxiliar
      } else if($scope.tabAtiva == 1) {
        arrayAuxiliar = $scope.arrPostos; // copia cada posto da lista de postos para o array auxiliar
      }
      for(var contadorMarkers = 0;contadorMarkers < arrayAuxiliar.length;contadorMarkers++) {
        for(var contadorBandeiras = 0;contadorBandeiras < $scope.bandeiras.length;contadorBandeiras++) {
          if(arrayAuxiliar[contadorMarkers].bandeiraPosto.nome == $scope.bandeiras[contadorBandeiras].nome) {//marker ou posto é da mesma bandeira

            if($scope.bandeiras[contadorBandeiras].selecionado) { //bandeira escolhida no filtro
              if($scope.tabAtiva == 0) { // se estiver na aba de mapa
                arrayAuxiliar[contadorMarkers].setMap($scope.map); // habilita visualizacão do marker no mapa
              } else if($scope.tabAtiva == 1) {
                arrayAuxiliar[contadorMarkers].mostrar = true; // habilita visualizacão do posto na lista
              }
            } else {
              if($scope.tabAtiva == 0) { // se estiver na aba de lista de postos
                arrayAuxiliar[contadorMarkers].setMap(null); // desabilita visualizacão do marker no mapa
              } else if($scope.tabAtiva == 1) {
                arrayAuxiliar[contadorMarkers].mostrar = false; // // desabilita visualizacão do posto na lista
              }
            }
          }
        }
      }
    };

    /* Remove todos os markers do mapa */
    function removeMarkers () {
      for(var contadorMarkers = 0;contadorMarkers < $scope.allMarkers.length;contadorMarkers++){
        $scope.allMarkers[contadorMarkers].setMap(null);
      }
    };

    // Inicia fluxo para traçar rota do usuário até um determinado posto
    $scope.habilitarPesquisaEndereco = function () {
      if($scope.habilitarPesquisaEnd == true) {
        $scope.habilitarPesquisaEnd = false;
      } else {
        $scope.habilitarPesquisaEnd = true;
      }
      if(!$scope.habilitarPesquisaEnd) {
        $scope.directionsDisplay.setMap(null);
      }
    };

    // Atualiza as informações dos postos que estão no mapa
    $scope.atualizarInformacoesPostos = function () {
      $scope.removeDadosPostos();
      $scope.recuperaPostos();
    };

    // Cria um marker de acordo com o posto passado como parâmetro
    $scope.criarMarkers = function (posto) {
      var latFormatada = parseFloat(posto.coordenadaX.replace(',','.'));
      var lngFormatada = parseFloat(posto.coordenadaY.replace(',','.'));
      var latLng = new google.maps.LatLng(latFormatada, lngFormatada);

      var marker = new google.maps.Marker({
          map: $scope.map,
          animation: google.maps.Animation.DROP,
          position: latLng,
          icon: posto.bandeiraPosto.nome == "Bandeira Branca" ? 'img/gas_default.png' : 'img/gas_default.png',
          bandeiraPosto: {"nome": posto.bandeiraPosto.nome}
      });
      $scope.allMarkers.push(marker);

      var popupContent = posto.listaPrecosGNV.length == 0 ? '0.000' : posto.listaPrecosGNV[posto.listaPrecosGNV.length-1].valorGNV.toString();
      var infoWindow = new google.maps.InfoWindow({
          content: popupContent
      });

      google.maps.event.addListener(marker, 'click', function () {
          infoWindow.open($scope.map, marker);
      });
    };

    // Carrega tela que exibe as informações detalhadas do posto selecionado pelo usuário
    $scope.detalhesPosto = function (posto)  {
      $state.go('app.detalhe_posto', {paramPosto: posto});//
    };

    // Remove todos os dados dos postos do mapa e da lista de postos
    $scope.removeDadosPostos = function () {
      $scope.show();
      removeMarkers();
      $scope.allMarkers = []; // reseta array de markers
      $scope.arrPostos = []; // reseta array de postos
      $scope.hide();
    };

    // Recupera todos os postos da base de dados
    $scope.recuperaPostos = function () {
      var responseRecuperaPostos1 = $http.get('http://ec2-52-67-37-24.sa-east-1.compute.amazonaws.com:8080/scgas/rest/postoservice/listaPostos/0/45/'+$scope.position.coords.latitude+'/'+$scope.position.coords.longitude, {timeout: 5000});
      responseRecuperaPostos1.success(function(data, status, headers, config) {
        //alert('resultado de postos! -> '+JSON.stringify({data2: data}));
        //window.plugins.toast.show('Ocorreram erros ao carregar o mapa. Verifique se a localização está ativada e tente novamente!', 'long', 'center', function(a){}, function(b){});
        //$scope.arrPostos = $scope.arrPostos.concat(data.splice(-1,1));
        for(var counter = 0;counter < data.length-1;counter++){ // sempre ignorar ultima posicao do array

          data[counter].preco = data[counter].listaPrecosGNV.length == 0 ? '0.000' :
              data[counter].listaPrecosGNV[data[counter].listaPrecosGNV.length - 1].valorGNV;

          data[counter].ultimaAtualizacao = data[counter].listaPrecosGNV.length == 0 ? 'Sem atualizações' :
              data[counter].listaPrecosGNV[data[counter].listaPrecosGNV.length - 1].tempoUltimaAtulizacao;

          data[counter].usuarioUltimaAtualizacao =  data[counter].listaPrecosGNV.length == 0 ? 'Nenhum usuário atualizou' :
              data[counter].listaPrecosGNV[data[counter].listaPrecosGNV.length - 1].usuario.nome;

          $scope.criarMarkers(data[counter]);
          data[counter].mostrar = true;
          $scope.arrPostos.push(data[counter]);
        }
          //console.log($scope.arrPostos[0]);
          //alert('markers posicionados');
        });
        responseRecuperaPostos1.error(function(data, status, headers, config) {
          alert('Erro ao recuperar postos! -> '+JSON.stringify({data2: data}));
          //window.plugins.toast.show('Ocorreram erros ao carregar o mapa. Verifique se a localização está ativada e tente novamente!', 'long', 'center', function(a){}, function(b){});
        });

        var responseRecuperaPostos2 = $http.get('http://ec2-52-67-37-24.sa-east-1.compute.amazonaws.com:8080/scgas/rest/postoservice/listaPostos/45/90/'+$scope.position.coords.latitude+'/'+$scope.position.coords.longitude, {timeout: 5000});
        responseRecuperaPostos2.success(function(data, status, headers, config) {
          //alert('resultado de postos! -> '+JSON.stringify({data2: data}));
          //window.plugins.toast.show('Ocorreram erros ao carregar o mapa. Verifique se a localização está ativada e tente novamente!', 'long', 'center', function(a){}, function(b){});
          //$scope.arrPostos = $scope.arrPostos.concat(data.splice(-1,1));
          for(var counter = 0;counter < data.length-1;counter++){ // sempre ignorar ultima posicao do array

            data[counter].preco = data[counter].listaPrecosGNV.length == 0 ? '0.000' :
                data[counter].listaPrecosGNV[data[counter].listaPrecosGNV.length - 1].valorGNV;

            data[counter].ultimaAtualizacao = data[counter].listaPrecosGNV.length == 0 ? 'Sem atualizações' :
                data[counter].listaPrecosGNV[data[counter].listaPrecosGNV.length - 1].tempoUltimaAtulizacao;

            data[counter].usuarioUltimaAtualizacao =  data[counter].listaPrecosGNV.length == 0 ? 'Nenhum usuário atualizou' :
                data[counter].listaPrecosGNV[data[counter].listaPrecosGNV.length - 1].usuario.nome;

            $scope.criarMarkers(data[counter]);
            data[counter].mostrar = true;
            $scope.arrPostos.push(data[counter]);
          }
          //alert('markers posicionados');
        });
        responseRecuperaPostos2.error(function(data, status, headers, config) {
          alert('Erro ao recuperar postos! -> '+JSON.stringify({data2: data}));
          //window.plugins.toast.show('Ocorreram erros ao carregar o mapa. Verifique se a localização está ativada e tente novamente!', 'long', 'center', function(a){}, function(b){});
        });

        var responseRecuperaPostos3 = $http.get('http://ec2-52-67-37-24.sa-east-1.compute.amazonaws.com:8080/scgas/rest/postoservice/listaPostos/90/150/'+$scope.position.coords.latitude+'/'+$scope.position.coords.longitude, {timeout: 5000});
        responseRecuperaPostos3.success(function(data, status, headers, config) {
          //alert('resultado de postos! -> '+JSON.stringify({data2: data}));
          //window.plugins.toast.show('Ocorreram erros ao carregar o mapa. Verifique se a localização está ativada e tente novamente!', 'long', 'center', function(a){}, function(b){});
          //$scope.arrPostos = $scope.arrPostos.concat(data.splice(-1,1));
          for(var counter = 0;counter < data.length-1;counter++){ // sempre ignorar ultima posicao do array

            data[counter].preco = data[counter].listaPrecosGNV.length == 0 ? '0.000' :
                data[counter].listaPrecosGNV[data[counter].listaPrecosGNV.length - 1].valorGNV;

            data[counter].ultimaAtualizacao = data[counter].listaPrecosGNV.length == 0 ? 'Sem atualizações' :
                data[counter].listaPrecosGNV[data[counter].listaPrecosGNV.length - 1].tempoUltimaAtulizacao;

            data[counter].usuarioUltimaAtualizacao =  data[counter].listaPrecosGNV.length == 0 ? 'Nenhum usuário atualizou' :
                data[counter].listaPrecosGNV[data[counter].listaPrecosGNV.length - 1].usuario.nome;

            $scope.criarMarkers(data[counter]);
            data[counter].mostrar = true;
            $scope.arrPostos.push(data[counter]);
          }
          //alert('markers posicionados');
        });
        responseRecuperaPostos3.error(function(data, status, headers, config) {
          alert('Erro ao recuperar postos! -> '+JSON.stringify({data2: data}));
          //window.plugins.toast.show('Ocorreram erros ao carregar o mapa. Verifique se a localização está ativada e tente novamente!', 'long', 'center', function(a){}, function(b){});
        });
    };

    $scope.carregarNoMapa = function(endereco) {
        geocoder.geocode({ 'address': endereco + ', Brasil', 'region': 'BR' }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[0]) {
                    var latitude = results[0].geometry.location.lat();
                    var longitude = results[0].geometry.location.lng();

                    $('#txtEndereco').val(results[0].formatted_address);
                    $('#txtLatitude').val(latitude);
                    $('#txtLongitude').val(longitude);

                    var location = new google.maps.LatLng(latitude, longitude);
                    marker.setPosition(location);
                    map.setCenter(location);
                    map.setZoom(16);
                }
            }
        });
    };

    jQuery(document).ready(function() {

      /* Inicio configurações do mapa */

        var mapOptions = {
          center: $scope.latlngInicial,
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        var mapa = new google.maps.Map(document.getElementById("map"), mapOptions);

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
          $scope.recuperaPostos();
          $scope.rota.origem.lat = $scope.position.coords.latitude;
          $scope.rota.origem.lng = $scope.position.coords.longitude;
          $scope.recuperaLocalizacaoAtual();
          $scope.setMap(mapa);
        });
      /* Fim configurações do mapa */

      $scope.recuperaLocalizacaoAtual = function () {
        var latlng = {lat: parseFloat($scope.rota.origem.lat), lng: parseFloat($scope.rota.origem.lng)};
        $scope.geocoder.geocode({'location': latlng}, function(results, status) {
          if (status === 'OK') {
            if (results[1]) {
              $scope.rota.origem.nome = results[1].formatted_address
            } else {
              console.log('No results found');
            }
          } else {
            console.log('Geocoder failed due to: ' + status);
          }
        });
      };

      $("#origem").autocomplete({
          source: function (request, response) {
              $scope.geocoder.geocode({ 'address': request.term + ', Brasil', 'region': 'BR' }, function (results, status) {
                  response($.map(results, function (item) {
                      return {
                          label: item.formatted_address,
                          value: item.formatted_address,
                          latitude: item.geometry.location.lat(),
                          longitude: item.geometry.location.lng()
                      }
                  }));
              })
          },
          select: function (event, ui) {
              $scope.rota.origem.nome = ui.item.label;
              $scope.rota.origem.lat = ui.item.latitude;
              $scope.rota.origem.lng = ui.item.longitude;
          }
      });
      $("#destino").autocomplete({
          source: function (request, response) {
              $scope.geocoder.geocode({ 'address': request.term + ', Brasil', 'region': 'BR' }, function (results, status) {
                  response($.map(results, function (item) {
                      return {
                          label: item.formatted_address,
                          value: item.formatted_address,
                          latitude: item.geometry.location.lat(),
                          longitude: item.geometry.location.lng()
                      }
                  }));
              })
          },
          select: function (event, ui) {
              $scope.rota.destino.nome = ui.item.label;
              $scope.rota.destino.lat = ui.item.latitude;
              $scope.rota.destino.lng = ui.item.longitude;
              $scope.tracarRota();
          }
      });
    });

    // Busca rota entre dois endereços
    $scope.tracarRota = function () {
      var request = { // Novo objeto google.maps.DirectionsRequest, contendo:
          origin: $scope.rota.origem.nome, // origem
          destination: $scope.rota.destino.nome, // destino
          travelMode: google.maps.TravelMode.DRIVING // meio de transporte, nesse caso, de carro
       };

       $scope.directionsService.route(request, function(result, status) {
          if (status == google.maps.DirectionsStatus.OK) { // Se deu tudo certo
             $scope.directionsDisplay.setMap($scope.map);
             $scope.directionsDisplay.setDirections(result);
          }
       });
    };

    $scope.alteraTab = function() {
      if($ionicTabsDelegate.selectedIndex() == 0) {
        $scope.tabAtiva = 0;
        $scope.habilitarBotaoRota = true;
        $scope.habilitarBotaoOrdenar = false;
      } else if($ionicTabsDelegate.selectedIndex() == 1) {
        $scope.tabAtiva = 1;
        $scope.habilitarBotaoRota = false;
        $scope.habilitarBotaoOrdenar = true;
      }
    };

    // Ordena lista de postos de acordo com o preço
    $scope.ordenarListaPostos = function () {
      $scope.show();
      $scope.sortBy('preco');
      $scope.hide();
    };

    $scope.propertyName = null;
    $scope.reverse = true;
    $scope.arrPostos = orderBy($scope.arrPostos, $scope.propertyName, $scope.reverse);

    $scope.sortBy = function(propertyName) {
      $scope.reverse = (propertyName !== null && $scope.propertyName === propertyName)
          ? !$scope.reverse : false;
      $scope.propertyName = propertyName;
      $scope.arrPostos = orderBy($scope.arrPostos, $scope.propertyName, $scope.reverse);
    };
  } catch (ex) {alert(ex);console.log(ex);}
}]);
