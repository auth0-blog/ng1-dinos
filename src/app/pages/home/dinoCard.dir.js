(function() {
	'use strict';

	angular
		.module('app')
		.directive('dinoCard', dinoCard);

	function dinoCard() {
		// return directive
		return {
			restrict: 'EA',
			replace: true,
			scope: {},
			templateUrl: 'app/pages/home/dinoCard.tpl.html',
			controller: dinoCardCtrl,
			controllerAs: 'dc',
			bindToController: {
				data: '='
			}
		};
	}

	dinoCardCtrl.$inject = [];
	/**
	 * DinoCard CONTROLLER
	 */
	function dinoCardCtrl() {
		var dc = this;

		// bindable members
		dc.dino = dc.data;
	}

}());