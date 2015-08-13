function FrequencyPolygonChart(parent) {
    var _self = this;
    this._parent = parent;
    this.gridLineColor = '#878787';
    this.pointColor = '#f00';
    this.connectorLineColor = '#00f';
    this.firstTime = true;
    this.connectors = [];
    
    this.parameters = function (settings) {
        var plotArea = _self.getPlotArea(settings),
            height = plotArea.bottom - plotArea.top,
            width = plotArea.right - plotArea.left,
            xAxisMin = Number(settings.frequencyPolygonChart.xAxisMin),
            xAxisMax = Number(settings.frequencyPolygonChart.xAxisMax),
            xInterval = Number(settings.frequencyPolygonChart.xInterval);
            yAxisMin = Number(settings.frequencyPolygonChart.yAxisMin),
            yAxisMax = Number(settings.frequencyPolygonChart.yAxisMax),
            yInterval = Number(settings.frequencyPolygonChart.yInterval),
            yAxisScale = Helpers.validateMinValue(Number(settings.frequencyPolygonChart.yAxisScale), 1);
            
        settings.frequencyPolygonChart.yAxisScale = yAxisScale;

        return {
            plotArea: plotArea,
            strictPunctuation: Boolean(settings.frequencyPolygonChart.strictPunctuation),
            gridLineStyle: settings.frequencyPolygonChart.gridLineStyle,
            connectorLineStyle: settings.frequencyPolygonChart.connectorLineStyle,
            height: height,
            width: width,
            xAxisMin: xAxisMin,
            xAxisMax: xAxisMax,
            xInterval: xInterval,
            yAxisMin: yAxisMin,
            yAxisMax: yAxisMax,
            yInterval: yInterval,
            yAxisScale: yAxisScale,
            title: settings.frequencyPolygonChart.title,
            xAxisTitle: settings.frequencyPolygonChart.xAxisTitle,
            yAxisTitle: settings.frequencyPolygonChart.yAxisTitle,
            ratioX: width / (xAxisMax - xAxisMin),
            ratioY: height / (yAxisMax - yAxisMin)
        }
    }

    this.reset = function (settings) {
        if (!_self.parametersValidation(settings)) {
            BootstrapDialog.alert('There are wrong parameters.<br/>Please check the arguments provided');
            return;
        }

        BootstrapDialog.confirm('<strong>Are you sure?</strong><br/>All data will be restored to default values.', function (result) {
            if (result) {
                _self.loadIntervals(settings);
                _self._parent.scope.$apply();
            }
        });
    }

    this.redraw = function (settings, canvas) {
        if (settings.chartType.id != 'frequency-polygon-chart') {
            return;
        }

        if (_self.firstTime && (typeof settings.id === 'undefined' || settings.id == 0)) {
            _self.loadIntervals(settings);
        }
        var parameters = _self.parameters(settings);
        _self.drawIntervals(canvas, settings, parameters);
        _self.toFront(settings);
    }

    this.setViewMode = function (settings, viewMode) {
        if (settings.chartType.id != 'frequency-polygon-chart') {
            return;
        }

        if (viewMode == 'teacher') {
            settings.frequencyPolygonChart.intervals.length = 0;
            for (var i = 0; i < settings.frequencyPolygonChart.teacherIntervals.length; i++) {
                settings.frequencyPolygonChart.intervals.push({
                    uuid: settings.frequencyPolygonChart.teacherIntervals[i].uuid,
                    label: settings.frequencyPolygonChart.teacherIntervals[i].label,
                    order: settings.frequencyPolygonChart.teacherIntervals[i].order,
                    value: settings.frequencyPolygonChart.teacherIntervals[i].value,
                    worth: settings.frequencyPolygonChart.teacherIntervals[i].worth,
                    start: settings.frequencyPolygonChart.teacherIntervals[i].start,
                    end: settings.frequencyPolygonChart.teacherIntervals[i].end
                });
            }
        } else {
            settings.frequencyPolygonChart.teacherIntervals.length = 0;
            for (var i = 0; i < settings.frequencyPolygonChart.intervals.length; i++) {
                settings.frequencyPolygonChart.teacherIntervals.push({
                    uuid: settings.frequencyPolygonChart.intervals[i].uuid,
                    label: settings.frequencyPolygonChart.intervals[i].label,
                    order: settings.frequencyPolygonChart.intervals[i].order,
                    value: settings.frequencyPolygonChart.intervals[i].value,
                    worth: settings.frequencyPolygonChart.intervals[i].worth,
                    start: settings.frequencyPolygonChart.intervals[i].start,
                    end: settings.frequencyPolygonChart.intervals[i].end
                });
            }

            _self.loadIntervals(settings);
        }
        _self._parent.redraw(settings);
    }

    this.submitAnswerFromPreview = function (settings) {
        if (settings.chartType.id != 'frequency-polygon-chart') {
            return;
        }

        var parameters = _self.parameters(settings),
            teacherIntervals = settings.frequencyPolygonChart.teacherIntervals,
            studentIntervals = settings.frequencyPolygonChart.intervals,
            totalWorth = 0,
            correctPoints = 0,
            gotWorth = 0;

        for (var i = 0; i < teacherIntervals.length; i++) {
            totalWorth += Number(teacherIntervals[i].worth);
            if (studentIntervals[i].value == teacherIntervals[i].value) {
                correctPoints++;
                gotWorth += Number(teacherIntervals[i].worth);
            }
        }

        if (parameters.strictPunctuation) {
            correctPoints = correctPoints == teacherIntervals.length ? correctPoints : 0;
            gotWorth = correctPoints == teacherIntervals.length ? gotWorth : 0;
        }

        var message = "Correct points: " + correctPoints + "\n";
        message += "Worth: " + gotWorth + " / " + totalWorth;
        alert(message);
    }
    
    this.drawIntervals = function (canvas, settings, parameters) {
        var intervals = settings.frequencyPolygonChart.intervals;        
        _self.drawGrid(canvas, settings, parameters);
        _self.drawAxisTitleLabel(canvas, settings, parameters);
        for (var i = 0; i < intervals.length; i++) {
            _self.drawInterval(canvas, parameters, intervals, i);
        }
    }

    this.drawInterval = function (canvas, parameters, intervals, i) {
        intervals[i].value = _self.snapToIncrement(parameters, { x: 0, y: intervals[i].value }).y;

        var xi = parameters.plotArea.left + i * parameters.xInterval * parameters.ratioX;
        var xf = xi + parameters.xInterval * parameters.ratioX;
        var middle = xi + (xf - xi) / 2;

        canvas.path(['M', xf, parameters.plotArea.bottom, 'L', xf, parameters.plotArea.top])
            .attr({ 'stroke-dasharray': Helpers.getLineStyle(parameters.gridLineStyle.id), stroke: _self.gridLineColor });

        var y = _self.mapToPlotAreaCoordinates(parameters, { x: parameters.xAxisMin, y: intervals[i].value }).y;
        intervals[i].circle = canvas.circle(middle, y, 7)
            .attr({ 'fill': _self.pointColor })
            .drag(_self.onMove, _self.onStart, _self.onEnd);

        _self.drawValueLabel(parameters, canvas, intervals[i], { x: middle, y: y });
        _self.drawConnectors(canvas, parameters, intervals, i);
    }

    this.drawConnectors = function (canvas, parameters, intervals, i) {
        var path = null,
            point = null,
            lastPoint = null;

        point = intervals[i];
        if (i == 0) {            
            lastPoint = _self.makeMockCircle(parameters.plotArea.left, parameters.plotArea.bottom);
        } else {
            lastPoint = intervals[i - 1];
        }

        _self.drawConnector(canvas, parameters, point, lastPoint);

        if (i == intervals.length - 1) {
            lastPoint = _self.makeMockCircle(parameters.plotArea.left + parameters.width, parameters.plotArea.bottom);
            _self.drawConnector(canvas, parameters, point, lastPoint);
        }
    }

    this.drawConnector = function (canvas, parameters, point1, point2) {
        var path = canvas.path(['M', point1.circle.attrs['cx'], point1.circle.attrs['cy'], 'L', point2.circle.attrs['cx'], point2.circle.attrs['cy']])
            .attr({ 'stroke-dasharray': Helpers.getLineStyle(parameters.connectorLineStyle.id), 'stroke-width': 3, stroke: _self.connectorLineColor });

        _self.connectors.push({
            id: Helpers.getUUID(),
            path: path,
            point1: point1,
            point2: point2
        });
    }

    this.drawValueLabel = function (parameters, canvas, interval, position) {
        interval.text = Helpers.text(canvas, position.x, position.y - 10, interval.value, { 'font-size': 12, 'font-weight': 'bold' });
    }

    this.drawGrid = function (canvas, settings, parameters) {
        canvas.path(['M', parameters.plotArea.left, parameters.plotArea.bottom, 'L', parameters.plotArea.left, parameters.plotArea.top])
            .attr({ 'stroke-dasharray': Helpers.getLineStyle(parameters.gridLineStyle.id), stroke: _self.gridLineColor });
        
        for (var i = parameters.yAxisMin; i <= parameters.yAxisMax; i += parameters.yInterval) {
            var devicePoint1 = _self.mapToPlotAreaCoordinates(parameters, { x: 0, y: i });
            var path = ['M', devicePoint1.x, devicePoint1.y, 'L', parameters.plotArea.left + parameters.width, devicePoint1.y];
            canvas.path(path).attr({ 'stroke-dasharray': Helpers.getLineStyle(parameters.gridLineStyle.id), stroke: _self.gridLineColor });
            Helpers.text(canvas, parameters.plotArea.left - 15, devicePoint1.y, i);
        }

        var initialPosition = parameters.plotArea.left;
        for (var i = parameters.xAxisMin; i <= parameters.xAxisMax; i += parameters.xInterval) {
            _self.drawIntervalLabel(canvas, settings.frequencyPolygonChart.intervals, { x: initialPosition, y: parameters.plotArea.bottom + 18 }, i);
            initialPosition += (parameters.xInterval * parameters.ratioX);
        }
    }

    this.drawIntervalLabel = function (canvas, intervals, position, label) {
        var delta = Math.floor(intervals.length / 10);
        Helpers.text(canvas, position.x, position.y, label, { 'font-size': (11 - delta) + 'px' });
    }

    this.drawAxisTitleLabel = function (canvas, settings, parameters) {
        var xHorizontal = (parameters.plotArea.right + settings.frequencyPolygonChart.plotAreaPadding.right) / 2,
            yVertical = (parameters.plotArea.bottom + settings.frequencyPolygonChart.plotAreaPadding.bottom) / 2;

        Helpers.text(canvas, xHorizontal, 18, parameters.title, { 'font-size': 16, 'font-weight': 'bold' });
        Helpers.text(canvas, xHorizontal, parameters.plotArea.bottom + 30, parameters.xAxisTitle, { 'font-size': 12, 'font-weight': 'bold' });
        Helpers.text(canvas, 10, yVertical, parameters.yAxisTitle, { 'font-size': 12, 'font-weight': 'bold' }, 'R270 5 ' + ((parameters.plotArea.bottom + 20) / 2));
    }

    this.makeMockCircle = function (cx, cy) {
        return {
            uuid: Helpers.getUUID(),
            circle: {
                attrs: { 'cx': cx, 'cy': cy },
                data: function (key) {
                    if (key == 'id')
                        return Helpers.getUUID();
                    return null;
                }
            }
        }
    }

    this.loadIntervals = function (settings) {
        var parameters = _self.parameters(settings),
            value = _self.getMidPoint(parameters),
            initialPoint = parameters.xAxisMin,
            finalPoint = initialPoint + parameters.xInterval;

        settings.frequencyPolygonChart.intervals.length = 0;
        var index = 0;
        for (var i = parameters.xAxisMin; i < parameters.xAxisMax; i += parameters.xInterval) {
            var label = (initialPoint < 0 ? '(' + initialPoint + ')' : initialPoint) + ' - ' +
                        (finalPoint < 0 ? '(' + finalPoint + ')' : finalPoint);
            settings.frequencyPolygonChart.intervals.push({
                uuid: Helpers.getUUID(),
                label: label,
                order: settings.frequencyPolygonChart.intervals.length + 1,
                value: value,
                worth: 0,
                start: index,
                end: index + parameters.xInterval
            });
            initialPoint = finalPoint;
            finalPoint = finalPoint + parameters.xInterval;
            index += parameters.xInterval;
        }

        if (!_self.firstTime) {
            _self._parent.redraw(settings);
        } else {            
            _self.firstTime = !_self.firstTime;
        }
    }

    this.changeValue = function (settings, interval) {
        var parameters = _self.parameters(settings);
        interval.value = _self.snapToIncrement(parameters, { x: 0, y: interval.value }).y;
        _self._parent.redraw(settings);
    }

    this.getPlotArea = function (settings) {
        return {
            top: settings.frequencyPolygonChart.plotAreaPadding.top,
            left: settings.frequencyPolygonChart.plotAreaPadding.left,
            bottom: settings.container.height - settings.frequencyPolygonChart.plotAreaPadding.bottom,
            right: settings.container.width - settings.frequencyPolygonChart.plotAreaPadding.right,
        }
    }

    this.mapToChartCoordinates = function (parameters, coordinates) {
        return {
            x: Math.round((coordinates.x - parameters.plotArea.left) / parameters.ratioX),
            y: Math.round((parameters.plotArea.bottom - coordinates.y + (parameters.yAxisMin * parameters.ratioY)) / parameters.ratioY)
        };
    }

    this.mapToPlotAreaCoordinates = function (parameters, point) {
        return {
            x: Math.round((parameters.ratioX * point.x) + parameters.plotArea.left),
            y: Math.round(parameters.plotArea.bottom - (parameters.ratioY * point.y) + (parameters.yAxisMin * parameters.ratioY))
        };
    }

    this.snapToIncrement = function (parameters, point) {
        var nearest = NaN;
        for (var i = parameters.yAxisMin; i <= parameters.yAxisMax; i += parameters.yAxisScale) {
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

    this.getIntervalForCircle = function (settings, circle) {
        var intervals = settings.frequencyPolygonChart.intervals;
        for (var i = 0; i < intervals.length; i++) {
            if (intervals[i].circle.id == circle.id) {
                return intervals[i];
            }
        }
        return null;
    }

    this.getPointConnectors = function (settings, point) {
        var result = [];
        for (var i = 0; i < _self.connectors.length; i++) {
            if (_self.connectors[i].point1.uuid == point.uuid || _self.connectors[i].point2.uuid == point.uuid) {
                result.push(_self.connectors[i]);
            }
        }
        return result;
    }

    this.getMidPoint = function (parameters) {
        var middle = parameters.yAxisMin + (parameters.yAxisMax - parameters.yAxisMin) / 2;
        return _self.snapToIncrement(parameters, { x: 0, y: middle }).y;
    }

    this.parametersValidation = function (settings) {
        var xAxisMin = Number(settings.frequencyPolygonChart.xAxisMin),
            xAxisMax = Number(settings.frequencyPolygonChart.xAxisMax),
            xInterval = Number(settings.frequencyPolygonChart.xInterval),
            yAxisMin = Number(settings.frequencyPolygonChart.yAxisMin),
            yAxisMax = Number(settings.frequencyPolygonChart.yAxisMax),
            yInterval = Number(settings.frequencyPolygonChart.yInterval),
            yAxisScale = Number(settings.frequencyPolygonChart.yAxisScale);

        if (!_self.validRange(xAxisMin, xAxisMax, xInterval))
            return false;

        if (!_self.validRange(yAxisMin, yAxisMax, yInterval))
            return false;

        if (yAxisScale >= yAxisMax)
            return false;

        return true;
    }

    this.validRange = function (from, to, interval) {
        var length = to - from,
            check = false;
        if (interval < 1)
            return check;

        if (from >= 0 && to >= 0) {
            check = to > from;
        } else if (from < 0 && to < 0) {
            check = from < to;
        } else {
            check = length > 0;
        }
        return check ? length % interval == 0 : check;
    }

    this.exportJson = function (frequencyPolygonChart) {
        var result = {
            plotAreaPadding: frequencyPolygonChart.plotAreaPadding,
            title: frequencyPolygonChart.title,
            xAxisTitle: frequencyPolygonChart.xAxisTitle,
            yAxisTitle: frequencyPolygonChart.yAxisTitle,
            gridLineStyle: frequencyPolygonChart.gridLineStyle,
            connectorLineStyle: frequencyPolygonChart.connectorLineStyle,
            xAxisMin: frequencyPolygonChart.xAxisMin,
            xAxisMax: frequencyPolygonChart.xAxisMax,
            xInterval: frequencyPolygonChart.xInterval,
            yAxisMin: frequencyPolygonChart.yAxisMin,
            yAxisMax: frequencyPolygonChart.yAxisMax,
            yAxisScale: frequencyPolygonChart.yAxisScale,
            yInterval: frequencyPolygonChart.yInterval,
            strictPunctuation: frequencyPolygonChart.strictPunctuation,
            intervals: []
        };

        for (var i = 0; i < frequencyPolygonChart.intervals.length; i++) {
            result.intervals.push({
                uuid: frequencyPolygonChart.intervals[i].uuid,
                label: frequencyPolygonChart.intervals[i].label,
                order: frequencyPolygonChart.intervals[i].order,
                value: frequencyPolygonChart.intervals[i].value,
                worth: frequencyPolygonChart.intervals[i].worth,
                start: frequencyPolygonChart.intervals[i].start,
                end: frequencyPolygonChart.intervals[i].end
            });
        }

        return result;
    }

    this.toFront = function (settings) {
        for (var i = 0; i < settings.frequencyPolygonChart.intervals.length; i++) {
            settings.frequencyPolygonChart.intervals[i].circle.toFront();
        }
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

        this.attr({
            cx: position.x,
            cy: position.y
        });

        var interval = _self.getIntervalForCircle(settings, this);
        var connectors = _self.getPointConnectors(settings, interval);
        var value = _self.snapToIncrement(parameters, _self.mapToChartCoordinates(parameters, position)).y;
        interval.text.attr('y', position.y - 10);
        interval.text.attr('text', value);
        $('tspan', interval.text.node).attr('dy', 0);

        for (var i = 0; i < connectors.length; i++) {
            var c = connectors[i];
            var path = [];
            if (c.point1.uuid == interval.uuid) {
                path = ['M', interval.circle.attrs['cx'], interval.circle.attrs['cy'], 'L', c.point2.circle.attrs['cx'], c.point2.circle.attrs['cy']];
            } else {
                path = ['M', c.point1.circle.attrs['cx'], c.point1.circle.attrs['cy'], 'L', interval.circle.attrs['cx'], interval.circle.attrs['cy']];
            }
            c.path.attr('path', path);
        }
    }

    this.onEnd = function () {
        var settings = _self._parent.settings,
            parameters = _self.parameters(settings),
            interval = _self.getIntervalForCircle(settings, this),
            position = { x: interval.circle.attrs['cx'], y: interval.circle.attrs['cy'] };

        interval.value = _self.snapToIncrement(parameters, _self.mapToChartCoordinates(parameters, position)).y;

        this.attr('fill', _self.pointColor);
        _self._parent.scope.$apply();
    }

    /************************ Drag and Drop ************************/
}