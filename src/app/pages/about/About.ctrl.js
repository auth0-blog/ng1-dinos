(function() {
  'use strict';

  angular
    .module('app')
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
      // set page <title>
      Metadata.set(about.title);
    }
  }
  
}());