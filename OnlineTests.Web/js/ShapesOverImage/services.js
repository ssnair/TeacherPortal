onlineTestsApp.service("shapesOverImageSrvc", ['FileUploader', function (FileUploader) {
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
            var settings = {
                viewMode: 'teacher',
                container: { width: 500, height: 300 },
                shapes: [],
                teacherShapes: [],
                plotAreaPadding: { top: 10, left: 20, right: 10, bottom: 20 },
                answerType: { id: 'position-must-match' },
            };

            return settings;
        },
        completeSettings: function (settings) {
            settings.teacherShapes = []
        },
    }
}]);