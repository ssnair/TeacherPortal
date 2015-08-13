function Histogram(parent) {
    var _self = this;
    this._parent = parent;
    this.gridLineColor = '#878787';
    this.gridLineColor = '#878787';
    this.firstTime = true;
    
    this.bars = _self._parent.canvas.set();
    
    this.parameters = function (settings) {
        var plotArea = _self.getPlotArea(settings),
            height = plotArea.bottom - plotArea.top,
            width = (plotArea.right - 5) - (plotArea.left + 5),
            xAxisMin = Number(settings.histogram.xAxisMin),
            xAxisMax = Number(settings.histogram.xAxisMax),
            xInterval = Number(settings.histogram.xInterval),
            yAxisMin = Number(settings.histogram.yAxisMin),
            yAxisMax = Number(settings.histogram.yAxisMax),
            yInterval = Number(settings.histogram.yInterval),
            yAxisScale = Helpers.validateMinValue(Number(settings.histogram.yAxisScale), 1);

        settings.histogram.yAxisScale = yAxisScale;

        return {
            plotArea: plotArea,
            strictPunctuation: Boolean(settings.histogram.strictPunctuation),
            gridLineStyle: settings.histogram.gridLineStyle,
            height: height,
            width: width,
            xAxisMin: xAxisMin,
            xAxisMax: xAxisMax,
            xInterval: xInterval,
            yAxisMin: yAxisMin,
            yAxisMax: yAxisMax,
            yInterval: yInterval,
            yAxisScale: yAxisScale,
            title: settings.histogram.title,
            xAxisTitle: settings.histogram.xAxisTitle,
            yAxisTitle: settings.histogram.yAxisTitle,
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
        if (settings.chartType.id != 'histogram') {
            return;
        }

        if (_self.firstTime && (typeof settings.id === 'undefined' || settings.id == 0)) {
            _self.loadIntervals(settings);
        }
        var parameters = _self.parameters(settings);
        _self.drawIntervals(canvas, settings, parameters);
    }

    this.setViewMode = function (settings, viewMode) {
        if (settings.chartType.id != 'histogram') {
            return;
        }

        if (viewMode == 'teacher') {
            settings.histogram.intervals.length = 0;
            for (var i = 0; i < settings.histogram.teacherIntervals.length; i++) {
                settings.histogram.intervals.push({
                    uuid: settings.histogram.teacherIntervals[i].uuid,
                    label: settings.histogram.teacherIntervals[i].label,
                    order: settings.histogram.teacherIntervals[i].order,
                    value: settings.histogram.teacherIntervals[i].value,
                    worth: settings.histogram.teacherIntervals[i].worth,
                    start: settings.histogram.teacherIntervals[i].start,
                    end: settings.histogram.teacherIntervals[i].end,
                    color: settings.histogram.teacherIntervals[i].color
                });
            }
        } else {
            settings.histogram.teacherIntervals.length = 0;
            for (var i = 0; i < settings.histogram.intervals.length; i++) {
                settings.histogram.teacherIntervals.push({
                    uuid: settings.histogram.intervals[i].uuid,
                    label: settings.histogram.intervals[i].label,
                    order: settings.histogram.intervals[i].order,
                    value: settings.histogram.intervals[i].value,
                    worth: settings.histogram.intervals[i].worth,
                    start: settings.histogram.intervals[i].start,
                    end: settings.histogram.intervals[i].end,
                    color: settings.histogram.intervals[i].color
                });
            }

            _self.loadIntervals(settings);
        }
        _self._parent.redraw(settings);
    }

    this.submitAnswerFromPreview = function (settings) {
        if (settings.chartType.id != 'histogram') {
            return;
        }

        var parameters = _self.parameters(settings),
            teacherIntervals = settings.histogram.teacherIntervals,
            studentIntervals = settings.histogram.intervals,
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
        var intervals = settings.histogram.intervals;
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
        intervals[i].rect = canvas.rect(xi, y, xf - xi, parameters.plotArea.bottom - y + 5)
            .attr({ 'fill': intervals[i].color })
            .drag(_self.onMove, _self.onStart, _self.onEnd);

        _self.drawValueLabel(parameters, canvas, intervals[i], { x: middle, y: y });
    }

    this.drawValueLabel = function (parameters, canvas, interval, position) {
        interval.text = Helpers.text(canvas, position.x, position.y - 5, interval.value, { 'font-size': 12, 'font-weight': 'bold' });
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
            _self.drawIntervalLabel(canvas, settings.histogram.intervals, { x: initialPosition, y: parameters.plotArea.bottom + 18 }, i);
            initialPosition += (parameters.xInterval * parameters.ratioX);
        }
    }

    this.drawIntervalLabel = function (canvas, intervals, position, label) {
        var delta = Math.floor(intervals.length / 10);
        Helpers.text(canvas, position.x, position.y, label, { 'font-size': (11 - delta) + 'px' });
    }

    this.drawAxisTitleLabel = function (canvas, settings, parameters) {
        var xHorizontal = (parameters.plotArea.right + settings.histogram.plotAreaPadding.right) / 2,
            yVertical = (parameters.plotArea.bottom + settings.histogram.plotAreaPadding.bottom) / 2;

        Helpers.text(canvas, xHorizontal, 18, parameters.title, { 'font-size': 16, 'font-weight': 'bold' });
        Helpers.text(canvas, xHorizontal, parameters.plotArea.bottom + 30, parameters.xAxisTitle, { 'font-size': 12, 'font-weight': 'bold' });
        Helpers.text(canvas, 10, yVertical, parameters.yAxisTitle, { 'font-size': 12, 'font-weight': 'bold' }, 'R270 5 ' + ((parameters.plotArea.bottom + 20) / 2));
    }

    this.loadIntervals = function (settings) {
        var parameters = _self.parameters(settings),
            value = _self.getMidPoint(parameters),
            initialPoint = parameters.xAxisMin,
            finalPoint = initialPoint + parameters.xInterval;

        settings.histogram.intervals.length = 0;
        var index = 0;
        for (var i = parameters.xAxisMin; i < parameters.xAxisMax; i += parameters.xInterval) {
            var label = (initialPoint < 0 ? '(' + initialPoint + ')' : initialPoint) + ' - ' +
                        (finalPoint < 0 ? '(' + finalPoint + ')' : finalPoint);
            settings.histogram.intervals.push({
                uuid: Helpers.getUUID(),
                label: label,
                order: settings.histogram.intervals.length + 1,
                value: value,
                worth: 0,
                start: index,
                end: index + parameters.xInterval,
                color: '#ff0000'
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
            top: settings.histogram.plotAreaPadding.top,
            left: settings.histogram.plotAreaPadding.left,
            bottom: settings.container.height - settings.histogram.plotAreaPadding.bottom,
            right: settings.container.width - settings.histogram.plotAreaPadding.right,
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

    this.getIntervalForRect = function (settings, rect) {
        var intervals = settings.histogram.intervals;
        for (var i = 0; i < intervals.length; i++) {
            if (intervals[i].rect.id == rect.id) {
                return intervals[i];
            }
        }
        return null;
    }

    this.getMidPoint = function (parameters) {
        var middle = parameters.yAxisMin + (parameters.yAxisMax - parameters.yAxisMin) / 2;
        return _self.snapToIncrement(parameters, { x: 0, y: middle }).y;
    }

    this.parametersValidation = function (settings) {
        var xAxisMin = Number(settings.histogram.xAxisMin),
            xAxisMax = Number(settings.histogram.xAxisMax),
            xInterval = Number(settings.histogram.xInterval),
            yAxisMin = Number(settings.histogram.yAxisMin),
            yAxisMax = Number(settings.histogram.yAxisMax),
            yInterval = Number(settings.histogram.yInterval),
            scale = Number(settings.histogram.yAxisScale);
        
        if (!_self.validRange(xAxisMin, xAxisMax, xInterval))
            return false;

        if (!_self.validRange(yAxisMin, yAxisMax, yInterval))
            return false;

        if (scale >= yAxisMax)
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

    this.exportJson = function (histogram) {
        var result = {
            plotAreaPadding: histogram.plotAreaPadding,
            xAxisMin: histogram.xAxisMin,
            xAxisMax: histogram.xAxisMax,
            xInterval: histogram.xInterval,
            yAxisMin: histogram.yAxisMin,
            yAxisMax: histogram.yAxisMax,
            yAxisScale: histogram.yAxisScale,
            yInterval: histogram.yInterval,
            title: histogram.title,
            xAxisTitle: histogram.xAxisTitle,
            yAxisTitle: histogram.yAxisTitle,
            gridLineStyle: histogram.gridLineStyle,
            strictPunctuation: histogram.strictPunctuation,
            intervals: []
        };

        for (var i = 0; i < histogram.intervals.length; i++) {
            result.intervals.push({
                uuid: histogram.intervals[i].uuid,
                label: histogram.intervals[i].label,
                order: histogram.intervals[i].order,
                value: histogram.intervals[i].value,
                worth: histogram.intervals[i].worth,
                start: histogram.intervals[i].start,
                end: histogram.intervals[i].end,
                color: histogram.intervals[i].color
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

        this.attr({
            x: position.x,
            y: position.y,
            height: parameters.plotArea.bottom - position.y + 5
        });

        var interval = _self.getIntervalForRect(settings, this);
        var value = _self.snapToIncrement(parameters, _self.mapToChartCoordinates(parameters, position)).y;
        interval.text.attr('y', position.y - 5);
        interval.text.attr('text', value);
        $('tspan', interval.text.node).attr('dy', 0);
    }

    this.onEnd = function () {
        var settings = _self._parent.settings,
            parameters = _self.parameters(settings),
            interval = _self.getIntervalForRect(settings, this),
            position = { x: interval.rect.attrs['x'], y: interval.rect.attrs['y'] };

        interval.value = _self.snapToIncrement(parameters, _self.mapToChartCoordinates(parameters, position)).y;

        this.attr('fill-opacity', 1);
        _self._parent.scope.$apply();
    }

    /************************ Drag and Drop ************************/
}