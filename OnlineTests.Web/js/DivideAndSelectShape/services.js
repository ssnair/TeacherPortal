onlineTestsApp.service("divideAndSelectShapeSrvc", function () {
    return {
        buildQuestion: function(loadedData) {
            var question = this.getEmptyQuestion();
            question.chartType = loadedData.Settings.chartType;
            question.container = loadedData.Settings.container;
            question.grid = loadedData.Settings.grid;
            if (question.chartType.id === 'line-chart') {
                question.lineChart = loadedData.Settings.lineChart;
                this.completeLineChart(question.lineChart);
            }
            return question;
        },
        getEmptyQuestion : function() {
            return {
                shapeType: { id: 'none' },
                container: { width: 500, height: 300 },
                grid: { width: 10, height: 10 },
                polygonShape: this.getEmptyPolygonShape(),
                circleShape: this.getEmptyCircleShape(),
                rectangleShape: this.getEmptyRectangleShape(),
                starShape: this.getEmptyStarShape()
            }
        },
        getEmptyPolygonShape: function () {
            return {
                sides: 3,
                worth: 0,
                answerMode: { id: '0', name: 'Quantity of selected sectors only' },
                angle: 0,
                plotAreaPadding: { top: 10, left: 20, right: 10, bottom: 20 },
                sectors: [],
                teacherSectors: []
            };
        },
        getEmptyCircleShape : function() {
            return {
                divisions: 2,
                worth: 0,
                answerMode: { id: '0', name: 'Quantity of selected sectors only' },
                plotAreaPadding: { top: 10, left: 20, right: 10, bottom: 20 },
                sectors: [],
                teacherSectors: []
            };
        },
        getEmptyRectangleShape: function() {
            return {
                width: 100,
                height: 80,
                columns: 1,
                rows: 1,
                worth: 0,
                answerMode: { id: '0', name: 'Quantity of selected sectors only' },
                divisionType: { id: '0' },
                plotAreaPadding: { top: 10, left: 20, right: 10, bottom: 20 },
                sectors: [],
                teacherSectors: [],
                grid: []
            }
        },
        getEmptyStarShape: function() {
            return {
                peaks: 5,
                worth: 0,
                angle: 0,
                answerMode: { id: '0', name: 'Quantity of selected sectors only' },
                plotAreaPadding: { top: 10, left: 20, right: 10, bottom: 20 },
                sectors: [],
                teacherSectors: []
            }
        },
        completeSettings: function (settings) {
            this.completePolygonShape(settings.polygonShape);
            this.completeCircleShape(settings.circleShape);
            this.completeStarShape(settings.starShape);
            this.completeRectangleShape(settings.rectangleShape);
        },
        completePolygonShape: function (polygonShape) {
            polygonShape.teacherSectors = [];
        },
        completeCircleShape: function (circleShape) {
            circleShape.teacherSectors = [];
        },
        completeStarShape: function (starShape) {
            starShape.teacherSectors = [];
        },
        completeRectangleShape: function (rectangleShape) {
            teacherSlices = [],
            grid = []
        }
    }
});