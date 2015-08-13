//questionsContainer/directives.js

onlineTestsApp.directive("questionsContainer", function () {
    return {
        restrict: 'E',
        templateUrl: '/js/QuestionsContainer/templates/questionsContainer.html'
    };
});

onlineTestsApp.directive("addQuestionButton", function () {
    return {
        restrict: 'E',
        templateUrl: '/js/QuestionsContainer/templates/addQuestionButton.html'
    };
});

onlineTestsApp.directive("addQuestion", function ($compile) {
    return function (scope, element, attrs) {
        element.bind("click", function () {
            scope.count++;
            angular
                .element(document.getElementById("questionsContainer"))
                .append($compile("<div><button data-alert=" + scope.count + ">Show Alert #" + scope.count + "</button></div>")(scope));
        });
    };
});

onlineTestsApp.directive("alert", function () {
    return function (scope, element, attrs) {
        element.bind("click", function () {
            console.log(attrs);
            alert("This is alert #" + attrs.alert);
        });
    };
});

