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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImhlbHBlcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJzY3JpcHRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xyXG5cclxud2luZG93LmhlbHBlcnMgPSAoZnVuY3Rpb24oKSB7XHJcblxyXG4gIGluaXQoKTtcclxuXHJcbiAgLyoqXHJcbiAgICogZnVuY3Rpb24gaW5pdCgpXHJcbiAgICpcclxuICAgKiBJbml0aWFsaXplIHB1YmxpYyB3aW5kb3cuaGVscGVycyBmdW5jdGlvbnNcclxuICAgKi9cclxuICBmdW5jdGlvbiBpbml0KCkge1xyXG4gICAgZml4QnJvd3NlcnMoKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIGZ1bmN0aW9uIGZpeEJyb3dzZXJzKClcclxuICAgKlxyXG4gICAqIEZpeCBicm93c2VyIHdlaXJkbmVzc1xyXG4gICAqIENvcnJlY3QgTW9kZXJuaXpyIGJ1Z3NcclxuICAgKi9cclxuICBmdW5jdGlvbiBmaXhCcm93c2VycygpIHtcclxuICAgIHZhciB1YSA9IG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKTtcclxuICAgIHZhciBjaHJvbWUgPSB1YS5sYXN0SW5kZXhPZignY2hyb21lLycpID4gMDtcclxuICAgIHZhciBjaHJvbWV2ZXJzaW9uID0gbnVsbDtcclxuICAgIHZhciBodG1sRWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdodG1sJylbMF07XHJcbiAgICBcclxuICAgIC8vIE1vZGVybml6ciBidWc6IENocm9tZSBnaXZlcyBhIGZhbHNlIG5lZ2F0aXZlIGZvciBjc3N0cmFuc2Zvcm1zM2Qgc3VwcG9ydFxyXG4gICAgLy8gR29vZ2xlIGRvZXMgbm90IHBsYW4gdG8gZml4IHRoaXM7IGh0dHBzOi8vY29kZS5nb29nbGUuY29tL3AvY2hyb21pdW0vaXNzdWVzL2RldGFpbD9pZD0xMjkwMDRcclxuICAgIGlmIChjaHJvbWUpIHtcclxuICAgICAgY2hyb21ldmVyc2lvbiA9IHVhLnN1YnN0cih1YS5sYXN0SW5kZXhPZignY2hyb21lLycpICsgNywgMik7XHJcbiAgICAgIGlmIChjaHJvbWV2ZXJzaW9uID49IDEyKSB7XHJcbiAgICAgICAgaHRtbEVsZW0uY2xhc3NMaXN0LnJlbW92ZSgnbm8tY3NzdHJhbnNmb3JtczNkJyk7XHJcbiAgICAgICAgaHRtbEVsZW0uY2xhc3NMaXN0LmFkZCgnY3NzdHJhbnNmb3JtczNkJyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn0oKSk7Il19
