// question/directives.js
onlineTestsApp
    .directive('question', function () {
        return {
            restrict: 'E',
            scope: {
                question: '=question',
                render: '=render',
                htmlContent: '=htmlContent'
            },
            templateUrl: '/OnlineDW/js/Question/templates/question.html'
        };
    })
    .directive("ngScopeElement", function () {
        var directiveDefinitionObject = {

            restrict: "A",

            compile: function compile(tElement, tAttrs, transclude) {
                return {
                    pre: function preLink(scope, iElement, iAttrs, controller) {
                        scope[iAttrs.ngScopeElement] = iElement;
                    }
                };
            }
        };

        return directiveDefinitionObject;
    });
