// application module setter
(function() {
	'use strict';

	angular
		.module('ng1-event-calendar', ['ngRoute', 'ngResource', 'ngSanitize', 'mediaCheck', 'resize']);
}());
(function() {
	'use strict';

	angular
		.module('ng1-event-calendar')
		.factory('Metadata', Metadata);

	function Metadata() {
		var siteTitle = 'ng1-event-calendar-angular';
		var pageTitle = '';
		var keywords = '';
		var desc = '';

		// callable members
		return {
			set: set,
			getTitle: getTitle,
			getKeywords: getKeywords,
			getDesc: getDesc
		};

		/**
		 * Set page title, keywords, description
		 *
		 * @param newTitle {string}
		 * @param newKeywords {string}
		 * @param newDesc {string}
		 */
		function set(newTitle, newKeywords, newDesc) {
			pageTitle = ' | ' + newTitle;
			keywords = newKeywords;
			desc = newDesc;
		}

		/**
		 * Get title
		 * Returns site title and page title
		 *
		 * @returns {string} site title + page title
		 */
		function getTitle() {
			return siteTitle + pageTitle;
		}

		/**
		 * Get keywords
		 * Returns site meta keywords
		 *
		 * @returns keywords {string}
		 */
		function getKeywords() {
			return keywords;
		}

		/**
		 * Get description
		 * Returns site meta description
		 *
		 * @returns desc {string}
		 */
		function getDesc() {
			return desc;
		}
	}
}());
(function() {
	'use strict';

	angular
		.module('ng1-event-calendar')
		.controller('PageCtrl', PageCtrl);

	PageCtrl.$inject = ['Metadata', '$scope', 'MQ', 'mediaCheck', '$log'];

	function PageCtrl(Metadata, $scope, MQ, mediaCheck, $log) {
		var page = this;

		// private variables
		var _handlingRouteChangeError = false;
		// Set up functionality to run on enter/exit of media query
		var _mc = mediaCheck.init({
			scope: $scope,
			media: {
				mq: MQ.LARGE,
				enter: _enterLarge,
				exit: _exitLarge
			},
			debounce: 200
		});

		_init();

		/**
		 * INIT function executes procedural code
		 *
		 * @private
		 */
		function _init() {
			// associate page <title>
			page.metadata = Metadata;

			$scope.$on('$routeChangeStart', _routeChangeStart);
			$scope.$on('$routeChangeSuccess', _routeChangeSuccess);
			$scope.$on('$routeChangeError', _routeChangeError);
		}

		/**
		 * Enter large media query
		 * $broadcast 'enter-large' event
		 *
		 * @private
		 */
		function _enterLarge() {
			$scope.$broadcast('enter-large');
		}

		/**
		 * Exit large media query
		 * $broadcast 'exit-large' event
		 *
		 * @private
		 */
		function _exitLarge() {
			$scope.$broadcast('exit-large');
		}

		/**
		 * Turn on loading state
		 *
		 * @private
		 */
		function _loadingOn() {
			$scope.$broadcast('loading-on');
		}

		/**
		 * Turn off loading state
		 *
		 * @private
		 */
		function _loadingOff() {
			$scope.$broadcast('loading-off');
		}

		/**
		 * Route change start handler
		 * If next route has resolve, turn on loading
		 *
		 * @param $event {object}
		 * @param next {object}
		 * @param current {object}
		 * @private
		 */
		function _routeChangeStart($event, next, current) {
			if (next.$$route && next.$$route.resolve) { // eslint-disable-line angular/no-private-call
				_loadingOn();
			}
		}

		/**
		 * Route change success handler
		 * Match current media query and run appropriate function
		 * If current route has been resolved, turn off loading
		 *
		 * @param $event {object}
		 * @param current {object}
		 * @param previous {object}
		 * @private
		 */
		function _routeChangeSuccess($event, current, previous) {
			if (angular.isObject(previous)) {
				_mc.matchCurrent(MQ.LARGE);
			}

			if (current.$$route && current.$$route.resolve) {   // eslint-disable-line angular/no-private-call
				_loadingOff();
			}
		}

		/**
		 * Route change error handler
		 * Handle route resolve failures
		 *
		 * @param $event {object}
		 * @param current {object}
		 * @param previous {object}
		 * @param rejection {object}
		 * @private
		 */
		function _routeChangeError($event, current, previous, rejection) {
			var destination = (current && (current.title || current.name || current.loadedTemplateUrl)) || 'unknown target';
			var msg = 'Error routing to ' + destination + '. ' + (rejection.msg || '');

			if (_handlingRouteChangeError) {
				return;
			}

			_handlingRouteChangeError = true;
			_loadingOff();

			$log.error(msg);
		}
	}
}());
// "global" object to share between controllers
(function() {
	'use strict';

	angular
		.module('ng1-event-calendar')
		.factory('Utils', Utils);

	function Utils() {
		var greeting = 'Hello';

		// callable members
		return {
			greeting: greeting,
			alertGreeting: alertGreeting
		};

		/**
		 * Alert greeting
		 *
		 * @param name {string}
		 */
		function alertGreeting(name) {
			alert(greeting + ', ' + name + '!');
		}
	}
}());
// application config
(function() {
	'use strict';

	angular
		.module('ng1-event-calendar')
		.config(appConfig);

	appConfig.$inject = ['$routeProvider', '$locationProvider'];

	function appConfig($routeProvider, $locationProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'ng1-event-calendar/pages/home/Home.view.html',
				controller: 'HomeCtrl',
				controllerAs: 'home'
			})
			.when('/subpage', {
				templateUrl: 'ng1-event-calendar/pages/sub/Sub.view.html',
				controller: 'SubCtrl',
				controllerAs: 'sub',
				resolve: {
					resolveLocalData: resolveLocalData
				}
			})
			.otherwise({
				templateUrl: 'ng1-event-calendar/pages/error404/Error404.view.html',
				controller: 'Error404Ctrl',
				controllerAs: 'e404'
			});

		$locationProvider
			.html5Mode({
				enabled: true
			})
			.hashPrefix('!');
	}

	resolveLocalData.$inject = ['JSONData'];
	/**
	 * Get local data for route resolve
	 *
	 * @param JSONData {factory}
	 * @returns {promise} data
	 */
	function resolveLocalData(JSONData) {
		return JSONData.getLocalData();
	}
}());
// fetch JSON data to share between controllers
(function() {
	'use strict';

	angular
		.module('ng1-event-calendar')
		.factory('JSONData', JSONData);

	JSONData.$inject = ['$http', 'Res'];

	function JSONData($http, Res) {
		// callable members
		return {
			getLocalData: getLocalData
		};

		/**
		 * GET local JSON data file and return results
		 *
		 * @returns {promise}
		 */
		function getLocalData() {
			return $http
				.get('/data/data.json')
				.then(Res.success, Res.error);
		}
	}
}());
(function() {
	'use strict';

	angular
		.module('ng1-event-calendar')
		.factory('Res', Res);

	function Res() {
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
		 * Throws an error with error data
		 *
		 * @param error {object}
		 */
		function error(error) {
			throw new Error('Error retrieving data', error);
		}
	}
}());
(function() {
	'use strict';

	// media query constants
	var MQ = {
		SMALL: '(max-width: 767px)',
		LARGE: '(min-width: 768px)'
	};

	angular
		.module('ng1-event-calendar')
		.constant('MQ', MQ);
}());
(function() {
	'use strict';

	angular
		.module('ng1-event-calendar')
		.directive('loading', loading);

	loading.$inject = ['$window', 'resize'];

	function loading($window, resize) {
		// return directive
		return {
			restrict: 'EA',
			replace: true,
			templateUrl: 'ng1-event-calendar/core/ui/loading.tpl.html',
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
			// turn on loading for initial page load
			_loadingActive();

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
		.module('ng1-event-calendar')
		.directive('svgIcon', svgIcon);

	function svgIcon() {
		// return directive
		return {
			restrict: 'E',
			replace: true,
			scope: {
				name: '@'
			},
			template: '<svg class="icon {{::name}}"><use xlink:href="{{::xlinkHref}}" /></svg>',
			link: svgIconLink
		};

		function svgIconLink($scope, $attrs, $element) {
			$scope.xlinkHref = '/assets/images/svg/sprite.symbol.svg#' + $scope.name;
		}
	}
}());
(function() {
	'use strict';

	angular
		.module('ng1-event-calendar')
		.filter('trustAsHTML', trustAsHTML);

	trustAsHTML.$inject = ['$sce'];

	function trustAsHTML($sce) {
		return function(text) {
			return $sce.trustAsHtml(text);
		};
	}
}());
(function() {
	'use strict';

	angular
		.module('ng1-event-calendar')
		.controller('HeaderCtrl', HeaderCtrl);

	HeaderCtrl.$inject = ['$location', 'JSONData'];

	function HeaderCtrl($location, JSONData) {
		// controllerAs ViewModel
		var header = this;

		// bindable members
		header.indexIsActive = indexIsActive;
		header.navIsActive = navIsActive;

		_init();

		/**
		 * INIT function executes procedural code
		 *
		 * @private
		 */
		function _init() {
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
			// get the data from JSON
			return JSONData.getLocalData().then(_getJsonSuccess);
		}

		/**
		 * Successful promise data
		 *
		 * @param data {json}
		 * @private
		 */
		function _getJsonSuccess(data) {
			header.json = data;
			return header.json;
		}

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
		.module('ng1-event-calendar')
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
		function navControlLink($scope) {
			// private variables
			var _$body = angular.element('body');
			var _layoutCanvas = _$body.find('.layout-canvas');
			var _navOpen;

			// data model
			$scope.nav = {};

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
				$scope.$on('enter-large', _enterLarge);
				$scope.$on('exit-large', _exitLarge);
			}

			/**
			 * Resized window (debounced)
			 *
			 * @private
			 */
			function _resized() {
				_layoutCanvas.css({
					minHeight: $window.innerHeight + 'px'
				});
			}

			/**
			 * Open mobile navigation
			 *
			 * @private
			 */
			function _openNav() {
				_$body
					.removeClass('nav-closed')
					.addClass('nav-open');

				_navOpen = true;
			}

			/**
			 * Close mobile navigation
			 *
			 * @private
			 */
			function _closeNav() {
				_$body
					.removeClass('nav-open')
					.addClass('nav-closed');

				_navOpen = false;
			}

			/**
			 * Toggle nav open/closed
			 */
			function toggleNav() {
				if (!_navOpen) {
					_openNav();
				} else {
					_closeNav();
				}
			}

			/**
			 * When changing location, close the nav if it's open
			 */
			function _$locationChangeStart() {
				if (_navOpen) {
					_closeNav();
				}
			}

			/**
			 * Function to execute when entering large media query
			 * Disable menu toggling and remove body classes
			 *
			 * @private
			 */
			function _enterLarge(mq) {
				// unbind function to toggle mobile navigation open/closed
				$scope.nav.toggleNav = null;

				_$body.removeClass('nav-closed nav-open');
			}

			/**
			 * Function to execute when exiting large media query
			 * Close nav and set up menu toggling functionality
			 *
			 * @private
			 */
			function _exitLarge(mq) {
				_closeNav();

				// bind function to toggle mobile navigation open/closed
				$scope.nav.toggleNav = toggleNav;
			}
		}
	}

}());
(function() {
	'use strict';

	angular
		.module('ng1-event-calendar')
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
			Metadata.set(e404.title, 'error', 'Error 404 - page not found');

			// no data to load, but loading state might be on
			$scope.$emit('loading-off');
		}
	}
}());
(function() {
	'use strict';

	angular
		.module('ng1-event-calendar')
		.controller('HomeCtrl', HomeCtrl);

	HomeCtrl.$inject = ['$scope', 'Utils', 'MQ', 'mediaCheck', 'Metadata', 'JSONData'];

	function HomeCtrl($scope, Utils, MQ, mediaCheck, Metadata, JSONData) {
		// controllerAs ViewModel
		var home = this;

		// Set up functionality to run on enter/exit of media query
		var _mc = mediaCheck.init({
			scope: $scope,
			media: {
				mq: MQ.LARGE,
				enter: _enterLarge,
				exit: _exitLarge
			},
			debounce: 200
		});

		// bindable members
		home.title = 'Home';
		home.global = Utils;
		home.name = 'Visitor';
		home.alertGreeting = Utils.alertGreeting;
		home.stringOfHTML = '<strong style="color: green;">Some green text</strong> bound as HTML with a <a href="#">link</a>, trusted with SCE!';
		home.viewformat = null;

		_init();

		/**
		 * INIT function executes procedural code
		 *
		 * @private
		 */
		function _init() {
			// set page <title>
			Metadata.set(home.title, 'ng1-event-calendar-angular, angularjs, javascript, boilerplate, spa, demo, app, application', 'ng1-event-calendar-angular demo application');

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
			$scope.$emit('loading-on');

			// get the data from JSON
			return JSONData.getLocalData().then(_getJsonSuccess);
		}

		/**
		 * Successful promise data
		 *
		 * @param data {json}
		 * @private
		 */
		function _getJsonSuccess(data) {
			home.json = data;

			// stop loading
			$scope.$emit('loading-off');

			return home.json;
		}

		/**
		 * Enter large mq
		 * Set home.viewformat
		 *
		 * @private
		 */
		function _enterLarge() {
			home.viewformat = 'large';
		}

		/**
		 * Exit large mq
		 * Set home.viewformat
		 *
		 * @private
		 */
		function _exitLarge() {
			home.viewformat = 'small';
		}
	}
}());
(function() {
	'use strict';

	angular
		.module('ng1-event-calendar')
		.controller('SubCtrl', SubCtrl);

	SubCtrl.$inject = ['Utils', 'Metadata', 'resolveLocalData'];

	function SubCtrl(Utils, Metadata, resolveLocalData) {
		// controllerAs ViewModel
		var sub = this;

		// bindable members
		sub.title = 'Subpage';
		sub.global = Utils;
		sub.json = resolveLocalData;

		_init();

		/**
		 * INIT function executes procedural code
		 *
		 * @private
		 */
		function _init() {
			// set page <title>
			Metadata.set(sub.title, 'angularjs, subpage', 'ng1-event-calendar-angular sample subpage with directive and transclusion.');
		}
	}
}());
/**
 * Directives (and associated attributes) are always declared as camelCase in JS and snake-case in HTML
 * Angular's built-in <a> directive automatically implements preventDefault on links that don't have an href attribute
 * Complex JavaScript DOM manipulation should always be done in directive link functions, and $apply should never be used in a controller! Simple DOM manipulation should be in the view.
 */

/*--- Sample Directive with a $watch ---*/
(function() {
	'use strict';

	angular
		.module('ng1-event-calendar')
		.directive('sampleDirective', sampleDirective);

	sampleDirective.$inject = ['$timeout'];

	function sampleDirective($timeout) {
		// return directive
		return {
			restrict: 'EA',
			replace: true,
			scope: {},
			templateUrl: 'ng1-event-calendar/pages/sub/sample.tpl.html',
			transclude: true,
			controller: SampleDirectiveCtrl,
			controllerAs: 'sd',
			bindToController: {
				jsonData: '='
			},
			link: sampleDirectiveLink
		};

		/**
		 * sampleDirective LINK function
		 *
		 * @param $scope
		 * @param $element
		 * @param $attrs
		 * @param sd {controller}
		 */
		function sampleDirectiveLink($scope, $element, $attrs, sd) {
			_init();

			/**
			 * INIT function executes procedural code
			 *
			 * @private
			 */
			function _init() {
				// watch for async data to become available and update
				$scope.$watch('sd.jsonData', _$watchJsonData);
			}

			/**
			 * $watch for sd.jsonData to become available
			 *
			 * @param newVal {*}
			 * @param oldVal {*}
			 * @private
			 */
			function _$watchJsonData(newVal, oldVal) {
				if (newVal) {
					sd.jsonData = newVal;

					$timeout(function() {
						console.log('demonstrate $timeout injection in a directive link function');
					}, 1000);
				}
			}
		}
	}

	SampleDirectiveCtrl.$inject = [];
	/**
	 * sampleDirective CONTROLLER
	 */
	function SampleDirectiveCtrl() {
		var sd = this;

		// controller logic goes here
	}

}());
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5tb2R1bGUuanMiLCJjb3JlL01ldGFkYXRhLmZhY3RvcnkuanMiLCJjb3JlL1BhZ2UuY3RybC5qcyIsImNvcmUvVXRpbHMuZmFjdG9yeS5qcyIsImNvcmUvYXBwLXNldHVwL2FwcC5jb25maWcuanMiLCJjb3JlL2dldC1kYXRhL0pTT05EYXRhLmZhY3RvcnkuanMiLCJjb3JlL2dldC1kYXRhL1Jlcy5mYWN0b3J5LmpzIiwiY29yZS91aS9NUS5jb25zdGFudC5qcyIsImNvcmUvdWkvbG9hZGluZy5kaXIuanMiLCJjb3JlL3VpL3N2Z0ljb24uZGlyLmpzIiwiY29yZS91aS90cnVzdEFzSFRNTC5maWx0ZXIuanMiLCJtb2R1bGVzL2hlYWRlci9IZWFkZXIuY3RybC5qcyIsIm1vZHVsZXMvaGVhZGVyL25hdkNvbnRyb2wuZGlyLmpzIiwicGFnZXMvZXJyb3I0MDQvRXJyb3I0MDQuY3RybC5qcyIsInBhZ2VzL2hvbWUvSG9tZS5jdHJsLmpzIiwicGFnZXMvc3ViL1N1Yi5jdHJsLmpzIiwicGFnZXMvc3ViL3NhbXBsZS5kaXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoibmcxLWV2ZW50LWNhbGVuZGFyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gYXBwbGljYXRpb24gbW9kdWxlIHNldHRlclxuKGZ1bmN0aW9uKCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ25nMS1ldmVudC1jYWxlbmRhcicsIFsnbmdSb3V0ZScsICduZ1Jlc291cmNlJywgJ25nU2FuaXRpemUnLCAnbWVkaWFDaGVjaycsICdyZXNpemUnXSk7XG59KCkpOyIsIihmdW5jdGlvbigpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdGFuZ3VsYXJcblx0XHQubW9kdWxlKCduZzEtZXZlbnQtY2FsZW5kYXInKVxuXHRcdC5mYWN0b3J5KCdNZXRhZGF0YScsIE1ldGFkYXRhKTtcblxuXHRmdW5jdGlvbiBNZXRhZGF0YSgpIHtcblx0XHR2YXIgc2l0ZVRpdGxlID0gJ25nMS1ldmVudC1jYWxlbmRhci1hbmd1bGFyJztcblx0XHR2YXIgcGFnZVRpdGxlID0gJyc7XG5cdFx0dmFyIGtleXdvcmRzID0gJyc7XG5cdFx0dmFyIGRlc2MgPSAnJztcblxuXHRcdC8vIGNhbGxhYmxlIG1lbWJlcnNcblx0XHRyZXR1cm4ge1xuXHRcdFx0c2V0OiBzZXQsXG5cdFx0XHRnZXRUaXRsZTogZ2V0VGl0bGUsXG5cdFx0XHRnZXRLZXl3b3JkczogZ2V0S2V5d29yZHMsXG5cdFx0XHRnZXREZXNjOiBnZXREZXNjXG5cdFx0fTtcblxuXHRcdC8qKlxuXHRcdCAqIFNldCBwYWdlIHRpdGxlLCBrZXl3b3JkcywgZGVzY3JpcHRpb25cblx0XHQgKlxuXHRcdCAqIEBwYXJhbSBuZXdUaXRsZSB7c3RyaW5nfVxuXHRcdCAqIEBwYXJhbSBuZXdLZXl3b3JkcyB7c3RyaW5nfVxuXHRcdCAqIEBwYXJhbSBuZXdEZXNjIHtzdHJpbmd9XG5cdFx0ICovXG5cdFx0ZnVuY3Rpb24gc2V0KG5ld1RpdGxlLCBuZXdLZXl3b3JkcywgbmV3RGVzYykge1xuXHRcdFx0cGFnZVRpdGxlID0gJyB8ICcgKyBuZXdUaXRsZTtcblx0XHRcdGtleXdvcmRzID0gbmV3S2V5d29yZHM7XG5cdFx0XHRkZXNjID0gbmV3RGVzYztcblx0XHR9XG5cblx0XHQvKipcblx0XHQgKiBHZXQgdGl0bGVcblx0XHQgKiBSZXR1cm5zIHNpdGUgdGl0bGUgYW5kIHBhZ2UgdGl0bGVcblx0XHQgKlxuXHRcdCAqIEByZXR1cm5zIHtzdHJpbmd9IHNpdGUgdGl0bGUgKyBwYWdlIHRpdGxlXG5cdFx0ICovXG5cdFx0ZnVuY3Rpb24gZ2V0VGl0bGUoKSB7XG5cdFx0XHRyZXR1cm4gc2l0ZVRpdGxlICsgcGFnZVRpdGxlO1xuXHRcdH1cblxuXHRcdC8qKlxuXHRcdCAqIEdldCBrZXl3b3Jkc1xuXHRcdCAqIFJldHVybnMgc2l0ZSBtZXRhIGtleXdvcmRzXG5cdFx0ICpcblx0XHQgKiBAcmV0dXJucyBrZXl3b3JkcyB7c3RyaW5nfVxuXHRcdCAqL1xuXHRcdGZ1bmN0aW9uIGdldEtleXdvcmRzKCkge1xuXHRcdFx0cmV0dXJuIGtleXdvcmRzO1xuXHRcdH1cblxuXHRcdC8qKlxuXHRcdCAqIEdldCBkZXNjcmlwdGlvblxuXHRcdCAqIFJldHVybnMgc2l0ZSBtZXRhIGRlc2NyaXB0aW9uXG5cdFx0ICpcblx0XHQgKiBAcmV0dXJucyBkZXNjIHtzdHJpbmd9XG5cdFx0ICovXG5cdFx0ZnVuY3Rpb24gZ2V0RGVzYygpIHtcblx0XHRcdHJldHVybiBkZXNjO1xuXHRcdH1cblx0fVxufSgpKTsiLCIoZnVuY3Rpb24oKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgnbmcxLWV2ZW50LWNhbGVuZGFyJylcblx0XHQuY29udHJvbGxlcignUGFnZUN0cmwnLCBQYWdlQ3RybCk7XG5cblx0UGFnZUN0cmwuJGluamVjdCA9IFsnTWV0YWRhdGEnLCAnJHNjb3BlJywgJ01RJywgJ21lZGlhQ2hlY2snLCAnJGxvZyddO1xuXG5cdGZ1bmN0aW9uIFBhZ2VDdHJsKE1ldGFkYXRhLCAkc2NvcGUsIE1RLCBtZWRpYUNoZWNrLCAkbG9nKSB7XG5cdFx0dmFyIHBhZ2UgPSB0aGlzO1xuXG5cdFx0Ly8gcHJpdmF0ZSB2YXJpYWJsZXNcblx0XHR2YXIgX2hhbmRsaW5nUm91dGVDaGFuZ2VFcnJvciA9IGZhbHNlO1xuXHRcdC8vIFNldCB1cCBmdW5jdGlvbmFsaXR5IHRvIHJ1biBvbiBlbnRlci9leGl0IG9mIG1lZGlhIHF1ZXJ5XG5cdFx0dmFyIF9tYyA9IG1lZGlhQ2hlY2suaW5pdCh7XG5cdFx0XHRzY29wZTogJHNjb3BlLFxuXHRcdFx0bWVkaWE6IHtcblx0XHRcdFx0bXE6IE1RLkxBUkdFLFxuXHRcdFx0XHRlbnRlcjogX2VudGVyTGFyZ2UsXG5cdFx0XHRcdGV4aXQ6IF9leGl0TGFyZ2Vcblx0XHRcdH0sXG5cdFx0XHRkZWJvdW5jZTogMjAwXG5cdFx0fSk7XG5cblx0XHRfaW5pdCgpO1xuXG5cdFx0LyoqXG5cdFx0ICogSU5JVCBmdW5jdGlvbiBleGVjdXRlcyBwcm9jZWR1cmFsIGNvZGVcblx0XHQgKlxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICovXG5cdFx0ZnVuY3Rpb24gX2luaXQoKSB7XG5cdFx0XHQvLyBhc3NvY2lhdGUgcGFnZSA8dGl0bGU+XG5cdFx0XHRwYWdlLm1ldGFkYXRhID0gTWV0YWRhdGE7XG5cblx0XHRcdCRzY29wZS4kb24oJyRyb3V0ZUNoYW5nZVN0YXJ0JywgX3JvdXRlQ2hhbmdlU3RhcnQpO1xuXHRcdFx0JHNjb3BlLiRvbignJHJvdXRlQ2hhbmdlU3VjY2VzcycsIF9yb3V0ZUNoYW5nZVN1Y2Nlc3MpO1xuXHRcdFx0JHNjb3BlLiRvbignJHJvdXRlQ2hhbmdlRXJyb3InLCBfcm91dGVDaGFuZ2VFcnJvcik7XG5cdFx0fVxuXG5cdFx0LyoqXG5cdFx0ICogRW50ZXIgbGFyZ2UgbWVkaWEgcXVlcnlcblx0XHQgKiAkYnJvYWRjYXN0ICdlbnRlci1sYXJnZScgZXZlbnRcblx0XHQgKlxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICovXG5cdFx0ZnVuY3Rpb24gX2VudGVyTGFyZ2UoKSB7XG5cdFx0XHQkc2NvcGUuJGJyb2FkY2FzdCgnZW50ZXItbGFyZ2UnKTtcblx0XHR9XG5cblx0XHQvKipcblx0XHQgKiBFeGl0IGxhcmdlIG1lZGlhIHF1ZXJ5XG5cdFx0ICogJGJyb2FkY2FzdCAnZXhpdC1sYXJnZScgZXZlbnRcblx0XHQgKlxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICovXG5cdFx0ZnVuY3Rpb24gX2V4aXRMYXJnZSgpIHtcblx0XHRcdCRzY29wZS4kYnJvYWRjYXN0KCdleGl0LWxhcmdlJyk7XG5cdFx0fVxuXG5cdFx0LyoqXG5cdFx0ICogVHVybiBvbiBsb2FkaW5nIHN0YXRlXG5cdFx0ICpcblx0XHQgKiBAcHJpdmF0ZVxuXHRcdCAqL1xuXHRcdGZ1bmN0aW9uIF9sb2FkaW5nT24oKSB7XG5cdFx0XHQkc2NvcGUuJGJyb2FkY2FzdCgnbG9hZGluZy1vbicpO1xuXHRcdH1cblxuXHRcdC8qKlxuXHRcdCAqIFR1cm4gb2ZmIGxvYWRpbmcgc3RhdGVcblx0XHQgKlxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICovXG5cdFx0ZnVuY3Rpb24gX2xvYWRpbmdPZmYoKSB7XG5cdFx0XHQkc2NvcGUuJGJyb2FkY2FzdCgnbG9hZGluZy1vZmYnKTtcblx0XHR9XG5cblx0XHQvKipcblx0XHQgKiBSb3V0ZSBjaGFuZ2Ugc3RhcnQgaGFuZGxlclxuXHRcdCAqIElmIG5leHQgcm91dGUgaGFzIHJlc29sdmUsIHR1cm4gb24gbG9hZGluZ1xuXHRcdCAqXG5cdFx0ICogQHBhcmFtICRldmVudCB7b2JqZWN0fVxuXHRcdCAqIEBwYXJhbSBuZXh0IHtvYmplY3R9XG5cdFx0ICogQHBhcmFtIGN1cnJlbnQge29iamVjdH1cblx0XHQgKiBAcHJpdmF0ZVxuXHRcdCAqL1xuXHRcdGZ1bmN0aW9uIF9yb3V0ZUNoYW5nZVN0YXJ0KCRldmVudCwgbmV4dCwgY3VycmVudCkge1xuXHRcdFx0aWYgKG5leHQuJCRyb3V0ZSAmJiBuZXh0LiQkcm91dGUucmVzb2x2ZSkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIGFuZ3VsYXIvbm8tcHJpdmF0ZS1jYWxsXG5cdFx0XHRcdF9sb2FkaW5nT24oKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvKipcblx0XHQgKiBSb3V0ZSBjaGFuZ2Ugc3VjY2VzcyBoYW5kbGVyXG5cdFx0ICogTWF0Y2ggY3VycmVudCBtZWRpYSBxdWVyeSBhbmQgcnVuIGFwcHJvcHJpYXRlIGZ1bmN0aW9uXG5cdFx0ICogSWYgY3VycmVudCByb3V0ZSBoYXMgYmVlbiByZXNvbHZlZCwgdHVybiBvZmYgbG9hZGluZ1xuXHRcdCAqXG5cdFx0ICogQHBhcmFtICRldmVudCB7b2JqZWN0fVxuXHRcdCAqIEBwYXJhbSBjdXJyZW50IHtvYmplY3R9XG5cdFx0ICogQHBhcmFtIHByZXZpb3VzIHtvYmplY3R9XG5cdFx0ICogQHByaXZhdGVcblx0XHQgKi9cblx0XHRmdW5jdGlvbiBfcm91dGVDaGFuZ2VTdWNjZXNzKCRldmVudCwgY3VycmVudCwgcHJldmlvdXMpIHtcblx0XHRcdGlmIChhbmd1bGFyLmlzT2JqZWN0KHByZXZpb3VzKSkge1xuXHRcdFx0XHRfbWMubWF0Y2hDdXJyZW50KE1RLkxBUkdFKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGN1cnJlbnQuJCRyb3V0ZSAmJiBjdXJyZW50LiQkcm91dGUucmVzb2x2ZSkgeyAgIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgYW5ndWxhci9uby1wcml2YXRlLWNhbGxcblx0XHRcdFx0X2xvYWRpbmdPZmYoKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvKipcblx0XHQgKiBSb3V0ZSBjaGFuZ2UgZXJyb3IgaGFuZGxlclxuXHRcdCAqIEhhbmRsZSByb3V0ZSByZXNvbHZlIGZhaWx1cmVzXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0gJGV2ZW50IHtvYmplY3R9XG5cdFx0ICogQHBhcmFtIGN1cnJlbnQge29iamVjdH1cblx0XHQgKiBAcGFyYW0gcHJldmlvdXMge29iamVjdH1cblx0XHQgKiBAcGFyYW0gcmVqZWN0aW9uIHtvYmplY3R9XG5cdFx0ICogQHByaXZhdGVcblx0XHQgKi9cblx0XHRmdW5jdGlvbiBfcm91dGVDaGFuZ2VFcnJvcigkZXZlbnQsIGN1cnJlbnQsIHByZXZpb3VzLCByZWplY3Rpb24pIHtcblx0XHRcdHZhciBkZXN0aW5hdGlvbiA9IChjdXJyZW50ICYmIChjdXJyZW50LnRpdGxlIHx8IGN1cnJlbnQubmFtZSB8fCBjdXJyZW50LmxvYWRlZFRlbXBsYXRlVXJsKSkgfHwgJ3Vua25vd24gdGFyZ2V0Jztcblx0XHRcdHZhciBtc2cgPSAnRXJyb3Igcm91dGluZyB0byAnICsgZGVzdGluYXRpb24gKyAnLiAnICsgKHJlamVjdGlvbi5tc2cgfHwgJycpO1xuXG5cdFx0XHRpZiAoX2hhbmRsaW5nUm91dGVDaGFuZ2VFcnJvcikge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdF9oYW5kbGluZ1JvdXRlQ2hhbmdlRXJyb3IgPSB0cnVlO1xuXHRcdFx0X2xvYWRpbmdPZmYoKTtcblxuXHRcdFx0JGxvZy5lcnJvcihtc2cpO1xuXHRcdH1cblx0fVxufSgpKTsiLCIvLyBcImdsb2JhbFwiIG9iamVjdCB0byBzaGFyZSBiZXR3ZWVuIGNvbnRyb2xsZXJzXG4oZnVuY3Rpb24oKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgnbmcxLWV2ZW50LWNhbGVuZGFyJylcblx0XHQuZmFjdG9yeSgnVXRpbHMnLCBVdGlscyk7XG5cblx0ZnVuY3Rpb24gVXRpbHMoKSB7XG5cdFx0dmFyIGdyZWV0aW5nID0gJ0hlbGxvJztcblxuXHRcdC8vIGNhbGxhYmxlIG1lbWJlcnNcblx0XHRyZXR1cm4ge1xuXHRcdFx0Z3JlZXRpbmc6IGdyZWV0aW5nLFxuXHRcdFx0YWxlcnRHcmVldGluZzogYWxlcnRHcmVldGluZ1xuXHRcdH07XG5cblx0XHQvKipcblx0XHQgKiBBbGVydCBncmVldGluZ1xuXHRcdCAqXG5cdFx0ICogQHBhcmFtIG5hbWUge3N0cmluZ31cblx0XHQgKi9cblx0XHRmdW5jdGlvbiBhbGVydEdyZWV0aW5nKG5hbWUpIHtcblx0XHRcdGFsZXJ0KGdyZWV0aW5nICsgJywgJyArIG5hbWUgKyAnIScpO1xuXHRcdH1cblx0fVxufSgpKTsiLCIvLyBhcHBsaWNhdGlvbiBjb25maWdcbihmdW5jdGlvbigpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdGFuZ3VsYXJcblx0XHQubW9kdWxlKCduZzEtZXZlbnQtY2FsZW5kYXInKVxuXHRcdC5jb25maWcoYXBwQ29uZmlnKTtcblxuXHRhcHBDb25maWcuJGluamVjdCA9IFsnJHJvdXRlUHJvdmlkZXInLCAnJGxvY2F0aW9uUHJvdmlkZXInXTtcblxuXHRmdW5jdGlvbiBhcHBDb25maWcoJHJvdXRlUHJvdmlkZXIsICRsb2NhdGlvblByb3ZpZGVyKSB7XG5cdFx0JHJvdXRlUHJvdmlkZXJcblx0XHRcdC53aGVuKCcvJywge1xuXHRcdFx0XHR0ZW1wbGF0ZVVybDogJ25nMS1ldmVudC1jYWxlbmRhci9wYWdlcy9ob21lL0hvbWUudmlldy5odG1sJyxcblx0XHRcdFx0Y29udHJvbGxlcjogJ0hvbWVDdHJsJyxcblx0XHRcdFx0Y29udHJvbGxlckFzOiAnaG9tZSdcblx0XHRcdH0pXG5cdFx0XHQud2hlbignL3N1YnBhZ2UnLCB7XG5cdFx0XHRcdHRlbXBsYXRlVXJsOiAnbmcxLWV2ZW50LWNhbGVuZGFyL3BhZ2VzL3N1Yi9TdWIudmlldy5odG1sJyxcblx0XHRcdFx0Y29udHJvbGxlcjogJ1N1YkN0cmwnLFxuXHRcdFx0XHRjb250cm9sbGVyQXM6ICdzdWInLFxuXHRcdFx0XHRyZXNvbHZlOiB7XG5cdFx0XHRcdFx0cmVzb2x2ZUxvY2FsRGF0YTogcmVzb2x2ZUxvY2FsRGF0YVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0Lm90aGVyd2lzZSh7XG5cdFx0XHRcdHRlbXBsYXRlVXJsOiAnbmcxLWV2ZW50LWNhbGVuZGFyL3BhZ2VzL2Vycm9yNDA0L0Vycm9yNDA0LnZpZXcuaHRtbCcsXG5cdFx0XHRcdGNvbnRyb2xsZXI6ICdFcnJvcjQwNEN0cmwnLFxuXHRcdFx0XHRjb250cm9sbGVyQXM6ICdlNDA0J1xuXHRcdFx0fSk7XG5cblx0XHQkbG9jYXRpb25Qcm92aWRlclxuXHRcdFx0Lmh0bWw1TW9kZSh7XG5cdFx0XHRcdGVuYWJsZWQ6IHRydWVcblx0XHRcdH0pXG5cdFx0XHQuaGFzaFByZWZpeCgnIScpO1xuXHR9XG5cblx0cmVzb2x2ZUxvY2FsRGF0YS4kaW5qZWN0ID0gWydKU09ORGF0YSddO1xuXHQvKipcblx0ICogR2V0IGxvY2FsIGRhdGEgZm9yIHJvdXRlIHJlc29sdmVcblx0ICpcblx0ICogQHBhcmFtIEpTT05EYXRhIHtmYWN0b3J5fVxuXHQgKiBAcmV0dXJucyB7cHJvbWlzZX0gZGF0YVxuXHQgKi9cblx0ZnVuY3Rpb24gcmVzb2x2ZUxvY2FsRGF0YShKU09ORGF0YSkge1xuXHRcdHJldHVybiBKU09ORGF0YS5nZXRMb2NhbERhdGEoKTtcblx0fVxufSgpKTsiLCIvLyBmZXRjaCBKU09OIGRhdGEgdG8gc2hhcmUgYmV0d2VlbiBjb250cm9sbGVyc1xuKGZ1bmN0aW9uKCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ25nMS1ldmVudC1jYWxlbmRhcicpXG5cdFx0LmZhY3RvcnkoJ0pTT05EYXRhJywgSlNPTkRhdGEpO1xuXG5cdEpTT05EYXRhLiRpbmplY3QgPSBbJyRodHRwJywgJ1JlcyddO1xuXG5cdGZ1bmN0aW9uIEpTT05EYXRhKCRodHRwLCBSZXMpIHtcblx0XHQvLyBjYWxsYWJsZSBtZW1iZXJzXG5cdFx0cmV0dXJuIHtcblx0XHRcdGdldExvY2FsRGF0YTogZ2V0TG9jYWxEYXRhXG5cdFx0fTtcblxuXHRcdC8qKlxuXHRcdCAqIEdFVCBsb2NhbCBKU09OIGRhdGEgZmlsZSBhbmQgcmV0dXJuIHJlc3VsdHNcblx0XHQgKlxuXHRcdCAqIEByZXR1cm5zIHtwcm9taXNlfVxuXHRcdCAqL1xuXHRcdGZ1bmN0aW9uIGdldExvY2FsRGF0YSgpIHtcblx0XHRcdHJldHVybiAkaHR0cFxuXHRcdFx0XHQuZ2V0KCcvZGF0YS9kYXRhLmpzb24nKVxuXHRcdFx0XHQudGhlbihSZXMuc3VjY2VzcywgUmVzLmVycm9yKTtcblx0XHR9XG5cdH1cbn0oKSk7IiwiKGZ1bmN0aW9uKCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ25nMS1ldmVudC1jYWxlbmRhcicpXG5cdFx0LmZhY3RvcnkoJ1JlcycsIFJlcyk7XG5cblx0ZnVuY3Rpb24gUmVzKCkge1xuXHRcdC8vIGNhbGxhYmxlIG1lbWJlcnNcblx0XHRyZXR1cm4ge1xuXHRcdFx0c3VjY2Vzczogc3VjY2Vzcyxcblx0XHRcdGVycm9yOiBlcnJvclxuXHRcdH07XG5cblx0XHQvKipcblx0XHQgKiBQcm9taXNlIHJlc3BvbnNlIGZ1bmN0aW9uXG5cdFx0ICogQ2hlY2tzIHR5cGVvZiBkYXRhIHJldHVybmVkIGFuZCBzdWNjZWVkcyBpZiBKUyBvYmplY3QsIHRocm93cyBlcnJvciBpZiBub3Rcblx0XHQgKiBVc2VmdWwgZm9yIEFQSXMgKGllLCB3aXRoIG5naW54KSB3aGVyZSBzZXJ2ZXIgZXJyb3IgSFRNTCBwYWdlIG1heSBiZSByZXR1cm5lZCBpbiBlcnJvclxuXHRcdCAqXG5cdFx0ICogQHBhcmFtIHJlc3BvbnNlIHsqfSBkYXRhIGZyb20gJGh0dHBcblx0XHQgKiBAcmV0dXJucyB7Kn0gb2JqZWN0LCBhcnJheVxuXHRcdCAqL1xuXHRcdGZ1bmN0aW9uIHN1Y2Nlc3MocmVzcG9uc2UpIHtcblx0XHRcdGlmIChhbmd1bGFyLmlzT2JqZWN0KHJlc3BvbnNlLmRhdGEpKSB7XG5cdFx0XHRcdHJldHVybiByZXNwb25zZS5kYXRhO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdyZXRyaWV2ZWQgZGF0YSBpcyBub3QgdHlwZW9mIG9iamVjdC4nKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvKipcblx0XHQgKiBQcm9taXNlIHJlc3BvbnNlIGZ1bmN0aW9uIC0gZXJyb3Jcblx0XHQgKiBUaHJvd3MgYW4gZXJyb3Igd2l0aCBlcnJvciBkYXRhXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0gZXJyb3Ige29iamVjdH1cblx0XHQgKi9cblx0XHRmdW5jdGlvbiBlcnJvcihlcnJvcikge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdFcnJvciByZXRyaWV2aW5nIGRhdGEnLCBlcnJvcik7XG5cdFx0fVxuXHR9XG59KCkpOyIsIihmdW5jdGlvbigpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdC8vIG1lZGlhIHF1ZXJ5IGNvbnN0YW50c1xuXHR2YXIgTVEgPSB7XG5cdFx0U01BTEw6ICcobWF4LXdpZHRoOiA3NjdweCknLFxuXHRcdExBUkdFOiAnKG1pbi13aWR0aDogNzY4cHgpJ1xuXHR9O1xuXG5cdGFuZ3VsYXJcblx0XHQubW9kdWxlKCduZzEtZXZlbnQtY2FsZW5kYXInKVxuXHRcdC5jb25zdGFudCgnTVEnLCBNUSk7XG59KCkpOyIsIihmdW5jdGlvbigpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdGFuZ3VsYXJcblx0XHQubW9kdWxlKCduZzEtZXZlbnQtY2FsZW5kYXInKVxuXHRcdC5kaXJlY3RpdmUoJ2xvYWRpbmcnLCBsb2FkaW5nKTtcblxuXHRsb2FkaW5nLiRpbmplY3QgPSBbJyR3aW5kb3cnLCAncmVzaXplJ107XG5cblx0ZnVuY3Rpb24gbG9hZGluZygkd2luZG93LCByZXNpemUpIHtcblx0XHQvLyByZXR1cm4gZGlyZWN0aXZlXG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OiAnRUEnLFxuXHRcdFx0cmVwbGFjZTogdHJ1ZSxcblx0XHRcdHRlbXBsYXRlVXJsOiAnbmcxLWV2ZW50LWNhbGVuZGFyL2NvcmUvdWkvbG9hZGluZy50cGwuaHRtbCcsXG5cdFx0XHR0cmFuc2NsdWRlOiB0cnVlLFxuXHRcdFx0Y29udHJvbGxlcjogbG9hZGluZ0N0cmwsXG5cdFx0XHRjb250cm9sbGVyQXM6ICdsb2FkaW5nJyxcblx0XHRcdGJpbmRUb0NvbnRyb2xsZXI6IHRydWUsXG5cdFx0XHRsaW5rOiBsb2FkaW5nTGlua1xuXHRcdH07XG5cblx0XHQvKipcblx0XHQgKiBsb2FkaW5nIExJTktcblx0XHQgKiBEaXNhYmxlcyBwYWdlIHNjcm9sbGluZyB3aGVuIGxvYWRpbmcgb3ZlcmxheSBpcyBvcGVuXG5cdFx0ICpcblx0XHQgKiBAcGFyYW0gJHNjb3BlXG5cdFx0ICogQHBhcmFtICRlbGVtZW50XG5cdFx0ICogQHBhcmFtICRhdHRyc1xuXHRcdCAqIEBwYXJhbSBsb2FkaW5nIHtjb250cm9sbGVyfVxuXHRcdCAqL1xuXHRcdGZ1bmN0aW9uIGxvYWRpbmdMaW5rKCRzY29wZSwgJGVsZW1lbnQsICRhdHRycywgbG9hZGluZykge1xuXHRcdFx0Ly8gcHJpdmF0ZSB2YXJpYWJsZXNcblx0XHRcdHZhciBfJGJvZHkgPSBhbmd1bGFyLmVsZW1lbnQoJ2JvZHknKTtcblx0XHRcdHZhciBfd2luSGVpZ2h0ID0gJHdpbmRvdy5pbm5lckhlaWdodCArICdweCc7XG5cblx0XHRcdF9pbml0KCk7XG5cblx0XHRcdC8qKlxuXHRcdFx0ICogSU5JVCBmdW5jdGlvbiBleGVjdXRlcyBwcm9jZWR1cmFsIGNvZGVcblx0XHRcdCAqXG5cdFx0XHQgKiBAcHJpdmF0ZVxuXHRcdFx0ICovXG5cdFx0XHRmdW5jdGlvbiBfaW5pdCgpIHtcblx0XHRcdFx0Ly8gaW5pdGlhbGl6ZSBkZWJvdW5jZWQgcmVzaXplXG5cdFx0XHRcdHZhciBfcnMgPSByZXNpemUuaW5pdCh7XG5cdFx0XHRcdFx0c2NvcGU6ICRzY29wZSxcblx0XHRcdFx0XHRyZXNpemVkRm46IF9yZXNpemVkLFxuXHRcdFx0XHRcdGRlYm91bmNlOiAyMDBcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0Ly8gJHdhdGNoIGFjdGl2ZSBzdGF0ZVxuXHRcdFx0XHQkc2NvcGUuJHdhdGNoKCdsb2FkaW5nLmFjdGl2ZScsIF8kd2F0Y2hBY3RpdmUpO1xuXHRcdFx0fVxuXG5cdFx0XHQvKipcblx0XHRcdCAqIFdpbmRvdyByZXNpemVkXG5cdFx0XHQgKiBJZiBsb2FkaW5nLCByZWFwcGx5IGJvZHkgaGVpZ2h0XG5cdFx0XHQgKiB0byBwcmV2ZW50IHNjcm9sbGJhclxuXHRcdFx0ICpcblx0XHRcdCAqIEBwcml2YXRlXG5cdFx0XHQgKi9cblx0XHRcdGZ1bmN0aW9uIF9yZXNpemVkKCkge1xuXHRcdFx0XHRfd2luSGVpZ2h0ID0gJHdpbmRvdy5pbm5lckhlaWdodCArICdweCc7XG5cblx0XHRcdFx0aWYgKGxvYWRpbmcuYWN0aXZlKSB7XG5cdFx0XHRcdFx0XyRib2R5LmNzcyh7XG5cdFx0XHRcdFx0XHRoZWlnaHQ6IF93aW5IZWlnaHRcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvKipcblx0XHRcdCAqICR3YXRjaCBsb2FkaW5nLmFjdGl2ZVxuXHRcdFx0ICpcblx0XHRcdCAqIEBwYXJhbSBuZXdWYWwge2Jvb2xlYW59XG5cdFx0XHQgKiBAcGFyYW0gb2xkVmFsIHt1bmRlZmluZWR8Ym9vbGVhbn1cblx0XHRcdCAqIEBwcml2YXRlXG5cdFx0XHQgKi9cblx0XHRcdGZ1bmN0aW9uIF8kd2F0Y2hBY3RpdmUobmV3VmFsLCBvbGRWYWwpIHtcblx0XHRcdFx0aWYgKG5ld1ZhbCkge1xuXHRcdFx0XHRcdF9vcGVuKCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0X2Nsb3NlKCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0LyoqXG5cdFx0XHQgKiBPcGVuIGxvYWRpbmdcblx0XHRcdCAqIERpc2FibGUgc2Nyb2xsXG5cdFx0XHQgKlxuXHRcdFx0ICogQHByaXZhdGVcblx0XHRcdCAqL1xuXHRcdFx0ZnVuY3Rpb24gX29wZW4oKSB7XG5cdFx0XHRcdF8kYm9keS5jc3Moe1xuXHRcdFx0XHRcdGhlaWdodDogX3dpbkhlaWdodCxcblx0XHRcdFx0XHRvdmVyZmxvd1k6ICdoaWRkZW4nXG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXG5cdFx0XHQvKipcblx0XHRcdCAqIENsb3NlIGxvYWRpbmdcblx0XHRcdCAqIEVuYWJsZSBzY3JvbGxcblx0XHRcdCAqXG5cdFx0XHQgKiBAcHJpdmF0ZVxuXHRcdFx0ICovXG5cdFx0XHRmdW5jdGlvbiBfY2xvc2UoKSB7XG5cdFx0XHRcdF8kYm9keS5jc3Moe1xuXHRcdFx0XHRcdGhlaWdodDogJycsXG5cdFx0XHRcdFx0b3ZlcmZsb3dZOiAnJ1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRsb2FkaW5nQ3RybC4kaW5qZWN0ID0gWyckc2NvcGUnXTtcblx0LyoqXG5cdCAqIGxvYWRpbmcgQ09OVFJPTExFUlxuXHQgKiBVcGRhdGUgdGhlIGxvYWRpbmcgc3RhdHVzIGJhc2VkXG5cdCAqIG9uIHJvdXRlQ2hhbmdlIHN0YXRlXG5cdCAqL1xuXHRmdW5jdGlvbiBsb2FkaW5nQ3RybCgkc2NvcGUpIHtcblx0XHR2YXIgbG9hZGluZyA9IHRoaXM7XG5cblx0XHRfaW5pdCgpO1xuXG5cdFx0LyoqXG5cdFx0ICogSU5JVCBmdW5jdGlvbiBleGVjdXRlcyBwcm9jZWR1cmFsIGNvZGVcblx0XHQgKlxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICovXG5cdFx0ZnVuY3Rpb24gX2luaXQoKSB7XG5cdFx0XHQvLyB0dXJuIG9uIGxvYWRpbmcgZm9yIGluaXRpYWwgcGFnZSBsb2FkXG5cdFx0XHRfbG9hZGluZ0FjdGl2ZSgpO1xuXG5cdFx0XHQkc2NvcGUuJG9uKCdsb2FkaW5nLW9uJywgX2xvYWRpbmdBY3RpdmUpO1xuXHRcdFx0JHNjb3BlLiRvbignbG9hZGluZy1vZmYnLCBfbG9hZGluZ0luYWN0aXZlKTtcblx0XHR9XG5cblx0XHQvKipcblx0XHQgKiBTZXQgbG9hZGluZyB0byBhY3RpdmVcblx0XHQgKlxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICovXG5cdFx0ZnVuY3Rpb24gX2xvYWRpbmdBY3RpdmUoKSB7XG5cdFx0XHRsb2FkaW5nLmFjdGl2ZSA9IHRydWU7XG5cdFx0fVxuXG5cdFx0LyoqXG5cdFx0ICogU2V0IGxvYWRpbmcgdG8gaW5hY3RpdmVcblx0XHQgKlxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICovXG5cdFx0ZnVuY3Rpb24gX2xvYWRpbmdJbmFjdGl2ZSgpIHtcblx0XHRcdGxvYWRpbmcuYWN0aXZlID0gZmFsc2U7XG5cdFx0fVxuXHR9XG5cbn0oKSk7IiwiKGZ1bmN0aW9uKCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ25nMS1ldmVudC1jYWxlbmRhcicpXG5cdFx0LmRpcmVjdGl2ZSgnc3ZnSWNvbicsIHN2Z0ljb24pO1xuXG5cdGZ1bmN0aW9uIHN2Z0ljb24oKSB7XG5cdFx0Ly8gcmV0dXJuIGRpcmVjdGl2ZVxuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0UnLFxuXHRcdFx0cmVwbGFjZTogdHJ1ZSxcblx0XHRcdHNjb3BlOiB7XG5cdFx0XHRcdG5hbWU6ICdAJ1xuXHRcdFx0fSxcblx0XHRcdHRlbXBsYXRlOiAnPHN2ZyBjbGFzcz1cImljb24ge3s6Om5hbWV9fVwiPjx1c2UgeGxpbms6aHJlZj1cInt7Ojp4bGlua0hyZWZ9fVwiIC8+PC9zdmc+Jyxcblx0XHRcdGxpbms6IHN2Z0ljb25MaW5rXG5cdFx0fTtcblxuXHRcdGZ1bmN0aW9uIHN2Z0ljb25MaW5rKCRzY29wZSwgJGF0dHJzLCAkZWxlbWVudCkge1xuXHRcdFx0JHNjb3BlLnhsaW5rSHJlZiA9ICcvYXNzZXRzL2ltYWdlcy9zdmcvc3ByaXRlLnN5bWJvbC5zdmcjJyArICRzY29wZS5uYW1lO1xuXHRcdH1cblx0fVxufSgpKTsiLCIoZnVuY3Rpb24oKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgnbmcxLWV2ZW50LWNhbGVuZGFyJylcblx0XHQuZmlsdGVyKCd0cnVzdEFzSFRNTCcsIHRydXN0QXNIVE1MKTtcblxuXHR0cnVzdEFzSFRNTC4kaW5qZWN0ID0gWyckc2NlJ107XG5cblx0ZnVuY3Rpb24gdHJ1c3RBc0hUTUwoJHNjZSkge1xuXHRcdHJldHVybiBmdW5jdGlvbih0ZXh0KSB7XG5cdFx0XHRyZXR1cm4gJHNjZS50cnVzdEFzSHRtbCh0ZXh0KTtcblx0XHR9O1xuXHR9XG59KCkpOyIsIihmdW5jdGlvbigpIHtcclxuXHQndXNlIHN0cmljdCc7XHJcblxyXG5cdGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ25nMS1ldmVudC1jYWxlbmRhcicpXHJcblx0XHQuY29udHJvbGxlcignSGVhZGVyQ3RybCcsIEhlYWRlckN0cmwpO1xyXG5cclxuXHRIZWFkZXJDdHJsLiRpbmplY3QgPSBbJyRsb2NhdGlvbicsICdKU09ORGF0YSddO1xyXG5cclxuXHRmdW5jdGlvbiBIZWFkZXJDdHJsKCRsb2NhdGlvbiwgSlNPTkRhdGEpIHtcclxuXHRcdC8vIGNvbnRyb2xsZXJBcyBWaWV3TW9kZWxcclxuXHRcdHZhciBoZWFkZXIgPSB0aGlzO1xyXG5cclxuXHRcdC8vIGJpbmRhYmxlIG1lbWJlcnNcclxuXHRcdGhlYWRlci5pbmRleElzQWN0aXZlID0gaW5kZXhJc0FjdGl2ZTtcclxuXHRcdGhlYWRlci5uYXZJc0FjdGl2ZSA9IG5hdklzQWN0aXZlO1xyXG5cclxuXHRcdF9pbml0KCk7XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBJTklUIGZ1bmN0aW9uIGV4ZWN1dGVzIHByb2NlZHVyYWwgY29kZVxyXG5cdFx0ICpcclxuXHRcdCAqIEBwcml2YXRlXHJcblx0XHQgKi9cclxuXHRcdGZ1bmN0aW9uIF9pbml0KCkge1xyXG5cdFx0XHQvLyBhY3RpdmF0ZSBjb250cm9sbGVyXHJcblx0XHRcdF9hY3RpdmF0ZSgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogQ29udHJvbGxlciBhY3RpdmF0ZVxyXG5cdFx0ICogR2V0IEpTT04gZGF0YVxyXG5cdFx0ICpcclxuXHRcdCAqIEByZXR1cm5zIHsqfVxyXG5cdFx0ICogQHByaXZhdGVcclxuXHRcdCAqL1xyXG5cdFx0ZnVuY3Rpb24gX2FjdGl2YXRlKCkge1xyXG5cdFx0XHQvLyBnZXQgdGhlIGRhdGEgZnJvbSBKU09OXHJcblx0XHRcdHJldHVybiBKU09ORGF0YS5nZXRMb2NhbERhdGEoKS50aGVuKF9nZXRKc29uU3VjY2Vzcyk7XHJcblx0XHR9XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBTdWNjZXNzZnVsIHByb21pc2UgZGF0YVxyXG5cdFx0ICpcclxuXHRcdCAqIEBwYXJhbSBkYXRhIHtqc29ufVxyXG5cdFx0ICogQHByaXZhdGVcclxuXHRcdCAqL1xyXG5cdFx0ZnVuY3Rpb24gX2dldEpzb25TdWNjZXNzKGRhdGEpIHtcclxuXHRcdFx0aGVhZGVyLmpzb24gPSBkYXRhO1xyXG5cdFx0XHRyZXR1cm4gaGVhZGVyLmpzb247XHJcblx0XHR9XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBBcHBseSBjbGFzcyB0byBpbmRleCBuYXYgaWYgYWN0aXZlXHJcblx0XHQgKlxyXG5cdFx0ICogQHBhcmFtIHtzdHJpbmd9IHBhdGhcclxuXHRcdCAqL1xyXG5cdFx0ZnVuY3Rpb24gaW5kZXhJc0FjdGl2ZShwYXRoKSB7XHJcblx0XHRcdC8vIHBhdGggc2hvdWxkIGJlICcvJ1xyXG5cdFx0XHRyZXR1cm4gJGxvY2F0aW9uLnBhdGgoKSA9PT0gcGF0aDtcclxuXHRcdH1cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIEFwcGx5IGNsYXNzIHRvIGN1cnJlbnRseSBhY3RpdmUgbmF2IGl0ZW1cclxuXHRcdCAqXHJcblx0XHQgKiBAcGFyYW0ge3N0cmluZ30gcGF0aFxyXG5cdFx0ICovXHJcblx0XHRmdW5jdGlvbiBuYXZJc0FjdGl2ZShwYXRoKSB7XHJcblx0XHRcdHJldHVybiAkbG9jYXRpb24ucGF0aCgpLnN1YnN0cigwLCBwYXRoLmxlbmd0aCkgPT09IHBhdGg7XHJcblx0XHR9XHJcblx0fVxyXG5cclxufSgpKTsiLCIoZnVuY3Rpb24oKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHRhbmd1bGFyXG5cdFx0Lm1vZHVsZSgnbmcxLWV2ZW50LWNhbGVuZGFyJylcblx0XHQuZGlyZWN0aXZlKCduYXZDb250cm9sJywgbmF2Q29udHJvbCk7XG5cblx0bmF2Q29udHJvbC4kaW5qZWN0ID0gWyckd2luZG93JywgJ3Jlc2l6ZSddO1xuXG5cdGZ1bmN0aW9uIG5hdkNvbnRyb2woJHdpbmRvdywgcmVzaXplKSB7XG5cdFx0Ly8gcmV0dXJuIGRpcmVjdGl2ZVxuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0VBJyxcblx0XHRcdGxpbms6IG5hdkNvbnRyb2xMaW5rXG5cdFx0fTtcblxuXHRcdC8qKlxuXHRcdCAqIG5hdkNvbnRyb2wgTElOSyBmdW5jdGlvblxuXHRcdCAqXG5cdFx0ICogQHBhcmFtICRzY29wZVxuXHRcdCAqL1xuXHRcdGZ1bmN0aW9uIG5hdkNvbnRyb2xMaW5rKCRzY29wZSkge1xuXHRcdFx0Ly8gcHJpdmF0ZSB2YXJpYWJsZXNcblx0XHRcdHZhciBfJGJvZHkgPSBhbmd1bGFyLmVsZW1lbnQoJ2JvZHknKTtcblx0XHRcdHZhciBfbGF5b3V0Q2FudmFzID0gXyRib2R5LmZpbmQoJy5sYXlvdXQtY2FudmFzJyk7XG5cdFx0XHR2YXIgX25hdk9wZW47XG5cblx0XHRcdC8vIGRhdGEgbW9kZWxcblx0XHRcdCRzY29wZS5uYXYgPSB7fTtcblxuXHRcdFx0X2luaXQoKTtcblxuXHRcdFx0LyoqXG5cdFx0XHQgKiBJTklUIGZ1bmN0aW9uIGV4ZWN1dGVzIHByb2NlZHVyYWwgY29kZVxuXHRcdFx0ICpcblx0XHRcdCAqIEBwcml2YXRlXG5cdFx0XHQgKi9cblx0XHRcdGZ1bmN0aW9uIF9pbml0KCkge1xuXHRcdFx0XHQvLyBpbml0aWFsaXplIGRlYm91bmNlZCByZXNpemVcblx0XHRcdFx0dmFyIF9ycyA9IHJlc2l6ZS5pbml0KHtcblx0XHRcdFx0XHRzY29wZTogJHNjb3BlLFxuXHRcdFx0XHRcdHJlc2l6ZWRGbjogX3Jlc2l6ZWQsXG5cdFx0XHRcdFx0ZGVib3VuY2U6IDEwMFxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHQkc2NvcGUuJG9uKCckbG9jYXRpb25DaGFuZ2VTdGFydCcsIF8kbG9jYXRpb25DaGFuZ2VTdGFydCk7XG5cdFx0XHRcdCRzY29wZS4kb24oJ2VudGVyLWxhcmdlJywgX2VudGVyTGFyZ2UpO1xuXHRcdFx0XHQkc2NvcGUuJG9uKCdleGl0LWxhcmdlJywgX2V4aXRMYXJnZSk7XG5cdFx0XHR9XG5cblx0XHRcdC8qKlxuXHRcdFx0ICogUmVzaXplZCB3aW5kb3cgKGRlYm91bmNlZClcblx0XHRcdCAqXG5cdFx0XHQgKiBAcHJpdmF0ZVxuXHRcdFx0ICovXG5cdFx0XHRmdW5jdGlvbiBfcmVzaXplZCgpIHtcblx0XHRcdFx0X2xheW91dENhbnZhcy5jc3Moe1xuXHRcdFx0XHRcdG1pbkhlaWdodDogJHdpbmRvdy5pbm5lckhlaWdodCArICdweCdcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblx0XHRcdC8qKlxuXHRcdFx0ICogT3BlbiBtb2JpbGUgbmF2aWdhdGlvblxuXHRcdFx0ICpcblx0XHRcdCAqIEBwcml2YXRlXG5cdFx0XHQgKi9cblx0XHRcdGZ1bmN0aW9uIF9vcGVuTmF2KCkge1xuXHRcdFx0XHRfJGJvZHlcblx0XHRcdFx0XHQucmVtb3ZlQ2xhc3MoJ25hdi1jbG9zZWQnKVxuXHRcdFx0XHRcdC5hZGRDbGFzcygnbmF2LW9wZW4nKTtcblxuXHRcdFx0XHRfbmF2T3BlbiA9IHRydWU7XG5cdFx0XHR9XG5cblx0XHRcdC8qKlxuXHRcdFx0ICogQ2xvc2UgbW9iaWxlIG5hdmlnYXRpb25cblx0XHRcdCAqXG5cdFx0XHQgKiBAcHJpdmF0ZVxuXHRcdFx0ICovXG5cdFx0XHRmdW5jdGlvbiBfY2xvc2VOYXYoKSB7XG5cdFx0XHRcdF8kYm9keVxuXHRcdFx0XHRcdC5yZW1vdmVDbGFzcygnbmF2LW9wZW4nKVxuXHRcdFx0XHRcdC5hZGRDbGFzcygnbmF2LWNsb3NlZCcpO1xuXG5cdFx0XHRcdF9uYXZPcGVuID0gZmFsc2U7XG5cdFx0XHR9XG5cblx0XHRcdC8qKlxuXHRcdFx0ICogVG9nZ2xlIG5hdiBvcGVuL2Nsb3NlZFxuXHRcdFx0ICovXG5cdFx0XHRmdW5jdGlvbiB0b2dnbGVOYXYoKSB7XG5cdFx0XHRcdGlmICghX25hdk9wZW4pIHtcblx0XHRcdFx0XHRfb3Blbk5hdigpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdF9jbG9zZU5hdigpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8qKlxuXHRcdFx0ICogV2hlbiBjaGFuZ2luZyBsb2NhdGlvbiwgY2xvc2UgdGhlIG5hdiBpZiBpdCdzIG9wZW5cblx0XHRcdCAqL1xuXHRcdFx0ZnVuY3Rpb24gXyRsb2NhdGlvbkNoYW5nZVN0YXJ0KCkge1xuXHRcdFx0XHRpZiAoX25hdk9wZW4pIHtcblx0XHRcdFx0XHRfY2xvc2VOYXYoKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvKipcblx0XHRcdCAqIEZ1bmN0aW9uIHRvIGV4ZWN1dGUgd2hlbiBlbnRlcmluZyBsYXJnZSBtZWRpYSBxdWVyeVxuXHRcdFx0ICogRGlzYWJsZSBtZW51IHRvZ2dsaW5nIGFuZCByZW1vdmUgYm9keSBjbGFzc2VzXG5cdFx0XHQgKlxuXHRcdFx0ICogQHByaXZhdGVcblx0XHRcdCAqL1xuXHRcdFx0ZnVuY3Rpb24gX2VudGVyTGFyZ2UobXEpIHtcblx0XHRcdFx0Ly8gdW5iaW5kIGZ1bmN0aW9uIHRvIHRvZ2dsZSBtb2JpbGUgbmF2aWdhdGlvbiBvcGVuL2Nsb3NlZFxuXHRcdFx0XHQkc2NvcGUubmF2LnRvZ2dsZU5hdiA9IG51bGw7XG5cblx0XHRcdFx0XyRib2R5LnJlbW92ZUNsYXNzKCduYXYtY2xvc2VkIG5hdi1vcGVuJyk7XG5cdFx0XHR9XG5cblx0XHRcdC8qKlxuXHRcdFx0ICogRnVuY3Rpb24gdG8gZXhlY3V0ZSB3aGVuIGV4aXRpbmcgbGFyZ2UgbWVkaWEgcXVlcnlcblx0XHRcdCAqIENsb3NlIG5hdiBhbmQgc2V0IHVwIG1lbnUgdG9nZ2xpbmcgZnVuY3Rpb25hbGl0eVxuXHRcdFx0ICpcblx0XHRcdCAqIEBwcml2YXRlXG5cdFx0XHQgKi9cblx0XHRcdGZ1bmN0aW9uIF9leGl0TGFyZ2UobXEpIHtcblx0XHRcdFx0X2Nsb3NlTmF2KCk7XG5cblx0XHRcdFx0Ly8gYmluZCBmdW5jdGlvbiB0byB0b2dnbGUgbW9iaWxlIG5hdmlnYXRpb24gb3Blbi9jbG9zZWRcblx0XHRcdFx0JHNjb3BlLm5hdi50b2dnbGVOYXYgPSB0b2dnbGVOYXY7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cbn0oKSk7IiwiKGZ1bmN0aW9uKCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0YW5ndWxhclxuXHRcdC5tb2R1bGUoJ25nMS1ldmVudC1jYWxlbmRhcicpXG5cdFx0LmNvbnRyb2xsZXIoJ0Vycm9yNDA0Q3RybCcsIEVycm9yNDA0Q3RybCk7XG5cblx0RXJyb3I0MDRDdHJsLiRpbmplY3QgPSBbJyRzY29wZScsICdNZXRhZGF0YSddO1xuXG5cdGZ1bmN0aW9uIEVycm9yNDA0Q3RybCgkc2NvcGUsIE1ldGFkYXRhKSB7XG5cdFx0dmFyIGU0MDQgPSB0aGlzO1xuXG5cdFx0Ly8gYmluZGFibGUgbWVtYmVyc1xuXHRcdGU0MDQudGl0bGUgPSAnNDA0IC0gUGFnZSBOb3QgRm91bmQnO1xuXG5cdFx0X2luaXQoKTtcblxuXHRcdC8qKlxuXHRcdCAqIElOSVQgZnVuY3Rpb24gZXhlY3V0ZXMgcHJvY2VkdXJhbCBjb2RlXG5cdFx0ICpcblx0XHQgKiBAcHJpdmF0ZVxuXHRcdCAqL1xuXHRcdGZ1bmN0aW9uIF9pbml0KCkge1xuXHRcdFx0Ly8gc2V0IHBhZ2UgPHRpdGxlPlxuXHRcdFx0TWV0YWRhdGEuc2V0KGU0MDQudGl0bGUsICdlcnJvcicsICdFcnJvciA0MDQgLSBwYWdlIG5vdCBmb3VuZCcpO1xuXG5cdFx0XHQvLyBubyBkYXRhIHRvIGxvYWQsIGJ1dCBsb2FkaW5nIHN0YXRlIG1pZ2h0IGJlIG9uXG5cdFx0XHQkc2NvcGUuJGVtaXQoJ2xvYWRpbmctb2ZmJyk7XG5cdFx0fVxuXHR9XG59KCkpOyIsIihmdW5jdGlvbigpIHtcclxuXHQndXNlIHN0cmljdCc7XHJcblxyXG5cdGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ25nMS1ldmVudC1jYWxlbmRhcicpXHJcblx0XHQuY29udHJvbGxlcignSG9tZUN0cmwnLCBIb21lQ3RybCk7XHJcblxyXG5cdEhvbWVDdHJsLiRpbmplY3QgPSBbJyRzY29wZScsICdVdGlscycsICdNUScsICdtZWRpYUNoZWNrJywgJ01ldGFkYXRhJywgJ0pTT05EYXRhJ107XHJcblxyXG5cdGZ1bmN0aW9uIEhvbWVDdHJsKCRzY29wZSwgVXRpbHMsIE1RLCBtZWRpYUNoZWNrLCBNZXRhZGF0YSwgSlNPTkRhdGEpIHtcclxuXHRcdC8vIGNvbnRyb2xsZXJBcyBWaWV3TW9kZWxcclxuXHRcdHZhciBob21lID0gdGhpcztcclxuXHJcblx0XHQvLyBTZXQgdXAgZnVuY3Rpb25hbGl0eSB0byBydW4gb24gZW50ZXIvZXhpdCBvZiBtZWRpYSBxdWVyeVxyXG5cdFx0dmFyIF9tYyA9IG1lZGlhQ2hlY2suaW5pdCh7XHJcblx0XHRcdHNjb3BlOiAkc2NvcGUsXHJcblx0XHRcdG1lZGlhOiB7XHJcblx0XHRcdFx0bXE6IE1RLkxBUkdFLFxyXG5cdFx0XHRcdGVudGVyOiBfZW50ZXJMYXJnZSxcclxuXHRcdFx0XHRleGl0OiBfZXhpdExhcmdlXHJcblx0XHRcdH0sXHJcblx0XHRcdGRlYm91bmNlOiAyMDBcclxuXHRcdH0pO1xyXG5cclxuXHRcdC8vIGJpbmRhYmxlIG1lbWJlcnNcclxuXHRcdGhvbWUudGl0bGUgPSAnSG9tZSc7XHJcblx0XHRob21lLmdsb2JhbCA9IFV0aWxzO1xyXG5cdFx0aG9tZS5uYW1lID0gJ1Zpc2l0b3InO1xyXG5cdFx0aG9tZS5hbGVydEdyZWV0aW5nID0gVXRpbHMuYWxlcnRHcmVldGluZztcclxuXHRcdGhvbWUuc3RyaW5nT2ZIVE1MID0gJzxzdHJvbmcgc3R5bGU9XCJjb2xvcjogZ3JlZW47XCI+U29tZSBncmVlbiB0ZXh0PC9zdHJvbmc+IGJvdW5kIGFzIEhUTUwgd2l0aCBhIDxhIGhyZWY9XCIjXCI+bGluazwvYT4sIHRydXN0ZWQgd2l0aCBTQ0UhJztcclxuXHRcdGhvbWUudmlld2Zvcm1hdCA9IG51bGw7XHJcblxyXG5cdFx0X2luaXQoKTtcclxuXHJcblx0XHQvKipcclxuXHRcdCAqIElOSVQgZnVuY3Rpb24gZXhlY3V0ZXMgcHJvY2VkdXJhbCBjb2RlXHJcblx0XHQgKlxyXG5cdFx0ICogQHByaXZhdGVcclxuXHRcdCAqL1xyXG5cdFx0ZnVuY3Rpb24gX2luaXQoKSB7XHJcblx0XHRcdC8vIHNldCBwYWdlIDx0aXRsZT5cclxuXHRcdFx0TWV0YWRhdGEuc2V0KGhvbWUudGl0bGUsICduZzEtZXZlbnQtY2FsZW5kYXItYW5ndWxhciwgYW5ndWxhcmpzLCBqYXZhc2NyaXB0LCBib2lsZXJwbGF0ZSwgc3BhLCBkZW1vLCBhcHAsIGFwcGxpY2F0aW9uJywgJ25nMS1ldmVudC1jYWxlbmRhci1hbmd1bGFyIGRlbW8gYXBwbGljYXRpb24nKTtcclxuXHJcblx0XHRcdC8vIGFjdGl2YXRlIGNvbnRyb2xsZXJcclxuXHRcdFx0X2FjdGl2YXRlKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBDb250cm9sbGVyIGFjdGl2YXRlXHJcblx0XHQgKiBHZXQgSlNPTiBkYXRhXHJcblx0XHQgKlxyXG5cdFx0ICogQHJldHVybnMgeyp9XHJcblx0XHQgKiBAcHJpdmF0ZVxyXG5cdFx0ICovXHJcblx0XHRmdW5jdGlvbiBfYWN0aXZhdGUoKSB7XHJcblx0XHRcdC8vIHN0YXJ0IGxvYWRpbmdcclxuXHRcdFx0JHNjb3BlLiRlbWl0KCdsb2FkaW5nLW9uJyk7XHJcblxyXG5cdFx0XHQvLyBnZXQgdGhlIGRhdGEgZnJvbSBKU09OXHJcblx0XHRcdHJldHVybiBKU09ORGF0YS5nZXRMb2NhbERhdGEoKS50aGVuKF9nZXRKc29uU3VjY2Vzcyk7XHJcblx0XHR9XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBTdWNjZXNzZnVsIHByb21pc2UgZGF0YVxyXG5cdFx0ICpcclxuXHRcdCAqIEBwYXJhbSBkYXRhIHtqc29ufVxyXG5cdFx0ICogQHByaXZhdGVcclxuXHRcdCAqL1xyXG5cdFx0ZnVuY3Rpb24gX2dldEpzb25TdWNjZXNzKGRhdGEpIHtcclxuXHRcdFx0aG9tZS5qc29uID0gZGF0YTtcclxuXHJcblx0XHRcdC8vIHN0b3AgbG9hZGluZ1xyXG5cdFx0XHQkc2NvcGUuJGVtaXQoJ2xvYWRpbmctb2ZmJyk7XHJcblxyXG5cdFx0XHRyZXR1cm4gaG9tZS5qc29uO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogRW50ZXIgbGFyZ2UgbXFcclxuXHRcdCAqIFNldCBob21lLnZpZXdmb3JtYXRcclxuXHRcdCAqXHJcblx0XHQgKiBAcHJpdmF0ZVxyXG5cdFx0ICovXHJcblx0XHRmdW5jdGlvbiBfZW50ZXJMYXJnZSgpIHtcclxuXHRcdFx0aG9tZS52aWV3Zm9ybWF0ID0gJ2xhcmdlJztcclxuXHRcdH1cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIEV4aXQgbGFyZ2UgbXFcclxuXHRcdCAqIFNldCBob21lLnZpZXdmb3JtYXRcclxuXHRcdCAqXHJcblx0XHQgKiBAcHJpdmF0ZVxyXG5cdFx0ICovXHJcblx0XHRmdW5jdGlvbiBfZXhpdExhcmdlKCkge1xyXG5cdFx0XHRob21lLnZpZXdmb3JtYXQgPSAnc21hbGwnO1xyXG5cdFx0fVxyXG5cdH1cclxufSgpKTsiLCIoZnVuY3Rpb24oKSB7XHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHRhbmd1bGFyXHJcblx0XHQubW9kdWxlKCduZzEtZXZlbnQtY2FsZW5kYXInKVxyXG5cdFx0LmNvbnRyb2xsZXIoJ1N1YkN0cmwnLCBTdWJDdHJsKTtcclxuXHJcblx0U3ViQ3RybC4kaW5qZWN0ID0gWydVdGlscycsICdNZXRhZGF0YScsICdyZXNvbHZlTG9jYWxEYXRhJ107XHJcblxyXG5cdGZ1bmN0aW9uIFN1YkN0cmwoVXRpbHMsIE1ldGFkYXRhLCByZXNvbHZlTG9jYWxEYXRhKSB7XHJcblx0XHQvLyBjb250cm9sbGVyQXMgVmlld01vZGVsXHJcblx0XHR2YXIgc3ViID0gdGhpcztcclxuXHJcblx0XHQvLyBiaW5kYWJsZSBtZW1iZXJzXHJcblx0XHRzdWIudGl0bGUgPSAnU3VicGFnZSc7XHJcblx0XHRzdWIuZ2xvYmFsID0gVXRpbHM7XHJcblx0XHRzdWIuanNvbiA9IHJlc29sdmVMb2NhbERhdGE7XHJcblxyXG5cdFx0X2luaXQoKTtcclxuXHJcblx0XHQvKipcclxuXHRcdCAqIElOSVQgZnVuY3Rpb24gZXhlY3V0ZXMgcHJvY2VkdXJhbCBjb2RlXHJcblx0XHQgKlxyXG5cdFx0ICogQHByaXZhdGVcclxuXHRcdCAqL1xyXG5cdFx0ZnVuY3Rpb24gX2luaXQoKSB7XHJcblx0XHRcdC8vIHNldCBwYWdlIDx0aXRsZT5cclxuXHRcdFx0TWV0YWRhdGEuc2V0KHN1Yi50aXRsZSwgJ2FuZ3VsYXJqcywgc3VicGFnZScsICduZzEtZXZlbnQtY2FsZW5kYXItYW5ndWxhciBzYW1wbGUgc3VicGFnZSB3aXRoIGRpcmVjdGl2ZSBhbmQgdHJhbnNjbHVzaW9uLicpO1xyXG5cdFx0fVxyXG5cdH1cclxufSgpKTsiLCIvKipcclxuICogRGlyZWN0aXZlcyAoYW5kIGFzc29jaWF0ZWQgYXR0cmlidXRlcykgYXJlIGFsd2F5cyBkZWNsYXJlZCBhcyBjYW1lbENhc2UgaW4gSlMgYW5kIHNuYWtlLWNhc2UgaW4gSFRNTFxyXG4gKiBBbmd1bGFyJ3MgYnVpbHQtaW4gPGE+IGRpcmVjdGl2ZSBhdXRvbWF0aWNhbGx5IGltcGxlbWVudHMgcHJldmVudERlZmF1bHQgb24gbGlua3MgdGhhdCBkb24ndCBoYXZlIGFuIGhyZWYgYXR0cmlidXRlXHJcbiAqIENvbXBsZXggSmF2YVNjcmlwdCBET00gbWFuaXB1bGF0aW9uIHNob3VsZCBhbHdheXMgYmUgZG9uZSBpbiBkaXJlY3RpdmUgbGluayBmdW5jdGlvbnMsIGFuZCAkYXBwbHkgc2hvdWxkIG5ldmVyIGJlIHVzZWQgaW4gYSBjb250cm9sbGVyISBTaW1wbGUgRE9NIG1hbmlwdWxhdGlvbiBzaG91bGQgYmUgaW4gdGhlIHZpZXcuXHJcbiAqL1xyXG5cclxuLyotLS0gU2FtcGxlIERpcmVjdGl2ZSB3aXRoIGEgJHdhdGNoIC0tLSovXHJcbihmdW5jdGlvbigpIHtcclxuXHQndXNlIHN0cmljdCc7XHJcblxyXG5cdGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ25nMS1ldmVudC1jYWxlbmRhcicpXHJcblx0XHQuZGlyZWN0aXZlKCdzYW1wbGVEaXJlY3RpdmUnLCBzYW1wbGVEaXJlY3RpdmUpO1xyXG5cclxuXHRzYW1wbGVEaXJlY3RpdmUuJGluamVjdCA9IFsnJHRpbWVvdXQnXTtcclxuXHJcblx0ZnVuY3Rpb24gc2FtcGxlRGlyZWN0aXZlKCR0aW1lb3V0KSB7XHJcblx0XHQvLyByZXR1cm4gZGlyZWN0aXZlXHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRyZXN0cmljdDogJ0VBJyxcclxuXHRcdFx0cmVwbGFjZTogdHJ1ZSxcclxuXHRcdFx0c2NvcGU6IHt9LFxyXG5cdFx0XHR0ZW1wbGF0ZVVybDogJ25nMS1ldmVudC1jYWxlbmRhci9wYWdlcy9zdWIvc2FtcGxlLnRwbC5odG1sJyxcclxuXHRcdFx0dHJhbnNjbHVkZTogdHJ1ZSxcclxuXHRcdFx0Y29udHJvbGxlcjogU2FtcGxlRGlyZWN0aXZlQ3RybCxcclxuXHRcdFx0Y29udHJvbGxlckFzOiAnc2QnLFxyXG5cdFx0XHRiaW5kVG9Db250cm9sbGVyOiB7XHJcblx0XHRcdFx0anNvbkRhdGE6ICc9J1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRsaW5rOiBzYW1wbGVEaXJlY3RpdmVMaW5rXHJcblx0XHR9O1xyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogc2FtcGxlRGlyZWN0aXZlIExJTksgZnVuY3Rpb25cclxuXHRcdCAqXHJcblx0XHQgKiBAcGFyYW0gJHNjb3BlXHJcblx0XHQgKiBAcGFyYW0gJGVsZW1lbnRcclxuXHRcdCAqIEBwYXJhbSAkYXR0cnNcclxuXHRcdCAqIEBwYXJhbSBzZCB7Y29udHJvbGxlcn1cclxuXHRcdCAqL1xyXG5cdFx0ZnVuY3Rpb24gc2FtcGxlRGlyZWN0aXZlTGluaygkc2NvcGUsICRlbGVtZW50LCAkYXR0cnMsIHNkKSB7XHJcblx0XHRcdF9pbml0KCk7XHJcblxyXG5cdFx0XHQvKipcclxuXHRcdFx0ICogSU5JVCBmdW5jdGlvbiBleGVjdXRlcyBwcm9jZWR1cmFsIGNvZGVcclxuXHRcdFx0ICpcclxuXHRcdFx0ICogQHByaXZhdGVcclxuXHRcdFx0ICovXHJcblx0XHRcdGZ1bmN0aW9uIF9pbml0KCkge1xyXG5cdFx0XHRcdC8vIHdhdGNoIGZvciBhc3luYyBkYXRhIHRvIGJlY29tZSBhdmFpbGFibGUgYW5kIHVwZGF0ZVxyXG5cdFx0XHRcdCRzY29wZS4kd2F0Y2goJ3NkLmpzb25EYXRhJywgXyR3YXRjaEpzb25EYXRhKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0LyoqXHJcblx0XHRcdCAqICR3YXRjaCBmb3Igc2QuanNvbkRhdGEgdG8gYmVjb21lIGF2YWlsYWJsZVxyXG5cdFx0XHQgKlxyXG5cdFx0XHQgKiBAcGFyYW0gbmV3VmFsIHsqfVxyXG5cdFx0XHQgKiBAcGFyYW0gb2xkVmFsIHsqfVxyXG5cdFx0XHQgKiBAcHJpdmF0ZVxyXG5cdFx0XHQgKi9cclxuXHRcdFx0ZnVuY3Rpb24gXyR3YXRjaEpzb25EYXRhKG5ld1ZhbCwgb2xkVmFsKSB7XHJcblx0XHRcdFx0aWYgKG5ld1ZhbCkge1xyXG5cdFx0XHRcdFx0c2QuanNvbkRhdGEgPSBuZXdWYWw7XHJcblxyXG5cdFx0XHRcdFx0JHRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKCdkZW1vbnN0cmF0ZSAkdGltZW91dCBpbmplY3Rpb24gaW4gYSBkaXJlY3RpdmUgbGluayBmdW5jdGlvbicpO1xyXG5cdFx0XHRcdFx0fSwgMTAwMCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRTYW1wbGVEaXJlY3RpdmVDdHJsLiRpbmplY3QgPSBbXTtcclxuXHQvKipcclxuXHQgKiBzYW1wbGVEaXJlY3RpdmUgQ09OVFJPTExFUlxyXG5cdCAqL1xyXG5cdGZ1bmN0aW9uIFNhbXBsZURpcmVjdGl2ZUN0cmwoKSB7XHJcblx0XHR2YXIgc2QgPSB0aGlzO1xyXG5cclxuXHRcdC8vIGNvbnRyb2xsZXIgbG9naWMgZ29lcyBoZXJlXHJcblx0fVxyXG5cclxufSgpKTsiXX0=
