(function() {
  'use strict';

  angular
    .module('app')
    .directive('loading', loading);

  function loading() {
    // return directive
    return {
      restrict: 'EA',
      template: '<img class="loading" src="/assets/images/raptor-loading.gif">'
    };
  }
  
}());