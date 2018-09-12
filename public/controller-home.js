app.controller('homeController', ['$scope', '$http', function($scope, $http) {
	var self = this;
	self.formData = {};
	
	self.todos = [];
	
	$http.get("/api/todos").then(function(response) {
		self.todos = response.data;
	},function(response) {
		console.log("Error: " + response);
	});
	
	self.createTodo = function() {
		$http.post("/api/todos", self.formData).then(function(response) {
			self.formData = {};
			self.todos = response.data;
		},function(response) {
			console.log("Error: " + response);
		});
	};
	
	self.deleteTodo = function(id) {
		$http.delete("/api/todos/"+id).then(function(response) {
			self.todos = response.data;
		},function(response) {
			console.log("Error: " + response);
		});
	};
}]);