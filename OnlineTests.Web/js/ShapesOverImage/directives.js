// shapesOverImages/directives.js

onlineTestsApp.directive('shapesOverImage', ['$timeout', 'FileUploader', 'questionSrvc', 'shapesOverImageSrvc', function ($timeout, FileUploader, questionSrvc, shapesOverImageSrvc) {
    return {
        restrict: 'E',
        replace: true,
        scope: true,
        templateUrl: '/OnlineDW/js/ShapesOverImage/templates/shapesOverImage.html',
        link: function (scope, element, attrs) {
            scope.title = "Shapes Over Image";
            scope.questionType = "shapes-over-image";
            scope.uploader = new FileUploader({ queueLimit: 2 })
            scope.uploader.onAfterAddingFile = function (fileItem) {
                scope.uploader.queue.length != 1 && scope.uploader.removeFromQueue(0);
                console.info("file", scope.uploader.queue);
            }
            scope.flagUploadedFile = false;

            scope.$watch('settings.grid.width', function () {
                //                scope.circle.attr({ cx: scope.diameter });
              //  scope.engine.redraw();
            });

            scope.answerTypes = [
                { id: 'position-must-match', name: 'Position must match' },
                { id: 'area-must-match', name: 'Area must match' },
                { id: 'position-and-area-must-match', name: 'Position and Area must match' },
                { id: 'click-inside-shapes', name: 'Clicks inside shapes' },
            ];

            scope.objectTypes = [
                { id: 'select', name: 'Select', action: 'select', teacherOnly: false },
                { id: 'delete', name: 'Delete', action: 'delete', teacherOnly: false },
                { id: 'add-rectangle', name: 'Add Rectangle', action: 'add-rectangle', teacherOnly: false },
                { id: 'add-ellipse', name: 'Add Ellipse', action: 'add-ellipse', teacherOnly: false },
                { id: 'add-polygon', name: 'Add Polygon', action: 'add-polygon', teacherOnly: false },
                /* { id: 'add-cube', name: 'Add Cube', action: 'add-cube', teacherOnly: true },
                { id: 'add-cylinder', name: 'Add Cilinder', action: 'add-cilinder', teacherOnly: true } */
            ];

            scope.setContainer = function (elem) {
                scope.container = elem;
            };

            scope.getEngine = function (settings) {
                scope.engine = new ShapesOverImage(Raphael, scope.drawingContainer[0], settings, scope);
                scope.engine.redraw(settings);
            };

            scope.setAction = function (action) {
                scope.settings.currentAction = action;
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
                    shapesOverImageSrvc.completeSettings(scope.settings);
                    scope.getEngine(scope.settings);

                    var canvas = $('#thumb');
                    canvas.attr("src", scope.settings.image);
                }
                else {
                    scope.settings = shapesOverImageSrvc.getEmptyQuestion();
                    scope.getEngine(scope.settings);
                }
            };

            scope.init();

            //$timeout(function () {
            //    scope.init();
            //}, 1, false);

        }
    }
}]);

onlineTestsApp.directive('ngThumb', ['$window', function ($window) {
    var helper = {
        support: !!($window.FileReader && $window.CanvasRenderingContext2D),
        isFile: function(item) {
            return angular.isObject(item) && item instanceof $window.File;
        },
        isImage: function(file) {
            var type =  '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
    };

    return {
        restrict: 'A',
        template: '<canvas/>',
        link: function(scope, element, attributes) {
            if (!helper.support) return;

            var params = scope.$eval(attributes.ngThumb);

            if (!helper.isFile(params.file)) return;
            if (!helper.isImage(params.file)) return;

            var canvas = element.find('canvas');
            var reader = new FileReader();

            reader.onload = onLoadFile;
            reader.readAsDataURL(params.file);

            function onLoadFile(event) {
                var img = new Image();
                img.onload = onLoadImage;
                img.src = event.target.result;
                $('#thumb').hide();
            }

            function onLoadImage(image) {
                var width = params.width || this.width / this.height * params.height;
                var height = params.height || this.height / this.width * params.width;
                canvas.attr({ width: width, height: height });
                canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
                scope.settings.image = image.target.src;
                scope.flagUploadedFile = true;
            }
        }
    };
}]);
