(function() {
	'use strict';

	angular
		.module('ng1-dinos')
		.controller('AboutCtrl', AboutCtrl);

	AboutCtrl.$inject = ['$scope', 'Metadata'];

	function AboutCtrl($scope, Metadata) {
		// controllerAs ViewModel
		var about = this;

		// bindable members
		about.title = 'About';

		_init();

		/**
		 * INIT function executes procedural code
		 *
		 * @private
		 */
		function _init() {
			// set page <title> and keywords
			Metadata.set(about.title, 'ng1-dinos, dinosaurs, about, prehistory');
		}
	}
}());