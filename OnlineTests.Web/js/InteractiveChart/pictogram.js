function Pictogram(parent) {
    var _self = this;
    this._parent = parent;
    this.firstTime = true;

    this.parameters = function (settings) {        
        var plotArea = _self.getPlotArea(settings),
            seriesValue = Helpers.validateMinValue(Number(settings.pictogram.seriesValue), 1),
            symbolValue = Helpers.validateMinValue(Number(settings.pictogram.symbolValue), 1),
            symbolWidth = Number(settings.pictogram.symbolWidth),
            symbolHeight = Number(settings.pictogram.symbolHeight);

        symbolValue = symbolValue > 10 ? 10 : symbolValue;
        symbolWidth = symbolWidth < 25 ? 25 : symbolWidth;
        symbolHeight = symbolHeight < 25 ? 25 : symbolHeight;
        settings.pictogram.symbolWidth = symbolWidth;
        settings.pictogram.symbolHeight = symbolHeight;
        settings.pictogram.seriesValue = seriesValue;
        settings.pictogram.symbolValue = symbolValue;

        return {
            plotArea: plotArea,
            strictPunctuation: Boolean(settings.pictogram.strictPunctuation),
            symbol: settings.pictogram.symbol,
            symbolEmboss: settings.pictogram.symbolEmboss,
            seriesValue: seriesValue,
            symbolValue: symbolValue,
            symbolWidth: symbolWidth,
            symbolHeight: symbolHeight,
            symbolRatio: symbolWidth / symbolHeight,
            title: settings.pictogram.title,
            labelWidth: (plotArea.right - plotArea.left) * 0.15,
            valuesWidth: (plotArea.right - plotArea.left) * 0.85,
            divisionWidth: symbolWidth / symbolValue
        }
    }

    this.redraw = function (settings, canvas) {
        if (settings.chartType.id != 'pictogram') {
            return;
        }
        
        var parameters = _self.parameters(settings);
        _self.drawAxisTitleLabel(canvas, settings, parameters);
        if (_self.firstTime) {
            _self.changeImageColor(settings);
            _self.firstTime = false;
        }        
        _self.drawSeries(canvas, settings, parameters);
    }

    this.setViewMode = function (settings, viewMode) {
        if (settings.chartType.id != 'pictogram') {
            return;
        }
        
        if (viewMode == 'teacher') {
            settings.pictogram.series.length = 0;

            for (var i = 0; i < settings.pictogram.teacherSeries.length; i++) {
                settings.pictogram.series.push({
                    uuid: settings.pictogram.teacherSeries[i].uuid,
                    label: settings.pictogram.teacherSeries[i].label,
                    order: settings.pictogram.teacherSeries[i].order,
                    value: settings.pictogram.teacherSeries[i].value,
                    worth: settings.pictogram.teacherSeries[i].worth,
                });
            }
        } else {
            settings.pictogram.teacherSeries.length = 0;
            for (var i = 0; i < settings.pictogram.series.length; i++) {
                settings.pictogram.teacherSeries.push({
                    uuid: settings.pictogram.series[i].uuid,
                    label: settings.pictogram.series[i].label,
                    order: settings.pictogram.series[i].order,
                    value: settings.pictogram.series[i].value,
                    worth: settings.pictogram.series[i].worth,
                });
                settings.pictogram.series[i].value = 0;
            }
        }
        _self._parent.redraw(settings);
    }

    this.submitAnswerFromPreview = function (settings) {
        if (settings.chartType.id != 'pictogram') {
            return;
        }

        var parameters = _self.parameters(settings),
            teacherSeries = settings.pictogram.teacherSeries,
            studentSeries = settings.pictogram.series,
            totalWorth = 0,
            correctSeries = 0,
            gotWorth = 0;            

        for (var i = 0; i < teacherSeries.length; i++) {
            totalWorth += Number(teacherSeries[i].worth);
            if (studentSeries[i].value == teacherSeries[i].value) {
                correctSeries++;
                gotWorth += Number(teacherSeries[i].worth);
            }
        }

        if (parameters.strictPunctuation) {
            correctSeries = correctSeries == teacherSeries.length ? correctSeries : 0;
            gotWorth = correctSeries == teacherSeries.length ? gotWorth : 0;
        }

        var message = 'Correct series: ' + correctSeries + '\n';
        message += 'Worth: ' + gotWorth + " / " + totalWorth;
        alert(message);
    }

    this.drawSeries = function (canvas, settings, parameters) {
        var series = settings.pictogram.series;
        if (series.length > 0) {
            for (var i = 0; i < series.length; i++) {
                _self.drawSerie(settings, parameters, series, i, canvas);
            }
        }        
    }

    this.drawSerie = function (settings, parameters, series, i, canvas) {
        series[i].value = _self.snapToScale(parameters, series[i].value);

        var x = parameters.plotArea.left + parameters.labelWidth,
            y = parameters.plotArea.top + (i * (parameters.symbolHeight + 5)),
            ly = y + 8 + (parameters.symbolHeight / 2);

        Helpers.text(canvas, parameters.plotArea.left, ly, series[i].label, { 'font-size': 13, 'text-anchor': 'start' });
        
        var startRange = 1,
            endRange = parameters.symbolValue;
        for (var index = 1; index <= parameters.seriesValue; index++) {
            if (series[i].value < startRange) {
                _self.drawSymbol(canvas, parameters, parameters.symbolEmboss, x, y, series[i], { start: startRange, end: endRange }, false);
            } else if (series[i].value >= endRange) {
                _self.drawSymbol(canvas, parameters, parameters.symbol, x, y, series[i], { start: startRange, end: endRange }, false);
            } else if (series[i].value >= startRange && series[i].value < endRange) {
                _self.drawSymbol(canvas, parameters, parameters.symbol, x, y, series[i], { start: startRange, end: endRange }, true, 0);
                _self.drawSymbol(canvas, parameters, parameters.symbolEmboss, x, y, series[i], { start: startRange, end: endRange }, true, 1);
            }

            x += (parameters.symbolWidth + 5);
            startRange = endRange + 1;
            endRange = startRange + parameters.symbolValue - 1;
        }
    }

    this.drawSymbol = function (canvas, parameters, symbol, x, y, serie, range, middleValue, sector) {
        var image = canvas.image(symbol, x, y, parameters.symbolWidth, parameters.symbolHeight);
        image.node.value = serie.value + '_' + range.start + '_' + range.end + '_' + serie.uuid;
        image.click(_self.onClick);
        if (middleValue) {
            var selectedValue = parameters.divisionWidth * (serie.value - (range.start - 1)),
                unseledtedValue = parameters.symbolWidth - selectedValue,
                newX = sector == 0 ? x : x + selectedValue;
            image.attr({ 'clip-rect': [newX, y, sector == 0 ? selectedValue : unseledtedValue, parameters.symbolHeight] });
        }
    }

    this.drawAxisTitleLabel = function (canvas, settings, parameters) {
        var xHorizontal = (parameters.plotArea.right + settings.pictogram.plotAreaPadding.right) / 2,
            yVertical = (parameters.plotArea.bottom + settings.pictogram.plotAreaPadding.bottom) / 2;

        Helpers.text(canvas, xHorizontal, 18, parameters.title, { 'font-size': 16, 'font-weight': 'bold' });
    }

    this.addSerie = function (settings) {
        var parameters = _self.parameters(settings);
        if (parameters.symbol == '')
            return;

        settings.pictogram.series.push({
            uuid: Helpers.getUUID(),
            label: "Serie " + (settings.pictogram.series.length + 1),
            order: settings.pictogram.series.length + 1,
            value: 0,
            worth: 0
        });
        _self._parent.redraw(settings);
    }

    this.removeSerie = function (settings, p) {
        BootstrapDialog.confirm('Are you sure?', function (result) {
            if (result) {
                for (i = 0; i < settings.pictogram.series.length; i++) {
                    if (settings.pictogram.series[i].uuid == p.uuid) {
                        settings.pictogram.series.splice(i, 1);
                    }
                    _self._parent.redraw(settings);
                }
                _self._parent.scope.$apply();
            }
        });
    }

    this.changeSymbol = function (settings) {
        _self.changeImageColor(settings);        
    }

    this.changeValue = function (settings, serie) {
        var parameters = _self.parameters(settings);
        serie.value = _self.snapToScale(parameters, serie.value);
        _self._parent.redraw(settings);
    }

    this.loadImageOnCanvas = function (settings) {
        var parameters = _self.parameters(settings);
        if (parameters.symbol != '') {            
            var canvas = document.getElementById('show-symbol'),
                context = canvas.getContext('2d'),
                image = new Image();
            image.onload = function (img) {
                var width = 35;
                var height = 35;
                canvas.width = width;
                canvas.height = height;
                context.clearRect(0, 0, width, height);
                context.drawImage(image, 0, 0, width, height);
            };
            image.src = parameters.symbol;
        }
    }

    this.changeImageColor = function (settings) {
        var parameters = _self.parameters(settings);
        if (parameters.symbol != '') {
            var filePath = window.location.href;
            filePath = filePath.replace('home', 'Content');
            filePath = filePath.replace('interactivechart', 'pixastic/js/');

            var canvas = document.getElementById('output-canvas'),
                context = canvas.getContext('2d'),
                pixastic;

            var options = {
                amount: 0.5,
                angle: 135 / 180 * Math.PI
            };

            var image = new Image();
            image.onload = function (img) {                
                canvas.style.display = "none";
                canvas.width = image.width;
                canvas.height = image.height;
                context.drawImage(image, 0, 0);
                pixastic = new Pixastic(context,filePath);
                pixastic['emboss'](options).done(function () {
                    //canvas.style.display = "block";
                    settings.pictogram.symbolEmboss = canvas.toDataURL();
                    //_self.graySymbol = canvas.toDataURL();
                    _self.loadImageOnCanvas(settings);
                    _self._parent.redraw(settings);
                }, function (p) { });
            };
            image.src = parameters.symbol;            
        }
    }

    this.getPlotArea = function (settings) {
        return {
            top: settings.pictogram.plotAreaPadding.top,
            left: settings.pictogram.plotAreaPadding.left,
            bottom: settings.container.height - settings.pictogram.plotAreaPadding.bottom,
            right: settings.container.width - settings.pictogram.plotAreaPadding.right,
        }
    }

    this.snapToScale = function (parameters, value) {
        var maxValue = parameters.seriesValue * parameters.symbolValue;
        value = Math.round(value);
        return value > maxValue ? maxValue : value < 0 ? 0 : value;        
    }

    this.snapToRange = function (value, start, end) {
        return value > start ? start : value < end ? end : value;
    }

    this.getElementByUUID = function (settings, uuid) {
        var series = settings.pictogram.series;
        for (var i = 0; i < series.length; i++) {
            if (series[i].uuid == uuid) {
                return series[i];
            }
        }
        return null;
    }

    this.onClick = function (e) {
        var references = e.target.value.split('_'),
            settings = _self._parent.settings,            
            value = Number(references[0]),
            start = Number(references[1]),
            end = Number(references[2]);
        
        if (value < start) {
            value = _self.snapToRange(end, start, end);
        } else if (value > end) {
            value = _self.snapToRange(start, start, end);
        } else {
            if (value == end) {      
                value = start - 1;
            } else {
                value += 1;
            }
        }

        serie = _self.getElementByUUID(settings, references[3]);
        serie.value = value;        

        _self._parent.redraw(settings);
        _self._parent.scope.$apply();
    }

    this.exportJson = function (pictogram) {
        var result = {
            plotAreaPadding: pictogram.plotAreaPadding,
            strictPunctuation: pictogram.strictPunctuation,
            seriesValue: pictogram.seriesValue,
            symbolValue: pictogram.symbolValue,
            symbolWidth: pictogram.symbolWidth,
            symbolHeight: pictogram.symbolHeight,
            symbolSize: pictogram.symbolSize,
            symbol: pictogram.symbol,
            symbolEmboss: pictogram.symbolEmboss,
            key: pictogram.key,
            title: pictogram.title,
            series: []
        };

        for (var i = 0; i < pictogram.series.length; i++) {
            var src = pictogram.series[i];
            result.series.push({
                uuid: src.uuid,
                label: src.label,
                order: src.order,
                value: src.value,
                worth: src.worth
            });
        }
        return result;
    }

}