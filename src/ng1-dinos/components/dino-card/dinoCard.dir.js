/*--- Sample Directive with a $watch ---*/
(function() {
	'use strict';

	angular
		.module('ng1-dinos')
		.directive('dinoCard', dinoCard);

	dinoCard.$inject = ['$timeout'];

	function dinoCard($timeout) {
		// return directive
		return {
			restrict: 'EA',
			replace: true,
			scope: {},
			templateUrl: 'ng1-dinos/components/dino-card/dinoCard.tpl.html',
			controller: dinoCardCtrl,
			controllerAs: 'dc',
			bindToController: {
				data: '='
			},
			link: dinoCardLink
		};

		/**
		 * DinoCard LINK function
		 *
		 * @param $scope
		 * @param $element
		 * @param $attrs
		 * @param dc {controller}
		 */
		function dinoCardLink($scope, $element, $attrs, dc) {
			var _$flipWrapper = $element.find('.flipWrapper');

			// bindable members
			dc.flipCard = flipCard;

			_init();

			/**
			 * INIT function executes procedural code
			 *
			 * @private
			 */
			function _init() {
				
			}

			function flipCard() {
				_$flipWrapper.toggleClass('flipActive');
			}
		}
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