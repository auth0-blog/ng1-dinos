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
(function() {
	'use strict';

	angular
		.module('app')
		.directive('dinoCard', dinoCard);

	dinoCard.$inject = ['$timeout'];

	function dinoCard($timeout) {
		// return directive
		return {
			restrict: 'EA',
			replace: true,
			scope: {},
			templateUrl: 'app/components/dino-card/dinoCard.tpl.html',
			controller: dinoCardCtrl,
			controllerAs: 'dc',
			bindToController: {
				data: '='
			},
			link: dinoCardLink
		};

		/**
		 * DinoCard LINK function
		 *
		 * @param $scope
		 * @param $element
		 * @param $attrs
		 * @param dc {controller}
		 */
		function dinoCardLink($scope, $element, $attrs, dc) {
			var _$flipWrapper = $element.find('.flipWrapper');

			// bindable members
			dc.flipCard = flipCard;

			_init();

			/**
			 * INIT function executes procedural code
			 *
			 * @private
			 */
			function _init() {
				
			}

			function flipCard() {
				_$flipWrapper.toggleClass('flipActive');
			}
		}
	}

	dinoCardCtrl.$inject = [];
	/**
	 * DinoCard CONTROLLER
	 */
	function dinoCardCtrl() {
		var dc = this;

		// bindable members
		dc.dino = dc.data;
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
// fetch API data
(function() {
	'use strict';

	angular
		.module('app')
		.factory('APIData', APIData);

	APIData.$inject = ['$http', 'Res'];

	function APIData($http, Res) {
		var _API = 'http://localhost:3001/api/';

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
				.get(_API + 'dinosaurs')
				.then(Res.success, Res.error);
		}

		/**
		 * GET a specific dinosaur and return results
		 * 
		 * @param {Integer} id
		 * @returns
		 */
		function getDino(id) {
			return $http
				.get(_API + 'dinosaur/' + id)
				.then(Res.success, Res.error);
		}
	}
}());
(function() {
	'use strict';

	angular
		.module('app')
		.factory('Res', Res);

	Res.$inject = ['$rootScope'];

	function Res($rootScope) {
		// callable members
		return {
			success: success,
			error: error
		};

		/**
		 * Promise response function
		 * Checks typeof data returned and succeeds if JS object, throws error if not
		 * Useful for APIs (ie, with nginx) where server error HTML page may be returned in error
		 *
		 * @param response {*} data from $http
		 * @returns {*} object, array
		 */
		function success(response) {
			if (angular.isObject(response.data)) {
				return response.data;
			} else {
				throw new Error('retrieved data is not typeof object.');
			}
		}

		/**
		 * Promise response function - error
		 * Ends loading spinner
		 * Throws an error with error data
		 *
		 * @param error {object}
		 */
		function error(error) {
			$rootScope.$broadcast('loading-off');
			throw new Error('Error retrieving data', error);
		}
	}
}());
(function() {
	'use strict';

	angular
		.module('app')
		.directive('loading', loading);

	loading.$inject = ['$window', 'resize'];

	function loading($window, resize) {
		// return directive
		return {
			restrict: 'EA',
			replace: true,
			templateUrl: 'app/core/ui/loading.tpl.html',
			transclude: true,
			controller: loadingCtrl,
			controllerAs: 'loading',
			bindToController: true,
			link: loadingLink
		};

		/**
		 * loading LINK
		 * Disables page scrolling when loading overlay is open
		 *
		 * @param $scope
		 * @param $element
		 * @param $attrs
		 * @param loading {controller}
		 */
		function loadingLink($scope, $element, $attrs, loading) {
			// private variables
			var _$body = angular.element('body');
			var _winHeight = $window.innerHeight + 'px';

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
					debounce: 200
				});

				// $watch active state
				$scope.$watch('loading.active', _$watchActive);
			}

			/**
			 * Window resized
			 * If loading, reapply body height
			 * to prevent scrollbar
			 *
			 * @private
			 */
			function _resized() {
				_winHeight = $window.innerHeight + 'px';

				if (loading.active) {
					_$body.css({
						height: _winHeight
					});
				}
			}

			/**
			 * $watch loading.active
			 *
			 * @param newVal {boolean}
			 * @param oldVal {undefined|boolean}
			 * @private
			 */
			function _$watchActive(newVal, oldVal) {
				if (newVal) {
					_open();
				} else {
					_close();
				}
			}

			/**
			 * Open loading
			 * Disable scroll
			 *
			 * @private
			 */
			function _open() {
				_$body.css({
					height: _winHeight,
					overflowY: 'hidden'
				});
			}

			/**
			 * Close loading
			 * Enable scroll
			 *
			 * @private
			 */
			function _close() {
				_$body.css({
					height: '',
					overflowY: ''
				});
			}
		}
	}

	loadingCtrl.$inject = ['$scope'];
	/**
	 * loading CONTROLLER
	 * Update the loading status based
	 * on routeChange state
	 */
	function loadingCtrl($scope) {
		var loading = this;

		_init();

		/**
		 * INIT function executes procedural code
		 *
		 * @private
		 */
		function _init() {
			$scope.$on('loading-on', _loadingActive);
			$scope.$on('loading-off', _loadingInactive);
		}

		/**
		 * Set loading to active
		 *
		 * @private
		 */
		function _loadingActive() {
			loading.active = true;
		}

		/**
		 * Set loading to inactive
		 *
		 * @private
		 */
		function _loadingInactive() {
			loading.active = false;
		}
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
			var _$body = angular.element('body');
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

	DetailCtrl.$inject = ['$scope', '$routeParams', 'Metadata', 'APIData'];

	function DetailCtrl($scope, $routeParams, Metadata, APIData) {
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
			$scope.$emit('loading-on');

			// get the data from JSON
			return APIData.getDino(_id).then(_getJsonSuccess, _getJsonError);
		}

		/**
		 * Successful promise data
		 *
		 * @param data {json}
		 * @private
		 */
		function _getJsonSuccess(data) {
			detail.dino = data;
			detail.title = detail.dino.name;

			// set page <title>
			Metadata.set(detail.title);

			// stop loading
			$scope.$emit('loading-off');

			return detail.dino;
		}

		/**
		 * Failure of promise data
		 */
		function _getJsonError() {
			detail.error = true;
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

	HomeCtrl.$inject = ['$scope', 'Metadata', 'APIData'];

	function HomeCtrl($scope, Metadata, APIData) {
		// controllerAs ViewModel
		var home = this;

		// bindable members
		home.title = 'All Dinosaurs';

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
		 * @returns {any}
		 * @private
		 */
		function _activate() {
			// start loading
			$scope.$emit('loading-on');

			// get the data from JSON
			return APIData.getAllDinos().then(_getJsonSuccess, _getJsonError);
		}

		/**
		 * Successful promise data
		 *
		 * @param data {json}
		 * @private
		 */
		function _getJsonSuccess(data) {
			home.dinos = data;

			// stop loading
			$scope.$emit('loading-off');

			return home.dinos;
		}

		/**
		 * Failure of promise data
		 */
		function _getJsonError() {
			home.error = true;
		}
	}
}());
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5tb2R1bGUuanMiLCJjb3JlL01ldGFkYXRhLmZhY3RvcnkuanMiLCJjb3JlL1BhZ2UuY3RybC5qcyIsImNvbXBvbmVudHMvZGluby1jYXJkL2Rpbm9DYXJkLmRpci5qcyIsImNvbXBvbmVudHMvaGVhZGVyL0hlYWRlci5jdHJsLmpzIiwiY29yZS9hcHAtc2V0dXAvYXBwLmNvbmZpZy5qcyIsImNvcmUvZ2V0LWRhdGEvQVBJRGF0YS5mYWN0b3J5LmpzIiwiY29yZS9nZXQtZGF0YS9SZXMuZmFjdG9yeS5qcyIsImNvcmUvdWkvbG9hZGluZy5kaXIuanMiLCJjb3JlL3VpL25hdkNvbnRyb2wuZGlyLmpzIiwicGFnZXMvYWJvdXQvQWJvdXQuY3RybC5qcyIsInBhZ2VzL2RldGFpbC9EZXRhaWwuY3RybC5qcyIsInBhZ2VzL2Vycm9yNDA0L0Vycm9yNDA0LmN0cmwuanMiLCJwYWdlcy9ob21lL0hvbWUuY3RybC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gYXBwbGljYXRpb24gbW9kdWxlIHNldHRlclxuKGZ1bmN0aW9uKCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ2FwcCcsIFsnbmdSb3V0ZScsICduZ1Jlc291cmNlJywgJ25nU2FuaXRpemUnLCAncmVzaXplJ10pO1xufSgpKTsiLCIoZnVuY3Rpb24oKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgnYXBwJylcblx0XHQuZmFjdG9yeSgnTWV0YWRhdGEnLCBNZXRhZGF0YSk7XG5cblx0ZnVuY3Rpb24gTWV0YWRhdGEoKSB7XG5cdFx0dmFyIHBhZ2VUaXRsZSA9ICcnO1xuXG5cdFx0Ly8gY2FsbGFibGUgbWVtYmVyc1xuXHRcdHJldHVybiB7XG5cdFx0XHRzZXQ6IHNldCxcblx0XHRcdGdldFRpdGxlOiBnZXRUaXRsZVxuXHRcdH07XG5cblx0XHQvKipcblx0XHQgKiBTZXQgcGFnZSB0aXRsZSwgZGVzY3JpcHRpb25cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSBuZXdUaXRsZSB7c3RyaW5nfVxuXHRcdCAqL1xuXHRcdGZ1bmN0aW9uIHNldChuZXdUaXRsZSkge1xuXHRcdFx0cGFnZVRpdGxlID0gbmV3VGl0bGU7XG5cdFx0fVxuXG5cdFx0LyoqXG5cdFx0ICogR2V0IHRpdGxlXG5cdFx0ICogUmV0dXJucyBzaXRlIHRpdGxlIGFuZCBwYWdlIHRpdGxlXG5cdFx0ICpcblx0XHQgKiBAcmV0dXJucyB7c3RyaW5nfSBzaXRlIHRpdGxlICsgcGFnZSB0aXRsZVxuXHRcdCAqL1xuXHRcdGZ1bmN0aW9uIGdldFRpdGxlKCkge1xuXHRcdFx0cmV0dXJuIHBhZ2VUaXRsZTtcblx0XHR9XG5cdH1cbn0oKSk7IiwiKGZ1bmN0aW9uKCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ2FwcCcpXG5cdFx0LmNvbnRyb2xsZXIoJ1BhZ2VDdHJsJywgUGFnZUN0cmwpO1xuXG5cdFBhZ2VDdHJsLiRpbmplY3QgPSBbJ01ldGFkYXRhJ107XG5cblx0ZnVuY3Rpb24gUGFnZUN0cmwoTWV0YWRhdGEpIHtcblx0XHR2YXIgcGFnZSA9IHRoaXM7XG5cblx0XHRfaW5pdCgpO1xuXG5cdFx0LyoqXG5cdFx0ICogSU5JVCBmdW5jdGlvbiBleGVjdXRlcyBwcm9jZWR1cmFsIGNvZGVcblx0XHQgKlxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICovXG5cdFx0ZnVuY3Rpb24gX2luaXQoKSB7XG5cdFx0XHQvLyBhc3NvY2lhdGUgcGFnZSA8dGl0bGU+XG5cdFx0XHRwYWdlLm1ldGFkYXRhID0gTWV0YWRhdGE7XG5cdFx0fVxuXHR9XG59KCkpOyIsIihmdW5jdGlvbigpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdGFuZ3VsYXJcblx0XHQubW9kdWxlKCdhcHAnKVxuXHRcdC5kaXJlY3RpdmUoJ2Rpbm9DYXJkJywgZGlub0NhcmQpO1xuXG5cdGRpbm9DYXJkLiRpbmplY3QgPSBbJyR0aW1lb3V0J107XG5cblx0ZnVuY3Rpb24gZGlub0NhcmQoJHRpbWVvdXQpIHtcblx0XHQvLyByZXR1cm4gZGlyZWN0aXZlXG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRUEnLFxuXHRcdFx0cmVwbGFjZTogdHJ1ZSxcblx0XHRcdHNjb3BlOiB7fSxcblx0XHRcdHRlbXBsYXRlVXJsOiAnYXBwL2NvbXBvbmVudHMvZGluby1jYXJkL2Rpbm9DYXJkLnRwbC5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6IGRpbm9DYXJkQ3RybCxcblx0XHRcdGNvbnRyb2xsZXJBczogJ2RjJyxcblx0XHRcdGJpbmRUb0NvbnRyb2xsZXI6IHtcblx0XHRcdFx0ZGF0YTogJz0nXG5cdFx0XHR9LFxuXHRcdFx0bGluazogZGlub0NhcmRMaW5rXG5cdFx0fTtcblxuXHRcdC8qKlxuXHRcdCAqIERpbm9DYXJkIExJTksgZnVuY3Rpb25cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSAkc2NvcGVcblx0XHQgKiBAcGFyYW0gJGVsZW1lbnRcblx0XHQgKiBAcGFyYW0gJGF0dHJzXG5cdFx0ICogQHBhcmFtIGRjIHtjb250cm9sbGVyfVxuXHRcdCAqL1xuXHRcdGZ1bmN0aW9uIGRpbm9DYXJkTGluaygkc2NvcGUsICRlbGVtZW50LCAkYXR0cnMsIGRjKSB7XG5cdFx0XHR2YXIgXyRmbGlwV3JhcHBlciA9ICRlbGVtZW50LmZpbmQoJy5mbGlwV3JhcHBlcicpO1xuXG5cdFx0XHQvLyBiaW5kYWJsZSBtZW1iZXJzXG5cdFx0XHRkYy5mbGlwQ2FyZCA9IGZsaXBDYXJkO1xuXG5cdFx0XHRfaW5pdCgpO1xuXG5cdFx0XHQvKipcblx0XHRcdCAqIElOSVQgZnVuY3Rpb24gZXhlY3V0ZXMgcHJvY2VkdXJhbCBjb2RlXG5cdFx0XHQgKlxuXHRcdFx0ICogQHByaXZhdGVcblx0XHRcdCAqL1xuXHRcdFx0ZnVuY3Rpb24gX2luaXQoKSB7XG5cdFx0XHRcdFxuXHRcdFx0fVxuXG5cdFx0XHRmdW5jdGlvbiBmbGlwQ2FyZCgpIHtcblx0XHRcdFx0XyRmbGlwV3JhcHBlci50b2dnbGVDbGFzcygnZmxpcEFjdGl2ZScpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdGRpbm9DYXJkQ3RybC4kaW5qZWN0ID0gW107XG5cdC8qKlxuXHQgKiBEaW5vQ2FyZCBDT05UUk9MTEVSXG5cdCAqL1xuXHRmdW5jdGlvbiBkaW5vQ2FyZEN0cmwoKSB7XG5cdFx0dmFyIGRjID0gdGhpcztcblxuXHRcdC8vIGJpbmRhYmxlIG1lbWJlcnNcblx0XHRkYy5kaW5vID0gZGMuZGF0YTtcblx0fVxuXG59KCkpOyIsIihmdW5jdGlvbigpIHtcclxuXHQndXNlIHN0cmljdCc7XHJcblxyXG5cdGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ2FwcCcpXHJcblx0XHQuY29udHJvbGxlcignSGVhZGVyQ3RybCcsIEhlYWRlckN0cmwpO1xyXG5cclxuXHRIZWFkZXJDdHJsLiRpbmplY3QgPSBbJyRsb2NhdGlvbiddO1xyXG5cclxuXHRmdW5jdGlvbiBIZWFkZXJDdHJsKCRsb2NhdGlvbikge1xyXG5cdFx0Ly8gY29udHJvbGxlckFzIFZpZXdNb2RlbFxyXG5cdFx0dmFyIGhlYWRlciA9IHRoaXM7XHJcblxyXG5cdFx0Ly8gYmluZGFibGUgbWVtYmVyc1xyXG5cdFx0aGVhZGVyLmluZGV4SXNBY3RpdmUgPSBpbmRleElzQWN0aXZlO1xyXG5cdFx0aGVhZGVyLm5hdklzQWN0aXZlID0gbmF2SXNBY3RpdmU7XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBBcHBseSBjbGFzcyB0byBpbmRleCBuYXYgaWYgYWN0aXZlXHJcblx0XHQgKlxyXG5cdFx0ICogQHBhcmFtIHtzdHJpbmd9IHBhdGhcclxuXHRcdCAqL1xyXG5cdFx0ZnVuY3Rpb24gaW5kZXhJc0FjdGl2ZShwYXRoKSB7XHJcblx0XHRcdC8vIHBhdGggc2hvdWxkIGJlICcvJ1xyXG5cdFx0XHRyZXR1cm4gJGxvY2F0aW9uLnBhdGgoKSA9PT0gcGF0aDtcclxuXHRcdH1cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIEFwcGx5IGNsYXNzIHRvIGN1cnJlbnRseSBhY3RpdmUgbmF2IGl0ZW1cclxuXHRcdCAqXHJcblx0XHQgKiBAcGFyYW0ge3N0cmluZ30gcGF0aFxyXG5cdFx0ICovXHJcblx0XHRmdW5jdGlvbiBuYXZJc0FjdGl2ZShwYXRoKSB7XHJcblx0XHRcdHJldHVybiAkbG9jYXRpb24ucGF0aCgpLnN1YnN0cigwLCBwYXRoLmxlbmd0aCkgPT09IHBhdGg7XHJcblx0XHR9XHJcblx0fVxyXG5cclxufSgpKTsiLCIvLyBhcHBsaWNhdGlvbiBjb25maWdcbihmdW5jdGlvbigpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdGFuZ3VsYXJcblx0XHQubW9kdWxlKCdhcHAnKVxuXHRcdC5jb25maWcoYXBwQ29uZmlnKTtcblxuXHRhcHBDb25maWcuJGluamVjdCA9IFsnJHJvdXRlUHJvdmlkZXInLCAnJGxvY2F0aW9uUHJvdmlkZXInXTtcblxuXHRmdW5jdGlvbiBhcHBDb25maWcoJHJvdXRlUHJvdmlkZXIsICRsb2NhdGlvblByb3ZpZGVyKSB7XG5cdFx0JHJvdXRlUHJvdmlkZXJcblx0XHRcdC53aGVuKCcvJywge1xuXHRcdFx0XHR0ZW1wbGF0ZVVybDogJ2FwcC9wYWdlcy9ob21lL0hvbWUudmlldy5odG1sJyxcblx0XHRcdFx0Y29udHJvbGxlcjogJ0hvbWVDdHJsJyxcblx0XHRcdFx0Y29udHJvbGxlckFzOiAnaG9tZSdcblx0XHRcdH0pXG5cdFx0XHQud2hlbignL2Fib3V0Jywge1xuXHRcdFx0XHR0ZW1wbGF0ZVVybDogJ2FwcC9wYWdlcy9hYm91dC9BYm91dC52aWV3Lmh0bWwnLFxuXHRcdFx0XHRjb250cm9sbGVyOiAnQWJvdXRDdHJsJyxcblx0XHRcdFx0Y29udHJvbGxlckFzOiAnYWJvdXQnXG5cdFx0XHR9KVxuXHRcdFx0LndoZW4oJy9kaW5vc2F1ci86aWQnLCB7XG5cdFx0XHRcdHRlbXBsYXRlVXJsOiAnYXBwL3BhZ2VzL2RldGFpbC9EZXRhaWwudmlldy5odG1sJyxcblx0XHRcdFx0Y29udHJvbGxlcjogJ0RldGFpbEN0cmwnLFxuXHRcdFx0XHRjb250cm9sbGVyQXM6ICdkZXRhaWwnXG5cdFx0XHR9KVxuXHRcdFx0Lm90aGVyd2lzZSh7XG5cdFx0XHRcdHRlbXBsYXRlVXJsOiAnYXBwL3BhZ2VzL2Vycm9yNDA0L0Vycm9yNDA0LnZpZXcuaHRtbCcsXG5cdFx0XHRcdGNvbnRyb2xsZXI6ICdFcnJvcjQwNEN0cmwnLFxuXHRcdFx0XHRjb250cm9sbGVyQXM6ICdlNDA0J1xuXHRcdFx0fSk7XG5cblx0XHQkbG9jYXRpb25Qcm92aWRlclxuXHRcdFx0Lmh0bWw1TW9kZSh7XG5cdFx0XHRcdGVuYWJsZWQ6IHRydWVcblx0XHRcdH0pXG5cdFx0XHQuaGFzaFByZWZpeCgnIScpO1xuXHR9XG59KCkpOyIsIi8vIGZldGNoIEFQSSBkYXRhXG4oZnVuY3Rpb24oKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgnYXBwJylcblx0XHQuZmFjdG9yeSgnQVBJRGF0YScsIEFQSURhdGEpO1xuXG5cdEFQSURhdGEuJGluamVjdCA9IFsnJGh0dHAnLCAnUmVzJ107XG5cblx0ZnVuY3Rpb24gQVBJRGF0YSgkaHR0cCwgUmVzKSB7XG5cdFx0dmFyIF9BUEkgPSAnaHR0cDovL2xvY2FsaG9zdDozMDAxL2FwaS8nO1xuXG5cdFx0Ly8gY2FsbGFibGUgbWVtYmVyc1xuXHRcdHJldHVybiB7XG5cdFx0XHRnZXRBbGxEaW5vczogZ2V0QWxsRGlub3MsXG5cdFx0XHRnZXREaW5vOiBnZXREaW5vXG5cdFx0fTtcblxuXHRcdC8qKlxuXHRcdCAqIEdFVCBhbGwgZGlub3NhdXJzIGFuZCByZXR1cm4gcmVzdWx0c1xuXHRcdCAqXG5cdFx0ICogQHJldHVybnMge3Byb21pc2V9XG5cdFx0ICovXG5cdFx0ZnVuY3Rpb24gZ2V0QWxsRGlub3MoKSB7XG5cdFx0XHRyZXR1cm4gJGh0dHBcblx0XHRcdFx0LmdldChfQVBJICsgJ2Rpbm9zYXVycycpXG5cdFx0XHRcdC50aGVuKFJlcy5zdWNjZXNzLCBSZXMuZXJyb3IpO1xuXHRcdH1cblxuXHRcdC8qKlxuXHRcdCAqIEdFVCBhIHNwZWNpZmljIGRpbm9zYXVyIGFuZCByZXR1cm4gcmVzdWx0c1xuXHRcdCAqIFxuXHRcdCAqIEBwYXJhbSB7SW50ZWdlcn0gaWRcblx0XHQgKiBAcmV0dXJuc1xuXHRcdCAqL1xuXHRcdGZ1bmN0aW9uIGdldERpbm8oaWQpIHtcblx0XHRcdHJldHVybiAkaHR0cFxuXHRcdFx0XHQuZ2V0KF9BUEkgKyAnZGlub3NhdXIvJyArIGlkKVxuXHRcdFx0XHQudGhlbihSZXMuc3VjY2VzcywgUmVzLmVycm9yKTtcblx0XHR9XG5cdH1cbn0oKSk7IiwiKGZ1bmN0aW9uKCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ2FwcCcpXG5cdFx0LmZhY3RvcnkoJ1JlcycsIFJlcyk7XG5cblx0UmVzLiRpbmplY3QgPSBbJyRyb290U2NvcGUnXTtcblxuXHRmdW5jdGlvbiBSZXMoJHJvb3RTY29wZSkge1xuXHRcdC8vIGNhbGxhYmxlIG1lbWJlcnNcblx0XHRyZXR1cm4ge1xuXHRcdFx0c3VjY2Vzczogc3VjY2Vzcyxcblx0XHRcdGVycm9yOiBlcnJvclxuXHRcdH07XG5cblx0XHQvKipcblx0XHQgKiBQcm9taXNlIHJlc3BvbnNlIGZ1bmN0aW9uXG5cdFx0ICogQ2hlY2tzIHR5cGVvZiBkYXRhIHJldHVybmVkIGFuZCBzdWNjZWVkcyBpZiBKUyBvYmplY3QsIHRocm93cyBlcnJvciBpZiBub3Rcblx0XHQgKiBVc2VmdWwgZm9yIEFQSXMgKGllLCB3aXRoIG5naW54KSB3aGVyZSBzZXJ2ZXIgZXJyb3IgSFRNTCBwYWdlIG1heSBiZSByZXR1cm5lZCBpbiBlcnJvclxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHJlc3BvbnNlIHsqfSBkYXRhIGZyb20gJGh0dHBcblx0XHQgKiBAcmV0dXJucyB7Kn0gb2JqZWN0LCBhcnJheVxuXHRcdCAqL1xuXHRcdGZ1bmN0aW9uIHN1Y2Nlc3MocmVzcG9uc2UpIHtcblx0XHRcdGlmIChhbmd1bGFyLmlzT2JqZWN0KHJlc3BvbnNlLmRhdGEpKSB7XG5cdFx0XHRcdHJldHVybiByZXNwb25zZS5kYXRhO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdyZXRyaWV2ZWQgZGF0YSBpcyBub3QgdHlwZW9mIG9iamVjdC4nKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvKipcblx0XHQgKiBQcm9taXNlIHJlc3BvbnNlIGZ1bmN0aW9uIC0gZXJyb3Jcblx0XHQgKiBFbmRzIGxvYWRpbmcgc3Bpbm5lclxuXHRcdCAqIFRocm93cyBhbiBlcnJvciB3aXRoIGVycm9yIGRhdGFcblx0XHQgKlxuXHRcdCAqIEBwYXJhbSBlcnJvciB7b2JqZWN0fVxuXHRcdCAqL1xuXHRcdGZ1bmN0aW9uIGVycm9yKGVycm9yKSB7XG5cdFx0XHQkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ2xvYWRpbmctb2ZmJyk7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0Vycm9yIHJldHJpZXZpbmcgZGF0YScsIGVycm9yKTtcblx0XHR9XG5cdH1cbn0oKSk7IiwiKGZ1bmN0aW9uKCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ2FwcCcpXG5cdFx0LmRpcmVjdGl2ZSgnbG9hZGluZycsIGxvYWRpbmcpO1xuXG5cdGxvYWRpbmcuJGluamVjdCA9IFsnJHdpbmRvdycsICdyZXNpemUnXTtcblxuXHRmdW5jdGlvbiBsb2FkaW5nKCR3aW5kb3csIHJlc2l6ZSkge1xuXHRcdC8vIHJldHVybiBkaXJlY3RpdmVcblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFQScsXG5cdFx0XHRyZXBsYWNlOiB0cnVlLFxuXHRcdFx0dGVtcGxhdGVVcmw6ICdhcHAvY29yZS91aS9sb2FkaW5nLnRwbC5odG1sJyxcblx0XHRcdHRyYW5zY2x1ZGU6IHRydWUsXG5cdFx0XHRjb250cm9sbGVyOiBsb2FkaW5nQ3RybCxcblx0XHRcdGNvbnRyb2xsZXJBczogJ2xvYWRpbmcnLFxuXHRcdFx0YmluZFRvQ29udHJvbGxlcjogdHJ1ZSxcblx0XHRcdGxpbms6IGxvYWRpbmdMaW5rXG5cdFx0fTtcblxuXHRcdC8qKlxuXHRcdCAqIGxvYWRpbmcgTElOS1xuXHRcdCAqIERpc2FibGVzIHBhZ2Ugc2Nyb2xsaW5nIHdoZW4gbG9hZGluZyBvdmVybGF5IGlzIG9wZW5cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSAkc2NvcGVcblx0XHQgKiBAcGFyYW0gJGVsZW1lbnRcblx0XHQgKiBAcGFyYW0gJGF0dHJzXG5cdFx0ICogQHBhcmFtIGxvYWRpbmcge2NvbnRyb2xsZXJ9XG5cdFx0ICovXG5cdFx0ZnVuY3Rpb24gbG9hZGluZ0xpbmsoJHNjb3BlLCAkZWxlbWVudCwgJGF0dHJzLCBsb2FkaW5nKSB7XG5cdFx0XHQvLyBwcml2YXRlIHZhcmlhYmxlc1xuXHRcdFx0dmFyIF8kYm9keSA9IGFuZ3VsYXIuZWxlbWVudCgnYm9keScpO1xuXHRcdFx0dmFyIF93aW5IZWlnaHQgPSAkd2luZG93LmlubmVySGVpZ2h0ICsgJ3B4JztcblxuXHRcdFx0X2luaXQoKTtcblxuXHRcdFx0LyoqXG5cdFx0XHQgKiBJTklUIGZ1bmN0aW9uIGV4ZWN1dGVzIHByb2NlZHVyYWwgY29kZVxuXHRcdFx0ICpcblx0XHRcdCAqIEBwcml2YXRlXG5cdFx0XHQgKi9cblx0XHRcdGZ1bmN0aW9uIF9pbml0KCkge1xuXHRcdFx0XHQvLyBpbml0aWFsaXplIGRlYm91bmNlZCByZXNpemVcblx0XHRcdFx0dmFyIF9ycyA9IHJlc2l6ZS5pbml0KHtcblx0XHRcdFx0XHRzY29wZTogJHNjb3BlLFxuXHRcdFx0XHRcdHJlc2l6ZWRGbjogX3Jlc2l6ZWQsXG5cdFx0XHRcdFx0ZGVib3VuY2U6IDIwMFxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHQvLyAkd2F0Y2ggYWN0aXZlIHN0YXRlXG5cdFx0XHRcdCRzY29wZS4kd2F0Y2goJ2xvYWRpbmcuYWN0aXZlJywgXyR3YXRjaEFjdGl2ZSk7XG5cdFx0XHR9XG5cblx0XHRcdC8qKlxuXHRcdFx0ICogV2luZG93IHJlc2l6ZWRcblx0XHRcdCAqIElmIGxvYWRpbmcsIHJlYXBwbHkgYm9keSBoZWlnaHRcblx0XHRcdCAqIHRvIHByZXZlbnQgc2Nyb2xsYmFyXG5cdFx0XHQgKlxuXHRcdFx0ICogQHByaXZhdGVcblx0XHRcdCAqL1xuXHRcdFx0ZnVuY3Rpb24gX3Jlc2l6ZWQoKSB7XG5cdFx0XHRcdF93aW5IZWlnaHQgPSAkd2luZG93LmlubmVySGVpZ2h0ICsgJ3B4JztcblxuXHRcdFx0XHRpZiAobG9hZGluZy5hY3RpdmUpIHtcblx0XHRcdFx0XHRfJGJvZHkuY3NzKHtcblx0XHRcdFx0XHRcdGhlaWdodDogX3dpbkhlaWdodFxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8qKlxuXHRcdFx0ICogJHdhdGNoIGxvYWRpbmcuYWN0aXZlXG5cdFx0XHQgKlxuXHRcdFx0ICogQHBhcmFtIG5ld1ZhbCB7Ym9vbGVhbn1cblx0XHRcdCAqIEBwYXJhbSBvbGRWYWwge3VuZGVmaW5lZHxib29sZWFufVxuXHRcdFx0ICogQHByaXZhdGVcblx0XHRcdCAqL1xuXHRcdFx0ZnVuY3Rpb24gXyR3YXRjaEFjdGl2ZShuZXdWYWwsIG9sZFZhbCkge1xuXHRcdFx0XHRpZiAobmV3VmFsKSB7XG5cdFx0XHRcdFx0X29wZW4oKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRfY2xvc2UoKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvKipcblx0XHRcdCAqIE9wZW4gbG9hZGluZ1xuXHRcdFx0ICogRGlzYWJsZSBzY3JvbGxcblx0XHRcdCAqXG5cdFx0XHQgKiBAcHJpdmF0ZVxuXHRcdFx0ICovXG5cdFx0XHRmdW5jdGlvbiBfb3BlbigpIHtcblx0XHRcdFx0XyRib2R5LmNzcyh7XG5cdFx0XHRcdFx0aGVpZ2h0OiBfd2luSGVpZ2h0LFxuXHRcdFx0XHRcdG92ZXJmbG93WTogJ2hpZGRlbidcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblx0XHRcdC8qKlxuXHRcdFx0ICogQ2xvc2UgbG9hZGluZ1xuXHRcdFx0ICogRW5hYmxlIHNjcm9sbFxuXHRcdFx0ICpcblx0XHRcdCAqIEBwcml2YXRlXG5cdFx0XHQgKi9cblx0XHRcdGZ1bmN0aW9uIF9jbG9zZSgpIHtcblx0XHRcdFx0XyRib2R5LmNzcyh7XG5cdFx0XHRcdFx0aGVpZ2h0OiAnJyxcblx0XHRcdFx0XHRvdmVyZmxvd1k6ICcnXG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdGxvYWRpbmdDdHJsLiRpbmplY3QgPSBbJyRzY29wZSddO1xuXHQvKipcblx0ICogbG9hZGluZyBDT05UUk9MTEVSXG5cdCAqIFVwZGF0ZSB0aGUgbG9hZGluZyBzdGF0dXMgYmFzZWRcblx0ICogb24gcm91dGVDaGFuZ2Ugc3RhdGVcblx0ICovXG5cdGZ1bmN0aW9uIGxvYWRpbmdDdHJsKCRzY29wZSkge1xuXHRcdHZhciBsb2FkaW5nID0gdGhpcztcblxuXHRcdF9pbml0KCk7XG5cblx0XHQvKipcblx0XHQgKiBJTklUIGZ1bmN0aW9uIGV4ZWN1dGVzIHByb2NlZHVyYWwgY29kZVxuXHRcdCAqXG5cdFx0ICogQHByaXZhdGVcblx0XHQgKi9cblx0XHRmdW5jdGlvbiBfaW5pdCgpIHtcblx0XHRcdCRzY29wZS4kb24oJ2xvYWRpbmctb24nLCBfbG9hZGluZ0FjdGl2ZSk7XG5cdFx0XHQkc2NvcGUuJG9uKCdsb2FkaW5nLW9mZicsIF9sb2FkaW5nSW5hY3RpdmUpO1xuXHRcdH1cblxuXHRcdC8qKlxuXHRcdCAqIFNldCBsb2FkaW5nIHRvIGFjdGl2ZVxuXHRcdCAqXG5cdFx0ICogQHByaXZhdGVcblx0XHQgKi9cblx0XHRmdW5jdGlvbiBfbG9hZGluZ0FjdGl2ZSgpIHtcblx0XHRcdGxvYWRpbmcuYWN0aXZlID0gdHJ1ZTtcblx0XHR9XG5cblx0XHQvKipcblx0XHQgKiBTZXQgbG9hZGluZyB0byBpbmFjdGl2ZVxuXHRcdCAqXG5cdFx0ICogQHByaXZhdGVcblx0XHQgKi9cblx0XHRmdW5jdGlvbiBfbG9hZGluZ0luYWN0aXZlKCkge1xuXHRcdFx0bG9hZGluZy5hY3RpdmUgPSBmYWxzZTtcblx0XHR9XG5cdH1cblxufSgpKTsiLCIoZnVuY3Rpb24oKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgnYXBwJylcblx0XHQuZGlyZWN0aXZlKCduYXZDb250cm9sJywgbmF2Q29udHJvbCk7XG5cblx0bmF2Q29udHJvbC4kaW5qZWN0ID0gWyckd2luZG93JywgJ3Jlc2l6ZSddO1xuXG5cdGZ1bmN0aW9uIG5hdkNvbnRyb2woJHdpbmRvdywgcmVzaXplKSB7XG5cdFx0Ly8gcmV0dXJuIGRpcmVjdGl2ZVxuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0VBJyxcblx0XHRcdGxpbms6IG5hdkNvbnRyb2xMaW5rXG5cdFx0fTtcblxuXHRcdC8qKlxuXHRcdCAqIG5hdkNvbnRyb2wgTElOSyBmdW5jdGlvblxuXHRcdCAqXG5cdFx0ICogQHBhcmFtICRzY29wZVxuXHRcdCAqL1xuXHRcdGZ1bmN0aW9uIG5hdkNvbnRyb2xMaW5rKCRzY29wZSwgJGVsZW1lbnQpIHtcblx0XHRcdC8vIHByaXZhdGUgdmFyaWFibGVzXG5cdFx0XHR2YXIgXyRib2R5ID0gYW5ndWxhci5lbGVtZW50KCdib2R5Jyk7XG5cdFx0XHR2YXIgXyRsYXlvdXRDYW52YXMgPSAkZWxlbWVudDtcblxuXHRcdFx0Ly8gZGF0YSBtb2RlbFxuXHRcdFx0JHNjb3BlLm5hdiA9IHt9O1xuXHRcdFx0JHNjb3BlLm5hdi5uYXZPcGVuO1xuXHRcdFx0JHNjb3BlLm5hdi50b2dnbGVOYXYgPSB0b2dnbGVOYXY7XG5cblx0XHRcdF9pbml0KCk7XG5cblx0XHRcdC8qKlxuXHRcdFx0ICogSU5JVCBmdW5jdGlvbiBleGVjdXRlcyBwcm9jZWR1cmFsIGNvZGVcblx0XHRcdCAqXG5cdFx0XHQgKiBAcHJpdmF0ZVxuXHRcdFx0ICovXG5cdFx0XHRmdW5jdGlvbiBfaW5pdCgpIHtcblx0XHRcdFx0Ly8gaW5pdGlhbGl6ZSBkZWJvdW5jZWQgcmVzaXplXG5cdFx0XHRcdHZhciBfcnMgPSByZXNpemUuaW5pdCh7XG5cdFx0XHRcdFx0c2NvcGU6ICRzY29wZSxcblx0XHRcdFx0XHRyZXNpemVkRm46IF9yZXNpemVkLFxuXHRcdFx0XHRcdGRlYm91bmNlOiAxMDBcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0JHNjb3BlLiRvbignJGxvY2F0aW9uQ2hhbmdlU3RhcnQnLCBfJGxvY2F0aW9uQ2hhbmdlU3RhcnQpO1xuXHRcdFx0XHRfY2xvc2VOYXYoKTtcblx0XHRcdH1cblxuXHRcdFx0LyoqXG5cdFx0XHQgKiBSZXNpemVkIHdpbmRvdyAoZGVib3VuY2VkKVxuXHRcdFx0ICpcblx0XHRcdCAqIEBwcml2YXRlXG5cdFx0XHQgKi9cblx0XHRcdGZ1bmN0aW9uIF9yZXNpemVkKCkge1xuXHRcdFx0XHRfJGxheW91dENhbnZhcy5jc3Moe1xuXHRcdFx0XHRcdG1pbkhlaWdodDogJHdpbmRvdy5pbm5lckhlaWdodCArICdweCdcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblx0XHRcdC8qKlxuXHRcdFx0ICogT3BlbiBuYXZpZ2F0aW9uIG1lbnVcblx0XHRcdCAqXG5cdFx0XHQgKiBAcHJpdmF0ZVxuXHRcdFx0ICovXG5cdFx0XHRmdW5jdGlvbiBfb3Blbk5hdigpIHtcblx0XHRcdFx0JHNjb3BlLm5hdi5uYXZPcGVuID0gdHJ1ZTtcblx0XHRcdH1cblxuXHRcdFx0LyoqXG5cdFx0XHQgKiBDbG9zZSBuYXZpZ2F0aW9uIG1lbnVcblx0XHRcdCAqXG5cdFx0XHQgKiBAcHJpdmF0ZVxuXHRcdFx0ICovXG5cdFx0XHRmdW5jdGlvbiBfY2xvc2VOYXYoKSB7XG5cdFx0XHRcdCRzY29wZS5uYXYubmF2T3BlbiA9IGZhbHNlO1xuXHRcdFx0fVxuXG5cdFx0XHQvKipcblx0XHRcdCAqIFRvZ2dsZSBuYXYgb3Blbi9jbG9zZWRcblx0XHRcdCAqL1xuXHRcdFx0ZnVuY3Rpb24gdG9nZ2xlTmF2KCkge1xuXHRcdFx0XHQkc2NvcGUubmF2Lm5hdk9wZW4gPSAhJHNjb3BlLm5hdi5uYXZPcGVuO1xuXHRcdFx0fVxuXG5cdFx0XHQvKipcblx0XHRcdCAqIFdoZW4gY2hhbmdpbmcgbG9jYXRpb24sIGNsb3NlIHRoZSBuYXYgaWYgaXQncyBvcGVuXG5cdFx0XHQgKi9cblx0XHRcdGZ1bmN0aW9uIF8kbG9jYXRpb25DaGFuZ2VTdGFydCgpIHtcblx0XHRcdFx0aWYgKCRzY29wZS5uYXYubmF2T3Blbikge1xuXHRcdFx0XHRcdF9jbG9zZU5hdigpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cbn0oKSk7IiwiKGZ1bmN0aW9uKCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ2FwcCcpXG5cdFx0LmNvbnRyb2xsZXIoJ0Fib3V0Q3RybCcsIEFib3V0Q3RybCk7XG5cblx0QWJvdXRDdHJsLiRpbmplY3QgPSBbJyRzY29wZScsICdNZXRhZGF0YSddO1xuXG5cdGZ1bmN0aW9uIEFib3V0Q3RybCgkc2NvcGUsIE1ldGFkYXRhKSB7XG5cdFx0Ly8gY29udHJvbGxlckFzIFZpZXdNb2RlbFxuXHRcdHZhciBhYm91dCA9IHRoaXM7XG5cblx0XHQvLyBiaW5kYWJsZSBtZW1iZXJzXG5cdFx0YWJvdXQudGl0bGUgPSAnQWJvdXQnO1xuXG5cdFx0X2luaXQoKTtcblxuXHRcdC8qKlxuXHRcdCAqIElOSVQgZnVuY3Rpb24gZXhlY3V0ZXMgcHJvY2VkdXJhbCBjb2RlXG5cdFx0ICpcblx0XHQgKiBAcHJpdmF0ZVxuXHRcdCAqL1xuXHRcdGZ1bmN0aW9uIF9pbml0KCkge1xuXHRcdFx0Ly8gc2V0IHBhZ2UgPHRpdGxlPlxuXHRcdFx0TWV0YWRhdGEuc2V0KGFib3V0LnRpdGxlKTtcblx0XHR9XG5cdH1cbn0oKSk7IiwiKGZ1bmN0aW9uKCkge1xyXG5cdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0YW5ndWxhclxyXG5cdFx0Lm1vZHVsZSgnYXBwJylcclxuXHRcdC5jb250cm9sbGVyKCdEZXRhaWxDdHJsJywgRGV0YWlsQ3RybCk7XHJcblxyXG5cdERldGFpbEN0cmwuJGluamVjdCA9IFsnJHNjb3BlJywgJyRyb3V0ZVBhcmFtcycsICdNZXRhZGF0YScsICdBUElEYXRhJ107XHJcblxyXG5cdGZ1bmN0aW9uIERldGFpbEN0cmwoJHNjb3BlLCAkcm91dGVQYXJhbXMsIE1ldGFkYXRhLCBBUElEYXRhKSB7XHJcblx0XHQvLyBjb250cm9sbGVyQXMgVmlld01vZGVsXHJcblx0XHR2YXIgZGV0YWlsID0gdGhpcztcclxuXHJcblx0XHQvLyBwcml2YXRlIHZhcmlhYmxlc1xyXG5cdFx0dmFyIF9pZCA9ICRyb3V0ZVBhcmFtcy5pZDtcclxuXHJcblx0XHRfaW5pdCgpO1xyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogSU5JVCBmdW5jdGlvbiBleGVjdXRlcyBwcm9jZWR1cmFsIGNvZGVcclxuXHRcdCAqXHJcblx0XHQgKiBAcHJpdmF0ZVxyXG5cdFx0ICovXHJcblx0XHRmdW5jdGlvbiBfaW5pdCgpIHtcclxuXHRcdFx0X2FjdGl2YXRlKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBDb250cm9sbGVyIGFjdGl2YXRlXHJcblx0XHQgKiBHZXQgSlNPTiBkYXRhXHJcblx0XHQgKlxyXG5cdFx0ICogQHJldHVybnMgeyp9XHJcblx0XHQgKiBAcHJpdmF0ZVxyXG5cdFx0ICovXHJcblx0XHRmdW5jdGlvbiBfYWN0aXZhdGUoKSB7XHJcblx0XHRcdC8vIHN0YXJ0IGxvYWRpbmdcclxuXHRcdFx0JHNjb3BlLiRlbWl0KCdsb2FkaW5nLW9uJyk7XHJcblxyXG5cdFx0XHQvLyBnZXQgdGhlIGRhdGEgZnJvbSBKU09OXHJcblx0XHRcdHJldHVybiBBUElEYXRhLmdldERpbm8oX2lkKS50aGVuKF9nZXRKc29uU3VjY2VzcywgX2dldEpzb25FcnJvcik7XHJcblx0XHR9XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBTdWNjZXNzZnVsIHByb21pc2UgZGF0YVxyXG5cdFx0ICpcclxuXHRcdCAqIEBwYXJhbSBkYXRhIHtqc29ufVxyXG5cdFx0ICogQHByaXZhdGVcclxuXHRcdCAqL1xyXG5cdFx0ZnVuY3Rpb24gX2dldEpzb25TdWNjZXNzKGRhdGEpIHtcclxuXHRcdFx0ZGV0YWlsLmRpbm8gPSBkYXRhO1xyXG5cdFx0XHRkZXRhaWwudGl0bGUgPSBkZXRhaWwuZGluby5uYW1lO1xyXG5cclxuXHRcdFx0Ly8gc2V0IHBhZ2UgPHRpdGxlPlxyXG5cdFx0XHRNZXRhZGF0YS5zZXQoZGV0YWlsLnRpdGxlKTtcclxuXHJcblx0XHRcdC8vIHN0b3AgbG9hZGluZ1xyXG5cdFx0XHQkc2NvcGUuJGVtaXQoJ2xvYWRpbmctb2ZmJyk7XHJcblxyXG5cdFx0XHRyZXR1cm4gZGV0YWlsLmRpbm87XHJcblx0XHR9XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBGYWlsdXJlIG9mIHByb21pc2UgZGF0YVxyXG5cdFx0ICovXHJcblx0XHRmdW5jdGlvbiBfZ2V0SnNvbkVycm9yKCkge1xyXG5cdFx0XHRkZXRhaWwuZXJyb3IgPSB0cnVlO1xyXG5cdFx0fVxyXG5cdH1cclxufSgpKTsiLCIoZnVuY3Rpb24oKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgnYXBwJylcblx0XHQuY29udHJvbGxlcignRXJyb3I0MDRDdHJsJywgRXJyb3I0MDRDdHJsKTtcblxuXHRFcnJvcjQwNEN0cmwuJGluamVjdCA9IFsnJHNjb3BlJywgJ01ldGFkYXRhJ107XG5cblx0ZnVuY3Rpb24gRXJyb3I0MDRDdHJsKCRzY29wZSwgTWV0YWRhdGEpIHtcblx0XHR2YXIgZTQwNCA9IHRoaXM7XG5cblx0XHQvLyBiaW5kYWJsZSBtZW1iZXJzXG5cdFx0ZTQwNC50aXRsZSA9ICc0MDQgLSBQYWdlIE5vdCBGb3VuZCc7XG5cblx0XHRfaW5pdCgpO1xuXG5cdFx0LyoqXG5cdFx0ICogSU5JVCBmdW5jdGlvbiBleGVjdXRlcyBwcm9jZWR1cmFsIGNvZGVcblx0XHQgKlxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICovXG5cdFx0ZnVuY3Rpb24gX2luaXQoKSB7XG5cdFx0XHQvLyBzZXQgcGFnZSA8dGl0bGU+XG5cdFx0XHRNZXRhZGF0YS5zZXQoZTQwNC50aXRsZSk7XG5cdFx0fVxuXHR9XG59KCkpOyIsIihmdW5jdGlvbigpIHtcclxuXHQndXNlIHN0cmljdCc7XHJcblxyXG5cdGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ2FwcCcpXHJcblx0XHQuY29udHJvbGxlcignSG9tZUN0cmwnLCBIb21lQ3RybCk7XHJcblxyXG5cdEhvbWVDdHJsLiRpbmplY3QgPSBbJyRzY29wZScsICdNZXRhZGF0YScsICdBUElEYXRhJ107XHJcblxyXG5cdGZ1bmN0aW9uIEhvbWVDdHJsKCRzY29wZSwgTWV0YWRhdGEsIEFQSURhdGEpIHtcclxuXHRcdC8vIGNvbnRyb2xsZXJBcyBWaWV3TW9kZWxcclxuXHRcdHZhciBob21lID0gdGhpcztcclxuXHJcblx0XHQvLyBiaW5kYWJsZSBtZW1iZXJzXHJcblx0XHRob21lLnRpdGxlID0gJ0FsbCBEaW5vc2F1cnMnO1xyXG5cclxuXHRcdF9pbml0KCk7XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBJTklUIGZ1bmN0aW9uIGV4ZWN1dGVzIHByb2NlZHVyYWwgY29kZVxyXG5cdFx0ICpcclxuXHRcdCAqIEBwcml2YXRlXHJcblx0XHQgKi9cclxuXHRcdGZ1bmN0aW9uIF9pbml0KCkge1xyXG5cdFx0XHQvLyBzZXQgcGFnZSA8dGl0bGU+XHJcblx0XHRcdE1ldGFkYXRhLnNldChob21lLnRpdGxlKTtcclxuXHJcblx0XHRcdC8vIGFjdGl2YXRlIGNvbnRyb2xsZXJcclxuXHRcdFx0X2FjdGl2YXRlKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBDb250cm9sbGVyIGFjdGl2YXRlXHJcblx0XHQgKiBHZXQgSlNPTiBkYXRhXHJcblx0XHQgKlxyXG5cdFx0ICogQHJldHVybnMge2FueX1cclxuXHRcdCAqIEBwcml2YXRlXHJcblx0XHQgKi9cclxuXHRcdGZ1bmN0aW9uIF9hY3RpdmF0ZSgpIHtcclxuXHRcdFx0Ly8gc3RhcnQgbG9hZGluZ1xyXG5cdFx0XHQkc2NvcGUuJGVtaXQoJ2xvYWRpbmctb24nKTtcclxuXHJcblx0XHRcdC8vIGdldCB0aGUgZGF0YSBmcm9tIEpTT05cclxuXHRcdFx0cmV0dXJuIEFQSURhdGEuZ2V0QWxsRGlub3MoKS50aGVuKF9nZXRKc29uU3VjY2VzcywgX2dldEpzb25FcnJvcik7XHJcblx0XHR9XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBTdWNjZXNzZnVsIHByb21pc2UgZGF0YVxyXG5cdFx0ICpcclxuXHRcdCAqIEBwYXJhbSBkYXRhIHtqc29ufVxyXG5cdFx0ICogQHByaXZhdGVcclxuXHRcdCAqL1xyXG5cdFx0ZnVuY3Rpb24gX2dldEpzb25TdWNjZXNzKGRhdGEpIHtcclxuXHRcdFx0aG9tZS5kaW5vcyA9IGRhdGE7XHJcblxyXG5cdFx0XHQvLyBzdG9wIGxvYWRpbmdcclxuXHRcdFx0JHNjb3BlLiRlbWl0KCdsb2FkaW5nLW9mZicpO1xyXG5cclxuXHRcdFx0cmV0dXJuIGhvbWUuZGlub3M7XHJcblx0XHR9XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBGYWlsdXJlIG9mIHByb21pc2UgZGF0YVxyXG5cdFx0ICovXHJcblx0XHRmdW5jdGlvbiBfZ2V0SnNvbkVycm9yKCkge1xyXG5cdFx0XHRob21lLmVycm9yID0gdHJ1ZTtcclxuXHRcdH1cclxuXHR9XHJcbn0oKSk7Il19
