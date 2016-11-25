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
.controller('LoginCtrl', function($scope, $stateParams, $state, $http, $ionicPopup, $ionicLoading) {
	$scope.list = [];
	$scope.user = {
		email: "felipeems87@gmail.com",
		senha: "felipe"
	};
	$scope.init = function() {};

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

    facebookConnectPlugin.login(["email"], function(response) {
			if (response.authResponse) {
				facebookConnectPlugin.api('/me', null,
				function(response) {
					$ionicLoading.hide();
					console.log(JSON.stringify({data: response}));
					console.log(response.name);
					console.log(response.id);
				});
			}
    });
	};
  $scope.doGoogleLogin = function() {

    alert('Fazendo login com dados do Google+');

		$ionicLoading.show({
		  template: 'Carregando...'
		});

    if(window.localStorage.getItem("dadosUsuario") != null) {
          /*var user = JSON.parse(window.localStorage.getItem("dadosUsuario"));
          alert('Dados do usuário encontrados -> ' + user);
          alert('Dados do usuário encontrados NOME -> ' + user.nome + 'Dados do usuário encontrados EMAIL -> ' + user.email +
          'Dados do usuário encontrados tokenGmail -> ' + user.tokenGmail);*/

          var response = $http.get('http://ec2-52-67-37-24.sa-east-1.compute.amazonaws.com:8080/scgas/rest/usuarioservice/autenticaGmail/102140681765740944491', {});
          response.success(function(data, status, headers, config) {
            alert('Login via G+ realizado com sucesso!');
            alert(JSON.stringify({data2: data}));
            $state.go("app.playlists");
      		});
      		response.error(function(data, status, headers, config) {
            alert('Erros ao realizar Login via G+!');
            alert(JSON.stringify({data2: data}));
      		});

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
		$scope.newUserData = {
        nome: "",
        email: "",
        senha: "",
        confirmacaoSenha: "",
        tokenFacebook: "",
        tokenGmail: ""
		};
	};
  $scope.createNewUser = function(user) {
    delete user.confirmacaoSenha;
    alert('criar conta para -> ' + JSON.stringify({data2: user}));

		var response = $http.post(
      'http://ec2-52-67-37-24.sa-east-1.compute.amazonaws.com:8080/scgas/rest/usuarioservice/cadastrarusuario',
			user);
		response.success(function(data, status, headers, config) {
      alert('Usuário cadastrado com sucesso!');
      alert('Retorno -> ' + JSON.stringify({data2: data}));
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

        alert('Dados recuperados do G+ para Login, ' + JSON.stringify({data: obj}));
        $scope.newUserData = {
    			nome: obj.displayName,
    			email: obj.email,
          senha: "",
          confirmacaoSenha: "",
          tokenGmail: obj.userId
    		};

      },
      function (msg) {
        alert('Erro ao trazer dados do Google+, ' + JSON.stringify({data: msg}));
      }
    );
  };

  $scope.cadastrarFacebook = function() {
    alert('cadastrar facebbok');

    facebookConnectPlugin.login(["email"], function(response) {
      alert('chegou response'+JSON.stringify({data: response}));
      if (response.authResponse) {
        alert('chegou response.authResponse');
        facebookConnectPlugin.api('/me', null,
        function(response) {
          alert('Dados recuperados do FB para Login,' +JSON.stringify({data: response}));
          $scope.newUserData = {
      			nome: response.name,
      			email: response.email ? response.email : 'felipeems87@gmail.com',
            senha: "",
            confirmacaoSenha: "",
            tokenFacebook: response.id
      		};
        });
      }
    });
  };
});
