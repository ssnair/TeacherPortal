// drawLinesInAChart/directives.js

onlineTestsApp.directive('drawLinesInAChart', ['$timeout', 'questionSrvc', 'drawLinesInAChartSrvc', function ($timeout, questionSrvc, drawLinesInAChartSrvc) {
    return {
        restrict: 'E',
        replace: true,
        scope: true,
        templateUrl: '/OnlineDW/js/DrawPointsInAChart/templates/drawLinesInAChart.html',
        link: function (scope, element, attrs) {
            scope.title = "Draw Points In A Chart";
            scope.questionType = "draw-lines-in-a-chart";

            scope.$watch('settings.grid.width', function () {
                //                scope.circle.attr({ cx: scope.diameter });
                //  scope.engine.redraw();
            });

            scope.scaleModes = [
                { id: 'none', name: 'None' },
                { id: 'scale', name: 'X, Y Scale' },
                { id: 'cartesian', name: 'Cartesian axis' }
            ];

            scope.distanceBetweenTwoPoints_distanceTypes = [
                { id: 'horizontal', name: 'Horizontal' },
                { id: 'vertical', name: 'Vertical' },
                { id: 'diagonal', name: 'Diagonal' },
                { id: 'horizontal-or-vertical', name: 'Horizontal or Vertical' },
                { id: 'any', name: 'Any ' }
            ];

            scope.answerTypes = [
                { id: 'points-in-the-same-position', name: 'Points in the same position' },
                { id: 'distance-between-two-points', name: 'Distance between two points' }
            ];

            scope.objectTypes = [
                { id: 'select', name: 'Select', action: 'select', teacherOnly: false },
                { id: 'delete', name: 'Delete', action: 'delete', teacherOnly: false },
                { id: 'point', name: 'Point', action: 'add-point', teacherOnly: false },
                { id: 'line', name: 'Line', action: 'add-line', teacherOnly: false },
                { id: 'arrow', name: 'Single Arrow', action: 'add-arrow', teacherOnly: false },
                { id: 'double-arrow', name: 'Double Arrow', action: 'add-double-arrow', teacherOnly: false },
                { id: 'fixed-line', name: 'Fixed line', action: 'add-fixed-line', teacherOnly: true }
                //{ id: 'rectangle', name: 'Rectangle', action: 'add-rectangle' }
            ];


            scope.setContainer = function (elem) {
                scope.container = elem;
            };

            scope.getEngine = function (settings) {
                scope.engine = new DrawLinesInAChart(Raphael, scope.drawingContainer[0], settings, scope);
                scope.engine.redraw(settings);
            };

            scope.setAction = function (action) {
                if (scope.settings.currentAction == action) {
                    scope.settings.currentAction = "select"
                } else {
                    scope.settings.currentAction = action;
                }
                scope.engine.setAction(scope.settings);
            };

            scope.$on("viewModeChanged", function (event, viewMode) {
                scope.engine.setViewMode(scope.settings, viewMode);
            });

            scope.$on("submitAnswerFromPreview", function (event) {
                scope.engine.submitAnswerFromPreview(scope.settings);
            });

            scope.$on('save', function (event) {
                questionSrvc.save(scope.engine.exportJson(scope.engine.settings));
            });

            scope.init = function (event, args) {
                var backendSettings = $('#vmSettings').val();
                if (backendSettings != "") {
                    var parsedSettings = JSON.parse(backendSettings);
                    //scope.questionText = parsedSettings.QuestionText;
                    scope.$emit("initParent", parsedSettings);
                    scope.settings = parsedSettings.Settings;
                    scope.settings.id = parsedSettings.QuestionId;
                    $("#hfQBody").val(parsedSettings.QuestionText);
                    $("#divQBody").html(parsedSettings.QuestionText);
                    //scope.settings.questionText = parsedSettings.QuestionText;
                    //scope.questionId = parsedSettings.QuestionId;
                    //scope.questionNotes = parsedSettings.Notes;
                    drawLinesInAChartSrvc.completeSettings(scope.settings);
                    scope.getEngine(scope.settings);
                }
                else {
                    scope.settings = drawLinesInAChartSrvc.getEmptyQuestion();
                    drawLinesInAChartSrvc.completeSettings(scope.settings);
                    scope.getEngine(scope.settings);
                }
            };

            scope.init();
        }
    }
}]);
