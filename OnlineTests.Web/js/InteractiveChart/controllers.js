onlineTestsApp.controller("InteractiveChartCtrl", function ($scope) {
    $scope.title = "Interactive Chart";
    $scope.questionType = "interactive-chart";
    $scope.currentChartType = { id: 'line-graph', name: 'Line Chart' },

    $scope.settings = {
        chartType: { id: 'line-graph' },
        container: { width: 500, height: 300 },
        grid: { width: 10, height: 10 },
        lineChart: {
            yAxisMin: 0,
            yAxisMax: 100,
            yAxisScale: 10,
            plotAreaPadding: { top: 10, left: 20, right: 10, bottom: 20 },
            points: [],
            connectors: []
        },
        barChart: {
            yAxisMin: 0,
            yAxisMax: 100,
            yAxisScale: 10,
            plotAreaPadding: { top: 10, left: 20, right: 10, bottom: 20 },
            bars: []
        },
        scatterPlot: {
            yAxisMin: 0,
            yAxisMax: 100,
            yAxisScale: 10,
            plotAreaPadding: { top: 10, left: 20, right: 10, bottom: 20 },
            points: [],
            connectors: []
        },
        histogram: {
            yAxisMin: 0,
            yAxisMax: 7,
            yAxisScale: 1,
            plotAreaPadding: { top: 10, left: 20, right: 10, bottom: 20 },
            bars: []
        }
    };
});