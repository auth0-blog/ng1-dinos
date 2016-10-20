// fetch API data
(function() {
	'use strict';

	angular
		.module('ng1-dinos')
		.factory('APIData', APIData);

	APIData.$inject = ['$http', 'Res'];

	function APIData($http, Res) {
		var _API = 'http://swapi.co/api/';

		// callable members
		return {
			getPeople: getPeople,
			getDataByRoute: getDataByRoute
		};

		/**
		 * GET SW people and return results
		 *
		 * @returns {promise}
		 */
		function getPeople() {
			return $http
				.get(_API + '?format=json')
				.then(Res.success, Res.error);
		}

		/**
		 * 
		 * 
		 * @param {any} id
		 * @returns
		 */
		function getPerson(id) {
			return $http
				.get('http://swapi.co/api/' + _id + '?format=json')
				.then(Res.success, Res.error);
		}

		/**
		 * GET requested data and return results
		 *
		 * @param url {String} full URL of API route
		 * @returns {promise}
		 */
		function getDataByRoute(url) {
			return $http
				.get(url)
				.then(Res.success, Res.error);
		}
	}
}());