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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImhlbHBlcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJzY3JpcHRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xyXG5cclxud2luZG93LmhlbHBlcnMgPSAoZnVuY3Rpb24oKSB7XHJcblxyXG5cdGluaXQoKTtcclxuXHJcblx0LyoqXHJcblx0ICogZnVuY3Rpb24gaW5pdCgpXHJcblx0ICpcclxuXHQgKiBJbml0aWFsaXplIHB1YmxpYyB3aW5kb3cuaGVscGVycyBmdW5jdGlvbnNcclxuXHQgKi9cclxuXHRmdW5jdGlvbiBpbml0KCkge1xyXG5cdFx0Zml4QnJvd3NlcnMoKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIGZ1bmN0aW9uIGZpeEJyb3dzZXJzKClcclxuXHQgKlxyXG5cdCAqIEZpeCBicm93c2VyIHdlaXJkbmVzc1xyXG5cdCAqIENvcnJlY3QgTW9kZXJuaXpyIGJ1Z3NcclxuXHQgKi9cclxuXHRmdW5jdGlvbiBmaXhCcm93c2VycygpIHtcclxuXHRcdHZhciB1YSA9IG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKTtcclxuXHRcdHZhciBjaHJvbWUgPSB1YS5sYXN0SW5kZXhPZignY2hyb21lLycpID4gMDtcclxuXHRcdHZhciBjaHJvbWV2ZXJzaW9uID0gbnVsbDtcclxuXHRcdHZhciBodG1sRWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdodG1sJylbMF07XHJcblx0XHRcclxuXHRcdC8vIE1vZGVybml6ciBidWc6IENocm9tZSBnaXZlcyBhIGZhbHNlIG5lZ2F0aXZlIGZvciBjc3N0cmFuc2Zvcm1zM2Qgc3VwcG9ydFxyXG5cdFx0Ly8gR29vZ2xlIGRvZXMgbm90IHBsYW4gdG8gZml4IHRoaXM7IGh0dHBzOi8vY29kZS5nb29nbGUuY29tL3AvY2hyb21pdW0vaXNzdWVzL2RldGFpbD9pZD0xMjkwMDRcclxuXHRcdGlmIChjaHJvbWUpIHtcclxuXHRcdFx0Y2hyb21ldmVyc2lvbiA9IHVhLnN1YnN0cih1YS5sYXN0SW5kZXhPZignY2hyb21lLycpICsgNywgMik7XHJcblx0XHRcdGlmIChjaHJvbWV2ZXJzaW9uID49IDEyKSB7XHJcblx0XHRcdFx0aHRtbEVsZW0uY2xhc3NMaXN0LnJlbW92ZSgnbm8tY3NzdHJhbnNmb3JtczNkJyk7XHJcblx0XHRcdFx0aHRtbEVsZW0uY2xhc3NMaXN0LmFkZCgnY3NzdHJhbnNmb3JtczNkJyk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcbn0oKSk7Il19
