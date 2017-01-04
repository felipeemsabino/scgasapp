angular.module('starter.controllers')

.controller('MapaCtrl', ['$scope', '$state', '$cordovaGeolocation', '$ionicLoading', '$http', '$ionicPopup',

function($scope, $state, $cordovaGeolocation, $ionicLoading, $http, $ionicPopup) {
  try {
    $scope.allMarkers = []; // array para armazenar os markers do mapa
    $scope.arrPostos = []; // array para armazenar os postos recuperados do serviço
    $scope.bandeiras = [ // array para armazenar as bandeiras cadastradas
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
              aplicaFiltroBandeira();
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
      for(var contadorMarkers = 0;contadorMarkers < $scope.allMarkers.length;contadorMarkers++){
        for(var contadorBandeiras = 0;contadorBandeiras < $scope.bandeiras.length;contadorBandeiras++){
          if($scope.allMarkers[contadorMarkers].nomeBandeira == $scope.bandeiras[contadorBandeiras].nome) {//marker é da mesma bandeira
            if($scope.bandeiras[contadorBandeiras].selecionado) { //bandeira escolhida no filtro
              $scope.allMarkers[contadorMarkers].setMap($scope.map);
            } else {
              $scope.allMarkers[contadorMarkers].setMap(null);
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
    $scope.tracarRotaPosto = function () {
      alert('tracarRotaPosto');
    };

    // Atualiza as informações dos postos que estão no mapa
    $scope.atualizarInformacoesPostos = function () {
      $scope.removeDadosPostos();
      $scope.recuperaPostos();
    };

    // Configurações do mapa
    var options = {timeout: 10000, enableHighAccuracy: true};

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
          nomeBandeira: posto.bandeiraPosto.nome
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
      console.log(posto);
      $state.go('app.detalhe_posto', {paramPosto: posto});//
    };

    // Configurações do mapa e de localização do usuário
    $cordovaGeolocation.getCurrentPosition(options).then(function(position){
      $scope.show();
      $scope.position = position;

      var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      var mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

      //Reload markers every time the map moves
      google.maps.event.addListener($scope.map, 'dragend', function(){});

       //Reload markers every time the zoom changes
      google.maps.event.addListener($scope.map, 'zoom_changed', function(){});

      //Wait until the map is loaded
      google.maps.event.addListenerOnce($scope.map, 'idle', function(){
        $scope.hide();
        $scope.recuperaPostos();
      });
    }, function(error){
      //alert("erro -> "+JSON.stringify({data2: error}));
      window.plugins.toast.show('Ocorreram erros ao carregar o mapa. Verifique se a localização está ativada e tente novamente!', 'long', 'center', function(a){}, function(b){});
      //alert('Ocorreram erros ao carregar o mapa. Verifique se a localização está ativada e tente novamente!');
      $scope.hide();
    });

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
            $scope.arrPostos.push(data[counter]);
          }
          //alert('markers posicionados');
        });
        responseRecuperaPostos3.error(function(data, status, headers, config) {
          alert('Erro ao recuperar postos! -> '+JSON.stringify({data2: data}));
          //window.plugins.toast.show('Ocorreram erros ao carregar o mapa. Verifique se a localização está ativada e tente novamente!', 'long', 'center', function(a){}, function(b){});
        });
    };
  } catch (ex) {alert(ex);}
}]);
