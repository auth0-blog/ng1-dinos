(function() {
  'use strict';

  angular
    .module('app')
    .service('Dinos', Dinos);

  Dinos.$inject = ['$http', '$q'];

  function Dinos($http, $q) {
    var _baseUrl = 'http://localhost:3001/api/';

    // public members
    this.getAllDinos = getAllDinos;
    this.getDino = getDino;

    /**
     * GET all dinosaurs and return results
     *
     * @returns {promise}
     */
    function getAllDinos() {
      return $http
        .get(_baseUrl + 'dinosaurs')
        .then(_handleSuccess, _handleError);
    }

    /**
     * GET a specific dinosaur and return results
     *
     * @param {number} id
     * @returns {promise}
     */
    function getDino(id) {
      return $http
        .get(_baseUrl + 'dinosaur/' + id)
        .then(_handleSuccess, _handleError);
    }

    /**
     * Promise response function
     * Checks typeof data returned:
     * Resolves if response is object, rejects if not
     * Useful for APIs (ie, with nginx) where server error HTML page may be returned
     *
     * @param {any} res
     * @returns {promise}
     */
    function _handleSuccess(res) {
      if (angular.isObject(res.data)) {
        return res.data;
      } else {
        $q.reject({message: 'Retrieved data was not typeof object'});
      }
    }

    /**
     * Promise response function - error
     * Throws an error with error data
     *
     * @param {any} err
     */
    function _handleError(err) {
      var errorMsg = err.message || 'Unable to retrieve data';
      throw new Error(errorMsg);
    }
  }
  
}());