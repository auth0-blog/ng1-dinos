(function() {
	'use strict';

	angular
		.module('ng1-dinos')
		.controller('HomeCtrl', HomeCtrl);

	HomeCtrl.$inject = ['$scope', 'Utils', 'Metadata', 'APIData'];

	function HomeCtrl($scope, Utils, Metadata, APIData) {
		// controllerAs ViewModel
		var home = this;

		// bindable members
		home.title = 'Home';
		home.global = Utils;
		home.name = 'Visitor';
		home.alertGreeting = Utils.alertGreeting;
		home.stringOfHTML = '<strong style="color: green;">Some green text</strong> bound as HTML with a <a href="#">link</a>, trusted with SCE!';

		_init();

		/**
		 * INIT function executes procedural code
		 *
		 * @private
		 */
		function _init() {
			// set page <title>
			Metadata.set(home.title, 'ng1-dinos, angularjs, javascript, spa, demo, app, application', 'ng1-dinos demo application');

			// activate controller
			_activate();
		}

		/**
		 * Controller activate
		 * Get JSON data
		 *
		 * @returns {*}
		 * @private
		 */
		function _activate() {
			// start loading
			$scope.$emit('loading-on');

			// get the data from JSON
			return APIData.getData('people').then(_getJsonSuccess);
		}

		/**
		 * Successful promise data
		 *
		 * @param data {json}
		 * @private
		 */
		function _getJsonSuccess(data) {
			home.json = data;

			// stop loading
			$scope.$emit('loading-off');

			console.log(home.json);

			return home.json;
		}
	}
}());