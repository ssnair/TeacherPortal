
InteractiveChart = function(Raphael, container, settings, scope) {
    var _self = this;
    container = Helpers.clearContainer(container);
    this.canvas = Raphael(container, settings.container.width, settings.container.height);
    this.settings = settings;
    this.parent = parent;
    this.scope = scope;

    this.lineChart = new LineChart(this);
    this.barChart = new BarChart(this);
    this.scatterPlot = new ScatterPlot(this);
    this.pieChart = new PieChart(this);
    this.histogram = new Histogram(this);
    this.stemLeafPlot = new StemLeafPlot(this);
    this.frequencyPolygonChart = new FrequencyPolygonChart(this);
    this.pictogram = new Pictogram(this);

    this.redraw = function(settings)
    {
        _self.canvas.clear();
        _self.canvas.rect(0, 0, settings.container.width, settings.container.height);
        _self.lineChart.redraw(settings, _self.canvas);
        _self.barChart.redraw(settings, _self.canvas);
        _self.scatterPlot.redraw(settings, _self.canvas);
        _self.pieChart.redraw(settings, _self.canvas);
        _self.histogram.redraw(settings, _self.canvas);
        _self.stemLeafPlot.redraw(settings, _self.canvas);
        _self.frequencyPolygonChart.redraw(settings, _self.canvas);
        _self.pictogram.redraw(settings, _self.canvas);
    }

    this.setViewMode = function (viewMode) {
        _self.lineChart.setViewMode(settings, viewMode);
        _self.barChart.setViewMode(settings, viewMode);
        _self.pieChart.setViewMode(settings, viewMode);
        _self.scatterPlot.setViewMode(settings, viewMode);
        _self.histogram.setViewMode(settings, viewMode);
        _self.stemLeafPlot.setViewMode(settings, viewMode);
        _self.frequencyPolygonChart.setViewMode(settings, viewMode);
        _self.pictogram.setViewMode(settings, viewMode);
    }

    this.submitAnswerFromPreview = function () {
        _self.lineChart.submitAnswerFromPreview(settings);
        _self.scatterPlot.submitAnswerFromPreview(settings);
        _self.barChart.submitAnswerFromPreview(settings);
        _self.pieChart.submitAnswerFromPreview(settings);
        _self.stemLeafPlot.submitAnswerFromPreview(settings);
        _self.frequencyPolygonChart.submitAnswerFromPreview(settings);
        _self.histogram.submitAnswerFromPreview(settings);
        _self.pictogram.submitAnswerFromPreview(settings);
    }

    this.exportJson = function (settings) {
        var result = {
            //questionId: scope.questionId,
            id: settings.id,
            questionType: 'InteractiveChart',
            questionText: scope.questionText,
            questionNotes: scope.questionNotes,
            interactiveChart: JSON.stringify({
                chartType: settings.chartType,
                container: settings.container,
                grid: settings.grid,

                lineChart: _self.lineChart.exportJson(settings.lineChart),
                barChart: _self.barChart.exportJson(settings.barChart),
                scatterPlot: _self.scatterPlot.exportJson(settings.scatterPlot),
                pieChart: _self.pieChart.exportJson(settings.pieChart),
                histogram: _self.histogram.exportJson(settings.histogram),
                pictogram: _self.pictogram.exportJson(settings.pictogram),
                stemLeafPlot: _self.stemLeafPlot.exportJson(settings.stemLeafPlot),
                frequencyPolygonChart: _self.frequencyPolygonChart.exportJson(settings.frequencyPolygonChart)
            })
        };
        return result;
    }

    this.importJson = function (settings) {
        console.log("importJson");

        var result = {
            chartType: settings.chartType,
            container: settings.container,
            grid: settings.grid,

            lineChart: _self.lineChart.importJson(settings.lineChart),
            //barChart: _self.barChart.importJson(settings.barChart),
            //scatterPlot: _self.scatterPlot.importJson(settings.scatterPlot),
            //pieChart: _self.pieChart.importJson(settings.pieChart),
            //histogram: _self.histogram.importJson(settings.histogram),
            //pictogram: _self.pictogram.importJson(settings.pictogram),
            //stemLeafPlot: _self.stemLeafPlot.importJson(settings.stemLeafPlot),
            //frequencyPolygonChart: _self.frequencyPolygonChart.importJson(settings.frequencyPolygonChart)
        };
        return result;
    }

}
