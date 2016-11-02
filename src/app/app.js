// application module setter
(function() {
  'use strict';

  angular
    .module('app', ['ngRoute', 'ngResource', 'ngSanitize', 'resize']);
    
}());
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
// application config
(function() {
  'use strict';

  angular
    .module('app')
    .config(appConfig);

  appConfig.$inject = ['$routeProvider', '$locationProvider'];

  function appConfig($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/pages/home/Home.view.html',
        controller: 'HomeCtrl',
        controllerAs: 'home'
      })
      .when('/about', {
        templateUrl: 'app/pages/about/About.view.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/dinosaur/:id', {
        templateUrl: 'app/pages/detail/Detail.view.html',
        controller: 'DetailCtrl',
        controllerAs: 'detail'
      })
      .otherwise({
        templateUrl: 'app/pages/error404/Error404.view.html',
        controller: 'Error404Ctrl',
        controllerAs: 'e404'
      });

    $locationProvider
      .html5Mode({
        enabled: true
      })
      .hashPrefix('!');
  }
  
}());
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
      return Dinos.getDino(_id).then(_getJsonSuccess, _getJsonError);
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

      // stop loading
      detail.loading = false;

      return detail.dino;
    }

    /**
     * Failure of promise data
     * Show error
     * Stop loading
     */
    function _getJsonError() {
      detail.error = true;

      // stop loading
      detail.loading = false;
    }
  }
  
}());
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
      return Dinos.getAllDinos().then(_getJsonSuccess, _getJsonError);
    }

    /**
     * Successful promise data
     *
     * @param data {object}
     * @private
     */
    function _getJsonSuccess(data) {
      home.dinos = data;

      // stop loading
      home.loading = false;

      return home.dinos;
    }

    /**
     * Failure of promise data
     * Show error
     * Stop loading
     */
    function _getJsonError() {
      home.error = true;

      // stop loading
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
(function() {
  'use strict';

  angular
    .module('app')
    .directive('dinoCard', dinoCard);

  function dinoCard() {
    // return directive
    return {
      restrict: 'EA',
      replace: true,
      scope: {},
      templateUrl: 'app/pages/home/dino-card/dinoCard.tpl.html',
      controller: dinoCardCtrl,
      controllerAs: 'dc',
      bindToController: {
        dino: '='
      }
    };
  }

  /**
   * DinoCard CONTROLLER
   */
  function dinoCardCtrl() {
    var dc = this;
  }

}());
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5tb2R1bGUuanMiLCJjb3JlL0Rpbm9zLnNlcnZpY2UuanMiLCJjb3JlL01ldGFkYXRhLmZhY3RvcnkuanMiLCJjb3JlL1BhZ2UuY3RybC5qcyIsImNvcmUvYXBwLmNvbmZpZy5qcyIsImhlYWRlci9IZWFkZXIuY3RybC5qcyIsImNvcmUvdWkvbG9hZGluZy5kaXIuanMiLCJjb3JlL3VpL25hdkNvbnRyb2wuZGlyLmpzIiwicGFnZXMvYWJvdXQvQWJvdXQuY3RybC5qcyIsInBhZ2VzL2RldGFpbC9EZXRhaWwuY3RybC5qcyIsInBhZ2VzL2Vycm9yNDA0L0Vycm9yNDA0LmN0cmwuanMiLCJwYWdlcy9ob21lL0hvbWUuY3RybC5qcyIsInBhZ2VzL2hvbWUvZGluby1jYXJkL2Rpbm9DYXJkLmRpci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gYXBwbGljYXRpb24gbW9kdWxlIHNldHRlclxuKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgYW5ndWxhclxuICAgIC5tb2R1bGUoJ2FwcCcsIFsnbmdSb3V0ZScsICduZ1Jlc291cmNlJywgJ25nU2FuaXRpemUnLCAncmVzaXplJ10pO1xuICAgIFxufSgpKTsiLCIoZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwJylcbiAgICAuc2VydmljZSgnRGlub3MnLCBEaW5vcyk7XG5cbiAgRGlub3MuJGluamVjdCA9IFsnJGh0dHAnLCAnJHEnXTtcblxuICBmdW5jdGlvbiBEaW5vcygkaHR0cCwgJHEpIHtcbiAgICB2YXIgX2Jhc2VVcmwgPSAnaHR0cDovL2xvY2FsaG9zdDozMDAxL2FwaS8nO1xuXG4gICAgLy8gcHVibGljIG1lbWJlcnNcbiAgICB0aGlzLmdldEFsbERpbm9zID0gZ2V0QWxsRGlub3M7XG4gICAgdGhpcy5nZXREaW5vID0gZ2V0RGlubztcblxuICAgIC8qKlxuICAgICAqIEdFVCBhbGwgZGlub3NhdXJzIGFuZCByZXR1cm4gcmVzdWx0c1xuICAgICAqXG4gICAgICogQHJldHVybnMge3Byb21pc2V9XG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0QWxsRGlub3MoKSB7XG4gICAgICByZXR1cm4gJGh0dHBcbiAgICAgICAgLmdldChfYmFzZVVybCArICdkaW5vc2F1cnMnKVxuICAgICAgICAudGhlbihfaGFuZGxlU3VjY2VzcywgX2hhbmRsZUVycm9yKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHRVQgYSBzcGVjaWZpYyBkaW5vc2F1ciBhbmQgcmV0dXJuIHJlc3VsdHNcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpZFxuICAgICAqIEByZXR1cm5zIHtwcm9taXNlfVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldERpbm8oaWQpIHtcbiAgICAgIHJldHVybiAkaHR0cFxuICAgICAgICAuZ2V0KF9iYXNlVXJsICsgJ2Rpbm9zYXVyLycgKyBpZClcbiAgICAgICAgLnRoZW4oX2hhbmRsZVN1Y2Nlc3MsIF9oYW5kbGVFcnJvcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUHJvbWlzZSByZXNwb25zZSBmdW5jdGlvblxuICAgICAqIENoZWNrcyB0eXBlb2YgZGF0YSByZXR1cm5lZDpcbiAgICAgKiBSZXNvbHZlcyBpZiByZXNwb25zZSBpcyBvYmplY3QsIHJlamVjdHMgaWYgbm90XG4gICAgICogVXNlZnVsIGZvciBBUElzIChpZSwgd2l0aCBuZ2lueCkgd2hlcmUgc2VydmVyIGVycm9yIEhUTUwgcGFnZSBtYXkgYmUgcmV0dXJuZWRcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7YW55fSByZXNcbiAgICAgKiBAcmV0dXJucyB7cHJvbWlzZX1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfaGFuZGxlU3VjY2VzcyhyZXMpIHtcbiAgICAgIGlmIChhbmd1bGFyLmlzT2JqZWN0KHJlcy5kYXRhKSkge1xuICAgICAgICByZXR1cm4gcmVzLmRhdGE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAkcS5yZWplY3Qoe21lc3NhZ2U6ICdSZXRyaWV2ZWQgZGF0YSB3YXMgbm90IHR5cGVvZiBvYmplY3QnfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUHJvbWlzZSByZXNwb25zZSBmdW5jdGlvbiAtIGVycm9yXG4gICAgICogVGhyb3dzIGFuIGVycm9yIHdpdGggZXJyb3IgZGF0YVxuICAgICAqXG4gICAgICogQHBhcmFtIHthbnl9IGVyclxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9oYW5kbGVFcnJvcihlcnIpIHtcbiAgICAgIHZhciBlcnJvck1zZyA9IGVyci5tZXNzYWdlIHx8ICdVbmFibGUgdG8gcmV0cmlldmUgZGF0YSc7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyb3JNc2cpO1xuICAgIH1cbiAgfVxuICBcbn0oKSk7IiwiKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgYW5ndWxhclxuICAgIC5tb2R1bGUoJ2FwcCcpXG4gICAgLmZhY3RvcnkoJ01ldGFkYXRhJywgTWV0YWRhdGEpO1xuXG4gIGZ1bmN0aW9uIE1ldGFkYXRhKCkge1xuICAgIHZhciBwYWdlVGl0bGUgPSAnJztcblxuICAgIC8vIGNhbGxhYmxlIG1lbWJlcnNcbiAgICByZXR1cm4ge1xuICAgICAgc2V0OiBzZXQsXG4gICAgICBnZXRUaXRsZTogZ2V0VGl0bGVcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogU2V0IHBhZ2UgdGl0bGUsIGRlc2NyaXB0aW9uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gbmV3VGl0bGUge3N0cmluZ31cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBzZXQobmV3VGl0bGUpIHtcbiAgICAgIHBhZ2VUaXRsZSA9IG5ld1RpdGxlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCB0aXRsZVxuICAgICAqIFJldHVybnMgc2l0ZSB0aXRsZSBhbmQgcGFnZSB0aXRsZVxuICAgICAqXG4gICAgICogQHJldHVybnMge3N0cmluZ30gc2l0ZSB0aXRsZSArIHBhZ2UgdGl0bGVcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZXRUaXRsZSgpIHtcbiAgICAgIHJldHVybiBwYWdlVGl0bGU7XG4gICAgfVxuICB9XG4gIFxufSgpKTsiLCIoZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwJylcbiAgICAuY29udHJvbGxlcignUGFnZUN0cmwnLCBQYWdlQ3RybCk7XG5cbiAgUGFnZUN0cmwuJGluamVjdCA9IFsnTWV0YWRhdGEnXTtcblxuICBmdW5jdGlvbiBQYWdlQ3RybChNZXRhZGF0YSkge1xuICAgIHZhciBwYWdlID0gdGhpcztcblxuICAgIF9pbml0KCk7XG5cbiAgICAvKipcbiAgICAgKiBJTklUIGZ1bmN0aW9uIGV4ZWN1dGVzIHByb2NlZHVyYWwgY29kZVxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfaW5pdCgpIHtcbiAgICAgIC8vIGFzc29jaWF0ZSBwYWdlIDx0aXRsZT5cbiAgICAgIHBhZ2UubWV0YWRhdGEgPSBNZXRhZGF0YTtcbiAgICB9XG4gIH1cbiAgXG59KCkpOyIsIi8vIGFwcGxpY2F0aW9uIGNvbmZpZ1xuKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgYW5ndWxhclxuICAgIC5tb2R1bGUoJ2FwcCcpXG4gICAgLmNvbmZpZyhhcHBDb25maWcpO1xuXG4gIGFwcENvbmZpZy4kaW5qZWN0ID0gWyckcm91dGVQcm92aWRlcicsICckbG9jYXRpb25Qcm92aWRlciddO1xuXG4gIGZ1bmN0aW9uIGFwcENvbmZpZygkcm91dGVQcm92aWRlciwgJGxvY2F0aW9uUHJvdmlkZXIpIHtcbiAgICAkcm91dGVQcm92aWRlclxuICAgICAgLndoZW4oJy8nLCB7XG4gICAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL3BhZ2VzL2hvbWUvSG9tZS52aWV3Lmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiAnSG9tZUN0cmwnLFxuICAgICAgICBjb250cm9sbGVyQXM6ICdob21lJ1xuICAgICAgfSlcbiAgICAgIC53aGVuKCcvYWJvdXQnLCB7XG4gICAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL3BhZ2VzL2Fib3V0L0Fib3V0LnZpZXcuaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdBYm91dEN0cmwnLFxuICAgICAgICBjb250cm9sbGVyQXM6ICdhYm91dCdcbiAgICAgIH0pXG4gICAgICAud2hlbignL2Rpbm9zYXVyLzppZCcsIHtcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvcGFnZXMvZGV0YWlsL0RldGFpbC52aWV3Lmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiAnRGV0YWlsQ3RybCcsXG4gICAgICAgIGNvbnRyb2xsZXJBczogJ2RldGFpbCdcbiAgICAgIH0pXG4gICAgICAub3RoZXJ3aXNlKHtcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvcGFnZXMvZXJyb3I0MDQvRXJyb3I0MDQudmlldy5odG1sJyxcbiAgICAgICAgY29udHJvbGxlcjogJ0Vycm9yNDA0Q3RybCcsXG4gICAgICAgIGNvbnRyb2xsZXJBczogJ2U0MDQnXG4gICAgICB9KTtcblxuICAgICRsb2NhdGlvblByb3ZpZGVyXG4gICAgICAuaHRtbDVNb2RlKHtcbiAgICAgICAgZW5hYmxlZDogdHJ1ZVxuICAgICAgfSlcbiAgICAgIC5oYXNoUHJlZml4KCchJyk7XG4gIH1cbiAgXG59KCkpOyIsIihmdW5jdGlvbigpIHtcclxuICAndXNlIHN0cmljdCc7XHJcblxyXG4gIGFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcCcpXHJcbiAgICAuY29udHJvbGxlcignSGVhZGVyQ3RybCcsIEhlYWRlckN0cmwpO1xyXG5cclxuICBIZWFkZXJDdHJsLiRpbmplY3QgPSBbJyRsb2NhdGlvbiddO1xyXG5cclxuICBmdW5jdGlvbiBIZWFkZXJDdHJsKCRsb2NhdGlvbikge1xyXG4gICAgLy8gY29udHJvbGxlckFzIFZpZXdNb2RlbFxyXG4gICAgdmFyIGhlYWRlciA9IHRoaXM7XHJcblxyXG4gICAgLy8gYmluZGFibGUgbWVtYmVyc1xyXG4gICAgaGVhZGVyLmluZGV4SXNBY3RpdmUgPSBpbmRleElzQWN0aXZlO1xyXG4gICAgaGVhZGVyLm5hdklzQWN0aXZlID0gbmF2SXNBY3RpdmU7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBcHBseSBjbGFzcyB0byBpbmRleCBuYXYgaWYgYWN0aXZlXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHBhdGhcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gaW5kZXhJc0FjdGl2ZShwYXRoKSB7XHJcbiAgICAgIC8vIHBhdGggc2hvdWxkIGJlICcvJ1xyXG4gICAgICByZXR1cm4gJGxvY2F0aW9uLnBhdGgoKSA9PT0gcGF0aDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFwcGx5IGNsYXNzIHRvIGN1cnJlbnRseSBhY3RpdmUgbmF2IGl0ZW1cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gcGF0aFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBuYXZJc0FjdGl2ZShwYXRoKSB7XHJcbiAgICAgIHJldHVybiAkbG9jYXRpb24ucGF0aCgpLnN1YnN0cigwLCBwYXRoLmxlbmd0aCkgPT09IHBhdGg7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxufSgpKTsiLCIoZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwJylcbiAgICAuZGlyZWN0aXZlKCdsb2FkaW5nJywgbG9hZGluZyk7XG5cbiAgZnVuY3Rpb24gbG9hZGluZygpIHtcbiAgICAvLyByZXR1cm4gZGlyZWN0aXZlXG4gICAgcmV0dXJuIHtcbiAgICAgIHJlc3RyaWN0OiAnRUEnLFxuICAgICAgdGVtcGxhdGU6ICc8aW1nIGNsYXNzPVwibG9hZGluZ1wiIHNyYz1cIi9hc3NldHMvaW1hZ2VzL3JhcHRvci1sb2FkaW5nLmdpZlwiPidcbiAgICB9O1xuICB9XG4gIFxufSgpKTsiLCIoZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwJylcbiAgICAuZGlyZWN0aXZlKCduYXZDb250cm9sJywgbmF2Q29udHJvbCk7XG5cbiAgbmF2Q29udHJvbC4kaW5qZWN0ID0gWyckd2luZG93JywgJ3Jlc2l6ZSddO1xuXG4gIGZ1bmN0aW9uIG5hdkNvbnRyb2woJHdpbmRvdywgcmVzaXplKSB7XG4gICAgLy8gcmV0dXJuIGRpcmVjdGl2ZVxuICAgIHJldHVybiB7XG4gICAgICByZXN0cmljdDogJ0VBJyxcbiAgICAgIGxpbms6IG5hdkNvbnRyb2xMaW5rXG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIG5hdkNvbnRyb2wgTElOSyBmdW5jdGlvblxuICAgICAqXG4gICAgICogQHBhcmFtICRzY29wZVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIG5hdkNvbnRyb2xMaW5rKCRzY29wZSwgJGVsZW1lbnQpIHtcbiAgICAgIC8vIHByaXZhdGUgdmFyaWFibGVzXG4gICAgICB2YXIgXyRsYXlvdXRDYW52YXMgPSAkZWxlbWVudDtcblxuICAgICAgLy8gZGF0YSBtb2RlbFxuICAgICAgJHNjb3BlLm5hdiA9IHt9O1xuICAgICAgJHNjb3BlLm5hdi5uYXZPcGVuO1xuICAgICAgJHNjb3BlLm5hdi50b2dnbGVOYXYgPSB0b2dnbGVOYXY7XG5cbiAgICAgIF9pbml0KCk7XG5cbiAgICAgIC8qKlxuICAgICAgICogSU5JVCBmdW5jdGlvbiBleGVjdXRlcyBwcm9jZWR1cmFsIGNvZGVcbiAgICAgICAqXG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICovXG4gICAgICBmdW5jdGlvbiBfaW5pdCgpIHtcbiAgICAgICAgLy8gaW5pdGlhbGl6ZSBkZWJvdW5jZWQgcmVzaXplXG4gICAgICAgIHZhciBfcnMgPSByZXNpemUuaW5pdCh7XG4gICAgICAgICAgc2NvcGU6ICRzY29wZSxcbiAgICAgICAgICByZXNpemVkRm46IF9yZXNpemVkLFxuICAgICAgICAgIGRlYm91bmNlOiAxMDBcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJHNjb3BlLiRvbignJGxvY2F0aW9uQ2hhbmdlU3RhcnQnLCBfJGxvY2F0aW9uQ2hhbmdlU3RhcnQpO1xuICAgICAgICBfY2xvc2VOYXYoKTtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiBSZXNpemVkIHdpbmRvdyAoZGVib3VuY2VkKVxuICAgICAgICpcbiAgICAgICAqIEBwcml2YXRlXG4gICAgICAgKi9cbiAgICAgIGZ1bmN0aW9uIF9yZXNpemVkKCkge1xuICAgICAgICBfJGxheW91dENhbnZhcy5jc3Moe1xuICAgICAgICAgIG1pbkhlaWdodDogJHdpbmRvdy5pbm5lckhlaWdodCArICdweCdcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICogT3BlbiBuYXZpZ2F0aW9uIG1lbnVcbiAgICAgICAqXG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICovXG4gICAgICBmdW5jdGlvbiBfb3Blbk5hdigpIHtcbiAgICAgICAgJHNjb3BlLm5hdi5uYXZPcGVuID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiBDbG9zZSBuYXZpZ2F0aW9uIG1lbnVcbiAgICAgICAqXG4gICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICovXG4gICAgICBmdW5jdGlvbiBfY2xvc2VOYXYoKSB7XG4gICAgICAgICRzY29wZS5uYXYubmF2T3BlbiA9IGZhbHNlO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIFRvZ2dsZSBuYXYgb3Blbi9jbG9zZWRcbiAgICAgICAqL1xuICAgICAgZnVuY3Rpb24gdG9nZ2xlTmF2KCkge1xuICAgICAgICAkc2NvcGUubmF2Lm5hdk9wZW4gPSAhJHNjb3BlLm5hdi5uYXZPcGVuO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIFdoZW4gY2hhbmdpbmcgbG9jYXRpb24sIGNsb3NlIHRoZSBuYXYgaWYgaXQncyBvcGVuXG4gICAgICAgKi9cbiAgICAgIGZ1bmN0aW9uIF8kbG9jYXRpb25DaGFuZ2VTdGFydCgpIHtcbiAgICAgICAgaWYgKCRzY29wZS5uYXYubmF2T3Blbikge1xuICAgICAgICAgIF9jbG9zZU5hdigpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbn0oKSk7IiwiKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgYW5ndWxhclxuICAgIC5tb2R1bGUoJ2FwcCcpXG4gICAgLmNvbnRyb2xsZXIoJ0Fib3V0Q3RybCcsIEFib3V0Q3RybCk7XG5cbiAgQWJvdXRDdHJsLiRpbmplY3QgPSBbJyRzY29wZScsICdNZXRhZGF0YSddO1xuXG4gIGZ1bmN0aW9uIEFib3V0Q3RybCgkc2NvcGUsIE1ldGFkYXRhKSB7XG4gICAgLy8gY29udHJvbGxlckFzIFZpZXdNb2RlbFxuICAgIHZhciBhYm91dCA9IHRoaXM7XG5cbiAgICAvLyBiaW5kYWJsZSBtZW1iZXJzXG4gICAgYWJvdXQudGl0bGUgPSAnQWJvdXQnO1xuXG4gICAgX2luaXQoKTtcblxuICAgIC8qKlxuICAgICAqIElOSVQgZnVuY3Rpb24gZXhlY3V0ZXMgcHJvY2VkdXJhbCBjb2RlXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9pbml0KCkge1xuICAgICAgLy8gc2V0IHBhZ2UgPHRpdGxlPlxuICAgICAgTWV0YWRhdGEuc2V0KGFib3V0LnRpdGxlKTtcbiAgICB9XG4gIH1cbiAgXG59KCkpOyIsIihmdW5jdGlvbigpIHtcclxuICAndXNlIHN0cmljdCc7XHJcblxyXG4gIGFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcCcpXHJcbiAgICAuY29udHJvbGxlcignRGV0YWlsQ3RybCcsIERldGFpbEN0cmwpO1xyXG5cclxuICBEZXRhaWxDdHJsLiRpbmplY3QgPSBbJyRzY29wZScsICckcm91dGVQYXJhbXMnLCAnTWV0YWRhdGEnLCAnRGlub3MnXTtcclxuXHJcbiAgZnVuY3Rpb24gRGV0YWlsQ3RybCgkc2NvcGUsICRyb3V0ZVBhcmFtcywgTWV0YWRhdGEsIERpbm9zKSB7XHJcbiAgICAvLyBjb250cm9sbGVyQXMgVmlld01vZGVsXHJcbiAgICB2YXIgZGV0YWlsID0gdGhpcztcclxuXHJcbiAgICAvLyBwcml2YXRlIHZhcmlhYmxlc1xyXG4gICAgdmFyIF9pZCA9ICRyb3V0ZVBhcmFtcy5pZDtcclxuXHJcbiAgICBfaW5pdCgpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogSU5JVCBmdW5jdGlvbiBleGVjdXRlcyBwcm9jZWR1cmFsIGNvZGVcclxuICAgICAqXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBfaW5pdCgpIHtcclxuICAgICAgX2FjdGl2YXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb250cm9sbGVyIGFjdGl2YXRlXHJcbiAgICAgKiBHZXQgSlNPTiBkYXRhXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMgeyp9XHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBfYWN0aXZhdGUoKSB7XHJcbiAgICAgIC8vIHN0YXJ0IGxvYWRpbmdcclxuICAgICAgZGV0YWlsLmxvYWRpbmcgPSB0cnVlO1xyXG5cclxuICAgICAgLy8gZ2V0IHRoZSBkYXRhIGZyb20gSlNPTlxyXG4gICAgICByZXR1cm4gRGlub3MuZ2V0RGlubyhfaWQpLnRoZW4oX2dldEpzb25TdWNjZXNzLCBfZ2V0SnNvbkVycm9yKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFN1Y2Nlc3NmdWwgcHJvbWlzZSBkYXRhXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGRhdGEge29iamVjdH1cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIF9nZXRKc29uU3VjY2VzcyhkYXRhKSB7XHJcbiAgICAgIGRldGFpbC5kaW5vID0gZGF0YTtcclxuICAgICAgZGV0YWlsLnRpdGxlID0gZGV0YWlsLmRpbm8ubmFtZTtcclxuXHJcbiAgICAgIC8vIHNldCBwYWdlIDx0aXRsZT5cclxuICAgICAgTWV0YWRhdGEuc2V0KGRldGFpbC50aXRsZSk7XHJcblxyXG4gICAgICAvLyBzdG9wIGxvYWRpbmdcclxuICAgICAgZGV0YWlsLmxvYWRpbmcgPSBmYWxzZTtcclxuXHJcbiAgICAgIHJldHVybiBkZXRhaWwuZGlubztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEZhaWx1cmUgb2YgcHJvbWlzZSBkYXRhXHJcbiAgICAgKiBTaG93IGVycm9yXHJcbiAgICAgKiBTdG9wIGxvYWRpbmdcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gX2dldEpzb25FcnJvcigpIHtcclxuICAgICAgZGV0YWlsLmVycm9yID0gdHJ1ZTtcclxuXHJcbiAgICAgIC8vIHN0b3AgbG9hZGluZ1xyXG4gICAgICBkZXRhaWwubG9hZGluZyA9IGZhbHNlO1xyXG4gICAgfVxyXG4gIH1cclxuICBcclxufSgpKTsiLCIoZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwJylcbiAgICAuY29udHJvbGxlcignRXJyb3I0MDRDdHJsJywgRXJyb3I0MDRDdHJsKTtcblxuICBFcnJvcjQwNEN0cmwuJGluamVjdCA9IFsnJHNjb3BlJywgJ01ldGFkYXRhJ107XG5cbiAgZnVuY3Rpb24gRXJyb3I0MDRDdHJsKCRzY29wZSwgTWV0YWRhdGEpIHtcbiAgICB2YXIgZTQwNCA9IHRoaXM7XG5cbiAgICAvLyBiaW5kYWJsZSBtZW1iZXJzXG4gICAgZTQwNC50aXRsZSA9ICc0MDQgLSBQYWdlIE5vdCBGb3VuZCc7XG5cbiAgICBfaW5pdCgpO1xuXG4gICAgLyoqXG4gICAgICogSU5JVCBmdW5jdGlvbiBleGVjdXRlcyBwcm9jZWR1cmFsIGNvZGVcbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgZnVuY3Rpb24gX2luaXQoKSB7XG4gICAgICAvLyBzZXQgcGFnZSA8dGl0bGU+XG4gICAgICBNZXRhZGF0YS5zZXQoZTQwNC50aXRsZSk7XG4gICAgfVxuICB9XG4gIFxufSgpKTsiLCIoZnVuY3Rpb24oKSB7XHJcbiAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICBhbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAnKVxyXG4gICAgLmNvbnRyb2xsZXIoJ0hvbWVDdHJsJywgSG9tZUN0cmwpO1xyXG5cclxuICBIb21lQ3RybC4kaW5qZWN0ID0gWyckc2NvcGUnLCAnTWV0YWRhdGEnLCAnRGlub3MnXTtcclxuXHJcbiAgZnVuY3Rpb24gSG9tZUN0cmwoJHNjb3BlLCBNZXRhZGF0YSwgRGlub3MpIHtcclxuICAgIC8vIGNvbnRyb2xsZXJBcyBWaWV3TW9kZWxcclxuICAgIHZhciBob21lID0gdGhpcztcclxuXHJcbiAgICAvLyBiaW5kYWJsZSBtZW1iZXJzXHJcbiAgICBob21lLnRpdGxlID0gJ0Rpbm9zYXVycyc7XHJcbiAgICBob21lLnF1ZXJ5ID0gJyc7XHJcbiAgICBob21lLnJlc2V0UXVlcnkgPSByZXNldFF1ZXJ5O1xyXG5cclxuICAgIF9pbml0KCk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJTklUIGZ1bmN0aW9uIGV4ZWN1dGVzIHByb2NlZHVyYWwgY29kZVxyXG4gICAgICpcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIF9pbml0KCkge1xyXG4gICAgICAvLyBzZXQgcGFnZSA8dGl0bGU+XHJcbiAgICAgIE1ldGFkYXRhLnNldChob21lLnRpdGxlKTtcclxuXHJcbiAgICAgIC8vIGFjdGl2YXRlIGNvbnRyb2xsZXJcclxuICAgICAgX2FjdGl2YXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb250cm9sbGVyIGFjdGl2YXRlXHJcbiAgICAgKiBHZXQgSlNPTiBkYXRhXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMgeyp9XHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBfYWN0aXZhdGUoKSB7XHJcbiAgICAgIC8vIHN0YXJ0IGxvYWRpbmdcclxuICAgICAgaG9tZS5sb2FkaW5nID0gdHJ1ZTtcclxuXHJcbiAgICAgIC8vIGdldCB0aGUgZGF0YSBmcm9tIEpTT05cclxuICAgICAgcmV0dXJuIERpbm9zLmdldEFsbERpbm9zKCkudGhlbihfZ2V0SnNvblN1Y2Nlc3MsIF9nZXRKc29uRXJyb3IpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU3VjY2Vzc2Z1bCBwcm9taXNlIGRhdGFcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gZGF0YSB7b2JqZWN0fVxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gX2dldEpzb25TdWNjZXNzKGRhdGEpIHtcclxuICAgICAgaG9tZS5kaW5vcyA9IGRhdGE7XHJcblxyXG4gICAgICAvLyBzdG9wIGxvYWRpbmdcclxuICAgICAgaG9tZS5sb2FkaW5nID0gZmFsc2U7XHJcblxyXG4gICAgICByZXR1cm4gaG9tZS5kaW5vcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEZhaWx1cmUgb2YgcHJvbWlzZSBkYXRhXHJcbiAgICAgKiBTaG93IGVycm9yXHJcbiAgICAgKiBTdG9wIGxvYWRpbmdcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gX2dldEpzb25FcnJvcigpIHtcclxuICAgICAgaG9tZS5lcnJvciA9IHRydWU7XHJcblxyXG4gICAgICAvLyBzdG9wIGxvYWRpbmdcclxuICAgICAgaG9tZS5sb2FkaW5nID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXNldCBzZWFyY2ggcXVlcnlcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gcmVzZXRRdWVyeSgpIHtcclxuICAgICAgaG9tZS5xdWVyeSA9ICcnO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbn0oKSk7IiwiKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgYW5ndWxhclxuICAgIC5tb2R1bGUoJ2FwcCcpXG4gICAgLmRpcmVjdGl2ZSgnZGlub0NhcmQnLCBkaW5vQ2FyZCk7XG5cbiAgZnVuY3Rpb24gZGlub0NhcmQoKSB7XG4gICAgLy8gcmV0dXJuIGRpcmVjdGl2ZVxuICAgIHJldHVybiB7XG4gICAgICByZXN0cmljdDogJ0VBJyxcbiAgICAgIHJlcGxhY2U6IHRydWUsXG4gICAgICBzY29wZToge30sXG4gICAgICB0ZW1wbGF0ZVVybDogJ2FwcC9wYWdlcy9ob21lL2Rpbm8tY2FyZC9kaW5vQ2FyZC50cGwuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOiBkaW5vQ2FyZEN0cmwsXG4gICAgICBjb250cm9sbGVyQXM6ICdkYycsXG4gICAgICBiaW5kVG9Db250cm9sbGVyOiB7XG4gICAgICAgIGRpbm86ICc9J1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogRGlub0NhcmQgQ09OVFJPTExFUlxuICAgKi9cbiAgZnVuY3Rpb24gZGlub0NhcmRDdHJsKCkge1xuICAgIHZhciBkYyA9IHRoaXM7XG4gIH1cblxufSgpKTsiXX0=
