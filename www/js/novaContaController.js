angular.module('starter.controllers')

.controller('NovaContaCtrl', ['$scope', '$stateParams', '$state', '$http', '$ionicPopup', '$ionicLoading',
function($scope, $stateParams, $state, $http, $ionicPopup, $ionicLoading) {

  $scope.init = function () {

    var storedUser = JSON.parse(window.localStorage.getItem("dadosUsuario"));

    $scope.newUserData = {
        nome: "",
        email: "",
        senha: "",
        confirmacaoSenha: ""
    };
    if (storedUser != null) {
      $scope.newUserData.id = storedUser.id;
    }
  };
  $scope.createNewUser = function() {
    delete $scope.newUserData.confirmacaoSenha;
    //alert('criar conta para -> ' + JSON.stringify({data2: $scope.newUserData}));
    //alert('criar conta para -> ' + $scope.newUserData.id);

    var response = $http.post(
      'http://ec2-52-67-37-24.sa-east-1.compute.amazonaws.com:8080/scgas/rest/usuarioservice/cadastrarusuario',
      $scope.newUserData);
    response.success(function(data, status, headers, config) {
      //alert('Usuário cadastrado com sucesso!');
      //alert('Retorno -> ' + JSON.stringify({data2: data}));
      window.localStorage.setItem("dadosUsuario", JSON.stringify(data));
      $state.go("app.playlists");
    });
    response.error(function(data, status, headers, config) {
      window.plugins.toast.show('Ocorreram erros ao cadastrar usuário. Tente novamente!', 'long', 'center', function(a){}, function(b){});
      //alert('Erro -> ' + JSON.stringify({data2: data}));
    });
  };
  $scope.cadastrarGoogle = function() {
    //alert('Cadastrar via Google+!');
    window.plugins.googleplus.login( {},
      function (obj) {
        //alert('Dados recuperados do G+ para Login, ' + JSON.stringify({data: obj}));
        var storedUser = JSON.parse(window.localStorage.getItem("dadosUsuario"));
        //alert('storedUser ' + JSON.stringify({data: storedUser}));
        if(storedUser != null) {
          $scope.newUserData.id = storedUser.id;
        }
        //alert('storedUser ' + storedUser.id+ ' storedUser ' + storedUser.nome
        //+' storedUser ' + storedUser.email);

        $scope.newUserData.nome = storedUser != null ? storedUser.nome : obj.displayName;
        $scope.newUserData.email = storedUser != null ? storedUser.email : obj.email;
        $scope.newUserData.senha = "";
        $scope.newUserData.confirmacaoSenha = "";
        $scope.newUserData.tokenGmail = obj.userId;
        //alert('apos setar tudo no model ' + JSON.stringify({data: $scope.newUserData}));

      },
      function (msg) {
        window.plugins.toast.show('Erro ao recuperar dados do Google+!', 'long', 'center', function(a){}, function(b){});
        //alert('Erro ao trazer dados do Google+, ' + JSON.stringify({data: msg}));
      }
    );
  };

  $scope.cadastrarFacebook = function() {
    //alert('Cadastrar via Facebook!');

    facebookConnectPlugin.login(["email"], function(response) {
      //alert('chegou response'+JSON.stringify({data: response}));
      if (response.authResponse) {
        //alert('chegou response.authResponse');
        facebookConnectPlugin.api('/me', null,
        function(response) {
          //alert('Dados recuperados do FB para Login,' +JSON.stringify({data: response}));
          var storedUser = JSON.parse(window.localStorage.getItem("dadosUsuario"));

          if(storedUser != null) {
            $scope.newUserData.id = storedUser.id;
          }
          $scope.newUserData.nome = storedUser != null ? storedUser.nome : response.name;
          $scope.newUserData.email = storedUser != null ? storedUser.email : response.email;
          $scope.newUserData.senha = "";
          $scope.newUserData.confirmacaoSenha = "";
          $scope.newUserData.tokenFacebook = response.id;
        });
      }
    });
  };

}]);
