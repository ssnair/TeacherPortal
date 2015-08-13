function PieChart(parent) {
    var _self = this;
    this._parent = parent;

    this.startAngle = 0;
    this.sectors = _self._parent.canvas.set();
    this.points = _self._parent.canvas.set();    
    this.teacherPoints = _self._parent.canvas.set();
    this.teacherSectors = _self._parent.canvas.set();
    this.oldArea = 0;

    this.direction = {
        before: false,
        after: true
    }

    this.parameters = function(settings){
        var plotArea = _self.getPlotArea(settings),
            labelOutsideLocation = Boolean(settings.pieChart.labelOutsideLocation),
            height = plotArea.bottom - (plotArea.top + 30),
            width = plotArea.right - plotArea.left,
            radius = Math.min(height, width) / 2,
            rad = 180 / Math.PI,
            deg = Math.PI / 180,
            scale = Number(settings.pieChart.scale),
            area = Number(settings.pieChart.totalArea),
            cx = (width / 2) + settings.pieChart.plotAreaPadding.left,
            cy = (height / 2) + (settings.pieChart.plotAreaPadding.top + 20);

        return {
            title: settings.pieChart.title,
            scale: scale,
            labelsOutside: labelOutsideLocation,
            strictPunctuation: Boolean(settings.pieChart.strictPunctuation),
            area: area,            
            plotArea: plotArea,
            height: height,
            width: width,
            radius: radius,
            rad: rad,
            deg: deg,
            cx: cx,
            cy: cy
        }        
    }
    
    this.redraw = function (settings, canvas) {
        if (settings.chartType.id != 'pie-chart') {
            return;
        }
        
        _self.drawAxisTitleLabel(canvas, settings, _self.parameters(settings));
        _self.drawSlices(canvas, settings);
        if (_self.points.length > 0) {
            _self.points.toFront();
        }        
    }

    this.setViewMode = function (settings, viewMode) {
        if (settings.chartType.id != 'pie-chart') {
            return;
        }

        if (viewMode == "teacher") {
            settings.pieChart.slices.length = 0;
            for (var i = 0; i < settings.pieChart.teacherSlices.length; i++) {
                settings.pieChart.slices.push({
                    uuid: settings.pieChart.teacherSlices[i].uuid,
                    label: settings.pieChart.teacherSlices[i].label,
                    order: settings.pieChart.teacherSlices[i].order,
                    value: settings.pieChart.teacherSlices[i].value,
                    oldValue: settings.pieChart.teacherSlices[i].oldValue,
                    worth: settings.pieChart.teacherSlices[i].worth,
                    percentage: settings.pieChart.teacherSlices[i].percentage,
                    color: settings.pieChart.teacherSlices[i].color
                });
            }

            _self.points.length = 0;
            for (var i = 0; i < _self.teacherPoints.length; i++) {
                _self.points.push(_self.teacherPoints[i]);
            }

            _self.sectors.length = 0;
            for (var i = 0; i < _self.teacherSectors.length; i++) {
                _self.sectors.push(_self.teacherSectors[i]);
            }
        } else {
            settings.pieChart.teacherSlices.length = 0;
            for (var i = 0; i < settings.pieChart.slices.length; i++) {                
                settings.pieChart.teacherSlices.push({
                    uuid: settings.pieChart.slices[i].uuid,
                    label: settings.pieChart.slices[i].label,
                    order: settings.pieChart.slices[i].order,
                    value: settings.pieChart.slices[i].value,
                    oldValue: settings.pieChart.slices[i].oldValue,
                    worth: settings.pieChart.slices[i].worth,
                    percentage: settings.pieChart.slices[i].percentage,
                    color: settings.pieChart.slices[i].color
                });
            }
            settings.pieChart.slices.length = 0;

            _self.teacherPoints.length = 0;
            for (var i = 0; i < _self.points.length; i++) {
                _self.teacherPoints.push(_self.points[i]);
            }
            _self.points.length = 0;

            _self.teacherSectors.length = 0;
            for (var i = 0; i < _self.sectors.length; i++) {
                _self.teacherSectors.push(_self.sectors[i]);
            }
            _self.sectors.length = 0;
        }
        _self._parent.redraw(settings);
    }

    this.submitAnswerFromPreview = function (settings) {
        if (settings.chartType.id != 'pie-chart') {
            return;
        }

        var parameters = _self.parameters(settings),
            teacherSlices = settings.pieChart.teacherSlices,
            studentSlices = settings.pieChart.slices,
            totalWorth = 0,
            correctSlices = 0,
            gotWorth = 0;

        for (var i = 0; i < teacherSlices.length; i++) {
            totalWorth += Number(teacherSlices[i].worth);
            if (studentSlices[i].value == teacherSlices[i].value) {
                correctSlices++;
                gotWorth += Number(teacherSlices[i].worth);
            }
        }

        if (parameters.strictPunctuation) {
            correctSlices = correctSlices == teacherSlices.length ? correctSlices : 0;
            gotWorth = correctSlices == teacherSlices.length ? gotWorth : 0;
        }

        var message = "Correct slices: " + correctSlices + "\n";
        message += "Worth: " + gotWorth + " / " + totalWorth;
        alert(message);
    }

    this.drawSlices = function (canvas, settings) {
        var slices = settings.pieChart.slices;        
        if (slices.length == 0)
            return;
        
        _self.startAngle = 0;
        _self.points = this._parent.canvas.set();
        _self.sectors = this._parent.canvas.set();

        if (slices.length == 1) {
            _self.drawSingleSlice(settings, slices, canvas);
        } else {
            for (var i = 0; i < slices.length; i++) {
                _self.drawSlice(settings, slices, i, canvas);
            }
        }        
    }

    this.drawSingleSlice = function (settings, slices, canvas) {
        var parameters = _self.parameters(settings);
        var circle = canvas.circle(parameters.cx, parameters.cy, parameters.radius);
        circle.attr("stroke", "black").attr('stroke-width', 2);
        circle.attr("fill", slices[0].color);
        slices[0].circle = circle;
        var x = parameters.labelsOutside ? parameters.cx + (parameters.radius + 30) * Math.cos(-135 * parameters.deg) : parameters.cx,
            y = parameters.labelsOutside ? parameters.cy + (parameters.radius + 20) * Math.sin(-135 * parameters.deg) : parameters.cy;
        Helpers.text(canvas, x, y, slices[0].label + ' - ' + parameters.area, { 'font-size': 11, 'font-weight': 'normal' });
    }

    this.drawSlice = function (settings, slices, i, canvas) {        
        var parameters = _self.parameters(settings),
            endAngle = ((slices[i].value / parameters.area) * 360) + _self.startAngle;

        _self.oldArea = parameters.area;
        
        var x1 = parameters.cx + parameters.radius * Math.cos(-_self.startAngle * parameters.deg),
            x2 = parameters.cx + parameters.radius * Math.cos(-endAngle * parameters.deg),
            y1 = parameters.cy + parameters.radius * Math.sin(-_self.startAngle * parameters.deg),
            y2 = parameters.cy + parameters.radius * Math.sin(-endAngle * parameters.deg);

        _self.sectors.push(canvas.path(["M", parameters.cx, parameters.cy, "L", x1, y1, "A", parameters.radius, parameters.radius, 0, +(endAngle - _self.startAngle > 180), 0, x2, y2, "z"])
            .attr({ 'fill': slices[i].color }));
        _self.sectors[i].data({
            'startAngle': _self.startAngle,
            'endAngle': endAngle
        });

        slices[i].startAngle = _self.startAngle;
        slices[i].endAngle = endAngle;
        
        _self.drawLabel(parameters, canvas, slices[i], _self.startAngle, endAngle, slices[i].label + ' - ' + slices[i].value);
        
        if (i != slices.length - 1) {            
            _self.points.push(canvas.circle(x2, y2, 7)
                .attr({ fill: '#f00', cursor: 'pointer' })
                .data({ 'index': i, 'startAngle': _self.startAngle, 'endAngle': endAngle })
                .drag(_self.movePath, _self.startPath, _self.upPath));
        }
        
        _self.startAngle = endAngle;
    }

    this.drawLabel = function (parameters, canvas, slice, startAngle, endAngle, message) {
        var angle = startAngle + (endAngle - startAngle) / 2,
            deltaX = parameters.labelsOutside ? 40 : -40,
            deltaY = parameters.labelsOutside ? 15 : -40,
            labelXPosition = parameters.cx + (parameters.radius + deltaX) * Math.cos(-angle * parameters.deg),
            labelYPosition = parameters.cy + (parameters.radius + deltaY) * Math.sin(-angle * parameters.deg);

        slice.text = Helpers.text(canvas, labelXPosition, labelYPosition, message, { 'font-size': 11, 'font-weight': 'normal' });
        if (!parameters.labelsOutside) {
            var textAngle = Math.abs(180 - angle) > 90 ? 360 - angle : 180 - angle;
            slice.text.transform('R' + textAngle + ' ' + labelXPosition + ' ' + labelYPosition);
        }
    }

    this.drawAxisTitleLabel = function (canvas, settings, parameters) {
        var xHorizontal = (parameters.plotArea.right + settings.pieChart.plotAreaPadding.right) / 2;
        Helpers.text(canvas, xHorizontal, 18, parameters.title, { 'font-size': 16, 'font-weight': 'bold' });
    }

    this.addSlice = function (settings) {
        if (!_self.parametersValidation(settings))
            return;

        var parameters = _self.parameters(settings),
            slices = settings.pieChart.slices;

        var newSlice = {
            uuid: Helpers.getUUID(),
            label: "Slice " + (slices.length + 1),
            order: 0,
            value: slices.length == 0 ? parameters.area : parameters.scale,
            oldValue: 0,
            worth: 0,
            percentage: 0,
            color: Raphael.hsb(0.36 / slices.length, 1, 1)
        };

        var lastSlice = slices.length != 0 ? slices[slices.length - 1] : null;
        var spaceAvailable = lastSlice == null ? parameters.area : lastSlice.value;
        if (spaceAvailable >= parameters.scale * 2) {
            slices.splice(0, 0, newSlice);
            if (lastSlice) {
                lastSlice.value -= newSlice.value;
            }

            _self.updateListData(parameters, slices);
        } else {
            var sliceAvailable = _self.getSliceWithSpace(slices, parameters.scale);
            if (sliceAvailable != null) {
                sliceAvailable.value -= newSlice.value;
                slices.splice(sliceAvailable.order - 1, 0, newSlice);
            }
            _self.updateListData(parameters, slices);
        }

        _self._parent.redraw(settings);
    }

    this.removeSlice = function (settings, p) {
        BootstrapDialog.confirm('Are you sure?', function (result) {
            if (result) {
                _self.deleteSector(settings, p);
            }
        });
    }

    this.deleteSector = function (settings, p) {
        var parameters = _self.parameters(settings);
        for (i = 0; i < settings.pieChart.slices.length; i++) {
            if (settings.pieChart.slices[i].uuid == p.uuid) {
                if (i - 1 >= 0) {
                    settings.pieChart.slices[i - 1].value += settings.pieChart.slices[i].value;
                } else if (settings.pieChart.slices.length != i + 1) {
                    settings.pieChart.slices[i + 1].value += settings.pieChart.slices[i].value;
                }
                
                settings.pieChart.slices.splice(i, 1);
                _self.sectors.splice(i, 1);
                _self.points.splice(i, 1);
                _self.updateListData(parameters, settings.pieChart.slices);
            }
            _self._parent.redraw(settings);
        }
        _self._parent.scope.$apply();
    }

    this.update_sector = function (parameters, startAngle, endAngle, sec) {
        var cx = parameters.cx,
            cy = parameters.cy,
            r = parameters.radius,
            rad = parameters.deg;

        var x1 = cx + r * Math.cos(-startAngle * rad),
            x2 = cx + r * Math.cos(-endAngle * rad),
            y1 = cy + r * Math.sin(-startAngle * rad),
            y2 = cy + r * Math.sin(-endAngle * rad);

        var rotation = 0;
        if (startAngle > endAngle) {
            rotation = endAngle;
            startAngle = startAngle - endAngle;
            endAngle = 360;
        }

        sec.attr('path', ["M", cx, cy, "L", x1, y1, "A", r, r, rotation, +(endAngle - startAngle > 180), 0, x2, y2, "z"]);
    }

    this.getPlotArea = function(settings) {
        return {
            top: settings.pieChart.plotAreaPadding.top,
            left: settings.pieChart.plotAreaPadding.left,
            bottom: settings.container.height - settings.pieChart.plotAreaPadding.bottom,
            right: settings.container.width - settings.pieChart.plotAreaPadding.right,
        }
    }

    this.getSliceWithSpace = function (slices, scale) {
        for (var i = 0; i < slices.length; i++) {
            if (slices[i].value >= scale * 2)
                return slices[i];
        }
        return null;
    }

    this.updateListData = function (parameters, slices) {
        for (var i = 0; i < slices.length; i++) {
            slices[i].order = i + 1;
            slices[i].oldValue = slices[i].value;
            slices[i].percentage = slices[i].value / parameters.area;
        }
    }

    this.changeArea = function (settings) {
        if (!_self.parametersValidation(settings)) 
            return;

        var slices = settings.pieChart.slices,
            parameters = _self.parameters(settings),
            increase = _self.oldArea < parameters.area,
            value = 0,
            partial = 0;

        if (slices.length > 1) {
            var calculatedArea = _self.calculateTotalArea(parameters, slices, increase);
            if (calculatedArea <= parameters.area) {                
                for (var i = 0; i < slices.length; i++) {
                    if (increase) {
                        slices[i].value = _self.snapToScale(parameters, slices[i].value);
                    } else {
                        slices[i].value = _self.snapToScale(parameters, parameters.area * slices[i].percentage);
                    }
                    value += slices[i].value;
                    if (i == slices.length - 1) {
                        slices[i].value = value <= parameters.area ? slices[i].value + (parameters.area - value) : parameters.area - partial;
                    }
                    partial += slices[i].value;
                }
            } else {
                settings.pieChart.totalArea = _self.oldArea;
            }
        } else {
            slices[0].value = parameters.area;
        }
        _self.updateListData(parameters, slices);
        _self.oldArea = parameters.area;
        _self._parent.redraw(settings);
    }

    this.changeValue = function (settings, slice) {
        var parameters = _self.parameters(settings),
            slices = settings.pieChart.slices;
        
        if (slice.value != slice.oldValue) {
            slice.value = _self.snapToScale(parameters, slice.value, slice.oldValue);            
            var index = _self.positionByElementUUID(slices, slice);
            var difference = slice.value - slice.oldValue;
            
            if (index == slices.length - 1) {
                var previousSlice = _self.elementByPosition(slices, index, 1, _self.direction.before);
                _self.resizeSector(parameters, slice, previousSlice, difference, difference > 0 ? previousSlice.value >= difference : slice.oldValue >= difference);
            } else {
                var nextSlice = _self.elementByPosition(slices, index, 1, _self.direction.after);
                _self.resizeSector(parameters, slice, nextSlice, difference, difference > 0 ? nextSlice.value >= difference : slice.oldValue >= difference);
            }
            _self._parent.redraw(settings);
        }        
    }

    this.resizeSector = function (parameters, slice, after, difference, isPossible) {
        if (isPossible) {
            if (difference > 0) {
                after.value -= Math.abs(difference);
            } else {
                after.value += Math.abs(difference);
            }
            after.oldValue = after.value;
            slice.oldValue = slice.value;
        } else {
            slice.value = slice.oldValue;
        }
    }

    this.snapToScale = function (parameters, value, oldValue) {
        value = value < Math.round(parameters.scale / 2) - 1 ? Number(value) + parameters.scale : value;
        if (oldValue != undefined) {
            value = value >= parameters.area ? _self.snapToScale(parameters, oldValue) : value;
        }
        return Math.round(value / parameters.scale) * parameters.scale;
    }

    this.calculateTotalArea = function (parameters, slices, increase) {
        var totalArea = 0;
        for (var i = 0; i < slices.length; i++) {
            if (increase) {
                totalArea += _self.snapToScale(parameters, slices[i].value);
            } else {
                if (i < slices.length - 1) {
                    totalArea += _self.snapToScale(parameters, parameters.area * slices[i].percentage);
                }                
            }
        }
        return totalArea;
    }
        
    this.parametersValidation = function (settings) {
        var area = Number(settings.pieChart.totalArea),
            scale = Number(settings.pieChart.scale);
        
        if (scale >= area)
            return false;

        if (area % scale != 0)
            return false;

        return true;
    }

    this.elementByPosition = function (list, start, distance, direction) {
        if (direction == _self.direction.after) {
            var position = (start + distance) % list.length;
            return list[position];
        } else {
            var module = Math.abs(start - distance) % list.length,
                difference = module == 0 ? 0 : list.length - module,
                position = start >= distance ? start - distance : difference;
            return list[position];
        }
    }

    this.positionByElementUUID = function (list, element) {
        for (var i = 0; i < list.length; i++) {
            if (list[i].uuid == element.uuid) {
                return i;
            }
        }
    }

    this.moveLabel = function (parameters, slices, index, startAngle, endAngle) {
        var endAngle = endAngle < startAngle ? endAngle + 360 : endAngle,
            part = Math.round((endAngle - startAngle) / 360 * parameters.area * 100) / 100,
            value = Math.round(part / parameters.scale) * parameters.scale,
            slice = slices[index];
        
        var midAngle = startAngle + (endAngle - startAngle) / 2,
            deltaX = parameters.labelsOutside ? 40 : -40,
            deltaY = parameters.labelsOutside ? 15 : -40,
            labelXPosition = parameters.cx + (parameters.radius + deltaX) * Math.cos(-midAngle * parameters.deg),
            labelYPosition = parameters.cy + (parameters.radius + deltaY) * Math.sin(-midAngle * parameters.deg);

        slice.text.attr('text', slice.label + ' - ' + value);
        slice.text.attr('x', labelXPosition);
        slice.text.attr('y', labelYPosition);
        if (!parameters.labelsOutside) {
            var textAngle = Math.abs(180 - midAngle) > 90 ? 360 - midAngle : 180 - midAngle;
            slice.text.transform('R' + textAngle + ' ' + labelXPosition + ' ' + labelYPosition);
        }
        $('tspan', slice.text.node).attr('dy', 0);
    }

    this.exportJson = function (pieChart) {
        var result = {
            title: pieChart.title,
            totalArea: pieChart.totalArea,
            scale: pieChart.scale,
            labelOutsideLocation: pieChart.labelOutsideLocation,
            strictPunctuation: pieChart.strictPunctuation,
            plotAreaPadding: pieChart.plotAreaPadding,
            slices: []
        };

        for (var i = 0; i < pieChart.slices.length; i++) {
            var src = pieChart.slices[i];
            result.slices.push({
                uuid: src.uuid,
                label: src.label,
                order: src.order,
                value: src.value,
                oldValue: src.oldValue,
                worth: src.worth,
                percentage: src.percentage,
                color: src.color
            });
        }
        return result;
    }

    /************************ Drag and Drop ************************/
    this.offset = null;
    this.startPath = function () {
        this.attr('fill', 'pink');
        this.ox = 0;
        this.oy = 0;
        _self.offset = $('#pieChartDrawingContainer').offset();
    }

    this.upPath = function () {
        var settings = _self._parent.settings;
        var parameters = _self.parameters(settings);
        this.attr('fill', '#f00');

        var i = 0;
        var length = _self.sectors.length;
        while (i < length) {
            var endAngle = _self.sectors[i].data('endAngle');
            if (endAngle < _self.sectors[i].data('startAngle')) {
                endAngle += 360;
            }

            var angle = endAngle - _self.sectors[i].data('startAngle');
            var part = Math.round(angle / 360 * parameters.area * 100) / 100;
            var round = Math.round(part / parameters.scale) * parameters.scale;
            settings.pieChart.slices[i].value = round;
                        
            i += 1;
        }
        _self.updateListData(parameters, settings.pieChart.slices);
        _self._parent.redraw(settings);
        _self._parent.scope.$apply();
    };

    this.movePath = function (dx, dy, x, y) {
        var canMove = true;
        x = x - _self.offset.left;
        y = y - _self.offset.top;
        
        var parameters = _self.parameters(_self._parent.settings),
            ratio = 360 / parameters.area,
            min_angle = parameters.scale * ratio;
        
        // Calculate new button coordinates using mouse coordinates
        var btn_rad = Math.atan2(y - parameters.cy, x - parameters.cx),
            new_x = parameters.cx + parameters.radius * Math.cos(btn_rad),
            new_y = parameters.cy + parameters.radius * Math.sin(btn_rad),
            index = this.data('index'),            
            sec_1 = _self.sectors[index],
            sec_2 = _self.sectors[(index + 1) === _self.sectors.length ? 0 : index + 1],
            atan2 = Math.atan2(-1 * (new_y - parameters.cy), new_x - parameters.cx),
            sec_angle = 0;
        
        if ((atan2 / Math.PI) <= 0) {
            atan2 = 2 * Math.PI + atan2;
        }

        sec_angle = Math.round(atan2 * parameters.rad * 100) / 100;        
        var moveInside = sec_angle >= sec_1.data('startAngle') && sec_angle <= sec_1.data('endAngle');
        var moveOutside = sec_angle >= sec_2.data('startAngle') && sec_angle <= sec_2.data('endAngle');

        _self.moveLabel(parameters, _self._parent.settings.pieChart.slices, index, sec_1.data('startAngle'), sec_1.data('endAngle'));
        _self.moveLabel(parameters, _self._parent.settings.pieChart.slices, index + 1, sec_2.data('startAngle'), sec_2.data('endAngle'));

        if (moveInside) {
            if (sec_angle - sec_1.data('startAngle') < min_angle) {
                canMove = false;
            }
        } else if (moveOutside) {
            if (sec_2.data('endAngle') - sec_angle < min_angle) {
                canMove = false;
            }
        } else {
            canMove = false;
        }

        if (canMove) {
            this.attr({
                'cx': new_x,
                'cy': new_y
            });

            // Update the first sector touching the button.
            _self.update_sector(parameters, sec_1.data('startAngle'), sec_angle, sec_1);
            sec_1.data('endAngle', sec_angle);

            // Update the second sector touching the button.
            _self.update_sector(parameters, sec_angle, sec_2.data('endAngle'), sec_2);
            sec_2.data('startAngle', sec_angle);

            this.ox = dx;
            this.oy = dy;
        }
    }

    /************************ Drag and Drop ************************/

}