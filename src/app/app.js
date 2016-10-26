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
		.factory('APIData', APIData);

	APIData.$inject = ['$http', '$q'];

	function APIData($http, $q) {
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
			throw new Error('API ERROR:', errorMsg);
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

	loading.$inject = [];
	
	function loading() {
		// return directive
		return {
			restrict: 'EA',
			templateUrl: 'app/core/ui/loading.tpl.html',
			scope: {
				active: '='
			},
			controller: loadingCtrl,
			controllerAs: 'loading',
			bindToController: true
		};
	}

	/**
	 * loading CONTROLLER
	 * Update the loading status based
	 * on routeChange state
	 */
	function loadingCtrl() {
		var loading = this;

		_init();

		/**
		 * INIT function executes procedural code
		 *
		 * @private
		 */
		function _init() {
			
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
			detail.loading = true;

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
			home.loading = true;

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

	dinoCardCtrl.$inject = [];
	/**
	 * DinoCard CONTROLLER
	 */
	function dinoCardCtrl() {
		var dc = this;
	}

}());
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5tb2R1bGUuanMiLCJjb3JlL0FQSURhdGEuZmFjdG9yeS5qcyIsImNvcmUvTWV0YWRhdGEuZmFjdG9yeS5qcyIsImNvcmUvUGFnZS5jdHJsLmpzIiwiY29yZS9hcHAuY29uZmlnLmpzIiwiaGVhZGVyL0hlYWRlci5jdHJsLmpzIiwiY29yZS91aS9sb2FkaW5nLmRpci5qcyIsImNvcmUvdWkvbmF2Q29udHJvbC5kaXIuanMiLCJwYWdlcy9hYm91dC9BYm91dC5jdHJsLmpzIiwicGFnZXMvZGV0YWlsL0RldGFpbC5jdHJsLmpzIiwicGFnZXMvZXJyb3I0MDQvRXJyb3I0MDQuY3RybC5qcyIsInBhZ2VzL2hvbWUvSG9tZS5jdHJsLmpzIiwicGFnZXMvaG9tZS9kaW5vQ2FyZC5kaXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gYXBwbGljYXRpb24gbW9kdWxlIHNldHRlclxuKGZ1bmN0aW9uKCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ2FwcCcsIFsnbmdSb3V0ZScsICduZ1Jlc291cmNlJywgJ25nU2FuaXRpemUnLCAncmVzaXplJ10pO1xufSgpKTsiLCIvLyBmZXRjaCBBUEkgZGF0YVxuKGZ1bmN0aW9uKCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ2FwcCcpXG5cdFx0LmZhY3RvcnkoJ0FQSURhdGEnLCBBUElEYXRhKTtcblxuXHRBUElEYXRhLiRpbmplY3QgPSBbJyRodHRwJywgJyRxJ107XG5cblx0ZnVuY3Rpb24gQVBJRGF0YSgkaHR0cCwgJHEpIHtcblx0XHR2YXIgX2Jhc2VVcmwgPSAnaHR0cDovL2xvY2FsaG9zdDozMDAxL2FwaS8nO1xuXG5cdFx0Ly8gY2FsbGFibGUgbWVtYmVyc1xuXHRcdHJldHVybiB7XG5cdFx0XHRnZXRBbGxEaW5vczogZ2V0QWxsRGlub3MsXG5cdFx0XHRnZXREaW5vOiBnZXREaW5vXG5cdFx0fTtcblxuXHRcdC8qKlxuXHRcdCAqIEdFVCBhbGwgZGlub3NhdXJzIGFuZCByZXR1cm4gcmVzdWx0c1xuXHRcdCAqXG5cdFx0ICogQHJldHVybnMge3Byb21pc2V9XG5cdFx0ICovXG5cdFx0ZnVuY3Rpb24gZ2V0QWxsRGlub3MoKSB7XG5cdFx0XHRyZXR1cm4gJGh0dHBcblx0XHRcdFx0LmdldChfYmFzZVVybCArICdkaW5vc2F1cnMnKVxuXHRcdFx0XHQudGhlbihfaGFuZGxlU3VjY2VzcywgX2hhbmRsZUVycm9yKTtcblx0XHR9XG5cblx0XHQvKipcblx0XHQgKiBHRVQgYSBzcGVjaWZpYyBkaW5vc2F1ciBhbmQgcmV0dXJuIHJlc3VsdHNcblx0XHQgKiBcblx0XHQgKiBAcGFyYW0ge251bWJlcn0gaWRcblx0XHQgKiBAcmV0dXJucyB7cHJvbWlzZX1cblx0XHQgKi9cblx0XHRmdW5jdGlvbiBnZXREaW5vKGlkKSB7XG5cdFx0XHRyZXR1cm4gJGh0dHBcblx0XHRcdFx0LmdldChfYmFzZVVybCArICdkaW5vc2F1ci8nICsgaWQpXG5cdFx0XHRcdC50aGVuKF9oYW5kbGVTdWNjZXNzLCBfaGFuZGxlRXJyb3IpO1xuXHRcdH1cblxuXHRcdC8qKlxuXHRcdCAqIFByb21pc2UgcmVzcG9uc2UgZnVuY3Rpb25cblx0XHQgKiBDaGVja3MgdHlwZW9mIGRhdGEgcmV0dXJuZWQ6XG5cdFx0ICogUmVzb2x2ZXMgaWYgcmVzcG9uc2UgaXMgb2JqZWN0LCByZWplY3RzIGlmIG5vdFxuXHRcdCAqIFVzZWZ1bCBmb3IgQVBJcyAoaWUsIHdpdGggbmdpbngpIHdoZXJlIHNlcnZlciBlcnJvciBIVE1MIHBhZ2UgbWF5IGJlIHJldHVybmVkXG5cdFx0ICogXG5cdFx0ICogQHBhcmFtIHthbnl9IHJlc1xuXHRcdCAqIEByZXR1cm5zIHtwcm9taXNlfVxuXHRcdCAqL1xuXHRcdGZ1bmN0aW9uIF9oYW5kbGVTdWNjZXNzKHJlcykge1xuXHRcdFx0aWYgKGFuZ3VsYXIuaXNPYmplY3QocmVzLmRhdGEpKSB7XG5cdFx0XHRcdHJldHVybiByZXMuZGF0YTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCRxLnJlamVjdCh7bWVzc2FnZTogJ1JldHJpZXZlZCBkYXRhIHdhcyBub3QgdHlwZW9mIG9iamVjdCd9KTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvKipcblx0XHQgKiBQcm9taXNlIHJlc3BvbnNlIGZ1bmN0aW9uIC0gZXJyb3Jcblx0XHQgKiBUaHJvd3MgYW4gZXJyb3Igd2l0aCBlcnJvciBkYXRhXG5cdFx0ICogXG5cdFx0ICogQHBhcmFtIHthbnl9IGVyclxuXHRcdCAqL1xuXHRcdGZ1bmN0aW9uIF9oYW5kbGVFcnJvcihlcnIpIHtcblx0XHRcdHZhciBlcnJvck1zZyA9IGVyci5tZXNzYWdlIHx8ICdVbmFibGUgdG8gcmV0cmlldmUgZGF0YSc7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0FQSSBFUlJPUjonLCBlcnJvck1zZyk7XG5cdFx0fVxuXHR9XG59KCkpOyIsIihmdW5jdGlvbigpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdGFuZ3VsYXJcblx0XHQubW9kdWxlKCdhcHAnKVxuXHRcdC5mYWN0b3J5KCdNZXRhZGF0YScsIE1ldGFkYXRhKTtcblxuXHRmdW5jdGlvbiBNZXRhZGF0YSgpIHtcblx0XHR2YXIgcGFnZVRpdGxlID0gJyc7XG5cblx0XHQvLyBjYWxsYWJsZSBtZW1iZXJzXG5cdFx0cmV0dXJuIHtcblx0XHRcdHNldDogc2V0LFxuXHRcdFx0Z2V0VGl0bGU6IGdldFRpdGxlXG5cdFx0fTtcblxuXHRcdC8qKlxuXHRcdCAqIFNldCBwYWdlIHRpdGxlLCBkZXNjcmlwdGlvblxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIG5ld1RpdGxlIHtzdHJpbmd9XG5cdFx0ICovXG5cdFx0ZnVuY3Rpb24gc2V0KG5ld1RpdGxlKSB7XG5cdFx0XHRwYWdlVGl0bGUgPSBuZXdUaXRsZTtcblx0XHR9XG5cblx0XHQvKipcblx0XHQgKiBHZXQgdGl0bGVcblx0XHQgKiBSZXR1cm5zIHNpdGUgdGl0bGUgYW5kIHBhZ2UgdGl0bGVcblx0XHQgKlxuXHRcdCAqIEByZXR1cm5zIHtzdHJpbmd9IHNpdGUgdGl0bGUgKyBwYWdlIHRpdGxlXG5cdFx0ICovXG5cdFx0ZnVuY3Rpb24gZ2V0VGl0bGUoKSB7XG5cdFx0XHRyZXR1cm4gcGFnZVRpdGxlO1xuXHRcdH1cblx0fVxufSgpKTsiLCIoZnVuY3Rpb24oKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgnYXBwJylcblx0XHQuY29udHJvbGxlcignUGFnZUN0cmwnLCBQYWdlQ3RybCk7XG5cblx0UGFnZUN0cmwuJGluamVjdCA9IFsnTWV0YWRhdGEnXTtcblxuXHRmdW5jdGlvbiBQYWdlQ3RybChNZXRhZGF0YSkge1xuXHRcdHZhciBwYWdlID0gdGhpcztcblxuXHRcdF9pbml0KCk7XG5cblx0XHQvKipcblx0XHQgKiBJTklUIGZ1bmN0aW9uIGV4ZWN1dGVzIHByb2NlZHVyYWwgY29kZVxuXHRcdCAqXG5cdFx0ICogQHByaXZhdGVcblx0XHQgKi9cblx0XHRmdW5jdGlvbiBfaW5pdCgpIHtcblx0XHRcdC8vIGFzc29jaWF0ZSBwYWdlIDx0aXRsZT5cblx0XHRcdHBhZ2UubWV0YWRhdGEgPSBNZXRhZGF0YTtcblx0XHR9XG5cdH1cbn0oKSk7IiwiLy8gYXBwbGljYXRpb24gY29uZmlnXG4oZnVuY3Rpb24oKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgnYXBwJylcblx0XHQuY29uZmlnKGFwcENvbmZpZyk7XG5cblx0YXBwQ29uZmlnLiRpbmplY3QgPSBbJyRyb3V0ZVByb3ZpZGVyJywgJyRsb2NhdGlvblByb3ZpZGVyJ107XG5cblx0ZnVuY3Rpb24gYXBwQ29uZmlnKCRyb3V0ZVByb3ZpZGVyLCAkbG9jYXRpb25Qcm92aWRlcikge1xuXHRcdCRyb3V0ZVByb3ZpZGVyXG5cdFx0XHQud2hlbignLycsIHtcblx0XHRcdFx0dGVtcGxhdGVVcmw6ICdhcHAvcGFnZXMvaG9tZS9Ib21lLnZpZXcuaHRtbCcsXG5cdFx0XHRcdGNvbnRyb2xsZXI6ICdIb21lQ3RybCcsXG5cdFx0XHRcdGNvbnRyb2xsZXJBczogJ2hvbWUnXG5cdFx0XHR9KVxuXHRcdFx0LndoZW4oJy9hYm91dCcsIHtcblx0XHRcdFx0dGVtcGxhdGVVcmw6ICdhcHAvcGFnZXMvYWJvdXQvQWJvdXQudmlldy5odG1sJyxcblx0XHRcdFx0Y29udHJvbGxlcjogJ0Fib3V0Q3RybCcsXG5cdFx0XHRcdGNvbnRyb2xsZXJBczogJ2Fib3V0J1xuXHRcdFx0fSlcblx0XHRcdC53aGVuKCcvZGlub3NhdXIvOmlkJywge1xuXHRcdFx0XHR0ZW1wbGF0ZVVybDogJ2FwcC9wYWdlcy9kZXRhaWwvRGV0YWlsLnZpZXcuaHRtbCcsXG5cdFx0XHRcdGNvbnRyb2xsZXI6ICdEZXRhaWxDdHJsJyxcblx0XHRcdFx0Y29udHJvbGxlckFzOiAnZGV0YWlsJ1xuXHRcdFx0fSlcblx0XHRcdC5vdGhlcndpc2Uoe1xuXHRcdFx0XHR0ZW1wbGF0ZVVybDogJ2FwcC9wYWdlcy9lcnJvcjQwNC9FcnJvcjQwNC52aWV3Lmh0bWwnLFxuXHRcdFx0XHRjb250cm9sbGVyOiAnRXJyb3I0MDRDdHJsJyxcblx0XHRcdFx0Y29udHJvbGxlckFzOiAnZTQwNCdcblx0XHRcdH0pO1xuXG5cdFx0JGxvY2F0aW9uUHJvdmlkZXJcblx0XHRcdC5odG1sNU1vZGUoe1xuXHRcdFx0XHRlbmFibGVkOiB0cnVlXG5cdFx0XHR9KVxuXHRcdFx0Lmhhc2hQcmVmaXgoJyEnKTtcblx0fVxufSgpKTsiLCIoZnVuY3Rpb24oKSB7XHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHRhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdhcHAnKVxyXG5cdFx0LmNvbnRyb2xsZXIoJ0hlYWRlckN0cmwnLCBIZWFkZXJDdHJsKTtcclxuXHJcblx0SGVhZGVyQ3RybC4kaW5qZWN0ID0gWyckbG9jYXRpb24nXTtcclxuXHJcblx0ZnVuY3Rpb24gSGVhZGVyQ3RybCgkbG9jYXRpb24pIHtcclxuXHRcdC8vIGNvbnRyb2xsZXJBcyBWaWV3TW9kZWxcclxuXHRcdHZhciBoZWFkZXIgPSB0aGlzO1xyXG5cclxuXHRcdC8vIGJpbmRhYmxlIG1lbWJlcnNcclxuXHRcdGhlYWRlci5pbmRleElzQWN0aXZlID0gaW5kZXhJc0FjdGl2ZTtcclxuXHRcdGhlYWRlci5uYXZJc0FjdGl2ZSA9IG5hdklzQWN0aXZlO1xyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogQXBwbHkgY2xhc3MgdG8gaW5kZXggbmF2IGlmIGFjdGl2ZVxyXG5cdFx0ICpcclxuXHRcdCAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoXHJcblx0XHQgKi9cclxuXHRcdGZ1bmN0aW9uIGluZGV4SXNBY3RpdmUocGF0aCkge1xyXG5cdFx0XHQvLyBwYXRoIHNob3VsZCBiZSAnLydcclxuXHRcdFx0cmV0dXJuICRsb2NhdGlvbi5wYXRoKCkgPT09IHBhdGg7XHJcblx0XHR9XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBBcHBseSBjbGFzcyB0byBjdXJyZW50bHkgYWN0aXZlIG5hdiBpdGVtXHJcblx0XHQgKlxyXG5cdFx0ICogQHBhcmFtIHtzdHJpbmd9IHBhdGhcclxuXHRcdCAqL1xyXG5cdFx0ZnVuY3Rpb24gbmF2SXNBY3RpdmUocGF0aCkge1xyXG5cdFx0XHRyZXR1cm4gJGxvY2F0aW9uLnBhdGgoKS5zdWJzdHIoMCwgcGF0aC5sZW5ndGgpID09PSBwYXRoO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcbn0oKSk7IiwiKGZ1bmN0aW9uKCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ2FwcCcpXG5cdFx0LmRpcmVjdGl2ZSgnbG9hZGluZycsIGxvYWRpbmcpO1xuXG5cdGxvYWRpbmcuJGluamVjdCA9IFtdO1xuXHRcblx0ZnVuY3Rpb24gbG9hZGluZygpIHtcblx0XHQvLyByZXR1cm4gZGlyZWN0aXZlXG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRUEnLFxuXHRcdFx0dGVtcGxhdGVVcmw6ICdhcHAvY29yZS91aS9sb2FkaW5nLnRwbC5odG1sJyxcblx0XHRcdHNjb3BlOiB7XG5cdFx0XHRcdGFjdGl2ZTogJz0nXG5cdFx0XHR9LFxuXHRcdFx0Y29udHJvbGxlcjogbG9hZGluZ0N0cmwsXG5cdFx0XHRjb250cm9sbGVyQXM6ICdsb2FkaW5nJyxcblx0XHRcdGJpbmRUb0NvbnRyb2xsZXI6IHRydWVcblx0XHR9O1xuXHR9XG5cblx0LyoqXG5cdCAqIGxvYWRpbmcgQ09OVFJPTExFUlxuXHQgKiBVcGRhdGUgdGhlIGxvYWRpbmcgc3RhdHVzIGJhc2VkXG5cdCAqIG9uIHJvdXRlQ2hhbmdlIHN0YXRlXG5cdCAqL1xuXHRmdW5jdGlvbiBsb2FkaW5nQ3RybCgpIHtcblx0XHR2YXIgbG9hZGluZyA9IHRoaXM7XG5cblx0XHRfaW5pdCgpO1xuXG5cdFx0LyoqXG5cdFx0ICogSU5JVCBmdW5jdGlvbiBleGVjdXRlcyBwcm9jZWR1cmFsIGNvZGVcblx0XHQgKlxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICovXG5cdFx0ZnVuY3Rpb24gX2luaXQoKSB7XG5cdFx0XHRcblx0XHR9XG5cdH1cblxufSgpKTsiLCIoZnVuY3Rpb24oKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgnYXBwJylcblx0XHQuZGlyZWN0aXZlKCduYXZDb250cm9sJywgbmF2Q29udHJvbCk7XG5cblx0bmF2Q29udHJvbC4kaW5qZWN0ID0gWyckd2luZG93JywgJ3Jlc2l6ZSddO1xuXG5cdGZ1bmN0aW9uIG5hdkNvbnRyb2woJHdpbmRvdywgcmVzaXplKSB7XG5cdFx0Ly8gcmV0dXJuIGRpcmVjdGl2ZVxuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0VBJyxcblx0XHRcdGxpbms6IG5hdkNvbnRyb2xMaW5rXG5cdFx0fTtcblxuXHRcdC8qKlxuXHRcdCAqIG5hdkNvbnRyb2wgTElOSyBmdW5jdGlvblxuXHRcdCAqXG5cdFx0ICogQHBhcmFtICRzY29wZVxuXHRcdCAqL1xuXHRcdGZ1bmN0aW9uIG5hdkNvbnRyb2xMaW5rKCRzY29wZSwgJGVsZW1lbnQpIHtcblx0XHRcdC8vIHByaXZhdGUgdmFyaWFibGVzXG5cdFx0XHR2YXIgXyRsYXlvdXRDYW52YXMgPSAkZWxlbWVudDtcblxuXHRcdFx0Ly8gZGF0YSBtb2RlbFxuXHRcdFx0JHNjb3BlLm5hdiA9IHt9O1xuXHRcdFx0JHNjb3BlLm5hdi5uYXZPcGVuO1xuXHRcdFx0JHNjb3BlLm5hdi50b2dnbGVOYXYgPSB0b2dnbGVOYXY7XG5cblx0XHRcdF9pbml0KCk7XG5cblx0XHRcdC8qKlxuXHRcdFx0ICogSU5JVCBmdW5jdGlvbiBleGVjdXRlcyBwcm9jZWR1cmFsIGNvZGVcblx0XHRcdCAqXG5cdFx0XHQgKiBAcHJpdmF0ZVxuXHRcdFx0ICovXG5cdFx0XHRmdW5jdGlvbiBfaW5pdCgpIHtcblx0XHRcdFx0Ly8gaW5pdGlhbGl6ZSBkZWJvdW5jZWQgcmVzaXplXG5cdFx0XHRcdHZhciBfcnMgPSByZXNpemUuaW5pdCh7XG5cdFx0XHRcdFx0c2NvcGU6ICRzY29wZSxcblx0XHRcdFx0XHRyZXNpemVkRm46IF9yZXNpemVkLFxuXHRcdFx0XHRcdGRlYm91bmNlOiAxMDBcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0JHNjb3BlLiRvbignJGxvY2F0aW9uQ2hhbmdlU3RhcnQnLCBfJGxvY2F0aW9uQ2hhbmdlU3RhcnQpO1xuXHRcdFx0XHRfY2xvc2VOYXYoKTtcblx0XHRcdH1cblxuXHRcdFx0LyoqXG5cdFx0XHQgKiBSZXNpemVkIHdpbmRvdyAoZGVib3VuY2VkKVxuXHRcdFx0ICpcblx0XHRcdCAqIEBwcml2YXRlXG5cdFx0XHQgKi9cblx0XHRcdGZ1bmN0aW9uIF9yZXNpemVkKCkge1xuXHRcdFx0XHRfJGxheW91dENhbnZhcy5jc3Moe1xuXHRcdFx0XHRcdG1pbkhlaWdodDogJHdpbmRvdy5pbm5lckhlaWdodCArICdweCdcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblx0XHRcdC8qKlxuXHRcdFx0ICogT3BlbiBuYXZpZ2F0aW9uIG1lbnVcblx0XHRcdCAqXG5cdFx0XHQgKiBAcHJpdmF0ZVxuXHRcdFx0ICovXG5cdFx0XHRmdW5jdGlvbiBfb3Blbk5hdigpIHtcblx0XHRcdFx0JHNjb3BlLm5hdi5uYXZPcGVuID0gdHJ1ZTtcblx0XHRcdH1cblxuXHRcdFx0LyoqXG5cdFx0XHQgKiBDbG9zZSBuYXZpZ2F0aW9uIG1lbnVcblx0XHRcdCAqXG5cdFx0XHQgKiBAcHJpdmF0ZVxuXHRcdFx0ICovXG5cdFx0XHRmdW5jdGlvbiBfY2xvc2VOYXYoKSB7XG5cdFx0XHRcdCRzY29wZS5uYXYubmF2T3BlbiA9IGZhbHNlO1xuXHRcdFx0fVxuXG5cdFx0XHQvKipcblx0XHRcdCAqIFRvZ2dsZSBuYXYgb3Blbi9jbG9zZWRcblx0XHRcdCAqL1xuXHRcdFx0ZnVuY3Rpb24gdG9nZ2xlTmF2KCkge1xuXHRcdFx0XHQkc2NvcGUubmF2Lm5hdk9wZW4gPSAhJHNjb3BlLm5hdi5uYXZPcGVuO1xuXHRcdFx0fVxuXG5cdFx0XHQvKipcblx0XHRcdCAqIFdoZW4gY2hhbmdpbmcgbG9jYXRpb24sIGNsb3NlIHRoZSBuYXYgaWYgaXQncyBvcGVuXG5cdFx0XHQgKi9cblx0XHRcdGZ1bmN0aW9uIF8kbG9jYXRpb25DaGFuZ2VTdGFydCgpIHtcblx0XHRcdFx0aWYgKCRzY29wZS5uYXYubmF2T3Blbikge1xuXHRcdFx0XHRcdF9jbG9zZU5hdigpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cbn0oKSk7IiwiKGZ1bmN0aW9uKCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ2FwcCcpXG5cdFx0LmNvbnRyb2xsZXIoJ0Fib3V0Q3RybCcsIEFib3V0Q3RybCk7XG5cblx0QWJvdXRDdHJsLiRpbmplY3QgPSBbJyRzY29wZScsICdNZXRhZGF0YSddO1xuXG5cdGZ1bmN0aW9uIEFib3V0Q3RybCgkc2NvcGUsIE1ldGFkYXRhKSB7XG5cdFx0Ly8gY29udHJvbGxlckFzIFZpZXdNb2RlbFxuXHRcdHZhciBhYm91dCA9IHRoaXM7XG5cblx0XHQvLyBiaW5kYWJsZSBtZW1iZXJzXG5cdFx0YWJvdXQudGl0bGUgPSAnQWJvdXQnO1xuXG5cdFx0X2luaXQoKTtcblxuXHRcdC8qKlxuXHRcdCAqIElOSVQgZnVuY3Rpb24gZXhlY3V0ZXMgcHJvY2VkdXJhbCBjb2RlXG5cdFx0ICpcblx0XHQgKiBAcHJpdmF0ZVxuXHRcdCAqL1xuXHRcdGZ1bmN0aW9uIF9pbml0KCkge1xuXHRcdFx0Ly8gc2V0IHBhZ2UgPHRpdGxlPlxuXHRcdFx0TWV0YWRhdGEuc2V0KGFib3V0LnRpdGxlKTtcblx0XHR9XG5cdH1cbn0oKSk7IiwiKGZ1bmN0aW9uKCkge1xyXG5cdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0YW5ndWxhclxyXG5cdFx0Lm1vZHVsZSgnYXBwJylcclxuXHRcdC5jb250cm9sbGVyKCdEZXRhaWxDdHJsJywgRGV0YWlsQ3RybCk7XHJcblxyXG5cdERldGFpbEN0cmwuJGluamVjdCA9IFsnJHNjb3BlJywgJyRyb3V0ZVBhcmFtcycsICdNZXRhZGF0YScsICdBUElEYXRhJ107XHJcblxyXG5cdGZ1bmN0aW9uIERldGFpbEN0cmwoJHNjb3BlLCAkcm91dGVQYXJhbXMsIE1ldGFkYXRhLCBBUElEYXRhKSB7XHJcblx0XHQvLyBjb250cm9sbGVyQXMgVmlld01vZGVsXHJcblx0XHR2YXIgZGV0YWlsID0gdGhpcztcclxuXHJcblx0XHQvLyBwcml2YXRlIHZhcmlhYmxlc1xyXG5cdFx0dmFyIF9pZCA9ICRyb3V0ZVBhcmFtcy5pZDtcclxuXHJcblx0XHRfaW5pdCgpO1xyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogSU5JVCBmdW5jdGlvbiBleGVjdXRlcyBwcm9jZWR1cmFsIGNvZGVcclxuXHRcdCAqXHJcblx0XHQgKiBAcHJpdmF0ZVxyXG5cdFx0ICovXHJcblx0XHRmdW5jdGlvbiBfaW5pdCgpIHtcclxuXHRcdFx0X2FjdGl2YXRlKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBDb250cm9sbGVyIGFjdGl2YXRlXHJcblx0XHQgKiBHZXQgSlNPTiBkYXRhXHJcblx0XHQgKlxyXG5cdFx0ICogQHJldHVybnMgeyp9XHJcblx0XHQgKiBAcHJpdmF0ZVxyXG5cdFx0ICovXHJcblx0XHRmdW5jdGlvbiBfYWN0aXZhdGUoKSB7XHJcblx0XHRcdC8vIHN0YXJ0IGxvYWRpbmdcclxuXHRcdFx0ZGV0YWlsLmxvYWRpbmcgPSB0cnVlO1xyXG5cclxuXHRcdFx0Ly8gZ2V0IHRoZSBkYXRhIGZyb20gSlNPTlxyXG5cdFx0XHRyZXR1cm4gQVBJRGF0YS5nZXREaW5vKF9pZCkudGhlbihfZ2V0SnNvblN1Y2Nlc3MsIF9nZXRKc29uRXJyb3IpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogU3VjY2Vzc2Z1bCBwcm9taXNlIGRhdGFcclxuXHRcdCAqXHJcblx0XHQgKiBAcGFyYW0gZGF0YSB7anNvbn1cclxuXHRcdCAqIEBwcml2YXRlXHJcblx0XHQgKi9cclxuXHRcdGZ1bmN0aW9uIF9nZXRKc29uU3VjY2VzcyhkYXRhKSB7XHJcblx0XHRcdGRldGFpbC5kaW5vID0gZGF0YTtcclxuXHRcdFx0ZGV0YWlsLnRpdGxlID0gZGV0YWlsLmRpbm8ubmFtZTtcclxuXHJcblx0XHRcdC8vIHNldCBwYWdlIDx0aXRsZT5cclxuXHRcdFx0TWV0YWRhdGEuc2V0KGRldGFpbC50aXRsZSk7XHJcblxyXG5cdFx0XHQvLyBzdG9wIGxvYWRpbmdcclxuXHRcdFx0ZGV0YWlsLmxvYWRpbmcgPSBmYWxzZTtcclxuXHJcblx0XHRcdHJldHVybiBkZXRhaWwuZGlubztcclxuXHRcdH1cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIEZhaWx1cmUgb2YgcHJvbWlzZSBkYXRhXHJcblx0XHQgKiBTaG93IGVycm9yIFxyXG5cdFx0ICogU3RvcCBsb2FkaW5nXHJcblx0XHQgKi9cclxuXHRcdGZ1bmN0aW9uIF9nZXRKc29uRXJyb3IoKSB7XHJcblx0XHRcdGRldGFpbC5lcnJvciA9IHRydWU7XHJcblxyXG5cdFx0XHQvLyBzdG9wIGxvYWRpbmdcclxuXHRcdFx0ZGV0YWlsLmxvYWRpbmcgPSBmYWxzZTtcclxuXHRcdH1cclxuXHR9XHJcbn0oKSk7IiwiKGZ1bmN0aW9uKCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ2FwcCcpXG5cdFx0LmNvbnRyb2xsZXIoJ0Vycm9yNDA0Q3RybCcsIEVycm9yNDA0Q3RybCk7XG5cblx0RXJyb3I0MDRDdHJsLiRpbmplY3QgPSBbJyRzY29wZScsICdNZXRhZGF0YSddO1xuXG5cdGZ1bmN0aW9uIEVycm9yNDA0Q3RybCgkc2NvcGUsIE1ldGFkYXRhKSB7XG5cdFx0dmFyIGU0MDQgPSB0aGlzO1xuXG5cdFx0Ly8gYmluZGFibGUgbWVtYmVyc1xuXHRcdGU0MDQudGl0bGUgPSAnNDA0IC0gUGFnZSBOb3QgRm91bmQnO1xuXG5cdFx0X2luaXQoKTtcblxuXHRcdC8qKlxuXHRcdCAqIElOSVQgZnVuY3Rpb24gZXhlY3V0ZXMgcHJvY2VkdXJhbCBjb2RlXG5cdFx0ICpcblx0XHQgKiBAcHJpdmF0ZVxuXHRcdCAqL1xuXHRcdGZ1bmN0aW9uIF9pbml0KCkge1xuXHRcdFx0Ly8gc2V0IHBhZ2UgPHRpdGxlPlxuXHRcdFx0TWV0YWRhdGEuc2V0KGU0MDQudGl0bGUpO1xuXHRcdH1cblx0fVxufSgpKTsiLCIoZnVuY3Rpb24oKSB7XHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHRhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdhcHAnKVxyXG5cdFx0LmNvbnRyb2xsZXIoJ0hvbWVDdHJsJywgSG9tZUN0cmwpO1xyXG5cclxuXHRIb21lQ3RybC4kaW5qZWN0ID0gWyckc2NvcGUnLCAnTWV0YWRhdGEnLCAnQVBJRGF0YSddO1xyXG5cclxuXHRmdW5jdGlvbiBIb21lQ3RybCgkc2NvcGUsIE1ldGFkYXRhLCBBUElEYXRhKSB7XHJcblx0XHQvLyBjb250cm9sbGVyQXMgVmlld01vZGVsXHJcblx0XHR2YXIgaG9tZSA9IHRoaXM7XHJcblxyXG5cdFx0Ly8gYmluZGFibGUgbWVtYmVyc1xyXG5cdFx0aG9tZS50aXRsZSA9ICdBbGwgRGlub3NhdXJzJztcclxuXHJcblx0XHRfaW5pdCgpO1xyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogSU5JVCBmdW5jdGlvbiBleGVjdXRlcyBwcm9jZWR1cmFsIGNvZGVcclxuXHRcdCAqXHJcblx0XHQgKiBAcHJpdmF0ZVxyXG5cdFx0ICovXHJcblx0XHRmdW5jdGlvbiBfaW5pdCgpIHtcclxuXHRcdFx0Ly8gc2V0IHBhZ2UgPHRpdGxlPlxyXG5cdFx0XHRNZXRhZGF0YS5zZXQoaG9tZS50aXRsZSk7XHJcblxyXG5cdFx0XHQvLyBhY3RpdmF0ZSBjb250cm9sbGVyXHJcblx0XHRcdF9hY3RpdmF0ZSgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogQ29udHJvbGxlciBhY3RpdmF0ZVxyXG5cdFx0ICogR2V0IEpTT04gZGF0YVxyXG5cdFx0ICpcclxuXHRcdCAqIEByZXR1cm5zIHthbnl9XHJcblx0XHQgKiBAcHJpdmF0ZVxyXG5cdFx0ICovXHJcblx0XHRmdW5jdGlvbiBfYWN0aXZhdGUoKSB7XHJcblx0XHRcdC8vIHN0YXJ0IGxvYWRpbmdcclxuXHRcdFx0aG9tZS5sb2FkaW5nID0gdHJ1ZTtcclxuXHJcblx0XHRcdC8vIGdldCB0aGUgZGF0YSBmcm9tIEpTT05cclxuXHRcdFx0cmV0dXJuIEFQSURhdGEuZ2V0QWxsRGlub3MoKS50aGVuKF9nZXRKc29uU3VjY2VzcywgX2dldEpzb25FcnJvcik7XHJcblx0XHR9XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBTdWNjZXNzZnVsIHByb21pc2UgZGF0YVxyXG5cdFx0ICpcclxuXHRcdCAqIEBwYXJhbSBkYXRhIHtqc29ufVxyXG5cdFx0ICogQHByaXZhdGVcclxuXHRcdCAqL1xyXG5cdFx0ZnVuY3Rpb24gX2dldEpzb25TdWNjZXNzKGRhdGEpIHtcclxuXHRcdFx0aG9tZS5kaW5vcyA9IGRhdGE7XHJcblxyXG5cdFx0XHQvLyBzdG9wIGxvYWRpbmdcclxuXHRcdFx0aG9tZS5sb2FkaW5nID0gZmFsc2U7XHJcblxyXG5cdFx0XHRyZXR1cm4gaG9tZS5kaW5vcztcclxuXHRcdH1cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIEZhaWx1cmUgb2YgcHJvbWlzZSBkYXRhXHJcblx0XHQgKiBTaG93IGVycm9yXHJcblx0XHQgKiBTdG9wIGxvYWRpbmdcclxuXHRcdCAqL1xyXG5cdFx0ZnVuY3Rpb24gX2dldEpzb25FcnJvcigpIHtcclxuXHRcdFx0aG9tZS5lcnJvciA9IHRydWU7XHJcblxyXG5cdFx0XHQvLyBzdG9wIGxvYWRpbmdcclxuXHRcdFx0aG9tZS5sb2FkaW5nID0gZmFsc2U7XHJcblx0XHR9XHJcblx0fVxyXG59KCkpOyIsIihmdW5jdGlvbigpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdGFuZ3VsYXJcblx0XHQubW9kdWxlKCdhcHAnKVxuXHRcdC5kaXJlY3RpdmUoJ2Rpbm9DYXJkJywgZGlub0NhcmQpO1xuXG5cdGZ1bmN0aW9uIGRpbm9DYXJkKCkge1xuXHRcdC8vIHJldHVybiBkaXJlY3RpdmVcblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6ICdFQScsXG5cdFx0XHRyZXBsYWNlOiB0cnVlLFxuXHRcdFx0c2NvcGU6IHt9LFxuXHRcdFx0dGVtcGxhdGVVcmw6ICdhcHAvcGFnZXMvaG9tZS9kaW5vQ2FyZC50cGwuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiBkaW5vQ2FyZEN0cmwsXG5cdFx0XHRjb250cm9sbGVyQXM6ICdkYycsXG5cdFx0XHRiaW5kVG9Db250cm9sbGVyOiB7XG5cdFx0XHRcdGRpbm86ICc9J1xuXHRcdFx0fVxuXHRcdH07XG5cdH1cblxuXHRkaW5vQ2FyZEN0cmwuJGluamVjdCA9IFtdO1xuXHQvKipcblx0ICogRGlub0NhcmQgQ09OVFJPTExFUlxuXHQgKi9cblx0ZnVuY3Rpb24gZGlub0NhcmRDdHJsKCkge1xuXHRcdHZhciBkYyA9IHRoaXM7XG5cdH1cblxufSgpKTsiXX0=
