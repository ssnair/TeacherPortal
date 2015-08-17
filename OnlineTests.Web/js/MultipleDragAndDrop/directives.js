
onlineTestsApp.directive('multipleDragAndDrop', ['$timeout', 'questionSrvc', 'multipleDragAndDropSrvc', function ($timeout, questionSrvc, multipleDragAndDropSrvc) {
    return {
        restrict: 'E',
        replace: true,
        scope: true,
        templateUrl: '/OnlineDW/js/MultipleDragAndDrop/templates/multipleDragAndDrop.html',
        link: function (scope, element, attrs) {
            scope.title = "Multiple Drag and Drop";
            scope.questionType = "multiple-drag-and-drop";

            scope.getEngine = function (settings) {
                scope.engine = new MultipleDragAndDrop(scope.drawingContainer[0], settings, scope);
                scope.engine.redraw(settings);
                scope.engine.refresh(settings);
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
                    multipleDragAndDropSrvc.completeSettings(scope.settings);
                    scope.getEngine(scope.settings);
                }
                else {
                    scope.settings = multipleDragAndDropSrvc.getEmptyQuestion();
                    multipleDragAndDropSrvc.completeSettings(scope.settings);
                    scope.getEngine(scope.settings);
                }
            };

            scope.init();

            //$timeout(function () {
            //    scope.init();
            //}, 300, false);
        }
    }
}])
.directive('refreshOptions', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            scope.engine.refresh();
            scope.$on('$destroy', function () {
                // event called after removing an option
            });
        }
    };
});