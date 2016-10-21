// application config
(function() {
	'use strict';

	angular
		.module('ng1-dinos')
		.config(appConfig);

	appConfig.$inject = ['$routeProvider', '$locationProvider'];

	function appConfig($routeProvider, $locationProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'ng1-dinos/pages/home/Home.view.html',
				controller: 'HomeCtrl',
				controllerAs: 'home'
			})
			.when('/dinosaur/:id', {
				templateUrl: 'ng1-dinos/pages/detail/Detail.view.html',
				controller: 'DetailCtrl',
				controllerAs: 'detail'
			})
			.otherwise({
				templateUrl: 'ng1-dinos/pages/error404/Error404.view.html',
				controller: 'Error404Ctrl',
				controllerAs: 'e404'
			});

		$locationProvider
			.html5Mode({
				enabled: true
			})
			.hashPrefix('!');
	}
}());