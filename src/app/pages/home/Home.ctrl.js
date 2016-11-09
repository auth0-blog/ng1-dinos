(function() {
  'use strict';

  angular
    .module('app')
    .controller('HomeCtrl', HomeCtrl);

  HomeCtrl.$inject = ['$scope', 'Metadata', 'Dinos'];

  function HomeCtrl($scope, Metadata, Dinos) {
    // controllerAs ViewModel
    var home = this;

    // bindable members
    home.title = 'Dinosaurs';
    home.query = '';
    home.resetQuery = resetQuery;

    _init();

    /**
     * INIT function executes procedural code
     *
     * @private
     */
    function _init() {
      // set page <title>
      Metadata.set(home.title);

      // activate controller
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
      home.loading = true;

      // get the data from JSON
      return Dinos.getAllDinos().then(_getJsonSuccess, _getJsonError).finally(_finally);
    }

    /**
     * Successful promise data
     *
     * @param data {object}
     * @private
     */
    function _getJsonSuccess(data) {
      home.dinos = data;

      return home.dinos;
    }

    /**
     * Failure of promise data
     * Show error
     * Stop loading
     */
    function _getJsonError() {
      home.error = true;
    }

    /**
     * Stop loading
     */
    function _finally() {
      home.loading = false;
    }

    /**
     * Reset search query
     */
    function resetQuery() {
      home.query = '';
    }
  }

}());