angular.module('starter.controllers')

.controller('MapaCtrl', ['$scope', '$state', '$cordovaGeolocation', '$ionicLoading', '$http',

function($scope, $state, $cordovaGeolocation, $ionicLoading, $http) {
  try {

    $scope.show = function() {
      $ionicLoading.show({
        template: 'Carregando...',
        duration: 5000
      }).then(function(){});
    };
    $scope.hide = function(){
      $ionicLoading.hide().then(function(){});
    };

    $scope.arrPostos = [];
    $scope.postos = [{
        "preco": "2.999",
        "ultimaAtualizacao": "Há 1 hora",
        "endereco": "Avenida Nonoai, 000",
        "bandeira": "Ipiranga",
        "distancia": "3 km"
      }, {
        "preco": "2.998",
        "ultimaAtualizacao": "Há 1 dia",
        "endereco": "Avenida Tancredo Neves, 000",
        "bandeira": "Ipiranga",
        "distancia": "3 km"
      }, {
        "preco": "2.997",
        "ultimaAtualizacao": "Há 4 horas",
        "endereco": "Avenida Prof. Mario Werneck, 000",
        "bandeira": "Ipiranga",
        "distancia": "3 km"
      }
    ];

    $scope.$on('$ionicView.beforeEnter', function (e, data) {
      $scope.$root.showMenuIcon = false;
    });

    $scope.$on('$stateChangeSuccess', function() {
      $scope.loadMore();
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

    var options = {timeout: 10000, enableHighAccuracy: true};

    $scope.criarMarkers = function (lat, lng) {
      var latFormatada = parseFloat(lat.replace(',','.'));
      var lngFormatada = parseFloat(lng.replace(',','.'));
      var latLng = new google.maps.LatLng(latFormatada, lngFormatada);
      
      var marker = new google.maps.Marker({
          map: $scope.map,
          animation: google.maps.Animation.DROP,
          position: latLng
      });

      var infoWindow = new google.maps.InfoWindow({
          content: "Here I am!"
      });

      google.maps.event.addListener(marker, 'click', function () {
          infoWindow.open($scope.map, marker);
      });
    };

    $cordovaGeolocation.getCurrentPosition(options).then(function(position){
      $scope.show();

      var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      var mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

      //Reload markers every time the map moves
      google.maps.event.addListener($scope.map, 'dragend', function(){
         //alert("moved!");
      });

       //Reload markers every time the zoom changes
      google.maps.event.addListener($scope.map, 'zoom_changed', function(){
       //alert("zoomed!");
      });

      //Wait until the map is loaded
      google.maps.event.addListenerOnce($scope.map, 'idle', function(){
        $scope.hide();

        var responseRecuperaPostos1 = $http.get('http://ec2-52-67-37-24.sa-east-1.compute.amazonaws.com:8080/scgas/rest/postoservice/listaPostos/0/45/'+position.coords.latitude+'/'+position.coords.longitude, {timeout: 5000});
        responseRecuperaPostos1.success(function(data, status, headers, config) {
          //alert('resultado de postos! -> '+JSON.stringify({data2: data}));
          //window.plugins.toast.show('Ocorreram erros ao carregar o mapa. Verifique se a localização está ativada e tente novamente!', 'long', 'center', function(a){}, function(b){});
          $scope.arrPostos = $scope.arrPostos.concat(data);
          for(var counter = 0;counter < data.length-1;counter++){ // sempre ignorar ultima posicao do array
            $scope.criarMarkers(data[counter].coordenadaX, data[counter].coordenadaY);
          }
		  console.log($scope.arrPostos[0]);
          //alert('markers posicionados');
        });
        responseRecuperaPostos1.error(function(data, status, headers, config) {
          alert('Erro ao recuperar postos! -> '+JSON.stringify({data2: data}));
          //window.plugins.toast.show('Ocorreram erros ao carregar o mapa. Verifique se a localização está ativada e tente novamente!', 'long', 'center', function(a){}, function(b){});
        });

		var responseRecuperaPostos2 = $http.get('http://ec2-52-67-37-24.sa-east-1.compute.amazonaws.com:8080/scgas/rest/postoservice/listaPostos/45/50/'+position.coords.latitude+'/'+position.coords.longitude, {timeout: 5000});
		responseRecuperaPostos2.success(function(data, status, headers, config) {
		  //alert('resultado de postos! -> '+JSON.stringify({data2: data}));
		  //window.plugins.toast.show('Ocorreram erros ao carregar o mapa. Verifique se a localização está ativada e tente novamente!', 'long', 'center', function(a){}, function(b){});
		  $scope.arrPostos = $scope.arrPostos.concat(data);
		  for(var counter = 0;counter < data.length-1;counter++){ // sempre ignorar ultima posicao do array
			$scope.criarMarkers(data[counter].coordenadaX, data[counter].coordenadaY);
		  }
		  //alert('markers posicionados');
		});
		responseRecuperaPostos2.error(function(data, status, headers, config) {
		  alert('Erro ao recuperar postos! -> '+JSON.stringify({data2: data}));
		  //window.plugins.toast.show('Ocorreram erros ao carregar o mapa. Verifique se a localização está ativada e tente novamente!', 'long', 'center', function(a){}, function(b){});
		});

		var responseRecuperaPostos3 = $http.get('http://ec2-52-67-37-24.sa-east-1.compute.amazonaws.com:8080/scgas/rest/postoservice/listaPostos/90/150/'+position.coords.latitude+'/'+position.coords.longitude, {timeout: 5000});
		responseRecuperaPostos3.success(function(data, status, headers, config) {
		  //alert('resultado de postos! -> '+JSON.stringify({data2: data}));
		  //window.plugins.toast.show('Ocorreram erros ao carregar o mapa. Verifique se a localização está ativada e tente novamente!', 'long', 'center', function(a){}, function(b){});
		  $scope.arrPostos = $scope.arrPostos.concat(data);
		  for(var counter = 0;counter < data.length-1;counter++){ // sempre ignorar ultima posicao do array
			$scope.criarMarkers(data[counter].coordenadaX, data[counter].coordenadaY);
		  }
		  //alert('markers posicionados');
		});
		responseRecuperaPostos3.error(function(data, status, headers, config) {
		  alert('Erro ao recuperar postos! -> '+JSON.stringify({data2: data}));
		  //window.plugins.toast.show('Ocorreram erros ao carregar o mapa. Verifique se a localização está ativada e tente novamente!', 'long', 'center', function(a){}, function(b){});
		}); 
      });
    }, function(error){
      //alert("erro -> "+JSON.stringify({data2: error}));
      window.plugins.toast.show('Ocorreram erros ao carregar o mapa. Verifique se a localização está ativada e tente novamente!', 'long', 'center', function(a){}, function(b){});
      //alert('Ocorreram erros ao carregar o mapa. Verifique se a localização está ativada e tente novamente!');
      $scope.hide();
    });
  } catch (ex) {alert(ex);}
}]);
