function PolygonShape(parent) {
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
            height = plotArea.bottom - plotArea.top,
            width = plotArea.right - plotArea.left,
            cx = (width / 2) + plotArea.left,
            cy = (height / 2) + plotArea.top,
            radius = Math.min(height, width) / 2;

        return {
            plotArea: plotArea,
            sides: Number(settings.polygonShape.sides),
            answerMode: settings.polygonShape.answerMode,
            angle: Number(settings.polygonShape.angle),
            worth: Number(settings.polygonShape.worth),
            cx: cx,
            cy: cy,
            radius: radius
        }
    }

    this.reset = function (settings) {
        if (settings.shapeType.id != 'polygon-shape')
            return;

        var parameters = _self.parameters(settings);
        _self.loadSides(settings, parameters);
        _self._parent.redraw(settings);
    }

    this.redraw = function (settings, canvas) {
        if (settings.shapeType.id != 'polygon-shape')
            return;
        
        var parameters = _self.parameters(settings);
        _self.drawSectors(canvas, settings);
    }

    this.setViewMode = function (settings, viewMode) {
        if (settings.shapeType.id != 'polygon-shape')
            return;

        if (viewMode == 'teacher') {
            settings.polygonShape.sectors.length = 0;
            for (var i = 0; i < settings.polygonShape.teacherSectors.length; i++) {
                settings.polygonShape.sectors.push({
                    uuid: settings.polygonShape.teacherSectors[i].uuid,
                    label: settings.polygonShape.teacherSectors[i].label,
                    order: settings.polygonShape.teacherSectors[i].order,
                    value: settings.polygonShape.teacherSectors[i].value,
                    selected: settings.polygonShape.teacherSectors[i].selected
                });
            }
            _self._parent.redraw(settings);
        } else {
            settings.polygonShape.teacherSectors.length = 0;
            for (var i = 0; i < settings.polygonShape.sectors.length; i++) {
                settings.polygonShape.teacherSectors.push({
                    uuid: settings.polygonShape.sectors[i].uuid,
                    label: settings.polygonShape.sectors[i].label,
                    order: settings.polygonShape.sectors[i].order,
                    value: settings.polygonShape.sectors[i].value,
                    selected: settings.polygonShape.sectors[i].selected
                });
            }
            _self._parent.reset(settings);
        }        
    }

    this.submitAnswerFromPreview = function (settings) {
        if (settings.shapeType.id != 'polygon-shape')
            return;

        var parameters = _self.parameters(settings),
            teacherSectors = settings.polygonShape.teacherSectors,
            studentSectors = settings.polygonShape.sectors,
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
                        correctSectors = parameters.sides - (selectedStudent - selectedTeacher);
                    } else {
                        correctSectors = parameters.sides - selectedTeacher + selectedStudent;
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

        if (correctSectors == parameters.sides) {
            gotWorth = parameters.worth;
        }

        var message = 'Correct Sectors: ' + correctSectors + ' / ' + parameters.sides + '\n';
        message += 'Worth: ' + gotWorth + '\n';
        alert(message);
    }

    this.drawSectors = function (canvas, settings) {
        var sectors = settings.polygonShape.sectors;
        if (sectors.length == 0)
            return;

        var parameters = _self.parameters(settings),
            points = _self.getPoints(parameters);
        for (var i = 0; i < sectors.length; i++) {
            _self.drawSector(canvas, parameters, sectors, points, i);
        }
    }

    this.drawSector = function (canvas, parameters, sectors, points, i) {
        var begin = points[i],
            end = _self.elementByPosition(points, i, 1, _self.direction.after);
        var path = canvas.path(['M', parameters.cx, parameters.cy, 'L', begin.x, begin.y, 'L', end.x, end.y, 'L', parameters.cx, parameters.cy])
                .attr({ stroke: 2, fill: sectors[i].selected ? _self.selectedColor : _self.defaultColor, cursor: 'pointer' })
                .click(_self.onClick);
        path.node.id = i;
        path.node.selected = sectors[i].selected;
    }

    this.loadSides = function (settings, parameters) {
        var points = _self.getPoints(parameters),
            begin,
            end;

        // save 
        var buffer = [];
        for (var i = 0; i < settings.polygonShape.sectors.length ; i++) {
            buffer.push(settings.polygonShape.sectors[i].selected);
        }

        settings.polygonShape.sectors.length = 0;
        
        for (var i = 0; i < parameters.sides; i++) {
            settings.polygonShape.sectors.push({
                uuid: Helpers.getUUID(),
                order: i + 1,
                label: 'Sector ' + (i + 1),
                value: i + 1,
                selected: buffer[i]
            });
        }
    }

    this.getPoints = function (parameters) {
        var points = [];
        for (var i = 0; i <= parameters.sides; i++) {
            points.push(_self.getPointCoordinates(parameters, i));
        }
        return points;
    }

    this.getPointCoordinates = function (parameters, i) {
        var theta = ((i + 0.5) / parameters.sides * 2 * Math.PI) + (parameters.angle * Math.PI / 180),
            x = parameters.cx + Math.cos(theta) * parameters.radius,
            y = parameters.cy + Math.sin(theta) * parameters.radius;

        return { x: x, y: y };
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

    this.getPlotArea = function (settings) {
        return {
            top: settings.polygonShape.plotAreaPadding.top,
            left: settings.polygonShape.plotAreaPadding.left,
            bottom: settings.container.height - settings.polygonShape.plotAreaPadding.bottom,
            right: settings.container.width - settings.polygonShape.plotAreaPadding.right,
        }
    }

    this.onClick = function (path) {
        var index = path.target.id,
            selected = path.target.selected,
            settings = _self._parent.settings;
        
        if (selected) {
            settings.polygonShape.sectors[index].selected = false;
        } else {
            settings.polygonShape.sectors[index].selected = true;
        }

        _self._parent.redraw(settings);
        _self._parent.scope.$apply();
    }

    this.exportJson = function (polygonShape) {
        var result = {
            sides: polygonShape.sides,
            worth: polygonShape.worth,
            answerMode: polygonShape.answerMode,
            angle: polygonShape.angle,
            plotAreaPadding: polygonShape.plotAreaPadding,
            sectors: []
        };
        for (var i = 0; i < polygonShape.sectors.length; i++) {
            result.sectors.push({ selected: polygonShape.sectors[i].selected });
        }
        return result;
    }

}