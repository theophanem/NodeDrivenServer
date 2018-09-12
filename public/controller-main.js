var app = angular.module('todoapp', ['ngRoute', 'angularFileUpload', 'ngMaterial']);

app.config(function($routeProvider) {
	$routeProvider
	.when('/home', {
		title: 'Accueil',
		nav: 'home',
		templateUrl: 'home.html'
	})
	.when('/gallery', {
		title: 'Galerie',
		nav: 'gallery',
		templateUrl: 'gallery.html'
	})
	
	$routeProvider.otherwise({
		redirectTo: '/home'
	});
});

app.run(['$rootScope', '$route', function($rootScope, $route) {
	$rootScope.$on('$routeChangeSuccess', function() {
		$rootScope.title = $route.current.title;
		$rootScope.nav = $route.current.nav;
	});
}]);

app.controller('mainController', ['$scope', '$rootScope', '$http', '$location', '$mdDialog', '$window', function($scope, $rootScope, $http, $location, $mdDialog, $window) {
	var self = this;
	
	self.goto = function(route) {
		if(route===$rootScope.nav)
			$window.location.reload();
		else
			$location.path('/'+route);
	}
	
	$rootScope.showAlert = function(title, textContent) {
		$mdDialog.show(
			$mdDialog.alert()
			.parent(angular.element(document.querySelector('#popupContainer')))
			.clickOutsideToClose(true)
			.title(title)
			.textContent(textContent)
			.ok('Fermer')
		);
	};
	
	/*$scope.getVoice = function(voiceName, synth) {
		return new Promise((resolve, reject) => {
			synth.onvoiceschanged = function() {
				const voices = synth.getVoices();

				console.log("see all available languages and voices on your system: ", voices);

				for(let i = 0; i < voices.length ; i++) {
					if(voices[i].name == voiceName) {
						resolve(voices[i]);
					}
				}
			}
			synth.getVoices();
		});
	}
	
	$scope.saySomething = function(whatToSay) {
		const synth = window.speechSynthesis;
		const voices = synth.getVoices();
		console.log("see all available languages and voices on your system: ", voices);
		$scope.getVoice("Google FR French", synth)  
		.then(voice => {
			var utterThis = new SpeechSynthesisUtterance(whatToSay);
			utterThis.voice = voice;
			synth.speak(utterThis);
		})
		.catch(error => console.log("error: ", error));
	}

	$scope.saySomething("Troubadouhidoubadouhitoutouyoutou");*/
	
}]);