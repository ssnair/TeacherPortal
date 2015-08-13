function StarShape(parent) {
    var _self = this;
    this._parent = parent;

    this.defaultColor = '#fff';
    this.selectedColor = '#f00';    
    this.direction = {
        before: false,
        after: true
    }

    this.parameters = function (settings) {
        var plotArea = _self.getPlotArea(settings),
            peaks = Number(settings.starShape.peaks),
            angle = Number(settings.starShape.angle),
            height = plotArea.bottom - plotArea.top,
            width = plotArea.right - plotArea.left,
            cx = (width / 2) + plotArea.left,
            cy = (height / 2) + plotArea.top,
            radius = Math.min(height, width) / 2;

        peaks = peaks > 12 ? 12 : (peaks < 3 ? 3 : peaks);
        angle = angle > 360 ? 360 : (angle < 0 ? 0 : angle);

        settings.starShape.peaks = peaks;
        settings.starShape.angle = angle;

        return {
            plotArea: plotArea,
            answerMode: settings.starShape.answerMode,
            worth: Number(settings.starShape.worth),
            peaks: peaks,
            angle: angle,            
            cx: cx,
            cy: cy,
            radius: radius
        }
    }

    this.reset = function (settings) {
        if (settings.shapeType.id != 'star-shape')
            return;

        var parameters = _self.parameters(settings);
        _self.loadSectors(settings, parameters);
        _self._parent.redraw(settings);
    }

    this.redraw = function (settings, canvas) {
        if (settings.shapeType.id != 'star-shape')
            return;

        var parameters = _self.parameters(settings);
        _self.drawSectors(canvas, settings);
    }

    this.setViewMode = function (settings, viewMode) {
        if (settings.shapeType.id != 'star-shape')
            return;

        if (viewMode == 'teacher') {
            settings.starShape.sectors.length = 0;
            for (var i = 0; i < settings.starShape.teacherSectors.length; i++) {
                settings.starShape.sectors.push({
                    uuid: settings.starShape.teacherSectors[i].uuid,
                    label: settings.starShape.teacherSectors[i].label,
                    order: settings.starShape.teacherSectors[i].order,
                    value: settings.starShape.teacherSectors[i].value,
                    selected: settings.starShape.teacherSectors[i].selected
                });
            }
            _self._parent.redraw(settings);
        } else {
            settings.starShape.teacherSectors.length = 0;
            for (var i = 0; i < settings.starShape.sectors.length; i++) {
                settings.starShape.teacherSectors.push({
                    uuid: settings.starShape.sectors[i].uuid,
                    label: settings.starShape.sectors[i].label,
                    order: settings.starShape.sectors[i].order,
                    value: settings.starShape.sectors[i].value,
                    selected: settings.starShape.sectors[i].selected
                });
            }
            _self._parent.reset(settings);
        }
    }

    this.submitAnswerFromPreview = function (settings) {
        if (settings.shapeType.id != 'star-shape')
            return;

        var parameters = _self.parameters(settings),
            teacherSectors = settings.starShape.teacherSectors,
            studentSectors = settings.starShape.sectors,
            selectedTeacher = 0,
            selectedStudent = 0,
            gotWorth = 0,
            correctSectors = 0;

        for (var i = 0; i < teacherSectors.length; i++) {
            if (parameters.answerMode.id == _self._parent.scope.answerModes[0].id) {
                if (teacherSectors[i].selected)
                    selectedTeacher++;
                if (studentSectors[i].selected)
                    selectedStudent++;
                if (i == teacherSectors.length - 1) {
                    if (selectedStudent > selectedTeacher) {
                        correctSectors = parameters.peaks - (selectedStudent - selectedTeacher);
                    } else {
                        correctSectors = parameters.peaks - selectedTeacher + selectedStudent;
                    }
                }
            } else if (parameters.answerMode.id == _self._parent.scope.answerModes[1].id) {
                if (teacherSectors[i].selected == studentSectors[i].selected) {
                    correctSectors++;
                } else if (!teacherSectors[i].selected && !studentSectors[i].selected) {
                    correctSectors++;
                }
            }
        }

        if (correctSectors == parameters.peaks) {
            gotWorth = parameters.worth;
        }

        var message = 'Correct Sectors: ' + correctSectors + ' / ' + parameters.peaks + '\n';
        message += 'Worth: ' + gotWorth + '\n';
        alert(message);
    }

    this.drawSectors = function (canvas, settings) {
        var sectors = settings.starShape.sectors;
        if (sectors.length == 0)
            return;

        var parameters = _self.parameters(settings),
            peaks = _self.quantityOfPeaksToCalculate(parameters.peaks),
            jump = _self.jumpQuantity(peaks),
            points = _self.getPoints(parameters, peaks);

        for (var i = 0; i < sectors.length; i++) {
            _self.drawSector(canvas, parameters, sectors, points, jump, i);
        }
    }

    this.drawSector = function (canvas, parameters, sectors, points, jump, i) {        
        var path = [],
            intersection_1,
            intersection_2;
        
        if (parameters.peaks > 4) {
            intersection_1 = _self.intersectionPoint(points, points[i], jump, _self.direction.before);
            intersection_2 = _self.intersectionPoint(points, points[i], jump, _self.direction.after);
            path = _self.getPath(points[i], parameters, intersection_1, intersection_2);
        } else if (parameters.peaks == 4) {
            intersection_1 = _self.intersectionPoint(points, points[i * 2], 3, _self.direction.before, 2);
            intersection_2 = _self.intersectionPoint(points, points[i * 2], 3, _self.direction.after, 2);
            path = _self.getPath(points[i * 2], parameters, intersection_1, intersection_2);
        } else {
            intersection_1 = _self.intersectionPoint(points, points[i * 3], 4, _self.direction.before, 3);
            intersection_2 = _self.intersectionPoint(points, points[i * 3], 4, _self.direction.after, 3);
            path = _self.getPath(points[i * 3], parameters, intersection_1, intersection_2);
        }
        
        var sect = canvas.path(path)
                .attr({ stroke: 2, fill: sectors[i].selected ? _self.selectedColor : _self.defaultColor, cursor: 'pointer' })
                .click(_self.onClick);
        sect.node.id = i;
        sect.node.selected = sectors[i].selected;
    }

    this.loadSectors = function (settings, parameters) {
        // save 
        var buffer = [];
        for (var i = 0; i < settings.starShape.sectors.length ; i++) {
            buffer.push(settings.starShape.sectors[i].selected);
        }

        settings.starShape.sectors.length = 0;
        
        for (var i = 0; i < parameters.peaks; i++) {
            settings.starShape.sectors.push({
                uuid: Helpers.getUUID(),
                order: i + 1,
                label: 'Sector ' + (i + 1),
                value: i + 1,
                selected: buffer[i]
            });
        }        
    }

    this.getPath = function (point, parameters, intersection_1, intersection_2) {
        return ['M', point.x, point.y,
                'L', intersection_1.x, intersection_1.y,
                'L', parameters.cx, parameters.cy,
                'L', intersection_2.x, intersection_2.y,
                'L', point.x, point.y];
    }

    this.quantityOfPeaksToCalculate = function (peaks) {
        return peaks > 4 ? peaks : (peaks == 4 ? peaks * 2 : peaks * 3);
    }

    this.jumpQuantity = function (peaks) {
        var jump = 1;
        if (peaks > 4) {
            jump = Math.round(((peaks - 4) / 2) + 1);
        }
        return jump;
    }

    this.getPoints = function (parameters, quantity) {
        var points = [];
        for (var i = 0; i < quantity; i++) {
            points.push(_self.getPointCoordinates(parameters, quantity, i));
        }
        return points;
    }

    this.getPointCoordinates = function (parameters, quantity, i) {
        var theta = ((i + 0.5) / quantity * 2 * Math.PI) + (parameters.angle * Math.PI / 180),
            x = parameters.cx + Math.cos(theta) * parameters.radius,
            y = parameters.cy + Math.sin(theta) * parameters.radius;

        return { index: i, x: x, y: y };
    }

    this.elementByPosition = function (list, start, distance, direction) { 
        if (direction == _self.direction.after) {
            var position = (start + distance) % list.length;
            list[position].index = position;
            return list[position];
        } else {
            var module = Math.abs(start - distance) % list.length,
                difference = module == 0 ? 0 : list.length - module,
                position = start >= distance ? start - distance : difference;
            list[position].index = position;
            return list[position];
        }
    }

    this.intersectionPoint = function (points, current, jump, direction, distance) {
        var point = _self.elementByPosition(points, current.index, distance != undefined ? distance : 1, direction),
            jump_current = _self.elementByPosition(points, current.index, jump, direction),
            jump_point = _self.elementByPosition(points, point.index, jump, !direction);

        var path_1 = ['M', current.x, current.y, 'L', jump_current.x, jump_current.y],
            path_2 = ['M', point.x, point.y, 'L', jump_point.x, jump_point.y];

        return Raphael.pathIntersection(path_1, path_2)[0];
    }

    this.getPlotArea = function (settings) {
        return {
            top: settings.starShape.plotAreaPadding.top,
            left: settings.starShape.plotAreaPadding.left,
            bottom: settings.container.height - settings.starShape.plotAreaPadding.bottom,
            right: settings.container.width - settings.starShape.plotAreaPadding.right,
        }
    }

    this.onClick = function (path) {
        var index = path.target.id,
            selected = path.target.selected,
            settings = _self._parent.settings;

        if (selected) {
            settings.starShape.sectors[index].selected = false;
        } else {
            settings.starShape.sectors[index].selected = true;
        }

        _self._parent.redraw(settings);
        _self._parent.scope.$apply();
    }

    this.exportJson = function (starShape) {
        var result = {
            peaks: starShape.peaks,
            worth: starShape.worth,
            angle: starShape.angle,
            answerMode: starShape.answerMode,
            plotAreaPadding: starShape.plotAreaPadding,
            sectors: []
        };
        for (var i = 0; i < starShape.sectors.length; i++) {
            result.sectors.push({ selected: starShape.sectors[i].selected });
        }
        return result;
    }
}