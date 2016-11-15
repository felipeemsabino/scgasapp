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
    
    facebookConnectPlugin.login(["email"], function(response) {
             if (response.authResponse) {
                 facebookConnectPlugin.api('/me', null,
                     function(response) {
                         alert('Good to see you, ' + JSON.stringify({data: response}));
                     });
             }
         });
      
      
      
  };
    
  $scope.doLoginFacebook = function() {
      
      
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

.controller('NewAccountCtrl', function($scope, $stateParams, $http) {
   
	$scope.init = function () {
		$scope.newUserData = {
			nome: "Felipe",
			email: "felipeems87@gmail.com",
			senha: "felipe",
			confirmacaoSenha: "felipe",
			tokenFacebook: "jointt",
			tokenGmail: "jointt"
		};
	};
	$scope.createNewUser = function(user) {
        
        
        
		delete user.confirmacaoSenha;
		console.log(user);
		
        
        var response = $http.post('http://ec2-52-67-37-24.sa-east-1.compute.amazonaws.com:8080/scgas/rest/usuarioservice/cadastrarusuario', 
			user);
		response.success(function(data, status, headers, config) {
			$scope.message = data;
		});
		response.error(function(data, status, headers, config) {
			alert( "failure message: " + JSON.stringify({data: data}));
		});
        
        
        

	};
    
    
});
