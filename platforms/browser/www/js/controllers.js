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
.controller('LoginCtrl', function($scope, $stateParams, $http, $ionicPopup, $ionicLoading) {
	$scope.list = [];
	$scope.user = {
		email: "felipeems87@gmail.com",
		senha: "felipe"
	};
	$scope.init = function() {};
	
	$scope.submit = function(user) {
		var response = $http.post('http://ec2-52-67-37-24.sa-east-1.compute.amazonaws.com:8080/scgas/rest/usuarioservice/autentica', user);
		response.success(function(data, status, headers, config) {
			$scope.message = data;
		});
		response.error(function(data, status, headers, config) {
			
			 // An alert dialog
			 $scope.showAlert = function(status) {
			   var errorMessage = 'Usuário e/ou senha inválidos. Verifique os dados e tente novamente!';
			   if(status == 500)
				   errorMessage = 'Problemas com o servidor. Tente novamente mais tarde.';
			   var alertPopup = $ionicPopup.alert({
				 title: 'Erro ao realizar login',
				 template: errorMessage
			   });

			   alertPopup.then(function(res) {
				 //console.log('Thank you for not eating my delicious ice cream cone');
			   });
			 };
			 $scope.showAlert(status);
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
		$ionicLoading.show({
		  template: 'Carregando...'
		});
		
		window.plugins.googleplus.login(
			{},
			function (obj) {
				console.log("function (obj)");
				console.log(obj);
				$ionicLoading.hide();
				alert('Good to see you 1, ' + JSON.stringify({data: obj}));
			},
			function (msg) {
				console.log("function (msg)");
				console.log(msg);
				$ionicLoading.hide();
				alert('Good to see you 2, ' + JSON.stringify({data: msg}));
			}
		);
	};
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
})

.controller('NewAccountCtrl', function($scope, $stateParams, $http, $ionicPopup) {
   
	$scope.init = function () {
		$scope.newUserData = {
			nome: "Felipe",
			email: "felipeems87@gmail.com",
			senha: "felipe",
			confirmacaoSenha: "felipe"
		};
	};
	$scope.createNewUser = function(user) {
        delete user.confirmacaoSenha;
		console.log(user);
		
		var response = $http.post('http://ec2-52-67-37-24.sa-east-1.compute.amazonaws.com:8080/scgas/rest/usuarioservice/cadastrarusuario', 
			user);
		response.success(function(data, status, headers, config) {
			console.log("success createNewUser message");
			console.log($scope.message);
		});
		response.error(function(data, status, headers, config) {
			// An alert dialog
			 $scope.showAlert = function(status) {
			   var errorMessage = 'Verifique os dados e tente novamente!';
			   if(status == 500)
				   errorMessage = 'Problemas com o servidor. Tente novamente mais tarde.';
			   var alertPopup = $ionicPopup.alert({
				 title: 'Erro ao realizar cadastro!',
				 template: errorMessage
			   });

			   alertPopup.then(function(res) {
				 //console.log('Thank you for not eating my delicious ice cream cone');
			   });
			 };
			 $scope.showAlert(status);
		});
	};
});
