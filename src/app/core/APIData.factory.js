// fetch API data
(function() {
	'use strict';

	angular
		.module('app')
		.factory('APIData', APIData);

	APIData.$inject = ['$http'];

	function APIData($http) {
		var _baseUrl = 'http://localhost:3001/api/';

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
				.get(_baseUrl + 'dinosaurs')
				.then(_handleSuccess, _handleError);
		}

		/**
		 * GET a specific dinosaur and return results
		 * 
		 * @param {number} id
		 * @returns {promise}
		 */
		function getDino(id) {
			return $http
				.get(_baseUrl + 'dinosaur/' + id)
				.then(_handleSuccess, _handleError);
		}
	}

	/**
	 * Promise response function
	 * Checks typeof data returned and succeeds if JS object, throws error if not
	 * Useful for APIs (ie, with nginx) where server error HTML page may be returned in error
	 * 
	 * @param {any} res
	 * @returns
	 */
	function _handleSuccess(res) {
		if (angular.isObject(res.data)) {
			return res.data;
		} else {
			_handleError({message: 'retrieved data is not typeof object'});
		}
	}

	/**
	 * Promise response function - error
	 * Throws an error with error data
	 * 
	 * @param {any} err
	 */
	function _handleError(err) {
		throw new Error('Error retrieving data', error);
	}
}());