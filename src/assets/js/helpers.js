'use strict';

window.helpers = (function() {

	init();

	/**
	 * function init()
	 *
	 * Initialize public window.helpers functions
	 */
	function init() {
		fixBrowsers();
	}

	/**
	 * function fixBrowsers()
	 *
	 * Fix browser weirdness
	 * Correct Modernizr bugs
	 */
	function fixBrowsers() {
		var ua = navigator.userAgent.toLowerCase();
		var chrome = ua.lastIndexOf('chrome/') > 0;
		var chromeversion = null;
		var htmlElem = document.getElementsByTagName('html')[0];
		
		// Modernizr bug: Chrome gives a false negative for csstransforms3d support
		// Google does not plan to fix this; https://code.google.com/p/chromium/issues/detail?id=129004
		if (chrome) {
			chromeversion = ua.substr(ua.lastIndexOf('chrome/') + 7, 2);
			if (chromeversion >= 12) {
				htmlElem.classList.remove('no-csstransforms3d');
				htmlElem.classList.add('csstransforms3d');
			}
		}
	}
}());