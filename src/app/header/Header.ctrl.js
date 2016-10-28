(function() {
  'use strict';

  angular
    .module('app')
    .controller('HeaderCtrl', HeaderCtrl);

  HeaderCtrl.$inject = ['$location'];

  function HeaderCtrl($location) {
    // controllerAs ViewModel
    var header = this;

    // bindable members
    header.indexIsActive = indexIsActive;
    header.navIsActive = navIsActive;

    /**
     * Apply class to index nav if active
     *
     * @param {string} path
     */
    function indexIsActive(path) {
      // path should be '/'
      return $location.path() === path;
    }

    /**
     * Apply class to currently active nav item
     *
     * @param {string} path
     */
    function navIsActive(path) {
      return $location.path().substr(0, path.length) === path;
    }
  }

}());