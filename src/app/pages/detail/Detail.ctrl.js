(function() {
  'use strict';

  angular
    .module('app')
    .controller('DetailCtrl', DetailCtrl);

  DetailCtrl.$inject = ['$scope', '$routeParams', 'Metadata', 'Dinos'];

  function DetailCtrl($scope, $routeParams, Metadata, Dinos) {
    // controllerAs ViewModel
    var detail = this;

    // private variables
    var _id = $routeParams.id;

    _init();

    /**
     * INIT function executes procedural code
     *
     * @private
     */
    function _init() {
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
      detail.loading = true;

      // get the data from JSON
      return Dinos.getDino(_id).then(_getJsonSuccess, _getJsonError).finally(_finally);
    }

    /**
     * Successful promise data
     *
     * @param data {object}
     * @private
     */
    function _getJsonSuccess(data) {
      detail.dino = data;
      detail.title = detail.dino.name;

      // set page <title>
      Metadata.set(detail.title);

      return detail.dino;
    }

    /**
     * Failure of promise data
     * Show error
     */
    function _getJsonError() {
      detail.error = true;
    }

    /**
     * Stop loading
     */
    function _finally() {
      detail.loading = false;
    }
  }
  
}());