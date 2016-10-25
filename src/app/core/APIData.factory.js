// fetch API data
(function() {
	'use strict';

	angular
		.module('app')
		.factory('APIData', APIData);

	APIData.$inject = ['$http', 'Res'];

	function APIData($http, Res) {
		var _API = 'http://localhost:3001/api/';

		// callable members
		return {
			getAllDinos: getAllDinos,
			getDino: getDino
		};

		/**
		 * GET all dinosaurs and return results
		 *
		 * @returns {promise}
		 */
		function getAllDinos() {
			return $http
				.get(_API + 'dinosaurs')
				.then(Res.success, Res.error);
		}

		/**
		 * GET a specific dinosaur and return results
		 * 
		 * @param {Integer} id
		 * @returns
		 */
		function getDino(id) {
			return $http
				.get(_API + 'dinosaur/' + id)
				.then(Res.success, Res.error);
		}
	}
}());