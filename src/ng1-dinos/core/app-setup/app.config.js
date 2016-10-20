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
			.when('/subpage', {
				templateUrl: 'ng1-dinos/pages/sub/Sub.view.html',
				controller: 'SubCtrl',
				controllerAs: 'sub',
				resolve: {
					resolveData: resolveData
				}
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

	resolveData.$inject = ['APIData'];
	/**
	 * Get data for route resolve
	 *
	 * @param APIData {factory}
	 * @returns {promise} data
	 */
	function resolveData(APIData) {
		return APIData.getAllDinos();
	}
}());