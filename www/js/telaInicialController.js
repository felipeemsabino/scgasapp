angular.module('starter.controllers')

.controller('TelaInicialCtrl', ['$scope', '$stateParams', '$state', '$http', '$ionicSideMenuDelegate', '$ionicLoading', '$ionicPlatform',
function($scope, $stateParams, $state, $http, $ionicSideMenuDelegate, $ionicLoading, $ionicPlatform) {

  $scope.$on('$ionicView.beforeEnter', function (e, data) {
    //alert('tela inicial '+ window.localStorage.getItem("dadosUsuario"));
    $ionicSideMenuDelegate.canDragContent(true);

    $scope.$root.showMenuIcon = true;

    if(window.localStorage.getItem("dadosUsuario") === null || window.localStorage.getItem("dadosUsuario") === 'null'
      || window.localStorage.getItem("dadosUsuario") === '') {
        $state.go("app.user_login");
    } else {
        var user = JSON.parse(window.localStorage.getItem("dadosUsuario"));
        window.FirebasePlugin.getToken(function(token) {
          // save this server-side and use it to push notifications to this device
          $scope.updateTokenFCM(token);
        }, function(error) {
            console.error(error);
        });

        window.FirebasePlugin.onTokenRefresh(function(token) {
          // save this server-side and use it to push notifications to this device
             $scope.updateTokenFCM(token);
          }, function(error) {
              console.error(error);
          });

          window.FirebasePlugin.setBadgeNumber(0);
          window.FirebasePlugin.subscribe("all");
          window.FirebasePlugin.grantPermission();

    }
  });

  $scope.carregaRetornoInvestimento = function (){
    $state.go("app.retorno_investimento");
  };

  $scope.carregaCalcEconomia = function (){
    $state.go("app.calculadora_economia");
  };

  $scope.carregaMapa = function() {
    //$state.go("app.mapa");
    $state.go("app.mapa_postos");
  };

  $scope.loadNews = function() {
    $state.go("app.lista_noticias");
  };

  $scope.openInstaladoresCordovaWebView = function()
  {
     // Open cordova webview if the url is in the whitelist otherwise opens in app browser
        window.open('http://www.inmetro.gov.br/inovacao/oficinas/lista_oficinas.asp?end=1&descr_estado=sc','_blank');
  };

  $scope.openInspecaoCordovaWebView = function()
  {
     // Open cordova webview if the url is in the whitelist otherwise opens in app browser
        window.open('http://www.inmetro.gov.br/organismos/resultado_consulta.asp?Seq_Tipo_Relacionamento=13&Ind_Status=A&Sig_Pais=BRA&Ind_Ordenacao=C&Sig_Uf=SC','_blank');
  };

  $scope.openLicenciamentoCordovaWebView = function()
  {
     // Open cordova webview if the url is in the whitelist otherwise opens in app browser
        window.open('http://www.detran.sc.gov.br/index.php/institucional/endereco-ciretrans','_blank');
  };

  $scope.updateTokenFCM = function(token){
       var user = JSON.parse(window.localStorage.getItem("dadosUsuario"));

       user.tokenNotificacao = token;
       var response = $http.post($scope.defaultURL+'/scgas/rest/usuarioservice/atualizaTokenNotificacao',user);

        // Response retornado com sucesso
         response.success(function(data, status, headers, config) {});

        // Response retornado com erros
         response.error(function(data, status, headers, config) {

              if(status == 500){
                errorMessage = 'Problemas com o servidor. Tente novamente mais tarde.';
                window.plugins.toast.show(errorMessage, 'long', 'center', function(a){}, function(b){});
              }

          });

  };



  $scope.init = function() {
    var customBackButton = function() {};

    // registerBackButtonAction() returns a function which can be used to deregister it
    var deregisterBackButtonAction = $ionicPlatform.registerBackButtonAction(
        customBackButton, 101
    );

    $scope.$on('$destroy', function() {
        deregisterBackButtonAction();
    });

  };
}]);
