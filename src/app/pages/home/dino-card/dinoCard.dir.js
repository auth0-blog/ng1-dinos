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
      templateUrl: 'app/pages/home/dino-card/dinoCard.tpl.html',
      controller: dinoCardCtrl,
      controllerAs: 'dc',
      bindToController: {
        dino: '='
      }
    };
  }

  /**
   * DinoCard CONTROLLER
   */
  function dinoCardCtrl() {
    var dc = this;
  }

}());