'use strict';
/* App Controllers */

// Declare app level module which depends on filters, and services

var onlineTestsApp = angular.module('onlineTestApp', ['ngSanitize', 'ui.bootstrap', 'ngCkeditor', 'angularFileUpload', 'angularSpectrumColorpicker'
 //   'onlineTestApp.controllers'
]);

// enable html5Mode for pushstate ('#'-less URLs) 
//// been able to read the the id on Edit mode from the MVC urls (http://localhost:4444/home/edit/971830)
//onlineTestsApp.config(['$locationProvider', function onlineTestsAppConfig($locationProvider) {

//    //$routeProvider
//    //    .when(
//    //    '/', {
//    //        redirectTo: '/home'
//    //    })
//    //    .when('/home', {
//    //        templateUrl: 'templates/home.html'
//    //    })
//    //    .when('/login', {
//    //        templateUrl: 'templates/login.html'
//    //    })
//    //    .when('/news', {
//    //        templateUrl: 'templates/news.html'
//    //    })
//    //    .when('/news/archive', {
//    //        templateUrl: 'templates/newsarchive.html'
//    //    })
//    //    // removed other routes ... *snip
//    //    .otherwise({
//    //        redirectTo: '/home'
//    //    }
//    //);

//    $locationProvider.html5Mode({
//        enabled: true,
//        requireBase: false
//    });
//    //$locationProvider.hashPrefix('!');

//}]);

