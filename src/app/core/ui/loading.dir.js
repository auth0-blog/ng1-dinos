(function() {
	'use strict';

	angular
		.module('app')
		.directive('loading', loading);

	loading.$inject = [];
	
	function loading() {
		// return directive
		return {
			restrict: 'EA',
			templateUrl: 'app/core/ui/loading.tpl.html',
			scope: {
				active: '='
			},
			controller: loadingCtrl,
			controllerAs: 'loading',
			bindToController: true
		};
	}

	/**
	 * loading CONTROLLER
	 * Update the loading status based
	 * on routeChange state
	 */
	function loadingCtrl() {
		var loading = this;

		_init();

		/**
		 * INIT function executes procedural code
		 *
		 * @private
		 */
		function _init() {
			
		}
	}

}());