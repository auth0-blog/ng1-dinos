// application module setter
(function() {
  'use strict';

  angular
    .module('app', ['ngRoute', 'ngResource', 'ngSanitize', 'resize']);
    
}());
// fetch API data
(function() {
  'use strict';

  angular
    .module('app')
    .factory('Dinos', Dinos);

  Dinos.$inject = ['$http', '$q'];

  function Dinos($http, $q) {
    var _baseUrl = 'http://localhost:3001/api/';

    // callable members
    return {
      getAllDinos: getAllDinos,
      getDino: getDino
    };

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
      template: '<img class="loading" src="/assets/images/ajax-loader.gif">'
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
      templateUrl: 'app/pages/home/dinoCard.tpl.html',
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5tb2R1bGUuanMiLCJjb3JlL0Rpbm9zLmZhY3RvcnkuanMiLCJjb3JlL01ldGFkYXRhLmZhY3RvcnkuanMiLCJjb3JlL1BhZ2UuY3RybC5qcyIsImNvcmUvYXBwLmNvbmZpZy5qcyIsImhlYWRlci9IZWFkZXIuY3RybC5qcyIsImNvcmUvdWkvbG9hZGluZy5kaXIuanMiLCJjb3JlL3VpL25hdkNvbnRyb2wuZGlyLmpzIiwicGFnZXMvYWJvdXQvQWJvdXQuY3RybC5qcyIsInBhZ2VzL2RldGFpbC9EZXRhaWwuY3RybC5qcyIsInBhZ2VzL2Vycm9yNDA0L0Vycm9yNDA0LmN0cmwuanMiLCJwYWdlcy9ob21lL0hvbWUuY3RybC5qcyIsInBhZ2VzL2hvbWUvZGlub0NhcmQuZGlyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBhcHBsaWNhdGlvbiBtb2R1bGUgc2V0dGVyXG4oZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwJywgWyduZ1JvdXRlJywgJ25nUmVzb3VyY2UnLCAnbmdTYW5pdGl6ZScsICdyZXNpemUnXSk7XG4gICAgXG59KCkpOyIsIi8vIGZldGNoIEFQSSBkYXRhXG4oZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwJylcbiAgICAuZmFjdG9yeSgnRGlub3MnLCBEaW5vcyk7XG5cbiAgRGlub3MuJGluamVjdCA9IFsnJGh0dHAnLCAnJHEnXTtcblxuICBmdW5jdGlvbiBEaW5vcygkaHR0cCwgJHEpIHtcbiAgICB2YXIgX2Jhc2VVcmwgPSAnaHR0cDovL2xvY2FsaG9zdDozMDAxL2FwaS8nO1xuXG4gICAgLy8gY2FsbGFibGUgbWVtYmVyc1xuICAgIHJldHVybiB7XG4gICAgICBnZXRBbGxEaW5vczogZ2V0QWxsRGlub3MsXG4gICAgICBnZXREaW5vOiBnZXREaW5vXG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEdFVCBhbGwgZGlub3NhdXJzIGFuZCByZXR1cm4gcmVzdWx0c1xuICAgICAqXG4gICAgICogQHJldHVybnMge3Byb21pc2V9XG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0QWxsRGlub3MoKSB7XG4gICAgICByZXR1cm4gJGh0dHBcbiAgICAgICAgLmdldChfYmFzZVVybCArICdkaW5vc2F1cnMnKVxuICAgICAgICAudGhlbihfaGFuZGxlU3VjY2VzcywgX2hhbmRsZUVycm9yKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHRVQgYSBzcGVjaWZpYyBkaW5vc2F1ciBhbmQgcmV0dXJuIHJlc3VsdHNcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpZFxuICAgICAqIEByZXR1cm5zIHtwcm9taXNlfVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldERpbm8oaWQpIHtcbiAgICAgIHJldHVybiAkaHR0cFxuICAgICAgICAuZ2V0KF9iYXNlVXJsICsgJ2Rpbm9zYXVyLycgKyBpZClcbiAgICAgICAgLnRoZW4oX2hhbmRsZVN1Y2Nlc3MsIF9oYW5kbGVFcnJvcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUHJvbWlzZSByZXNwb25zZSBmdW5jdGlvblxuICAgICAqIENoZWNrcyB0eXBlb2YgZGF0YSByZXR1cm5lZDpcbiAgICAgKiBSZXNvbHZlcyBpZiByZXNwb25zZSBpcyBvYmplY3QsIHJlamVjdHMgaWYgbm90XG4gICAgICogVXNlZnVsIGZvciBBUElzIChpZSwgd2l0aCBuZ2lueCkgd2hlcmUgc2VydmVyIGVycm9yIEhUTUwgcGFnZSBtYXkgYmUgcmV0dXJuZWRcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7YW55fSByZXNcbiAgICAgKiBAcmV0dXJucyB7cHJvbWlzZX1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfaGFuZGxlU3VjY2VzcyhyZXMpIHtcbiAgICAgIGlmIChhbmd1bGFyLmlzT2JqZWN0KHJlcy5kYXRhKSkge1xuICAgICAgICByZXR1cm4gcmVzLmRhdGE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAkcS5yZWplY3Qoe21lc3NhZ2U6ICdSZXRyaWV2ZWQgZGF0YSB3YXMgbm90IHR5cGVvZiBvYmplY3QnfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUHJvbWlzZSByZXNwb25zZSBmdW5jdGlvbiAtIGVycm9yXG4gICAgICogVGhyb3dzIGFuIGVycm9yIHdpdGggZXJyb3IgZGF0YVxuICAgICAqXG4gICAgICogQHBhcmFtIHthbnl9IGVyclxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9oYW5kbGVFcnJvcihlcnIpIHtcbiAgICAgIHZhciBlcnJvck1zZyA9IGVyci5tZXNzYWdlIHx8ICdVbmFibGUgdG8gcmV0cmlldmUgZGF0YSc7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyb3JNc2cpO1xuICAgIH1cbiAgfVxuICBcbn0oKSk7IiwiKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgYW5ndWxhclxuICAgIC5tb2R1bGUoJ2FwcCcpXG4gICAgLmZhY3RvcnkoJ01ldGFkYXRhJywgTWV0YWRhdGEpO1xuXG4gIGZ1bmN0aW9uIE1ldGFkYXRhKCkge1xuICAgIHZhciBwYWdlVGl0bGUgPSAnJztcblxuICAgIC8vIGNhbGxhYmxlIG1lbWJlcnNcbiAgICByZXR1cm4ge1xuICAgICAgc2V0OiBzZXQsXG4gICAgICBnZXRUaXRsZTogZ2V0VGl0bGVcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogU2V0IHBhZ2UgdGl0bGUsIGRlc2NyaXB0aW9uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gbmV3VGl0bGUge3N0cmluZ31cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBzZXQobmV3VGl0bGUpIHtcbiAgICAgIHBhZ2VUaXRsZSA9IG5ld1RpdGxlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCB0aXRsZVxuICAgICAqIFJldHVybnMgc2l0ZSB0aXRsZSBhbmQgcGFnZSB0aXRsZVxuICAgICAqXG4gICAgICogQHJldHVybnMge3N0cmluZ30gc2l0ZSB0aXRsZSArIHBhZ2UgdGl0bGVcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZXRUaXRsZSgpIHtcbiAgICAgIHJldHVybiBwYWdlVGl0bGU7XG4gICAgfVxuICB9XG4gIFxufSgpKTsiLCIoZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwJylcbiAgICAuY29udHJvbGxlcignUGFnZUN0cmwnLCBQYWdlQ3RybCk7XG5cbiAgUGFnZUN0cmwuJGluamVjdCA9IFsnTWV0YWRhdGEnXTtcblxuICBmdW5jdGlvbiBQYWdlQ3RybChNZXRhZGF0YSkge1xuICAgIHZhciBwYWdlID0gdGhpcztcblxuICAgIF9pbml0KCk7XG5cbiAgICAvKipcbiAgICAgKiBJTklUIGZ1bmN0aW9uIGV4ZWN1dGVzIHByb2NlZHVyYWwgY29kZVxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBfaW5pdCgpIHtcbiAgICAgIC8vIGFzc29jaWF0ZSBwYWdlIDx0aXRsZT5cbiAgICAgIHBhZ2UubWV0YWRhdGEgPSBNZXRhZGF0YTtcbiAgICB9XG4gIH1cbiAgXG59KCkpOyIsIi8vIGFwcGxpY2F0aW9uIGNvbmZpZ1xuKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgYW5ndWxhclxuICAgIC5tb2R1bGUoJ2FwcCcpXG4gICAgLmNvbmZpZyhhcHBDb25maWcpO1xuXG4gIGFwcENvbmZpZy4kaW5qZWN0ID0gWyckcm91dGVQcm92aWRlcicsICckbG9jYXRpb25Qcm92aWRlciddO1xuXG4gIGZ1bmN0aW9uIGFwcENvbmZpZygkcm91dGVQcm92aWRlciwgJGxvY2F0aW9uUHJvdmlkZXIpIHtcbiAgICAkcm91dGVQcm92aWRlclxuICAgICAgLndoZW4oJy8nLCB7XG4gICAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL3BhZ2VzL2hvbWUvSG9tZS52aWV3Lmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiAnSG9tZUN0cmwnLFxuICAgICAgICBjb250cm9sbGVyQXM6ICdob21lJ1xuICAgICAgfSlcbiAgICAgIC53aGVuKCcvYWJvdXQnLCB7XG4gICAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL3BhZ2VzL2Fib3V0L0Fib3V0LnZpZXcuaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdBYm91dEN0cmwnLFxuICAgICAgICBjb250cm9sbGVyQXM6ICdhYm91dCdcbiAgICAgIH0pXG4gICAgICAud2hlbignL2Rpbm9zYXVyLzppZCcsIHtcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvcGFnZXMvZGV0YWlsL0RldGFpbC52aWV3Lmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiAnRGV0YWlsQ3RybCcsXG4gICAgICAgIGNvbnRyb2xsZXJBczogJ2RldGFpbCdcbiAgICAgIH0pXG4gICAgICAub3RoZXJ3aXNlKHtcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvcGFnZXMvZXJyb3I0MDQvRXJyb3I0MDQudmlldy5odG1sJyxcbiAgICAgICAgY29udHJvbGxlcjogJ0Vycm9yNDA0Q3RybCcsXG4gICAgICAgIGNvbnRyb2xsZXJBczogJ2U0MDQnXG4gICAgICB9KTtcblxuICAgICRsb2NhdGlvblByb3ZpZGVyXG4gICAgICAuaHRtbDVNb2RlKHtcbiAgICAgICAgZW5hYmxlZDogdHJ1ZVxuICAgICAgfSlcbiAgICAgIC5oYXNoUHJlZml4KCchJyk7XG4gIH1cbiAgXG59KCkpOyIsIihmdW5jdGlvbigpIHtcclxuICAndXNlIHN0cmljdCc7XHJcblxyXG4gIGFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcCcpXHJcbiAgICAuY29udHJvbGxlcignSGVhZGVyQ3RybCcsIEhlYWRlckN0cmwpO1xyXG5cclxuICBIZWFkZXJDdHJsLiRpbmplY3QgPSBbJyRsb2NhdGlvbiddO1xyXG5cclxuICBmdW5jdGlvbiBIZWFkZXJDdHJsKCRsb2NhdGlvbikge1xyXG4gICAgLy8gY29udHJvbGxlckFzIFZpZXdNb2RlbFxyXG4gICAgdmFyIGhlYWRlciA9IHRoaXM7XHJcblxyXG4gICAgLy8gYmluZGFibGUgbWVtYmVyc1xyXG4gICAgaGVhZGVyLmluZGV4SXNBY3RpdmUgPSBpbmRleElzQWN0aXZlO1xyXG4gICAgaGVhZGVyLm5hdklzQWN0aXZlID0gbmF2SXNBY3RpdmU7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBcHBseSBjbGFzcyB0byBpbmRleCBuYXYgaWYgYWN0aXZlXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHBhdGhcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gaW5kZXhJc0FjdGl2ZShwYXRoKSB7XHJcbiAgICAgIC8vIHBhdGggc2hvdWxkIGJlICcvJ1xyXG4gICAgICByZXR1cm4gJGxvY2F0aW9uLnBhdGgoKSA9PT0gcGF0aDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFwcGx5IGNsYXNzIHRvIGN1cnJlbnRseSBhY3RpdmUgbmF2IGl0ZW1cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gcGF0aFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBuYXZJc0FjdGl2ZShwYXRoKSB7XHJcbiAgICAgIHJldHVybiAkbG9jYXRpb24ucGF0aCgpLnN1YnN0cigwLCBwYXRoLmxlbmd0aCkgPT09IHBhdGg7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxufSgpKTsiLCIoZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwJylcbiAgICAuZGlyZWN0aXZlKCdsb2FkaW5nJywgbG9hZGluZyk7XG5cbiAgZnVuY3Rpb24gbG9hZGluZygpIHtcbiAgICAvLyByZXR1cm4gZGlyZWN0aXZlXG4gICAgcmV0dXJuIHtcbiAgICAgIHJlc3RyaWN0OiAnRUEnLFxuICAgICAgdGVtcGxhdGU6ICc8aW1nIGNsYXNzPVwibG9hZGluZ1wiIHNyYz1cIi9hc3NldHMvaW1hZ2VzL2FqYXgtbG9hZGVyLmdpZlwiPidcbiAgICB9O1xuICB9XG4gIFxufSgpKTsiLCIoZnVuY3Rpb24oKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgnYXBwJylcblx0XHQuZGlyZWN0aXZlKCduYXZDb250cm9sJywgbmF2Q29udHJvbCk7XG5cblx0bmF2Q29udHJvbC4kaW5qZWN0ID0gWyckd2luZG93JywgJ3Jlc2l6ZSddO1xuXG5cdGZ1bmN0aW9uIG5hdkNvbnRyb2woJHdpbmRvdywgcmVzaXplKSB7XG5cdFx0Ly8gcmV0dXJuIGRpcmVjdGl2ZVxuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0VBJyxcblx0XHRcdGxpbms6IG5hdkNvbnRyb2xMaW5rXG5cdFx0fTtcblxuXHRcdC8qKlxuXHRcdCAqIG5hdkNvbnRyb2wgTElOSyBmdW5jdGlvblxuXHRcdCAqXG5cdFx0ICogQHBhcmFtICRzY29wZVxuXHRcdCAqL1xuXHRcdGZ1bmN0aW9uIG5hdkNvbnRyb2xMaW5rKCRzY29wZSwgJGVsZW1lbnQpIHtcblx0XHRcdC8vIHByaXZhdGUgdmFyaWFibGVzXG5cdFx0XHR2YXIgXyRsYXlvdXRDYW52YXMgPSAkZWxlbWVudDtcblxuXHRcdFx0Ly8gZGF0YSBtb2RlbFxuXHRcdFx0JHNjb3BlLm5hdiA9IHt9O1xuXHRcdFx0JHNjb3BlLm5hdi5uYXZPcGVuO1xuXHRcdFx0JHNjb3BlLm5hdi50b2dnbGVOYXYgPSB0b2dnbGVOYXY7XG5cblx0XHRcdF9pbml0KCk7XG5cblx0XHRcdC8qKlxuXHRcdFx0ICogSU5JVCBmdW5jdGlvbiBleGVjdXRlcyBwcm9jZWR1cmFsIGNvZGVcblx0XHRcdCAqXG5cdFx0XHQgKiBAcHJpdmF0ZVxuXHRcdFx0ICovXG5cdFx0XHRmdW5jdGlvbiBfaW5pdCgpIHtcblx0XHRcdFx0Ly8gaW5pdGlhbGl6ZSBkZWJvdW5jZWQgcmVzaXplXG5cdFx0XHRcdHZhciBfcnMgPSByZXNpemUuaW5pdCh7XG5cdFx0XHRcdFx0c2NvcGU6ICRzY29wZSxcblx0XHRcdFx0XHRyZXNpemVkRm46IF9yZXNpemVkLFxuXHRcdFx0XHRcdGRlYm91bmNlOiAxMDBcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0JHNjb3BlLiRvbignJGxvY2F0aW9uQ2hhbmdlU3RhcnQnLCBfJGxvY2F0aW9uQ2hhbmdlU3RhcnQpO1xuXHRcdFx0XHRfY2xvc2VOYXYoKTtcblx0XHRcdH1cblxuXHRcdFx0LyoqXG5cdFx0XHQgKiBSZXNpemVkIHdpbmRvdyAoZGVib3VuY2VkKVxuXHRcdFx0ICpcblx0XHRcdCAqIEBwcml2YXRlXG5cdFx0XHQgKi9cblx0XHRcdGZ1bmN0aW9uIF9yZXNpemVkKCkge1xuXHRcdFx0XHRfJGxheW91dENhbnZhcy5jc3Moe1xuXHRcdFx0XHRcdG1pbkhlaWdodDogJHdpbmRvdy5pbm5lckhlaWdodCArICdweCdcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblx0XHRcdC8qKlxuXHRcdFx0ICogT3BlbiBuYXZpZ2F0aW9uIG1lbnVcblx0XHRcdCAqXG5cdFx0XHQgKiBAcHJpdmF0ZVxuXHRcdFx0ICovXG5cdFx0XHRmdW5jdGlvbiBfb3Blbk5hdigpIHtcblx0XHRcdFx0JHNjb3BlLm5hdi5uYXZPcGVuID0gdHJ1ZTtcblx0XHRcdH1cblxuXHRcdFx0LyoqXG5cdFx0XHQgKiBDbG9zZSBuYXZpZ2F0aW9uIG1lbnVcblx0XHRcdCAqXG5cdFx0XHQgKiBAcHJpdmF0ZVxuXHRcdFx0ICovXG5cdFx0XHRmdW5jdGlvbiBfY2xvc2VOYXYoKSB7XG5cdFx0XHRcdCRzY29wZS5uYXYubmF2T3BlbiA9IGZhbHNlO1xuXHRcdFx0fVxuXG5cdFx0XHQvKipcblx0XHRcdCAqIFRvZ2dsZSBuYXYgb3Blbi9jbG9zZWRcblx0XHRcdCAqL1xuXHRcdFx0ZnVuY3Rpb24gdG9nZ2xlTmF2KCkge1xuXHRcdFx0XHQkc2NvcGUubmF2Lm5hdk9wZW4gPSAhJHNjb3BlLm5hdi5uYXZPcGVuO1xuXHRcdFx0fVxuXG5cdFx0XHQvKipcblx0XHRcdCAqIFdoZW4gY2hhbmdpbmcgbG9jYXRpb24sIGNsb3NlIHRoZSBuYXYgaWYgaXQncyBvcGVuXG5cdFx0XHQgKi9cblx0XHRcdGZ1bmN0aW9uIF8kbG9jYXRpb25DaGFuZ2VTdGFydCgpIHtcblx0XHRcdFx0aWYgKCRzY29wZS5uYXYubmF2T3Blbikge1xuXHRcdFx0XHRcdF9jbG9zZU5hdigpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cbn0oKSk7IiwiKGZ1bmN0aW9uKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgYW5ndWxhclxuICAgIC5tb2R1bGUoJ2FwcCcpXG4gICAgLmNvbnRyb2xsZXIoJ0Fib3V0Q3RybCcsIEFib3V0Q3RybCk7XG5cbiAgQWJvdXRDdHJsLiRpbmplY3QgPSBbJyRzY29wZScsICdNZXRhZGF0YSddO1xuXG4gIGZ1bmN0aW9uIEFib3V0Q3RybCgkc2NvcGUsIE1ldGFkYXRhKSB7XG4gICAgLy8gY29udHJvbGxlckFzIFZpZXdNb2RlbFxuICAgIHZhciBhYm91dCA9IHRoaXM7XG5cbiAgICAvLyBiaW5kYWJsZSBtZW1iZXJzXG4gICAgYWJvdXQudGl0bGUgPSAnQWJvdXQnO1xuXG4gICAgX2luaXQoKTtcblxuICAgIC8qKlxuICAgICAqIElOSVQgZnVuY3Rpb24gZXhlY3V0ZXMgcHJvY2VkdXJhbCBjb2RlXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIF9pbml0KCkge1xuICAgICAgLy8gc2V0IHBhZ2UgPHRpdGxlPlxuICAgICAgTWV0YWRhdGEuc2V0KGFib3V0LnRpdGxlKTtcbiAgICB9XG4gIH1cbiAgXG59KCkpOyIsIihmdW5jdGlvbigpIHtcclxuICAndXNlIHN0cmljdCc7XHJcblxyXG4gIGFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcCcpXHJcbiAgICAuY29udHJvbGxlcignRGV0YWlsQ3RybCcsIERldGFpbEN0cmwpO1xyXG5cclxuICBEZXRhaWxDdHJsLiRpbmplY3QgPSBbJyRzY29wZScsICckcm91dGVQYXJhbXMnLCAnTWV0YWRhdGEnLCAnRGlub3MnXTtcclxuXHJcbiAgZnVuY3Rpb24gRGV0YWlsQ3RybCgkc2NvcGUsICRyb3V0ZVBhcmFtcywgTWV0YWRhdGEsIERpbm9zKSB7XHJcbiAgICAvLyBjb250cm9sbGVyQXMgVmlld01vZGVsXHJcbiAgICB2YXIgZGV0YWlsID0gdGhpcztcclxuXHJcbiAgICAvLyBwcml2YXRlIHZhcmlhYmxlc1xyXG4gICAgdmFyIF9pZCA9ICRyb3V0ZVBhcmFtcy5pZDtcclxuXHJcbiAgICBfaW5pdCgpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogSU5JVCBmdW5jdGlvbiBleGVjdXRlcyBwcm9jZWR1cmFsIGNvZGVcclxuICAgICAqXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBfaW5pdCgpIHtcclxuICAgICAgX2FjdGl2YXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb250cm9sbGVyIGFjdGl2YXRlXHJcbiAgICAgKiBHZXQgSlNPTiBkYXRhXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMgeyp9XHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBfYWN0aXZhdGUoKSB7XHJcbiAgICAgIC8vIHN0YXJ0IGxvYWRpbmdcclxuICAgICAgZGV0YWlsLmxvYWRpbmcgPSB0cnVlO1xyXG5cclxuICAgICAgLy8gZ2V0IHRoZSBkYXRhIGZyb20gSlNPTlxyXG4gICAgICByZXR1cm4gRGlub3MuZ2V0RGlubyhfaWQpLnRoZW4oX2dldEpzb25TdWNjZXNzLCBfZ2V0SnNvbkVycm9yKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFN1Y2Nlc3NmdWwgcHJvbWlzZSBkYXRhXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGRhdGEge29iamVjdH1cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIF9nZXRKc29uU3VjY2VzcyhkYXRhKSB7XHJcbiAgICAgIGRldGFpbC5kaW5vID0gZGF0YTtcclxuICAgICAgZGV0YWlsLnRpdGxlID0gZGV0YWlsLmRpbm8ubmFtZTtcclxuXHJcbiAgICAgIC8vIHNldCBwYWdlIDx0aXRsZT5cclxuICAgICAgTWV0YWRhdGEuc2V0KGRldGFpbC50aXRsZSk7XHJcblxyXG4gICAgICAvLyBzdG9wIGxvYWRpbmdcclxuICAgICAgZGV0YWlsLmxvYWRpbmcgPSBmYWxzZTtcclxuXHJcbiAgICAgIHJldHVybiBkZXRhaWwuZGlubztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEZhaWx1cmUgb2YgcHJvbWlzZSBkYXRhXHJcbiAgICAgKiBTaG93IGVycm9yXHJcbiAgICAgKiBTdG9wIGxvYWRpbmdcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gX2dldEpzb25FcnJvcigpIHtcclxuICAgICAgZGV0YWlsLmVycm9yID0gdHJ1ZTtcclxuXHJcbiAgICAgIC8vIHN0b3AgbG9hZGluZ1xyXG4gICAgICBkZXRhaWwubG9hZGluZyA9IGZhbHNlO1xyXG4gICAgfVxyXG4gIH1cclxuICBcclxufSgpKTsiLCIoZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyXG4gICAgLm1vZHVsZSgnYXBwJylcbiAgICAuY29udHJvbGxlcignRXJyb3I0MDRDdHJsJywgRXJyb3I0MDRDdHJsKTtcblxuICBFcnJvcjQwNEN0cmwuJGluamVjdCA9IFsnJHNjb3BlJywgJ01ldGFkYXRhJ107XG5cbiAgZnVuY3Rpb24gRXJyb3I0MDRDdHJsKCRzY29wZSwgTWV0YWRhdGEpIHtcbiAgICB2YXIgZTQwNCA9IHRoaXM7XG5cbiAgICAvLyBiaW5kYWJsZSBtZW1iZXJzXG4gICAgZTQwNC50aXRsZSA9ICc0MDQgLSBQYWdlIE5vdCBGb3VuZCc7XG5cbiAgICBfaW5pdCgpO1xuXG4gICAgLyoqXG4gICAgICogSU5JVCBmdW5jdGlvbiBleGVjdXRlcyBwcm9jZWR1cmFsIGNvZGVcbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgZnVuY3Rpb24gX2luaXQoKSB7XG4gICAgICAvLyBzZXQgcGFnZSA8dGl0bGU+XG4gICAgICBNZXRhZGF0YS5zZXQoZTQwNC50aXRsZSk7XG4gICAgfVxuICB9XG4gIFxufSgpKTsiLCIoZnVuY3Rpb24oKSB7XHJcbiAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICBhbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAnKVxyXG4gICAgLmNvbnRyb2xsZXIoJ0hvbWVDdHJsJywgSG9tZUN0cmwpO1xyXG5cclxuICBIb21lQ3RybC4kaW5qZWN0ID0gWyckc2NvcGUnLCAnTWV0YWRhdGEnLCAnRGlub3MnXTtcclxuXHJcbiAgZnVuY3Rpb24gSG9tZUN0cmwoJHNjb3BlLCBNZXRhZGF0YSwgRGlub3MpIHtcclxuICAgIC8vIGNvbnRyb2xsZXJBcyBWaWV3TW9kZWxcclxuICAgIHZhciBob21lID0gdGhpcztcclxuXHJcbiAgICAvLyBiaW5kYWJsZSBtZW1iZXJzXHJcbiAgICBob21lLnRpdGxlID0gJ0Rpbm9zYXVycyc7XHJcblxyXG4gICAgX2luaXQoKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIElOSVQgZnVuY3Rpb24gZXhlY3V0ZXMgcHJvY2VkdXJhbCBjb2RlXHJcbiAgICAgKlxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gX2luaXQoKSB7XHJcbiAgICAgIC8vIHNldCBwYWdlIDx0aXRsZT5cclxuICAgICAgTWV0YWRhdGEuc2V0KGhvbWUudGl0bGUpO1xyXG5cclxuICAgICAgLy8gYWN0aXZhdGUgY29udHJvbGxlclxyXG4gICAgICBfYWN0aXZhdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENvbnRyb2xsZXIgYWN0aXZhdGVcclxuICAgICAqIEdldCBKU09OIGRhdGFcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyB7Kn1cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIF9hY3RpdmF0ZSgpIHtcclxuICAgICAgLy8gc3RhcnQgbG9hZGluZ1xyXG4gICAgICBob21lLmxvYWRpbmcgPSB0cnVlO1xyXG5cclxuICAgICAgLy8gZ2V0IHRoZSBkYXRhIGZyb20gSlNPTlxyXG4gICAgICByZXR1cm4gRGlub3MuZ2V0QWxsRGlub3MoKS50aGVuKF9nZXRKc29uU3VjY2VzcywgX2dldEpzb25FcnJvcik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTdWNjZXNzZnVsIHByb21pc2UgZGF0YVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBkYXRhIHtvYmplY3R9XHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBfZ2V0SnNvblN1Y2Nlc3MoZGF0YSkge1xyXG4gICAgICBob21lLmRpbm9zID0gZGF0YTtcclxuXHJcbiAgICAgIC8vIHN0b3AgbG9hZGluZ1xyXG4gICAgICBob21lLmxvYWRpbmcgPSBmYWxzZTtcclxuXHJcbiAgICAgIHJldHVybiBob21lLmRpbm9zO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRmFpbHVyZSBvZiBwcm9taXNlIGRhdGFcclxuICAgICAqIFNob3cgZXJyb3JcclxuICAgICAqIFN0b3AgbG9hZGluZ1xyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBfZ2V0SnNvbkVycm9yKCkge1xyXG4gICAgICBob21lLmVycm9yID0gdHJ1ZTtcclxuXHJcbiAgICAgIC8vIHN0b3AgbG9hZGluZ1xyXG4gICAgICBob21lLmxvYWRpbmcgPSBmYWxzZTtcclxuICAgIH1cclxuICB9XHJcblxyXG59KCkpOyIsIihmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGFuZ3VsYXJcbiAgICAubW9kdWxlKCdhcHAnKVxuICAgIC5kaXJlY3RpdmUoJ2Rpbm9DYXJkJywgZGlub0NhcmQpO1xuXG4gIGZ1bmN0aW9uIGRpbm9DYXJkKCkge1xuICAgIC8vIHJldHVybiBkaXJlY3RpdmVcbiAgICByZXR1cm4ge1xuICAgICAgcmVzdHJpY3Q6ICdFQScsXG4gICAgICByZXBsYWNlOiB0cnVlLFxuICAgICAgc2NvcGU6IHt9LFxuICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvcGFnZXMvaG9tZS9kaW5vQ2FyZC50cGwuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOiBkaW5vQ2FyZEN0cmwsXG4gICAgICBjb250cm9sbGVyQXM6ICdkYycsXG4gICAgICBiaW5kVG9Db250cm9sbGVyOiB7XG4gICAgICAgIGRpbm86ICc9J1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogRGlub0NhcmQgQ09OVFJPTExFUlxuICAgKi9cbiAgZnVuY3Rpb24gZGlub0NhcmRDdHJsKCkge1xuICAgIHZhciBkYyA9IHRoaXM7XG4gIH1cblxufSgpKTsiXX0=
