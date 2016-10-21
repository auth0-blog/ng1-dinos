(function() {
	'use strict';

	angular
		.module('ng1-dinos')
		.factory('Res', Res);

	Res.$inject = ['$rootScope'];

	function Res($rootScope) {
		// callable members
		return {
			success: success,
			error: error
		};

		/**
		 * Promise response function
		 * Checks typeof data returned and succeeds if JS object, throws error if not
		 * Useful for APIs (ie, with nginx) where server error HTML page may be returned in error
		 *
		 * @param response {*} data from $http
		 * @returns {*} object, array
		 */
		function success(response) {
			if (angular.isObject(response.data)) {
				return response.data;
			} else {
				throw new Error('retrieved data is not typeof object.');
			}
		}

		/**
		 * Promise response function - error
		 * Ends loading spinner
		 * Throws an error with error data
		 *
		 * @param error {object}
		 */
		function error(error) {
			$rootScope.$broadcast('loading-off');
			throw new Error('Error retrieving data', error);
		}
	}
}());