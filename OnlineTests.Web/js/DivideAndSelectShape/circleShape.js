function CircleShape(parent) {
    var _self = this;
    this._parent = parent;

    this.defaultColor = '#fff';
    this.selectedColor = '#f00';

    this.parameters = function (settings) {
        var plotArea = _self.getPlotArea(settings),
            height = plotArea.bottom - plotArea.top,
            width = plotArea.right - plotArea.left,
            cx = (width / 2) + plotArea.left,
            cy = (height / 2) + plotArea.top,
            radius = Math.min(height, width) / 2;

        return {
            plotArea: plotArea,
            divisions: Number(settings.circleShape.divisions),
            answerMode: settings.circleShape.answerMode,
            worth: Number(settings.circleShape.worth),
            cx: cx,
            cy: cy,
            radius: radius,
            rad: 180 / Math.PI,
            deg: Math.PI / 180
        }
    }

    this.reset = function (settings) {
        if (settings.shapeType.id != 'circle-shape')
            return;

        var parameters = _self.parameters(settings);
        _self.loadDivisions(settings, parameters);
        _self._parent.redraw(settings);
    }

    this.redraw = function (settings, canvas) {
        if (settings.shapeType.id != 'circle-shape')
            return;

        var parameters = _self.parameters(settings);
        _self.drawSectors(canvas, settings);
    }

    this.setViewMode = function (settings, viewMode) {
        if (settings.shapeType.id != 'circle-shape')
            return;

        if (viewMode == 'teacher') {
            settings.circleShape.sectors.length = 0;
            for (var i = 0; i < settings.circleShape.teacherSectors.length; i++) {
                settings.circleShape.sectors.push({
                    uuid: settings.circleShape.teacherSectors[i].uuid,
                    label: settings.circleShape.teacherSectors[i].label,
                    order: settings.circleShape.teacherSectors[i].order,
                    value: settings.circleShape.teacherSectors[i].value,
                    path: settings.circleShape.teacherSectors[i].path,
                    selected: settings.circleShape.teacherSectors[i].selected
                });
            }
            _self._parent.redraw(settings);
        } else {
            settings.circleShape.teacherSectors.length = 0;
            for (var i = 0; i < settings.circleShape.sectors.length; i++) {
                settings.circleShape.teacherSectors.push({
                    uuid: settings.circleShape.sectors[i].uuid,
                    label: settings.circleShape.sectors[i].label,
                    order: settings.circleShape.sectors[i].order,
                    value: settings.circleShape.sectors[i].value,
                    path: settings.circleShape.sectors[i].path,
                    selected: settings.circleShape.sectors[i].selected
                });
            }
            _self._parent.reset(settings);
        }
    }

    this.submitAnswerFromPreview = function (settings) {
        if (settings.shapeType.id != 'circle-shape')
            return;

        var parameters = _self.parameters(settings),
            teacherSectors = settings.circleShape.teacherSectors,
            studentSectors = settings.circleShape.sectors,
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
                        correctSectors = parameters.divisions - (selectedStudent - selectedTeacher);
                    } else {
                        correctSectors = parameters.divisions - selectedTeacher + selectedStudent;
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

        if (correctSectors == parameters.divisions) {
            gotWorth = parameters.worth;
        }

        var message = 'Correct Sectors: ' + correctSectors + ' / ' + parameters.divisions + '\n';
        message += 'Worth: ' + gotWorth + '\n';
        alert(message);
    }

    this.drawSectors = function (canvas, settings) {
        var sectors = settings.circleShape.sectors;
        if (sectors.length == 0)
            return;

        for (var i = 0; i < sectors.length; i++) {
            _self.drawSector(canvas, sectors, i);
        }
    }

    this.drawSector = function (canvas, sectors, i) {
        var path = canvas.path(sectors[i].path)
                .attr({ stroke: 2, fill: sectors[i].selected ? _self.selectedColor : _self.defaultColor, cursor: 'pointer' })
                .click(_self.onClick);
        path.node.id = i;
        path.node.selected = sectors[i].selected;
    }

    this.loadDivisions = function (settings, parameters) {

        var startAngle = 0,
            endAngle = 0,
            scale = (100 / parameters.divisions) / 100,
            x1 = 0,
            x2 = 0,
            y1 = 0,
            y2 = 0;
 
        // save 
        var buffer = [];
        for (var i = 0; i < settings.circleShape.sectors.length ; i++) {
            buffer.push(settings.circleShape.sectors[i].selected);
        }

        settings.circleShape.sectors.length = 0;

        for (var i = 0; i < parameters.divisions; i++) {
            endAngle = scale * 360 + startAngle;
            
            x1 = parameters.cx + parameters.radius * Math.cos(-startAngle * parameters.deg),
            x2 = parameters.cx + parameters.radius * Math.cos(-endAngle * parameters.deg),
            y1 = parameters.cy + parameters.radius * Math.sin(-startAngle * parameters.deg),
            y2 = parameters.cy + parameters.radius * Math.sin(-endAngle * parameters.deg);

            settings.circleShape.sectors.push({
                uuid: Helpers.getUUID(),
                order: i + 1,
                label: 'Sector ' + (i + 1),
                value: i + 1,
                path: ["M", parameters.cx, parameters.cy, "L", x1, y1, "A", parameters.radius, parameters.radius, 0, +(endAngle - startAngle > 180), 0, x2, y2, "z"],
                selected: buffer[i]
            });

            startAngle = endAngle;
        }
    }

    this.getPlotArea = function (settings) {
        return {
            top: settings.circleShape.plotAreaPadding.top,
            left: settings.circleShape.plotAreaPadding.left,
            bottom: settings.container.height - settings.circleShape.plotAreaPadding.bottom,
            right: settings.container.width - settings.circleShape.plotAreaPadding.right,
        }
    }

    this.onClick = function (path) {
        var index = path.target.id,
            selected = path.target.selected,
            settings = _self._parent.settings;

        if (selected) {
            settings.circleShape.sectors[index].selected = false;
        } else {
            settings.circleShape.sectors[index].selected = true;
        }

        _self._parent.redraw(settings);
        _self._parent.scope.$apply();
    }

    this.exportJson = function (circleShape) {
        var result = {
            divisions: circleShape.divisions,
            worth: circleShape.worth,
            answerMode: circleShape.answerMode,
            plotAreaPadding: circleShape.plotAreaPadding,
            sectors: [],
        };
        for (var i = 0; i < circleShape.sectors.length; i++) {
            result.sectors.push({ selected: circleShape.sectors[i].selected });
        }
        return result;
    }

}