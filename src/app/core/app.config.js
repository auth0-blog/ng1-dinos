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