function StemLeafPlot(parent) {
    var _self = this;
    this._parent = parent;

    this.parameters = function (settings) {
        var plotArea = _self.getPlotArea(settings),
            leafDelimiter = settings.stemLeafPlot.leafDelimiter;

        leafDelimiter = leafDelimiter == '' ? '-' : leafDelimiter;
        settings.stemLeafPlot.leafDelimiter;
            
        return {
            plotArea: plotArea,
            leafDelimiter: leafDelimiter,
            strictPunctuation: Boolean(settings.stemLeafPlot.strictPunctuation)
        }
    }

    this.redraw = function (settings, canvas) {
        if (settings.chartType.id != 'stem-leaf-plot') {
            return;
        }

        _self.defineStems(canvas, settings);
    }

    this.setViewMode = function (settings, viewMode) {
        if (settings.chartType.id != 'stem-leaf-plot') {
            return;
        }

        if (viewMode == 'teacher') {
            settings.stemLeafPlot.stems.length = 0;
            for (var i = 0; i < settings.stemLeafPlot.teacherStems.length; i++) {
                settings.stemLeafPlot.stems.push({
                    uuid: settings.stemLeafPlot.teacherStems[i].uuid,
                    label: settings.stemLeafPlot.teacherStems[i].label,
                    order: settings.stemLeafPlot.teacherStems[i].order,
                    value: settings.stemLeafPlot.teacherStems[i].value,
                    stringValue: settings.stemLeafPlot.teacherStems[i].stringValue,
                    worth: settings.stemLeafPlot.teacherStems[i].worth,
                });
            }
        } else {
            settings.stemLeafPlot.teacherStems.length = 0;
            for (var i = 0; i < settings.stemLeafPlot.stems.length; i++) {
                settings.stemLeafPlot.teacherStems.push({
                    uuid: settings.stemLeafPlot.stems[i].uuid,
                    label: settings.stemLeafPlot.stems[i].label,
                    order: settings.stemLeafPlot.stems[i].order,
                    value: settings.stemLeafPlot.stems[i].value,
                    stringValue: settings.stemLeafPlot.stems[i].stringValue,
                    worth: settings.stemLeafPlot.stems[i].worth,
                });
            }

            settings.stemLeafPlot.stems.length = 0;
        }
        _self._parent.redraw(settings);
    }

    this.submitAnswerFromPreview = function (settings) {
        if (settings.chartType.id != 'stem-leaf-plot') {
            return;
        }

        var parameters = _self.parameters(settings),
            teacherStems = settings.stemLeafPlot.teacherStems,
            studentStems = settings.stemLeafPlot.stems,
            totalWorth = 0,
            correctStems = 0,
            gotWorth = 0;

        for (var i = 0; i < teacherStems.length; i++) {
            totalWorth += Number(teacherStems[i].worth);
            if (i < studentStems.length) {
                if (_self.equalsArrays(studentStems[i].value, teacherStems[i].value) && studentStems[i].label === teacherStems[i].label) {
                    correctStems++;
                    gotWorth += Number(teacherStems[i].worth);
                }
            }
        }

        if (parameters.strictPunctuation) {
            correctStems = correctStems == teacherStems.length ? correctStems : 0;
            gotWorth = correctStems == teacherStems.length ? gotWorth : 0;
        }

        var message = "Correct stems: " + correctStems + "\n";
        message += "Worth: " + gotWorth + " / " + totalWorth;
        alert(message);
    }

    this.defineStems = function (canvas, settings) {
        var stems = settings.stemLeafPlot.stems;
        if (stems.length == 0)
            return;

        for (var i = 0; i < stems.length; i++) {
            _self.defineStem(settings, canvas, stems, i);
        }
    }

    this.defineStem = function (settings, canvas, stems, i) {
        var parameters = _self.parameters(settings);
        stems[i].value = _self.mapValues(parameters, stems[i].stringValue);
    }

    this.addStem = function (settings) {
        var stems = settings.stemLeafPlot.stems;
        stems.push({
            uuid: Helpers.getUUID(),
            label: stems.length + 1,
            order: stems.length + 1,
            value: [],
            stringValue: "",
            worth: 0
        });
        _self._parent.redraw(settings);
    }

    this.removeStem = function (settings, p) {
        BootstrapDialog.confirm('Are you sure?', function (result) {
            if (result) {
                _self.deleteStem(settings, p);
            }
        });
    }

    this.deleteStem = function (settings, p) {
        for (i = 0; i < settings.stemLeafPlot.stems.length; i++) {
            if (settings.stemLeafPlot.stems[i].uuid == p.uuid) {
                settings.stemLeafPlot.stems.splice(i, 1);
            }
            _self._parent.redraw(settings);
        }
        _self._parent.scope.$apply();
    }

    this.mapValues = function (parameters, value) {
        var array = [],
            valuesArray = value.split(parameters.leafDelimiter);
        
        for (var i = 0; i < valuesArray.length; i++) {
            if (!isNaN(valuesArray[i]) && valuesArray[i] !== '') {
                array.push(Number(valuesArray[i]));
            }
        }        
        return array;
    }

    this.sortAscendent = function numOrdA(a, b) {
        return (a - b);
    }

    this.getPlotArea = function (settings) {
        return {
            top: settings.stemLeafPlot.plotAreaPadding.top,
            left: settings.stemLeafPlot.plotAreaPadding.left,
            bottom: settings.container.height - settings.stemLeafPlot.plotAreaPadding.bottom,
            right: settings.container.width - settings.stemLeafPlot.plotAreaPadding.right,
        }
    }

    this.equalsArrays = function (a, b) {
        if (a.length != b.length)
            return false;

        var result = true;
        for (var i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) {
                result = false;
                break;
            }
        }

        return result;
    }

    this.exportJson = function (stemLeafPlot) {
        var result = {
            leafDelimiter: stemLeafPlot.leafDelimiter,
            strictPunctuation: stemLeafPlot.strictPunctuation,
            plotAreaPadding: stemLeafPlot.plotAreaPadding,
            stems: [],
        };

        for (var i = 0; i < stemLeafPlot.stems.length; i++) {
            var src = stemLeafPlot.stems[i];
            result.stems.push({
                uuid: src.uuid,
                label: src.label,
                order: src.order,
                value: src.value,
                stringValue: src.stringValue,
                worth: src.worth
            });
        }
        return result;
    }
}