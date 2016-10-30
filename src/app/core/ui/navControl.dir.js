(function() {
  'use strict';

  angular
    .module('app')
    .directive('navControl', navControl);

  navControl.$inject = ['$window', 'resize'];

  function navControl($window, resize) {
    // return directive
    return {
      restrict: 'EA',
      link: navControlLink
    };

    /**
     * navControl LINK function
     *
     * @param $scope
     */
    function navControlLink($scope, $element) {
      // private variables
      var _$layoutCanvas = $element;

      // data model
      $scope.nav = {};
      $scope.nav.navOpen;
      $scope.nav.toggleNav = toggleNav;

      _init();

      /**
       * INIT function executes procedural code
       *
       * @private
       */
      function _init() {
        // initialize debounced resize
        var _rs = resize.init({
          scope: $scope,
          resizedFn: _resized,
          debounce: 100
        });

        $scope.$on('$locationChangeStart', _$locationChangeStart);
        _closeNav();
      }

      /**
       * Resized window (debounced)
       *
       * @private
       */
      function _resized() {
        _$layoutCanvas.css({
          minHeight: $window.innerHeight + 'px'
        });
      }

      /**
       * Open navigation menu
       *
       * @private
       */
      function _openNav() {
        $scope.nav.navOpen = true;
      }

      /**
       * Close navigation menu
       *
       * @private
       */
      function _closeNav() {
        $scope.nav.navOpen = false;
      }

      /**
       * Toggle nav open/closed
       */
      function toggleNav() {
        $scope.nav.navOpen = !$scope.nav.navOpen;
      }

      /**
       * When changing location, close the nav if it's open
       */
      function _$locationChangeStart() {
        if ($scope.nav.navOpen) {
          _closeNav();
        }
      }
    }
  }

}());