(function() {
	'use strict';

	angular
		.module('ng1-dinos')
		.controller('SubCtrl', SubCtrl);

	SubCtrl.$inject = ['Utils', 'Metadata', 'resolveLocalData'];

	function SubCtrl(Utils, Metadata, resolveLocalData) {
		// controllerAs ViewModel
		var sub = this;

		// bindable members
		sub.title = 'Subpage';
		sub.global = Utils;
		sub.json = resolveLocalData;

		_init();

		/**
		 * INIT function executes procedural code
		 *
		 * @private
		 */
		function _init() {
			// set page <title>
			Metadata.set(sub.title, 'angularjs, subpage', 'ng1-dinos-angular sample subpage with directive and transclusion.');
		}
	}
}());