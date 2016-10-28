(function() {
  'use strict';

  angular
    .module('app')
    .factory('Metadata', Metadata);

  function Metadata() {
    var pageTitle = '';

    // callable members
    return {
      set: set,
      getTitle: getTitle
    };

    /**
     * Set page title, description
     *
     * @param newTitle {string}
     */
    function set(newTitle) {
      pageTitle = newTitle;
    }

    /**
     * Get title
     * Returns site title and page title
     *
     * @returns {string} site title + page title
     */
    function getTitle() {
      return pageTitle;
    }
  }
  
}());