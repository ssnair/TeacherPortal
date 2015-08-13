/// <reference path="templates/my-template.html" />
angular.module('myApp', [])
.directive('my-directive', function () {
    return {
        restrict: 'E',
        templateUrl: 'templates/my-template.html'
    }
});