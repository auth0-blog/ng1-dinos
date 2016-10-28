(function() {
  'use strict';

  angular
    .module('app')
    .controller('Error404Ctrl', Error404Ctrl);

  Error404Ctrl.$inject = ['$scope', 'Metadata'];

  function Error404Ctrl($scope, Metadata) {
    var e404 = this;

    // bindable members
    e404.title = '404 - Page Not Found';

    _init();

    /**
     * INIT function executes procedural code
     *
     * @private
     */
    function _init() {
      // set page <title>
      Metadata.set(e404.title);
    }
  }
  
}());