/// <reference path="templates/interactiveChart.html" />
// interactiveChart/directives.js

onlineTestsApp.directive('interactiveChart', ['$timeout', 'FileUploader', 'questionSrvc', 'questionAsyncSrvc', 'interactiveChartSrvc', function ($timeout, FileUploader, questionSrvc, questionAsyncSrvc, interactiveChartSrvc) {
    return {
        restrict: 'E',
        replace: false,
        scope: true,
        link: function (scope, element, attrs) {
            scope.title = 'Interactive Chart';
            scope.questionType = "interactive-chart";

            scope.chartTypes = [
              { id: 'none', name: '-- Select an option --' },
              { id: 'line-chart', name: 'Line Chart' },
              { id: 'pie-chart', name: 'Pie Chart' },
              { id: 'bar-chart', name: 'Bar Chart' },
              { id: 'scatter-plot', name: 'Scatter Plot' },
              { id: 'histogram', name: 'Histogram' },
              { id: 'stem-leaf-plot', name: 'Stem and Leaf Plot' },
              { id: 'frequency-polygon-chart', name: 'Frequency Polygon' },
              { id: 'pictogram', name: 'Pictogram' }
            ];

            scope.lineStyles = [
                { id: 'solid', name: 'Solid' },
                { id: 'dashed', name: 'Dashed' }
            ]

            scope.getEngine = function (settings) {
                var container = null;
                switch (settings.chartType.id) {
                    case 'line-chart':
                        container = scope.lineChartDrawingContainer[0];
                        break;
                    case 'pie-chart':
                        container = scope.pieChartDrawingContainer[0];
                        break;
                    case 'bar-chart':
                        container = scope.barChartDrawingContainer[0];
                        break;
                    case 'scatter-plot':
                        container = scope.scatterPlotDrawingContainer[0];
                        break;
                    case 'histogram':
                        container = scope.histogramDrawingContainer[0];
                        break;
                    case 'stem-leaf-plot':
                        container = scope.stemLeafPlotDrawingContainer[0];
                        break;
                    case 'frequency-polygon-chart':
                        container = scope.frequencyPolygonChartDrawingContainer[0];
                        break;
                    case 'pictogram':
                        container = scope.pictogramDrawingContainer[0];
                        break
                    default:
                }
                scope.engine = new InteractiveChart(Raphael, container, settings, scope);
                scope.engine.redraw(settings);
            };

            scope.chartTypeChanged = function (value) {
                scope.getEngine(scope.settings);
            };

            scope.$on("viewModeChanged", function (event, viewMode) {
                scope.engine.setViewMode(viewMode);
            });

            scope.$on("submitAnswerFromPreview", function (event) {
                scope.engine.submitAnswerFromPreview();
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
                    //scope.questionId = parsedSettings.QuestionId;
                    //scope.questionNotes = parsedSettings.Notes;
                    interactiveChartSrvc.completeSettings(scope.settings);
                    scope.getEngine(scope.settings);
                    //// TODO-Jul-13: workaround - remove when fix from Swopna is received
                    //$scope.questionNotes = parsedSettings.Notes;
                    //$scope.questionText = parsedSettings.QuestionText;
                } else {
                    scope.settings = interactiveChartSrvc.getEmptyQuestion();
                }
            };

            scope.completeJson = function (settings) {
                settings.lineChart.connectors = [];
                settings.lineChart.teacherPoints = [];
                settings.lineChart.teacherConnectors = [];
                return settings;
            }


            scope.uploader = new FileUploader({ queueLimit: 2 });
            scope.uploader.onAfterAddingFile = function (fileItem) {
                scope.uploader.queue.length != 1 && scope.uploader.removeFromQueue(0);
            }

            scope.defaultColors = [
                ['#000', '#444', '#666', '#999', '#ccc', '#eee', '#f3f3f3', '#fff'],
                ['#f00', '#f90', '#ff0', '#0f0', '#0ff', '#00f', '#90f', '#f0f'],
                ['#f4cccc', '#fce5cd', '#fff2cc', '#d9ead3', '#d0e0e3', '#cfe2f3', '#d9d2e9', '#ead1dc'],
                ['#ea9999', '#f9cb9c', '#ffe599', '#b6d7a8', '#a2c4c9', '#9fc5e8', '#b4a7d6', '#d5a6bd'],
                ['#e06666', '#f6b26b', '#ffd966', '#93c47d', '#76a5af', '#6fa8dc', '#8e7cc3', '#c27ba0'],
                ['#c00', '#e69138', '#f1c232', '#6aa84f', '#45818e', '#3d85c6', '#674ea7', '#a64d79'],
                ['#900', '#b45f06', '#bf9000', '#38761d', '#134f5c', '#0b5394', '#351c75', '#741b47'],
                ['#600', '#783f04', '#7f6000', '#274e13', '#0c343d', '#073763', '#20124d', '#4c1130']
            ];

            scope.init();

            //$timeout(function () {
            //    scope.init();
            //}, 300, false);

        },
        //templateUrl: '/OnlineDW/js/InteractiveChart/templates/interactiveChart.html'
        templateUrl: '/OnlineDW/home/interactiveChartTemplate'
    }
}])
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
})
.directive('staticInclude', function ($http, $templateCache, $compile) {
    return function (scope, element, attrs) {
        var templatePath = attrs.staticInclude;
        $http.get(templatePath, { cache: $templateCache }).success(function (response) {
            var contents = element.html(response).contents();
            $compile(contents)(scope);
        });
    };
})
.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter);
                });
                event.preventDefault();
            }
        });
    };
})
.directive('ngThumb', ['$window', function ($window) {
    var helper = {
        support: !!($window.FileReader),
        isFile: function (item) {
            return angular.isObject(item) && item instanceof $window.File;
        },
        isImage: function (file) {
            var type = '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
            return '|png|gif|jpeg|jpg|'.indexOf(type) !== -1;
        }
    };

    return {
        restrict: 'A',
        template: '<canvas/>',
        link: function (scope, element, attributes) {
            if (!helper.support) return;

            var params = scope.$eval(attributes.ngThumb);

            if (!helper.isFile(params.file)) return;
            if (!helper.isImage(params.file)) return;

            var canvas = element.find('canvas');
            var reader = new FileReader();

            reader.onload = onLoadFile;
            scope.settings.pictogram.symbolSize = params.file.size / 1024;
            reader.readAsDataURL(params.file);

            function onLoadFile(event) {
                var image = new Image();
                image.onload = onLoadImage;
                image.src = event.target.result;
            }

            function onLoadImage(image) {
                var width = scope.settings.pictogram.symbolWidth;
                var height = scope.settings.pictogram.symbolHeight;
                canvas.attr({ width: width, height: height });
                canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
                scope.settings.pictogram.symbol = image.target.src;
                scope.engine.pictogram.changeImageColor(scope.settings);
            }
        }
    };
}]);


