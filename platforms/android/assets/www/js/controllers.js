angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {


  };

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Triggered in the login modal to open a new user window
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    /**
    facebookConnectPlugin.login(["email"], function(response) {
             if (response.authResponse) {
                 facebookConnectPlugin.api('/me', null,
                     function(response) {
                         alert('Good to see you, ' + JSON.stringify({data: response}));
                     });
             }
         });
         */

      //Template Google+
       window.plugins.googleplus.login(
        {},
        function (obj) {
          alert('Good to see you, ' + JSON.stringify({data: obj}));

        },
        function (msg) {
            alert('Good to see you, ' + JSON.stringify({data: msg}));

        }
    );



  };

  $scope.doLoginFacebook = function() {


  };

})
/***
* Login controller
**/
/*.controller('LoginCtrl', function($scope, $stateParams, $state, $http, $ionicPopup, $ionicLoading) {
	$scope.list = [];
	$scope.user = {
		email: "",
		senha: ""
	};
	$scope.init = function() {



  };

	$scope.submit = function(user) {
		var response = $http.post('http://ec2-52-67-37-24.sa-east-1.compute.amazonaws.com:8080/scgas/rest/usuarioservice/autentica', user);
		response.success(function(data, status, headers, config) {
      alert('Login realizado com sucesso!');
      // Sobrescreve registro de login
      window.localStorage.setItem("dadosUsuario", data);
      $state.go("app.playlists");
		});
		response.error(function(data, status, headers, config) {
			   var errorMessage = 'Usuário e/ou senha inválidos. Verifique os dados e tente novamente!';
			   if(status == 500)
				   errorMessage = 'Problemas com o servidor. Tente novamente mais tarde.';
         alert(errorMessage);
		});
	};
	$scope.doFacebookLogin = function() {
		$ionicLoading.show({
		  template: 'Carregando...'
		});

    if(window.localStorage.getItem("dadosUsuario") != null) {

          var user = JSON.parse(window.localStorage.getItem("dadosUsuario"));
          if(user.tokenFacebook == null || user.tokenFacebook == "") {
            alert('Cadastre-se utilizando o FB antes de realizar login!');
          } else {
            var response = $http.get('http://ec2-52-67-37-24.sa-east-1.compute.amazonaws.com:8080/scgas/rest/usuarioservice/autenticaFacebook/'+user.tokenFacebook, {});
            response.success(function(data, status, headers, config) {
              alert('Login via FB realizado com sucesso!');
              alert(JSON.stringify({data2: data}));
              $state.go("app.playlists");
            });
            response.error(function(data, status, headers, config) {
              alert('Erros ao realizar Login via FB!');
              alert(JSON.stringify({data2: data}));
            });
          }
    } else {
        alert('Nada encontrado no localStorage');
        $state.go("app.user_login");
    }
    $ionicLoading.hide();
	};
  $scope.doGoogleLogin = function() {

    alert('Fazendo login com dados do Google+');

		$ionicLoading.show({
		  template: 'Carregando...'
		});

    if(window.localStorage.getItem("dadosUsuario") != null) {
          //var user = JSON.parse(window.localStorage.getItem("dadosUsuario"));
          //alert('Dados do usuário encontrados -> ' + user);
          //aert('Dados do usuário encontrados NOME -> ' + user.nome + 'Dados do usuário encontrados EMAIL -> ' + user.email +
          //'Dados do usuário encontrados tokenGmail -> ' + user.tokenGmail);
          var user = JSON.parse(window.localStorage.getItem("dadosUsuario"));
          if(user.tokenGmail == null || user.tokenGmail == "") {
            alert('Cadastre-se utilizando o G+ antes de realizar login!');
          } else {

            var response = $http.get('http://ec2-52-67-37-24.sa-east-1.compute.amazonaws.com:8080/scgas/rest/usuarioservice/autenticaGmail/'+user.tokenGmail, {});
            response.success(function(data, status, headers, config) {
              alert('Login via G+ realizado com sucesso!');
              alert(JSON.stringify({data2: data}));
              $state.go("app.playlists");
        		});
        		response.error(function(data, status, headers, config) {
              alert('Erros ao realizar Login via G+!');
              alert(JSON.stringify({data2: data}));
        		});
          }
    } else {
        alert('Nada encontrado no localStorage');
        $state.go("app.user_login");
    }
    $ionicLoading.hide();
	};
  $scope.cadastrarUsuario = function() {
    $ionicLoading.show({
      template: 'Carregando...'
    });

    $state.go("app.new_account");

    $ionicLoading.hide();
  };
})

.controller('TelaInicialCtrl', function($scope, $ionicPopup, $state) {

  $scope.init = function() {
    if(window.localStorage.getItem("dadosUsuario") != null) {
          var user = JSON.parse(window.localStorage.getItem("dadosUsuario"));
          alert('Dados do usuário encontrados -> ' + user);
          alert('Dados do usuário encontrados NOME -> ' + user.nome);
          alert('Dados do usuário encontrados EMAIL -> ' + user.email);
    } else {
        alert('Nada encontrado no localStorage');
        $state.go("app.user_login");
    }
  };
})

.controller('PlaylistCtrl', function($scope, $stateParams) {

})

.controller('NewAccountCtrl', function($scope, $stateParams, $state, $http, $ionicPopup) {

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
      alert('Ocorreram erros ao cadastrar usuário. Tente novamente!');
      alert('Erro -> ' + JSON.stringify({data2: data}));
		});
	};
  $scope.cadastrarGoogle = function() {
    alert('Cadastrar via Google+!');
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
        alert('Erro ao trazer dados do Google+, ' + JSON.stringify({data: msg}));
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
})*/;
