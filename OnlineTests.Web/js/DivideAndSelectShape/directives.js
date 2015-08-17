
onlineTestsApp.directive('divideAndSelectShape', ['$timeout', 'questionSrvc', 'divideAndSelectShapeSrvc', function ($timeout, questionSrvc, divideAndSelectShapeSrvc) {
    return {
        restrict: 'E',
        replace: false,
        scope: true,
        link: function (scope, element, attrs) {
            scope.title = 'Divide and Select Shape';
            scope.question = 'divide-and-select-shape';

            scope.shapeTypes = [
                { id: 'none', name: '-- Select an option --' },
                { id: 'polygon-shape', name: 'Polygon' },
                { id: 'circle-shape', name: 'Circle' },
                { id: 'rectangle-shape', name: 'Rectangle' },
                { id: 'star-shape', name: 'Star' }
            ];

            scope.answerModes = [
                { id: '0', name: 'Quantity of selected sectors only' },
                { id: '1', name: 'Position and number of selected sectors' }
            ];

            scope.divisionTypes = [
                { id: '0', name: 'Horizontal/Vertical' },
                { id: '1', name: 'Diagonal'}
            ];

            scope.getEngine = function (settings) {
                var container = null;
                switch (settings.shapeType.id) {
                    case 'polygon-shape':
                        container = scope.polygonShapeDrawingContainer[0];
                        break;
                    case 'circle-shape':
                        container = scope.circleShapeDrawingContainer[0];
                        break;
                    case 'rectangle-shape':
                        container = scope.rectangleShapeDrawingContainer[0];
                        break;
                    case 'star-shape':
                        container = scope.starShapeDrawingContainer[0];
                        break;
                    default:
                }
                scope.engine = new DivideAndSelectShape(Raphael, container, settings, scope);
                scope.engine.reset(settings);
                scope.engine.redraw(settings);
            };

            scope.shapeTypeChanged = function (value) {
                scope.getEngine(scope.settings);
            };

            scope.$on('viewModeChanged', function (event, viewMode) {
                scope.engine.setViewMode(viewMode);
            });

            scope.$on('submitAnswerFromPreview', function (event) {
                scope.engine.submitAnswerFromPreview();
            });

            scope.$on('save', function (event) {
                questionSrvc.save(scope.engine.exportJson(scope.engine.settings));
            });

            scope.init = function (event, args) {
                var backendSettings = $('#vmSettings').val();
                if (backendSettings != "") {
                    var parsedSettings = JSON.parse(backendSettings);
                    scope.$emit("initParent", parsedSettings);
                    scope.settings = parsedSettings.Settings;
                    scope.settings.id = parsedSettings.QuestionId;
                    $("#hfQBody").val(parsedSettings.QuestionText);
                    $("#divQBody").html(parsedSettings.QuestionText);
                    //scope.questionText = parsedSettings.QuestionText;
                    //scope.settings.questionText = parsedSettings.QuestionText;
                    //scope.questionId = parsedSettings.QuestionId;
                    //scope.questionNotes = parsedSettings.Notes;
                    divideAndSelectShapeSrvc.completeSettings(scope.settings);
                    scope.getEngine(scope.settings);
                }
                else {
                    scope.settings = divideAndSelectShapeSrvc.getEmptyQuestion();
                }
            };

            scope.init();

            //$timeout(function () {
            //    scope.init();
            //}, 300, false);

        },
        //templateUrl: '/OnlineDW/js/DivideAndSelectShape/templates/divideAndSelectShape.html'
        templateUrl: '/OnlineDW/home/DivideAndSelectShapeTemplate'
    }
}])
.directive('ngScopeElement', function () {
    var directiveDefinitionObject = {
        restrict: 'A',
        compile: function compile(tElement, tAttrs, transclude) {
            return {
                pre: function preLink(scope, iElement, iAttrs, controller) {
                    scope[iAttrs.ngScopeElement] = iElement;
                }
            }
        }
    };

    return directiveDefinitionObject;
})
.directive('staticInclude', function ($http, $templateCache, $compile) {
    return function (scope, element, attrs) {
        var templatePath = attrs.staticInclude;
        $http.get(templatePath, { cache: $templateCache }).success(function (response) {
            var contents = element.html(response).contents();
            $compile(contents)(scope);
        });
    };
});