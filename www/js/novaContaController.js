angular.module('starter.controllers')

.controller('NovaContaCtrl', ['$scope', '$stateParams', '$state', '$http',
'$ionicPopup', '$ionicLoading', '$ionicSideMenuDelegate',
function($scope, $stateParams, $state, $http, $ionicPopup, $ionicLoading,
  $ionicSideMenuDelegate) {

  $scope.$on('$ionicView.afterEnter', function() {
    $ionicSideMenuDelegate.canDragContent(false)
    $scope.$root.showMenuIcon = false;
    $scope.termosCondicoes = false;
  });

  $scope.init = function () {
    //alert('init tela nova conta');
    $ionicLoading.show({
      template: 'Carregando...'
    });

    var storedUser = JSON.parse(window.localStorage.getItem("dadosUsuario"));

    $scope.newUserData = {
        nome: "",
        email: "",
        senha: "",
        confirmacaoSenha: ""
    };
    if (storedUser != null) {
      $scope.newUserData.id = storedUser.id;
      $scope.newUserData.nome = storedUser.nome;
      $scope.newUserData.email = storedUser.email;
    }

      $ionicLoading.hide();
  };
  $scope.createNewUser = function() {
    if(!$scope.termosCondicoes) {
      window.plugins.toast.show('Antes de prosseguir leia e aceite os termos e condições!', 'long', 'center', function(a){}, function(b){});
      return;
    }
    //alert('criar conta para -> ' + JSON.stringify({data2: $scope.newUserData}));
    //alert('criar conta para -> ' + $scope.newUserData.id);

    if($scope.newUserData.senha == "") {
      window.plugins.toast.show('Senha obrigatória!', 'long', 'center', function(a){}, function(b){});
      return;
    }

    if($scope.newUserData.senha != $scope.newUserData.confirmacaoSenha) {
      window.plugins.toast.show('Senhas não conferem!', 'long', 'center', function(a){}, function(b){});
      return;
    }

    delete $scope.newUserData.confirmacaoSenha;

    var response = $http.post(
      $scope.defaultURL+'/scgas/rest/usuarioservice/cadastrarusuario',
      $scope.newUserData);
    response.success(function(data, status, headers, config) {
      //alert('Usuário cadastrado com sucesso!');
      //alert('Retorno -> ' + JSON.stringify({data2: data}));

      window.localStorage.setItem("dadosUsuario", JSON.stringify(data));

      window.plugins.toast.show('Conta cadastrada com sucesso.', 'long', 'center', function(a){}, function(b){});

      var navegarTelaInicial = window.localStorage.getItem("dadosUsuario") == null ? false : true;

      if(navegarTelaInicial)
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
        $scope.newUserData.tokenFacebook = (storedUser != null && storedUser.tokenFacebook != null) ? storedUser.tokenFacebook  : null;
        //alert('apos setar tudo no model ' + JSON.stringify({data: $scope.newUserData}));
        $scope.$apply();
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
          $scope.newUserData.tokenGmail = (storedUser != null && storedUser.tokenGmail != null) ? storedUser.tokenGmail  : null;
          $scope.$apply();
        });
      }
    });
  };
  $scope.abrirTermosCondicoes = function () {
    $state.go("app.termos_condicoes");
  };
  $scope.atualizaTermoCondicoes = function () {
    $scope.termosCondicoes = !$scope.termosCondicoes;
  };
}]);
