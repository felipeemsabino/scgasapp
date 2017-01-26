angular.module('starter.controllers')

.controller('MapaPostosCtrl', ['$scope', '$ionicTabsDelegate', '$stateParams', '$state', '$http', '$ionicSideMenuDelegate',
'$ionicLoading', '$ionicPlatform', '$compile', '$ionicPopup', 'orderByFilter',
function($scope, $ionicTabsDelegate, $stateParams, $state, $http, $ionicSideMenuDelegate, $ionicLoading, $ionicPlatform, $compile,
$ionicPopup, orderBy) {

  /* Variaveis de controle */

  // Flag para mostrar ou esconder os campos para digitar o endereço de origem e destino
  $scope.habilitarPesquisaEnd = false;

  // Controles para visibilidade dos botões de rota e ordenação na parte inferior da tela
  $scope.habilitarBotaoRota = true;
  $scope.habilitarBotaoOrdenar = false;
  $scope.tabAtiva = 0;

  // Armazenar a origem e destino com respectivas latitude e longitude
  $scope.rota = {
    "origem": {"nome":"", "lat":"", "lng":""},
    "destino": {"nome":"", "lat":"", "lng":""}
  };

  // Arrays para armazenar os markers do mapa e os postos recebidos do serviço
  $scope.allMarkers = [];
  $scope.arrPostos = [];

  // Array para armazenar as bandeiras cadastradas. TODO: preencher esse array através do serviço
  $scope.bandeiras = [
   {"nome":"Bandeira Branca", "id":"ban", "selecionado":true},
   {"nome":"Raízen Mime", "id":"rai", "selecionado":true},
   {"nome":"Ipiranga", "id":"ipi", "selecionado":true},
   {"nome":"BR", "id":"br", "selecionado":true},
   {"nome":"RDP", "id":"rdp", "selecionado":true},
   {"nome":"Alesat", "id":"ale", "selecionado":true},
   {"nome":"American Oil", "id":"ame", "selecionado":true}
 ];

 // Variaveis auxiliares para ordenação
 $scope.propertyName = null;
 $scope.reverse = true;
 $scope.arrPostos = orderBy($scope.arrPostos, $scope.propertyName, $scope.reverse);

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
  /* Eventos View */

  // Listener para após entrar na pagina
  $scope.$on('$ionicView.afterEnter', function (e, data) {
    $ionicSideMenuDelegate.canDragContent(false)
    $scope.$root.showMenuIcon = false;
    if($scope.map != null)
      google.maps.event.trigger($scope.map, 'resize'); // resolvendo bug de area cinza quando volta para o mapa principal após atualizar o preço

  });

  // Listener para antes de sair da pagina
  $scope.$on('$ionicView.beforeLeave', function (e, data) {

  });

  /* Metodos auxiliares */

  // Centraliza mapa na posição do usuario
  $scope.centralizarMapaPosicaoUsuario = function () {
      var posicaoUsuario = {lat: $scope.position.coords.latitude, lng: $scope.position.coords.longitude};
      $scope.map.setCenter(posicaoUsuario);
  };

  // Carrega a pagina de detalhe do posto
  $scope.carregaDetalhePosto = function (posto) {
    $state.go('app.mapa_detalhe_posto', {paramPosto: posto});
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

  // Recupera todos os postos da base de dados
  $scope.recuperaPostos = function () {
    var responseRecuperaPostos1 = $http.get($scope.defaultURL+'/scgas/rest/postoservice/listaPostos/0/45/'+$scope.position.coords.latitude+'/'+$scope.position.coords.longitude, {timeout: 5000});
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

        $scope.criaMarkers(data[counter]);
        data[counter].mostrar = true;
        $scope.arrPostos.push(data[counter]);
      }
        //console.log($scope.arrPostos[0]);
        //alert('markers posicionados');
      });
      responseRecuperaPostos1.error(function(data, status, headers, config) {
        //alert('Erro ao recuperar postos! -> '+JSON.stringify({data2: data}));
        window.plugins.toast.show('Ocorreram erros ao carregar o mapa. Verifique se a localização está ativada e tente novamente!', 'long', 'center', function(a){}, function(b){});
      });

      var responseRecuperaPostos2 = $http.get($scope.defaultURL+'/scgas/rest/postoservice/listaPostos/45/90/'+$scope.position.coords.latitude+'/'+$scope.position.coords.longitude, {timeout: 5000});
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

          $scope.criaMarkers(data[counter]);
          data[counter].mostrar = true;
          $scope.arrPostos.push(data[counter]);
        }
        //alert('markers posicionados');
      });
      responseRecuperaPostos2.error(function(data, status, headers, config) {
        //alert('Erro ao recuperar postos! -> '+JSON.stringify({data2: data}));
        window.plugins.toast.show('Ocorreram erros ao carregar o mapa. Verifique se a localização está ativada e tente novamente!', 'long', 'center', function(a){}, function(b){});
      });

      var responseRecuperaPostos3 = $http.get($scope.defaultURL+'/scgas/rest/postoservice/listaPostos/90/150/'+$scope.position.coords.latitude+'/'+$scope.position.coords.longitude, {timeout: 5000});
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

          $scope.criaMarkers(data[counter]);
          data[counter].mostrar = true;
          $scope.arrPostos.push(data[counter]);
        }
        //alert('markers posicionados');
      });
      responseRecuperaPostos3.error(function(data, status, headers, config) {
        //alert('Erro ao recuperar postos! -> '+JSON.stringify({data2: data}));
        window.plugins.toast.show('Ocorreram erros ao carregar o mapa. Verifique se a localização está ativada e tente novamente!', 'long', 'center', function(a){}, function(b){});
      });
  };

  // Cria um marker de acordo com o posto passado como parâmetro
  $scope.criaMarkers = function (posto) {
    var latFormatada = parseFloat(posto.coordenadaX.replace(',','.'));
    var lngFormatada = parseFloat(posto.coordenadaY.replace(',','.'));
    var latLng = new google.maps.LatLng(latFormatada, lngFormatada);
    if(posto.listaPrecosGNV.length > 1)
    console.log(posto);
    var marker = new google.maps.Marker({
        map: $scope.map,
        animation: google.maps.Animation.DROP,
        position: latLng,
        icon: $scope.defaultURL+'/images/'+posto.bandeiraPosto.urlImgBandeira,
        //"Bandeira Branca" ? 'img/gas_default.png' : 'img/gas_default.png',
        bandeiraPosto: {"nome": posto.bandeiraPosto.nome}
    });
    $scope.allMarkers.push(marker);

    var popupContent = "<div id='infoWindowDiv' style='align-content:center;text-align:center;color:#2ECC71;'>";
    if (posto.listaPrecosGNV.length == 0)
      popupContent += 'R$ 00,00';
    else {
      //var valor = parseFloat(posto.preco).toFixed(2).replace(".",",");
      posto.preco = posto.preco.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0].replace(".",",");
      popupContent += 'R$ ' + posto.preco;
    }

    popupContent += "</br><a ng-click='carregaDetalhePosto("+JSON.stringify(posto)+");'>Ver detalhes</a></div>";
    var compiled = $compile(popupContent)($scope);

    var infoWindow = new google.maps.InfoWindow({
        content: compiled[0]
    });

    google.maps.event.addListener(marker, 'click', function () {
        infoWindow.open($scope.map, marker);
    });
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

  // Deleta a rota desenhada no mapa
  $scope.limparRota = function () {
    $scope.show(0);
    $scope.directionsDisplay.setMap(null);
    $("#destino").val("");
    $scope.hide();
  };

  // Busca rota entre dois endereços
  $scope.tracarRota = function () {
    if( !$("#origem").val() || !$("#destino").val() ) {
      //alert('Favor preencher os campos de origem e destino!');
      window.plugins.toast.show('Favor preencher os campos de origem e destino!', 'long', 'center', function(a){}, function(b){});
      return;
    }
    $scope.show(0);
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
    $scope.hide();
     });
  };

  // Inicia fluxo para filtrar os markers do mapa de acordo com a bandeira
  $scope.filtrarPostosBandeira = function () {
    $scope.showPopupFiltroBandeira();
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
           $scope.show(1000);
           aplicaFiltroBandeira();
         }
       }
     ]
   });

   myPopup.then(function(res) {
   });
  };

   /*
    * Coloca no map os markers que possuem bandeiras escolhidas no filtro e retirada do mapa os markers cuja bandeira não
    * foi escolhida no filtro
    */
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

  // Ordena lista de postos de acordo com o preço
  $scope.ordenarListaPostos = function () {
    $scope.show(0);
    $scope.sortBy('preco');
    $scope.hide();
  };

  // Metodo de ordenação
  $scope.sortBy = function(propertyName) {
    $scope.reverse = (propertyName !== null && $scope.propertyName === propertyName)
        ? !$scope.reverse : false;
    $scope.propertyName = propertyName;
    $scope.arrPostos = orderBy($scope.arrPostos, $scope.propertyName, $scope.reverse);
  };

  // Atualiza as informações dos postos que estão no mapa
  $scope.atualizarInformacoesPostos = function () {
    $scope.removeDadosPostos();
    $scope.recuperaPostos();
  };

  // Remove todos os dados dos postos do mapa e da lista de postos
  $scope.removeDadosPostos = function () {
    $scope.show(0);
    removeMarkers();
    $scope.allMarkers = []; // reseta array de markers
    $scope.arrPostos = []; // reseta array de postos
    $scope.hide();
  };

  // Remove todos os markers do mapa
  function removeMarkers () {
    for(var contadorMarkers = 0;contadorMarkers < $scope.allMarkers.length;contadorMarkers++){
      $scope.allMarkers[contadorMarkers].setMap(null);
    }
  };

  // Trecho para criar o Mapa e todas as configurações necessárias
  jQuery(document).ready(function() {
    $scope.show(0);
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
        //criaBotaoCentralizar();
      });
    /* Fim configurações do mapa */


    /**
     * Create the DIV to hold the control and call the CenterControl()
     * constructor passing in this DIV.
     */
    function criaBotaoCentralizar () {
      var centerControlDiv = document.createElement('div');
      var centerControl = new CenterControl(centerControlDiv, $scope.map);

      centerControlDiv.index = 1;
      $scope.map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);
    }

    /**
     * The CenterControl adds a control to the map that recenters the map on
     * Chicago.
     * This constructor takes the control DIV as an argument.
     * @constructor
     */
    function CenterControl(controlDiv, map) {

      // Set CSS for the control border.
      var controlUI = document.createElement('div');
      controlUI.style.backgroundColor = '#fff';
      controlUI.style.border = '2px solid #fff';
      controlUI.style.borderRadius = '3px';
      controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
      controlUI.style.cursor = 'pointer';
      controlUI.style.marginBottom = '22px';
      controlUI.style.textAlign = 'center';
      controlUI.title = 'Click to recenter the map';
      controlDiv.appendChild(controlUI);

      // Set CSS for the control interior.
      var controlText = document.createElement('div');
      controlText.style.color = 'rgb(25,25,25)';
      controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
      controlText.style.fontSize = '16px';
      controlText.style.lineHeight = '38px';
      controlText.style.paddingLeft = '5px';
      controlText.style.paddingRight = '5px';
      controlText.innerHTML = 'Center Map';
      controlUI.appendChild(controlText);

      // Setup the click event listeners: simply set the map to Chicago.
      controlUI.addEventListener('click', function() {
        var posicaoUsuario = {lat: $scope.position.coords.latitude, lng: $scope.position.coords.longitude};
        map.setCenter(posicaoUsuario);
      });

    }
    // Recupera o endereço atual do usuário baseado em sua lat e lng
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
        }
    });
  });
}]);
