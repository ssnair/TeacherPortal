function ScatterPlot(parent) {
    var _self = this;
    this._parent = parent;
    this.gridLineColor = '#878787';
    this.pointColor = '#f00';

    this.parameters = function (settings) {
        var plotArea = _self.getPlotArea(settings),
            yAxisMin = Number(settings.scatterPlot.yAxisMin),
            yAxisMax = Number(settings.scatterPlot.yAxisMax),
            yAxisScale = Helpers.validateMinValue(Number(settings.scatterPlot.yAxisScale), 1),
            yIncrement = Helpers.validateMinValue(Number(settings.scatterPlot.yIncrement), 1),
            ratioX = (plotArea.right - plotArea.left) / 100,
            ratioY = (plotArea.bottom - plotArea.top) / (yAxisMax - yAxisMin);

        settings.scatterPlot.yAxisScale = yAxisScale;
        settings.scatterPlot.yIncrement = yIncrement;

        return {
            plotArea: plotArea,
            yAxisMin: yAxisMin,
            yAxisMax: yAxisMax,
            yAxisScale: yAxisScale,
            yIncrement: yIncrement,
            strictPunctuation: Boolean(settings.scatterPlot.strictPunctuation),
            gridLineStyle: settings.scatterPlot.gridLineStyle,
            title: settings.scatterPlot.title,
            xAxisTitle: settings.scatterPlot.xAxisTitle,
            yAxisTitle: settings.scatterPlot.yAxisTitle,
            ratioX: ratioX,
            ratioY: ratioY
        }
    }

    this.redraw = function (settings, canvas) {
        if (settings.chartType.id != 'scatter-plot') {
            return;
        }
                
        var parameters = _self.parameters(settings);
        for (var i = parameters.yAxisMin; i <= parameters.yAxisMax; i += parameters.yAxisScale) {
            var devicePoint1 = _self.mapToPlotAreaCoordinates(parameters, { x: 0, y: i });
            var devicePoint2 = _self.mapToPlotAreaCoordinates(parameters, { x: 100, y: i });
            var path = ['M', devicePoint1.x, devicePoint1.y, 'L', devicePoint2.x, devicePoint1.y];
            canvas.path(path).attr({ 'stroke-dasharray': Helpers.getLineStyle(parameters.gridLineStyle.id), stroke: _self.gridLineColor });
            Helpers.text(canvas, parameters.plotArea.left - 15, devicePoint1.y, i);
        }
        _self.drawAxisTitleLabel(canvas, settings, parameters);
        _self.drawPoints(canvas, settings, parameters);
    }

    this.setViewMode = function (settings, viewMode) {
        if (settings.chartType.id != 'scatter-plot') {
            return;
        }
        
        var parameters = _self.parameters(settings);
        if (viewMode == 'teacher') {
            settings.scatterPlot.points.length = 0;
            for (var i = 0; i < settings.scatterPlot.teacherPoints.length; i++) {
                settings.scatterPlot.points.push({
                    uuid: settings.scatterPlot.teacherPoints[i].uuid,
                    label: settings.scatterPlot.teacherPoints[i].label,
                    order: settings.scatterPlot.teacherPoints[i].order,
                    value: settings.scatterPlot.teacherPoints[i].value,
                    worth: settings.scatterPlot.teacherPoints[i].worth,
                });
            }
        } else {
            settings.scatterPlot.teacherPoints.length = 0;
            for (var i = 0; i < settings.scatterPlot.points.length; i++) {
                settings.scatterPlot.teacherPoints.push({
                    uuid: settings.scatterPlot.points[i].uuid,
                    label: settings.scatterPlot.points[i].label,
                    order: settings.scatterPlot.points[i].order,
                    value: settings.scatterPlot.points[i].value,
                    worth: settings.scatterPlot.points[i].worth,
                });

                // set to default value for student
                settings.scatterPlot.points[i].value = _self.getMidPoint(parameters);
            }
        }
        _self._parent.redraw(settings);
    }

    this.submitAnswerFromPreview = function (settings) {
        if (settings.chartType.id != 'scatter-plot') {
            return;
        }

        var parameters = _self.parameters(settings),
            teacherPoints = settings.scatterPlot.teacherPoints,
            studentPoints = settings.scatterPlot.points,
            totalWorth = 0,
            correctPoints = 0,
            gotWorth = 0;

        for (var i = 0; i < teacherPoints.length; i++) {
            totalWorth += Number(teacherPoints[i].worth);
            if (studentPoints[i].value == teacherPoints[i].value) {
                correctPoints++;
                gotWorth += Number(teacherPoints[i].worth);
            }
        }

        if (parameters.strictPunctuation) {
            correctPoints = correctPoints == teacherPoints.length ? correctPoints : 0;
            gotWorth = correctPoints == teacherPoints.length ? gotWorth : 0;
        }

        var message = "Correct points: " + correctPoints + "\n";
        message += "Worth: " + gotWorth + " / " + totalWorth;
        alert(message);
    }

    this.drawPoints = function (canvas, settings, parameters) {
        var points = settings.scatterPlot.points;
        if (points.length > 0) {
            for (var i = 0; i < points.length; i++) {
                _self.drawPoint(settings, parameters, points, i, canvas);
            }
        }
    }

    this.drawPoint = function (settings, parameters, points, i, canvas) {
        points[i].value = _self.snapToIncrement(parameters, { x: 0, y: points[i].value }).y;

        var pointFactor = (1 + (3 * points.length)) / 2;
        var sectorWidth = 100 / pointFactor;
        var ratioX = points.length == 1 ? 0 : 100 / (points.length - 1);
        var devicePoint = _self.mapToPlotAreaCoordinates(parameters, { x: i * ratioX, y: points[i].value });
        points[i].circle = canvas.circle(devicePoint.x, devicePoint.y, 7)
            .attr('fill', _self.pointColor)
            .drag(_self.onMove, _self.onStart, _self.onEnd);

        _self.drawValueLabel(parameters, canvas, points[i], devicePoint);
        _self.drawPointLabel(canvas, points, { x: devicePoint.x, y: parameters.plotArea.bottom + 15 }, points[i].label, sectorWidth * ratioX);
    }

    this.drawValueLabel = function (parameters, canvas, point, position) {
        point.text = Helpers.text(canvas, position.x, position.y - 10, point.value, { 'font-size': 12, 'font-weight': 'bold' });
    }

    this.drawPointLabel = function (canvas, points, position, label, width) {
        var delta = Math.floor(points.length / 5);
        var text = Helpers.text(canvas, position.x, position.y, label, { 'font-size': (11 - delta) + 'px' });
        Helpers.wrapText(text, label, width - 20);
    }

    this.addPoint = function (settings) {
        var parameters = _self.parameters(_self._parent.settings),
            value = _self.getMidPoint(parameters);

        settings.scatterPlot.points.push({
            uuid: Helpers.getUUID(),
            label: "Point " + (settings.scatterPlot.points.length + 1),
            order: settings.scatterPlot.points.length + 1,
            value: value,
            worth: 0
        });
        _self._parent.redraw(settings);
    }

    this.removePoint = function (settings, p) {
        BootstrapDialog.confirm('Are you sure?', function (result) {
            if (result) {
                for (i = 0; i < settings.scatterPlot.points.length; i++) {
                    if (settings.scatterPlot.points[i].uuid == p.uuid) {
                        settings.scatterPlot.points.splice(i, 1);
                    }
                    _self._parent.redraw(settings);
                }
                _self._parent.scope.$apply();
            }
        });
    }

    this.changeValue = function (settings, point) {
        var parameters = _self.parameters(settings);
        point.value = _self.snapToIncrement(parameters, { x: 0, y: point.value }).y;
        _self._parent.redraw(settings);
    }

    this.drawAxisTitleLabel = function (canvas, settings, parameters) {
        var xHorizontal = (parameters.plotArea.right + settings.scatterPlot.plotAreaPadding.right) / 2,
            yVertical = (parameters.plotArea.bottom + settings.scatterPlot.plotAreaPadding.bottom) / 2;

        Helpers.text(canvas, xHorizontal, 18, parameters.title, { 'font-size': 16, 'font-weight': 'bold' });
        Helpers.text(canvas, xHorizontal, parameters.plotArea.bottom + 40, parameters.xAxisTitle, { 'font-size': 12, 'font-weight': 'bold' });
        Helpers.text(canvas, 10, yVertical, parameters.yAxisTitle, { 'font-size': 12, 'font-weight': 'bold' }, 'R270 5 ' + ((parameters.plotArea.bottom + 20) / 2));
    }

    this.getPlotArea = function (settings) {
        return {
            top: settings.scatterPlot.plotAreaPadding.top,
            left: settings.scatterPlot.plotAreaPadding.left,
            bottom: settings.container.height - settings.scatterPlot.plotAreaPadding.bottom,
            right: settings.container.width - settings.scatterPlot.plotAreaPadding.right,
        }
    }

    this.mapToChartCoordinates = function (parameters, coordinates) {        
        return {
            x: Math.round((coordinates.x - parameters.plotArea.left) / parameters.ratioX),
            y: Math.round((parameters.plotArea.bottom - coordinates.y + (parameters.yAxisMin * parameters.ratioY)) / parameters.ratioY)
        };
    };

    this.mapToPlotAreaCoordinates = function (parameters, point) {
        return {
            x: Math.round((parameters.ratioX * point.x) + parameters.plotArea.left),
            y: Math.round(parameters.plotArea.bottom - (parameters.ratioY * point.y) + (parameters.yAxisMin * parameters.ratioY))
        };
    }

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

    this.getPointForCircle = function (settings, circle) {
        var points = settings.scatterPlot.points;
        for (var i = 0; i < points.length; i++) {
            if (points[i].circle.id == circle.id) {
                return points[i];
            }
        }
        return null;
    }
    
    this.getMidPoint = function (parameters) {
        var middle = parameters.yAxisMin + (parameters.yAxisMax - parameters.yAxisMin) / 2;
        return _self.snapToIncrement(parameters, { x: 0, y: middle}).y;
    }

    this.exportJson = function (scatterPlot) {
        var result = {
            yAxisMin: scatterPlot.yAxisMin,
            yAxisMax: scatterPlot.yAxisMax,
            yAxisScale: scatterPlot.yAxisScale,
            yIncrement: scatterPlot.yIncrement,
            title: scatterPlot.title,
            xAxisTitle: scatterPlot.xAxisTitle,
            yAxisTitle: scatterPlot.yAxisTitle,
            strictPunctuation: scatterPlot.strictPunctuation,
            gridLineStyle: scatterPlot.gridLineStyle,
            plotAreaPadding: scatterPlot.plotAreaPadding,
            points: []
        };

        for (var i = 0; i < scatterPlot.points.length; i++) {
            var src = scatterPlot.points[i];
            result.points.push({
                uuid: src.uuid,
                label: src.label,
                order: src.order,
                value: src.value,
                worth: src.worth,
            });
        }
        return result;
    }

    /************************ Drag and Drop ************************/
    this.startX = 0;
    this.startY = 0;
    this.onStart = function () {
        _self.startX = this.attr('cx');
        _self.startY = this.attr('cy');
        this.attr('fill', 'pink');
    }

    this.onMove = function (dx, dy) {
        var settings = _self._parent.settings;
        var parameters = _self.parameters(settings);
        var pt = { x: _self.startX, y: _self.startY + dy };        
        var position = _self.snapToGrid(parameters, pt);
        position.y = Math.min(position.y, settings.container.height);
        
        var point = _self.getPointForCircle(settings, this);
        var value = _self.snapToIncrement(parameters, _self.mapToChartCoordinates(parameters, position)).y;
        point.text.attr('y', position.y - 10);
        point.text.attr('text', value);
        $('tspan', point.text.node).attr('dy', 0);

        this.attr({
            cx: position.x,
            cy: position.y
        });        
    }

    this.onEnd = function () {
        var settings = _self._parent.settings,
            parameters = _self.parameters(settings),
            point = _self.getPointForCircle(settings, this),
            position = { x: point.circle.attrs['cx'], y: point.circle.attrs['cy'] };

        point.value = _self.snapToIncrement(parameters, _self.mapToChartCoordinates(parameters, position)).y;
        this.attr('fill', _self.pointColor);
        _self._parent.scope.$apply();
    }

    /************************ Drag and Drop ************************/
}