function BarChart(parent) {
    var _self = this;
    this._parent = parent;
    this.gridLineColor = '#878787';

    this.parameters = function (settings) {
        var plotArea = _self.getPlotArea(settings),
            yAxisMin = Number(settings.barChart.yAxisMin),
            yAxisMax = Number(settings.barChart.yAxisMax),
            yAxisScale = Helpers.validateMinValue(Number(settings.barChart.yAxisScale), 1),
            yIncrement = Helpers.validateMinValue(Number(settings.barChart.yIncrement), 1),
            ratioX = (plotArea.right - plotArea.left) / 100,
            ratioY = (plotArea.bottom - plotArea.top) / (yAxisMax - yAxisMin);
            
        settings.barChart.yAxisScale = yAxisScale;
        settings.barChart.yIncrement = yIncrement;

        return {
            plotArea: plotArea,
            yAxisMin: yAxisMin,
            yAxisMax: yAxisMax,
            yAxisScale: yAxisScale,
            yIncrement: yIncrement,
            strictPunctuation: Boolean(settings.barChart.strictPunctuation),
            gridLineStyle: settings.barChart.gridLineStyle,
            title: settings.barChart.title,
            xAxisTitle: settings.barChart.xAxisTitle,
            yAxisTitle: settings.barChart.yAxisTitle,
            ratioX: ratioX,
            ratioY: ratioY
        }
    }

    this.redraw = function (settings, canvas) {
        if (settings.chartType.id != 'bar-chart') {
            return;
        }

        var parameters = _self.parameters(settings);
        for (var i = parameters.yAxisMin; i <= parameters.yAxisMax; i += parameters.yAxisScale) {
            var devicePoint1 = _self.mapToPlotAreaCoordinates(parameters, { x: 0, y: i });
            var devicePoint2 = _self.mapToPlotAreaCoordinates(parameters, { x: 100, y: i });
            var path = "M" + devicePoint1.x + "," + devicePoint1.y + " L" + devicePoint2.x + "," + devicePoint1.y;
            canvas.path(path).attr({ 'stroke-dasharray': Helpers.getLineStyle(parameters.gridLineStyle.id), stroke: _self.gridLineColor });
            Helpers.text(canvas, parameters.plotArea.left - 15, devicePoint1.y, i);
        }
        _self.drawAxisTitleLabel(canvas, settings, parameters);
        _self.drawBars(canvas, settings, parameters);
    }

    this.setViewMode = function (settings, viewMode) {
        if (settings.chartType.id != 'bar-chart') {
            return;
        }

        var parameters = _self.parameters(settings);
        if (viewMode == 'teacher') {
            settings.barChart.bars.length = 0;
            for (var i = 0; i < settings.barChart.teacherBars.length; i++) {
                settings.barChart.bars.push({
                    uuid: settings.barChart.teacherBars[i].uuid,
                    label: settings.barChart.teacherBars[i].label,
                    order: settings.barChart.teacherBars[i].order,
                    value: settings.barChart.teacherBars[i].value,
                    worth: settings.barChart.teacherBars[i].worth,
                    color: settings.barChart.teacherBars[i].color
                });
            }
        } else {
            settings.barChart.teacherBars.length = 0;
            for (var i = 0; i < settings.barChart.bars.length; i++) {
                settings.barChart.teacherBars.push({
                    uuid: settings.barChart.bars[i].uuid,
                    label: settings.barChart.bars[i].label,
                    order: settings.barChart.bars[i].order,
                    value: settings.barChart.bars[i].value,
                    worth: settings.barChart.bars[i].worth,
                    color: settings.barChart.bars[i].color
                });

                // set to default value for student
                settings.barChart.bars[i].value = _self.getMidPoint(parameters);
            }
        }
        this._parent.redraw(settings);
    }

    this.submitAnswerFromPreview = function (settings) {
        if (settings.chartType.id != 'bar-chart') {
            return;
        }

        var parameters = _self.parameters(settings),
            teacherBars = settings.barChart.teacherBars,
            totalWorth = 0,
            correctBars = 0,
            gotWorth = 0,
            studentBars = settings.barChart.bars;

        for (var i = 0; i < teacherBars.length; i++) {
            totalWorth += Number(teacherBars[i].worth);
            if (studentBars[i].value == teacherBars[i].value) {
                correctBars++;
                gotWorth += Number(teacherBars[i].worth);
            }
        }

        if (parameters.strictPunctuation) {
            correctBars = correctBars == teacherBars.length ? correctBars : 0;
            gotWorth = correctBars == teacherBars.length ? gotWorth : 0;
        }

        var message = "Correct bars: " + correctBars + "\n";
        message += "Worth: " + gotWorth + " / " + totalWorth;
        alert(message);
    }

    this.drawBars = function (canvas, settings, parameters) {
        var bars = settings.barChart.bars;
        if (bars.length > 0) {
            for (var i = 0; i < bars.length; i++) {
                _self.drawBar(settings, parameters, bars, i, canvas);
            }
        }
    }

    this.drawBar = function (settings, parameters, bars, i, canvas) {
        bars[i].value = _self.snapToIncrement(parameters, { x: 0, y: bars[i].value }).y;

        var barFactor = (1 + (3 * bars.length)) / 2;
        var barWidth = 100 / barFactor;
        var offsetX = barWidth / 2;
        var devicePoint = _self.mapToPlotAreaCoordinates(parameters, { x: offsetX + (i * (barWidth + offsetX)), y: bars[i].value });
        bars[i].rect = canvas.rect(devicePoint.x, devicePoint.y, barWidth * parameters.ratioX, parameters.plotArea.bottom - devicePoint.y + 5)
            .attr({ 'fill': bars[i].color })
            .drag(_self.onMove, _self.onStart, _self.onEnd);

        var labelPoint = _self.mapToPlotAreaCoordinates(parameters, { x: offsetX * 2 + (i * (barWidth + offsetX)), y: 0 });
        _self.drawValueLabel(parameters, canvas, bars[i], { x: labelPoint.x, y: devicePoint.y });
        _self.drawPointLabel(canvas, bars, { x: labelPoint.x, y: parameters.plotArea.bottom + 14 }, bars[i].label, barWidth * parameters.ratioX);
    }

    this.drawValueLabel = function (parameters, canvas, bar, position) {
        bar.text = Helpers.text(canvas, position.x, position.y - 5, bar.value, { 'font-size': 12, 'font-weight': 'bold' });
    }

    this.drawPointLabel = function (canvas, bars, position, label, width) {
        var delta = Math.floor(bars.length / 5);
        var text = Helpers.text(canvas, position.x, position.y, label, { 'font-size': (11 - delta) + 'px' });
        Helpers.wrapText(text, label, width);
    }

    this.addBar = function (settings) {
        var parameters = _self.parameters(_self._parent.settings),
            value = _self.getMidPoint(parameters);
        
        settings.barChart.bars.push({
            uuid: Helpers.getUUID(),
            label: "Item " + (settings.barChart.bars.length + 1),
            order: settings.barChart.bars.length + 1,
            value: value,
            worth: 0,
            color: '#ff0000'
        });
        _self._parent.redraw(settings);
    }

    this.removeBar = function (settings, p) {
        BootstrapDialog.confirm('Are you sure?', function (result) {
            if (result) {
                for (i = 0; i < settings.barChart.bars.length; i++) {
                    if (settings.barChart.bars[i].uuid == p.uuid) {
                        settings.barChart.bars.splice(i, 1);
                    }
                    _self._parent.redraw(settings);
                }
                _self._parent.scope.$apply();
            }
        });
    }

    this.changeValue = function (settings, bar) {
        var parameters = _self.parameters(settings);
        bar.value = _self.snapToIncrement(parameters, { x: 0, y: bar.value }).y;
        _self._parent.redraw(settings);
    }

    this.drawAxisTitleLabel = function (canvas, settings, parameters) {
        var xHorizontal = (parameters.plotArea.right + settings.barChart.plotAreaPadding.right) / 2,
            yVertical = (parameters.plotArea.bottom + settings.barChart.plotAreaPadding.bottom) / 2;

        Helpers.text(canvas, xHorizontal, 18, parameters.title, { 'font-size': 16, 'font-weight': 'bold' });
        Helpers.text(canvas, xHorizontal, parameters.plotArea.bottom + 40, parameters.xAxisTitle, { 'font-size': 12, 'font-weight': 'bold' });
        Helpers.text(canvas, 10, yVertical, parameters.yAxisTitle, { 'font-size': 12, 'font-weight': 'bold' }, 'R270 5 ' + ((parameters.plotArea.bottom + 20) / 2));
    }
    
    this.getPlotArea = function (settings) {
        return {
            top: settings.barChart.plotAreaPadding.top,
            left: settings.barChart.plotAreaPadding.left,
            bottom: settings.container.height - settings.barChart.plotAreaPadding.bottom,
            right: settings.container.width - settings.barChart.plotAreaPadding.right,
        }
    }

    this.mapToPlotAreaCoordinates = function (parameters, point) {
        return {
            x: Math.round((parameters.ratioX * point.x) + parameters.plotArea.left),
            y: Math.round(parameters.plotArea.bottom - (parameters.ratioY * point.y) + (parameters.yAxisMin * parameters.ratioY))
        };
    }

    this.mapToChartCoordinates = function (parameters, coordinates) {
        return {
            x: Math.round((coordinates.x - parameters.plotArea.left) / parameters.ratioX),
            y: Math.round((parameters.plotArea.bottom - coordinates.y + (parameters.yAxisMin * parameters.ratioY)) / parameters.ratioY)
        };
    };

    this.snapToIncrement = function (parameters, point) {
        var nearest = NaN;
        for (var i = parameters.yAxisMin; i <= parameters.yAxisMax; i += parameters.yIncrement) {
            if (isNaN(nearest)) {
                nearest = i;
            }
            if (Math.abs(i - point.y) < Math.abs(nearest - point.y)) {
                nearest = i;
            }
        }
        point.y = nearest;
        return point;
    }

    this.snapToGrid = function (parameters, point) {
        var chartPoint = _self.mapToChartCoordinates(parameters, point);
        var snapPoint = _self.snapToIncrement(parameters, chartPoint);
        return _self.mapToPlotAreaCoordinates(parameters, snapPoint);
    }

    this.getBarForRect = function (settings, rect) {
        var bars = settings.barChart.bars;
        for (var i = 0; i < bars.length; i++) {
            if (bars[i].rect.id == rect.id) {
                return bars[i];
            }
        }
        return null;
    }

    this.snapValueToIncrement = function (parameters, value) {
        var mapPoint = _self.mapToPlotAreaCoordinates(parameters, { x: 0, y: value });
        return _self.mapToChartCoordinates(parameters, _self.snapToGrid(parameters, mapPoint)).y;
    }

    this.getMidPoint = function (parameters) {
        var middle = parameters.yAxisMin + (parameters.yAxisMax - parameters.yAxisMin) / 2;
        return _self.snapToIncrement(parameters, { x: 0, y: middle }).y;
    }

    this.exportJson = function (barChart) {
        var result = {
            yAxisMin: barChart.yAxisMin,
            yAxisMax: barChart.yAxisMax,
            yAxisScale: barChart.yAxisScale,
            yIncrement: barChart.yIncrement,
            title: barChart.title,
            xAxisTitle: barChart.xAxisTitle,
            yAxisTitle: barChart.yAxisTitle,
            strictPunctuation: barChart.strictPunctuation,
            gridLineStyle: barChart.gridLineStyle,
            plotAreaPadding: barChart.plotAreaPadding,
            bars: []
        };

        for (var i = 0; i < barChart.bars.length; i++) {
            var src = barChart.bars[i];
            result.bars.push({
                uuid: src.uuid,
                label: src.label,
                order: src.order,
                value: src.value,
                worth: src.worth,
                color: src.color
            });
        }
        return result;
    }

    /************************ Drag and Drop ************************/
    this.startX = 0;
    this.startY = 0;
    this.onStart = function () {
        _self.startX = this.attr('x');
        _self.startY = this.attr('y');
        this.attr('fill-opacity', 0.75);
    }

    this.onMove = function (dx, dy) {
        var settings = _self._parent.settings;
        var parameters = _self.parameters(settings);
        var pt = { x: _self.startX, y: _self.startY + dy };
        var position = _self.snapToGrid(parameters, pt);
        position.y = Math.min(position.y, settings.container.height);
        var bar = _self.getBarForRect(settings, this);
        bar.value = _self.snapToIncrement(parameters, _self.mapToChartCoordinates(parameters, position)).y;
        bar.text.attr('y', position.y - 5);
        bar.text.attr('text', bar.value);
        $('tspan', bar.text.node).attr('dy', 0);

        this.attr({
            x: position.x,
            y: position.y,
            height: parameters.plotArea.bottom - position.y + 5
        });
    }

    this.onEnd = function () {
        this.attr('fill-opacity', 1);
        _self._parent.scope.$apply();
    }

    /************************ Drag and Drop ************************/
}
