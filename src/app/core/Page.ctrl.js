(function() {
  'use strict';

  angular
    .module('app')
    .controller('PageCtrl', PageCtrl);

  PageCtrl.$inject = ['Metadata'];

  function PageCtrl(Metadata) {
    var page = this;

    _init();

    /**
     * INIT function executes procedural code
     *
     * @private
     */
    function _init() {
      // associate page <title>
      page.metadata = Metadata;
    }
  }
  
}());