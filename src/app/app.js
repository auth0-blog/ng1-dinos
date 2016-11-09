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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5tb2R1bGUuanMiLCJjb3JlL0Rpbm9zLnNlcnZpY2UuanMiLCJjb3JlL01ldGFkYXRhLmZhY3RvcnkuanMiLCJjb3JlL1BhZ2UuY3RybC5qcyIsImNvcmUvYXBwLmNvbmZpZy5qcyIsImhlYWRlci9IZWFkZXIuY3RybC5qcyIsImNvcmUvdWkvbG9hZGluZy5kaXIuanMiLCJjb3JlL3VpL25hdkNvbnRyb2wuZGlyLmpzIiwicGFnZXMvYWJvdXQvQWJvdXQuY3RybC5qcyIsInBhZ2VzL2RldGFpbC9EZXRhaWwuY3RybC5qcyIsInBhZ2VzL2Vycm9yNDA0L0Vycm9yNDA0LmN0cmwuanMiLCJwYWdlcy9ob21lL0hvbWUuY3RybC5qcyIsInBhZ2VzL2hvbWUvZGluby1jYXJkL2Rpbm9DYXJkLmRpci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBhcHBsaWNhdGlvbiBtb2R1bGUgc2V0dGVyXG4oZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwJywgWyduZ1JvdXRlJywgJ25nUmVzb3VyY2UnLCAnbmdTYW5pdGl6ZScsICdyZXNpemUnXSk7XG4gICAgXG59KCkpOyIsIihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGFuZ3VsYXJcbiAgICAubW9kdWxlKCdhcHAnKVxuICAgIC5zZXJ2aWNlKCdEaW5vcycsIERpbm9zKTtcblxuICBEaW5vcy4kaW5qZWN0ID0gWyckaHR0cCcsICckcSddO1xuXG4gIGZ1bmN0aW9uIERpbm9zKCRodHRwLCAkcSkge1xuICAgIHZhciBfYmFzZVVybCA9ICdodHRwOi8vbG9jYWxob3N0OjMwMDEvYXBpLyc7XG5cbiAgICAvLyBwdWJsaWMgbWVtYmVyc1xuICAgIHRoaXMuZ2V0QWxsRGlub3MgPSBnZXRBbGxEaW5vcztcbiAgICB0aGlzLmdldERpbm8gPSBnZXREaW5vO1xuXG4gICAgLyoqXG4gICAgICogR0VUIGFsbCBkaW5vc2F1cnMgYW5kIHJldHVybiByZXN1bHRzXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7cHJvbWlzZX1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZXRBbGxEaW5vcygpIHtcbiAgICAgIHJldHVybiAkaHR0cFxuICAgICAgICAuZ2V0KF9iYXNlVXJsICsgJ2Rpbm9zYXVycycpXG4gICAgICAgIC50aGVuKF9oYW5kbGVTdWNjZXNzLCBfaGFuZGxlRXJyb3IpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdFVCBhIHNwZWNpZmljIGRpbm9zYXVyIGFuZCByZXR1cm4gcmVzdWx0c1xuICAgICAqXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGlkXG4gICAgICogQHJldHVybnMge3Byb21pc2V9XG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0RGlubyhpZCkge1xuICAgICAgcmV0dXJuICRodHRwXG4gICAgICAgIC5nZXQoX2Jhc2VVcmwgKyAnZGlub3NhdXIvJyArIGlkKVxuICAgICAgICAudGhlbihfaGFuZGxlU3VjY2VzcywgX2hhbmRsZUVycm9yKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQcm9taXNlIHJlc3BvbnNlIGZ1bmN0aW9uXG4gICAgICogQ2hlY2tzIHR5cGVvZiBkYXRhIHJldHVybmVkOlxuICAgICAqIFJlc29sdmVzIGlmIHJlc3BvbnNlIGlzIG9iamVjdCwgcmVqZWN0cyBpZiBub3RcbiAgICAgKiBVc2VmdWwgZm9yIEFQSXMgKGllLCB3aXRoIG5naW54KSB3aGVyZSBzZXJ2ZXIgZXJyb3IgSFRNTCBwYWdlIG1heSBiZSByZXR1cm5lZFxuICAgICAqXG4gICAgICogQHBhcmFtIHthbnl9IHJlc1xuICAgICAqIEByZXR1cm5zIHtwcm9taXNlfVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9oYW5kbGVTdWNjZXNzKHJlcykge1xuICAgICAgaWYgKGFuZ3VsYXIuaXNPYmplY3QocmVzLmRhdGEpKSB7XG4gICAgICAgIHJldHVybiByZXMuZGF0YTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICRxLnJlamVjdCh7bWVzc2FnZTogJ1JldHJpZXZlZCBkYXRhIHdhcyBub3QgdHlwZW9mIG9iamVjdCd9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQcm9taXNlIHJlc3BvbnNlIGZ1bmN0aW9uIC0gZXJyb3JcbiAgICAgKiBUaHJvd3MgYW4gZXJyb3Igd2l0aCBlcnJvciBkYXRhXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge2FueX0gZXJyXG4gICAgICovXG4gICAgZnVuY3Rpb24gX2hhbmRsZUVycm9yKGVycikge1xuICAgICAgdmFyIGVycm9yTXNnID0gZXJyLm1lc3NhZ2UgfHwgJ1VuYWJsZSB0byByZXRyaWV2ZSBkYXRhJztcbiAgICAgIHRocm93IG5ldyBFcnJvcihlcnJvck1zZyk7XG4gICAgfVxuICB9XG4gIFxufSgpKTsiLCIoZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwJylcbiAgICAuZmFjdG9yeSgnTWV0YWRhdGEnLCBNZXRhZGF0YSk7XG5cbiAgZnVuY3Rpb24gTWV0YWRhdGEoKSB7XG4gICAgdmFyIHBhZ2VUaXRsZSA9ICcnO1xuXG4gICAgLy8gY2FsbGFibGUgbWVtYmVyc1xuICAgIHJldHVybiB7XG4gICAgICBzZXQ6IHNldCxcbiAgICAgIGdldFRpdGxlOiBnZXRUaXRsZVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBTZXQgcGFnZSB0aXRsZSwgZGVzY3JpcHRpb25cbiAgICAgKlxuICAgICAqIEBwYXJhbSBuZXdUaXRsZSB7c3RyaW5nfVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHNldChuZXdUaXRsZSkge1xuICAgICAgcGFnZVRpdGxlID0gbmV3VGl0bGU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0IHRpdGxlXG4gICAgICogUmV0dXJucyBzaXRlIHRpdGxlIGFuZCBwYWdlIHRpdGxlXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSBzaXRlIHRpdGxlICsgcGFnZSB0aXRsZVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldFRpdGxlKCkge1xuICAgICAgcmV0dXJuIHBhZ2VUaXRsZTtcbiAgICB9XG4gIH1cbiAgXG59KCkpOyIsIihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGFuZ3VsYXJcbiAgICAubW9kdWxlKCdhcHAnKVxuICAgIC5jb250cm9sbGVyKCdQYWdlQ3RybCcsIFBhZ2VDdHJsKTtcblxuICBQYWdlQ3RybC4kaW5qZWN0ID0gWydNZXRhZGF0YSddO1xuXG4gIGZ1bmN0aW9uIFBhZ2VDdHJsKE1ldGFkYXRhKSB7XG4gICAgdmFyIHBhZ2UgPSB0aGlzO1xuXG4gICAgX2luaXQoKTtcblxuICAgIC8qKlxuICAgICAqIElOSVQgZnVuY3Rpb24gZXhlY3V0ZXMgcHJvY2VkdXJhbCBjb2RlXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9pbml0KCkge1xuICAgICAgLy8gYXNzb2NpYXRlIHBhZ2UgPHRpdGxlPlxuICAgICAgcGFnZS5tZXRhZGF0YSA9IE1ldGFkYXRhO1xuICAgIH1cbiAgfVxuICBcbn0oKSk7IiwiLy8gYXBwbGljYXRpb24gY29uZmlnXG4oZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwJylcbiAgICAuY29uZmlnKGFwcENvbmZpZyk7XG5cbiAgYXBwQ29uZmlnLiRpbmplY3QgPSBbJyRyb3V0ZVByb3ZpZGVyJywgJyRsb2NhdGlvblByb3ZpZGVyJ107XG5cbiAgZnVuY3Rpb24gYXBwQ29uZmlnKCRyb3V0ZVByb3ZpZGVyLCAkbG9jYXRpb25Qcm92aWRlcikge1xuICAgICRyb3V0ZVByb3ZpZGVyXG4gICAgICAud2hlbignLycsIHtcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvcGFnZXMvaG9tZS9Ib21lLnZpZXcuaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdIb21lQ3RybCcsXG4gICAgICAgIGNvbnRyb2xsZXJBczogJ2hvbWUnXG4gICAgICB9KVxuICAgICAgLndoZW4oJy9hYm91dCcsIHtcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvcGFnZXMvYWJvdXQvQWJvdXQudmlldy5odG1sJyxcbiAgICAgICAgY29udHJvbGxlcjogJ0Fib3V0Q3RybCcsXG4gICAgICAgIGNvbnRyb2xsZXJBczogJ2Fib3V0J1xuICAgICAgfSlcbiAgICAgIC53aGVuKCcvZGlub3NhdXIvOmlkJywge1xuICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcC9wYWdlcy9kZXRhaWwvRGV0YWlsLnZpZXcuaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdEZXRhaWxDdHJsJyxcbiAgICAgICAgY29udHJvbGxlckFzOiAnZGV0YWlsJ1xuICAgICAgfSlcbiAgICAgIC5vdGhlcndpc2Uoe1xuICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcC9wYWdlcy9lcnJvcjQwNC9FcnJvcjQwNC52aWV3Lmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiAnRXJyb3I0MDRDdHJsJyxcbiAgICAgICAgY29udHJvbGxlckFzOiAnZTQwNCdcbiAgICAgIH0pO1xuXG4gICAgJGxvY2F0aW9uUHJvdmlkZXJcbiAgICAgIC5odG1sNU1vZGUoe1xuICAgICAgICBlbmFibGVkOiB0cnVlXG4gICAgICB9KVxuICAgICAgLmhhc2hQcmVmaXgoJyEnKTtcbiAgfVxuICBcbn0oKSk7IiwiKGZ1bmN0aW9uKCkge1xyXG4gICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwJylcclxuICAgIC5jb250cm9sbGVyKCdIZWFkZXJDdHJsJywgSGVhZGVyQ3RybCk7XHJcblxyXG4gIEhlYWRlckN0cmwuJGluamVjdCA9IFsnJGxvY2F0aW9uJ107XHJcblxyXG4gIGZ1bmN0aW9uIEhlYWRlckN0cmwoJGxvY2F0aW9uKSB7XHJcbiAgICAvLyBjb250cm9sbGVyQXMgVmlld01vZGVsXHJcbiAgICB2YXIgaGVhZGVyID0gdGhpcztcclxuXHJcbiAgICAvLyBiaW5kYWJsZSBtZW1iZXJzXHJcbiAgICBoZWFkZXIuaW5kZXhJc0FjdGl2ZSA9IGluZGV4SXNBY3RpdmU7XHJcbiAgICBoZWFkZXIubmF2SXNBY3RpdmUgPSBuYXZJc0FjdGl2ZTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEFwcGx5IGNsYXNzIHRvIGluZGV4IG5hdiBpZiBhY3RpdmVcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gcGF0aFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBpbmRleElzQWN0aXZlKHBhdGgpIHtcclxuICAgICAgLy8gcGF0aCBzaG91bGQgYmUgJy8nXHJcbiAgICAgIHJldHVybiAkbG9jYXRpb24ucGF0aCgpID09PSBwYXRoO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQXBwbHkgY2xhc3MgdG8gY3VycmVudGx5IGFjdGl2ZSBuYXYgaXRlbVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIG5hdklzQWN0aXZlKHBhdGgpIHtcclxuICAgICAgcmV0dXJuICRsb2NhdGlvbi5wYXRoKCkuc3Vic3RyKDAsIHBhdGgubGVuZ3RoKSA9PT0gcGF0aDtcclxuICAgIH1cclxuICB9XHJcblxyXG59KCkpOyIsIihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGFuZ3VsYXJcbiAgICAubW9kdWxlKCdhcHAnKVxuICAgIC5kaXJlY3RpdmUoJ2xvYWRpbmcnLCBsb2FkaW5nKTtcblxuICBmdW5jdGlvbiBsb2FkaW5nKCkge1xuICAgIC8vIHJldHVybiBkaXJlY3RpdmVcbiAgICByZXR1cm4ge1xuICAgICAgcmVzdHJpY3Q6ICdFQScsXG4gICAgICB0ZW1wbGF0ZTogJzxpbWcgY2xhc3M9XCJsb2FkaW5nXCIgc3JjPVwiL2Fzc2V0cy9pbWFnZXMvcmFwdG9yLWxvYWRpbmcuZ2lmXCI+J1xuICAgIH07XG4gIH1cbiAgXG59KCkpOyIsIihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGFuZ3VsYXJcbiAgICAubW9kdWxlKCdhcHAnKVxuICAgIC5kaXJlY3RpdmUoJ25hdkNvbnRyb2wnLCBuYXZDb250cm9sKTtcblxuICBuYXZDb250cm9sLiRpbmplY3QgPSBbJyR3aW5kb3cnLCAncmVzaXplJ107XG5cbiAgZnVuY3Rpb24gbmF2Q29udHJvbCgkd2luZG93LCByZXNpemUpIHtcbiAgICAvLyByZXR1cm4gZGlyZWN0aXZlXG4gICAgcmV0dXJuIHtcbiAgICAgIHJlc3RyaWN0OiAnRUEnLFxuICAgICAgbGluazogbmF2Q29udHJvbExpbmtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogbmF2Q29udHJvbCBMSU5LIGZ1bmN0aW9uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gJHNjb3BlXG4gICAgICovXG4gICAgZnVuY3Rpb24gbmF2Q29udHJvbExpbmsoJHNjb3BlLCAkZWxlbWVudCkge1xuICAgICAgLy8gcHJpdmF0ZSB2YXJpYWJsZXNcbiAgICAgIHZhciBfJGxheW91dENhbnZhcyA9ICRlbGVtZW50O1xuXG4gICAgICAvLyBkYXRhIG1vZGVsXG4gICAgICAkc2NvcGUubmF2ID0ge307XG4gICAgICAkc2NvcGUubmF2Lm5hdk9wZW47XG4gICAgICAkc2NvcGUubmF2LnRvZ2dsZU5hdiA9IHRvZ2dsZU5hdjtcblxuICAgICAgX2luaXQoKTtcblxuICAgICAgLyoqXG4gICAgICAgKiBJTklUIGZ1bmN0aW9uIGV4ZWN1dGVzIHByb2NlZHVyYWwgY29kZVxuICAgICAgICpcbiAgICAgICAqIEBwcml2YXRlXG4gICAgICAgKi9cbiAgICAgIGZ1bmN0aW9uIF9pbml0KCkge1xuICAgICAgICAvLyBpbml0aWFsaXplIGRlYm91bmNlZCByZXNpemVcbiAgICAgICAgdmFyIF9ycyA9IHJlc2l6ZS5pbml0KHtcbiAgICAgICAgICBzY29wZTogJHNjb3BlLFxuICAgICAgICAgIHJlc2l6ZWRGbjogX3Jlc2l6ZWQsXG4gICAgICAgICAgZGVib3VuY2U6IDEwMFxuICAgICAgICB9KTtcblxuICAgICAgICAkc2NvcGUuJG9uKCckbG9jYXRpb25DaGFuZ2VTdGFydCcsIF8kbG9jYXRpb25DaGFuZ2VTdGFydCk7XG4gICAgICAgIF9jbG9zZU5hdigpO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIFJlc2l6ZWQgd2luZG93IChkZWJvdW5jZWQpXG4gICAgICAgKlxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuICAgICAgZnVuY3Rpb24gX3Jlc2l6ZWQoKSB7XG4gICAgICAgIF8kbGF5b3V0Q2FudmFzLmNzcyh7XG4gICAgICAgICAgbWluSGVpZ2h0OiAkd2luZG93LmlubmVySGVpZ2h0ICsgJ3B4J1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiBPcGVuIG5hdmlnYXRpb24gbWVudVxuICAgICAgICpcbiAgICAgICAqIEBwcml2YXRlXG4gICAgICAgKi9cbiAgICAgIGZ1bmN0aW9uIF9vcGVuTmF2KCkge1xuICAgICAgICAkc2NvcGUubmF2Lm5hdk9wZW4gPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIENsb3NlIG5hdmlnYXRpb24gbWVudVxuICAgICAgICpcbiAgICAgICAqIEBwcml2YXRlXG4gICAgICAgKi9cbiAgICAgIGZ1bmN0aW9uIF9jbG9zZU5hdigpIHtcbiAgICAgICAgJHNjb3BlLm5hdi5uYXZPcGVuID0gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICogVG9nZ2xlIG5hdiBvcGVuL2Nsb3NlZFxuICAgICAgICovXG4gICAgICBmdW5jdGlvbiB0b2dnbGVOYXYoKSB7XG4gICAgICAgICRzY29wZS5uYXYubmF2T3BlbiA9ICEkc2NvcGUubmF2Lm5hdk9wZW47XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICogV2hlbiBjaGFuZ2luZyBsb2NhdGlvbiwgY2xvc2UgdGhlIG5hdiBpZiBpdCdzIG9wZW5cbiAgICAgICAqL1xuICAgICAgZnVuY3Rpb24gXyRsb2NhdGlvbkNoYW5nZVN0YXJ0KCkge1xuICAgICAgICBpZiAoJHNjb3BlLm5hdi5uYXZPcGVuKSB7XG4gICAgICAgICAgX2Nsb3NlTmF2KCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxufSgpKTsiLCIoZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwJylcbiAgICAuY29udHJvbGxlcignQWJvdXRDdHJsJywgQWJvdXRDdHJsKTtcblxuICBBYm91dEN0cmwuJGluamVjdCA9IFsnJHNjb3BlJywgJ01ldGFkYXRhJ107XG5cbiAgZnVuY3Rpb24gQWJvdXRDdHJsKCRzY29wZSwgTWV0YWRhdGEpIHtcbiAgICAvLyBjb250cm9sbGVyQXMgVmlld01vZGVsXG4gICAgdmFyIGFib3V0ID0gdGhpcztcblxuICAgIC8vIGJpbmRhYmxlIG1lbWJlcnNcbiAgICBhYm91dC50aXRsZSA9ICdBYm91dCc7XG5cbiAgICBfaW5pdCgpO1xuXG4gICAgLyoqXG4gICAgICogSU5JVCBmdW5jdGlvbiBleGVjdXRlcyBwcm9jZWR1cmFsIGNvZGVcbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgZnVuY3Rpb24gX2luaXQoKSB7XG4gICAgICAvLyBzZXQgcGFnZSA8dGl0bGU+XG4gICAgICBNZXRhZGF0YS5zZXQoYWJvdXQudGl0bGUpO1xuICAgIH1cbiAgfVxuICBcbn0oKSk7IiwiKGZ1bmN0aW9uKCkge1xyXG4gICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwJylcclxuICAgIC5jb250cm9sbGVyKCdEZXRhaWxDdHJsJywgRGV0YWlsQ3RybCk7XHJcblxyXG4gIERldGFpbEN0cmwuJGluamVjdCA9IFsnJHNjb3BlJywgJyRyb3V0ZVBhcmFtcycsICdNZXRhZGF0YScsICdEaW5vcyddO1xyXG5cclxuICBmdW5jdGlvbiBEZXRhaWxDdHJsKCRzY29wZSwgJHJvdXRlUGFyYW1zLCBNZXRhZGF0YSwgRGlub3MpIHtcclxuICAgIC8vIGNvbnRyb2xsZXJBcyBWaWV3TW9kZWxcclxuICAgIHZhciBkZXRhaWwgPSB0aGlzO1xyXG5cclxuICAgIC8vIHByaXZhdGUgdmFyaWFibGVzXHJcbiAgICB2YXIgX2lkID0gJHJvdXRlUGFyYW1zLmlkO1xyXG5cclxuICAgIF9pbml0KCk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJTklUIGZ1bmN0aW9uIGV4ZWN1dGVzIHByb2NlZHVyYWwgY29kZVxyXG4gICAgICpcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIF9pbml0KCkge1xyXG4gICAgICBfYWN0aXZhdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENvbnRyb2xsZXIgYWN0aXZhdGVcclxuICAgICAqIEdldCBKU09OIGRhdGFcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7Kn1cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIF9hY3RpdmF0ZSgpIHtcclxuICAgICAgLy8gc3RhcnQgbG9hZGluZ1xyXG4gICAgICBkZXRhaWwubG9hZGluZyA9IHRydWU7XHJcblxyXG4gICAgICAvLyBnZXQgdGhlIGRhdGEgZnJvbSBKU09OXHJcbiAgICAgIHJldHVybiBEaW5vcy5nZXREaW5vKF9pZCkudGhlbihfZ2V0SnNvblN1Y2Nlc3MsIF9nZXRKc29uRXJyb3IpLmZpbmFsbHkoX2ZpbmFsbHkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU3VjY2Vzc2Z1bCBwcm9taXNlIGRhdGFcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gZGF0YSB7b2JqZWN0fVxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gX2dldEpzb25TdWNjZXNzKGRhdGEpIHtcclxuICAgICAgZGV0YWlsLmRpbm8gPSBkYXRhO1xyXG4gICAgICBkZXRhaWwudGl0bGUgPSBkZXRhaWwuZGluby5uYW1lO1xyXG5cclxuICAgICAgLy8gc2V0IHBhZ2UgPHRpdGxlPlxyXG4gICAgICBNZXRhZGF0YS5zZXQoZGV0YWlsLnRpdGxlKTtcclxuXHJcbiAgICAgIHJldHVybiBkZXRhaWwuZGlubztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEZhaWx1cmUgb2YgcHJvbWlzZSBkYXRhXHJcbiAgICAgKiBTaG93IGVycm9yXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIF9nZXRKc29uRXJyb3IoKSB7XHJcbiAgICAgIGRldGFpbC5lcnJvciA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTdG9wIGxvYWRpbmdcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gX2ZpbmFsbHkoKSB7XHJcbiAgICAgIGRldGFpbC5sb2FkaW5nID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgfVxyXG4gIFxyXG59KCkpOyIsIihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGFuZ3VsYXJcbiAgICAubW9kdWxlKCdhcHAnKVxuICAgIC5jb250cm9sbGVyKCdFcnJvcjQwNEN0cmwnLCBFcnJvcjQwNEN0cmwpO1xuXG4gIEVycm9yNDA0Q3RybC4kaW5qZWN0ID0gWyckc2NvcGUnLCAnTWV0YWRhdGEnXTtcblxuICBmdW5jdGlvbiBFcnJvcjQwNEN0cmwoJHNjb3BlLCBNZXRhZGF0YSkge1xuICAgIHZhciBlNDA0ID0gdGhpcztcblxuICAgIC8vIGJpbmRhYmxlIG1lbWJlcnNcbiAgICBlNDA0LnRpdGxlID0gJzQwNCAtIFBhZ2UgTm90IEZvdW5kJztcblxuICAgIF9pbml0KCk7XG5cbiAgICAvKipcbiAgICAgKiBJTklUIGZ1bmN0aW9uIGV4ZWN1dGVzIHByb2NlZHVyYWwgY29kZVxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfaW5pdCgpIHtcbiAgICAgIC8vIHNldCBwYWdlIDx0aXRsZT5cbiAgICAgIE1ldGFkYXRhLnNldChlNDA0LnRpdGxlKTtcbiAgICB9XG4gIH1cbiAgXG59KCkpOyIsIihmdW5jdGlvbigpIHtcclxuICAndXNlIHN0cmljdCc7XHJcblxyXG4gIGFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcCcpXHJcbiAgICAuY29udHJvbGxlcignSG9tZUN0cmwnLCBIb21lQ3RybCk7XHJcblxyXG4gIEhvbWVDdHJsLiRpbmplY3QgPSBbJyRzY29wZScsICdNZXRhZGF0YScsICdEaW5vcyddO1xyXG5cclxuICBmdW5jdGlvbiBIb21lQ3RybCgkc2NvcGUsIE1ldGFkYXRhLCBEaW5vcykge1xyXG4gICAgLy8gY29udHJvbGxlckFzIFZpZXdNb2RlbFxyXG4gICAgdmFyIGhvbWUgPSB0aGlzO1xyXG5cclxuICAgIC8vIGJpbmRhYmxlIG1lbWJlcnNcclxuICAgIGhvbWUudGl0bGUgPSAnRGlub3NhdXJzJztcclxuICAgIGhvbWUucXVlcnkgPSAnJztcclxuICAgIGhvbWUucmVzZXRRdWVyeSA9IHJlc2V0UXVlcnk7XHJcblxyXG4gICAgX2luaXQoKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIElOSVQgZnVuY3Rpb24gZXhlY3V0ZXMgcHJvY2VkdXJhbCBjb2RlXHJcbiAgICAgKlxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gX2luaXQoKSB7XHJcbiAgICAgIC8vIHNldCBwYWdlIDx0aXRsZT5cclxuICAgICAgTWV0YWRhdGEuc2V0KGhvbWUudGl0bGUpO1xyXG5cclxuICAgICAgLy8gYWN0aXZhdGUgY29udHJvbGxlclxyXG4gICAgICBfYWN0aXZhdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENvbnRyb2xsZXIgYWN0aXZhdGVcclxuICAgICAqIEdldCBKU09OIGRhdGFcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7Kn1cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIF9hY3RpdmF0ZSgpIHtcclxuICAgICAgLy8gc3RhcnQgbG9hZGluZ1xyXG4gICAgICBob21lLmxvYWRpbmcgPSB0cnVlO1xyXG5cclxuICAgICAgLy8gZ2V0IHRoZSBkYXRhIGZyb20gSlNPTlxyXG4gICAgICByZXR1cm4gRGlub3MuZ2V0QWxsRGlub3MoKS50aGVuKF9nZXRKc29uU3VjY2VzcywgX2dldEpzb25FcnJvcikuZmluYWxseShfZmluYWxseSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTdWNjZXNzZnVsIHByb21pc2UgZGF0YVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBkYXRhIHtvYmplY3R9XHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBfZ2V0SnNvblN1Y2Nlc3MoZGF0YSkge1xyXG4gICAgICBob21lLmRpbm9zID0gZGF0YTtcclxuXHJcbiAgICAgIHJldHVybiBob21lLmRpbm9zO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRmFpbHVyZSBvZiBwcm9taXNlIGRhdGFcclxuICAgICAqIFNob3cgZXJyb3JcclxuICAgICAqIFN0b3AgbG9hZGluZ1xyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBfZ2V0SnNvbkVycm9yKCkge1xyXG4gICAgICBob21lLmVycm9yID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFN0b3AgbG9hZGluZ1xyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBfZmluYWxseSgpIHtcclxuICAgICAgaG9tZS5sb2FkaW5nID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXNldCBzZWFyY2ggcXVlcnlcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gcmVzZXRRdWVyeSgpIHtcclxuICAgICAgaG9tZS5xdWVyeSA9ICcnO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbn0oKSk7IiwiKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgYW5ndWxhclxuICAgIC5tb2R1bGUoJ2FwcCcpXG4gICAgLmRpcmVjdGl2ZSgnZGlub0NhcmQnLCBkaW5vQ2FyZCk7XG5cbiAgZnVuY3Rpb24gZGlub0NhcmQoKSB7XG4gICAgLy8gcmV0dXJuIGRpcmVjdGl2ZVxuICAgIHJldHVybiB7XG4gICAgICByZXN0cmljdDogJ0VBJyxcbiAgICAgIHJlcGxhY2U6IHRydWUsXG4gICAgICBzY29wZToge30sXG4gICAgICB0ZW1wbGF0ZVVybDogJ2FwcC9wYWdlcy9ob21lL2Rpbm8tY2FyZC9kaW5vQ2FyZC50cGwuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOiBkaW5vQ2FyZEN0cmwsXG4gICAgICBjb250cm9sbGVyQXM6ICdkYycsXG4gICAgICBiaW5kVG9Db250cm9sbGVyOiB7XG4gICAgICAgIGRpbm86ICc9J1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogRGlub0NhcmQgQ09OVFJPTExFUlxuICAgKi9cbiAgZnVuY3Rpb24gZGlub0NhcmRDdHJsKCkge1xuICAgIHZhciBkYyA9IHRoaXM7XG4gIH1cblxufSgpKTsiXX0=
