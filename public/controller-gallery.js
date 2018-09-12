app.controller('galleryController', ['$scope', '$rootScope', '$http', '$mdDialog', '$route', '$location', function($scope, $rootScope, $http, $mdDialog, $route, $location) {
	var self = this;
	var urlParams = $location.search();
	if (urlParams.success) {
		$rootScope.showAlert("Image sauvegardée");
		$location.search('success', null);
	}
	self.images = [];
	self.imagesPerRow = 5;
	self.data = "";
	self.contentType = "image/jpeg";
	
	$http.get("api/image/").then(function successCallback(response) {
		self.images = response.data;
		self.rowAmount = Math.floor(self.images.length/self.imagesPerRow) + 1;
	}, function errorCallback(response) {
		$rootScope.showAlert("Impossible de charger les images.");
	});
	
	self.growImage = function(picture) {
		$mdDialog.show({
			template: '<img src="data:'+picture.contentType+';base64, '+picture.data+'" aria-label="'+picture.name+'"/>',
			clickOutsideToClose: true
		});
	};
	
	self.delete = function(id) {
		$http.delete("api/image/"+id).then(function successCallback(response) {
			$rootScope.showAlert("Suppression réussie");
			self.images = response.data;
		});		
	};
	
	
}]);