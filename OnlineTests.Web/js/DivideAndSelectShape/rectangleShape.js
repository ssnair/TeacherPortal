function RectangleShape(parent) {
    var _self = this;
    this._parent = parent;
    this.defaultColor = '#fff';
    this.selectedColor = '#f00';
     
    this.parameters = function (settings) {
        var plotArea = _self.getPlotArea(settings),
            maxWidth = plotArea.right - plotArea.left,
            maxHeight = plotArea.bottom - plotArea.top,
            width = _self.defaultSizeValue(Number(settings.rectangleShape.width), maxWidth),
            height = _self.defaultSizeValue(Number(settings.rectangleShape.height), maxHeight),            
            columns = _self.defaultSectorsQuantity(width, Number(settings.rectangleShape.columns), 20),
            rows = _self.defaultSectorsQuantity(height, Number(settings.rectangleShape.rows), 20),
            sector_width = width / columns,
            sector_height = height / rows,
            diagonal = 0,
            angle = 90,
            cx = (maxWidth / 2) + plotArea.left,
            cy = (maxHeight / 2) + plotArea.top;

        settings.rectangleShape.width = width;
        settings.rectangleShape.height = height;
        settings.rectangleShape.columns = columns;
        settings.rectangleShape.rows = rows;

        if (settings.rectangleShape.divisionType.id == _self._parent.scope.divisionTypes[1].id) {
            diagonal = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
            angle = Math.atan(height / width) * 180 / Math.PI;
        }
        
        return {
            answerMode: settings.rectangleShape.answerMode,
            divisionType: settings.rectangleShape.divisionType,
            worth: Number(settings.rectangleShape.worth),
            plotArea: plotArea,
            columns: columns,
            rows: rows,
            quantity: columns * rows,
            width: width,
            height: height,
            maxWidth: maxWidth,
            maxHeight: maxHeight,
            sector_width: sector_width,
            sector_height: sector_height,
            diagonal: diagonal,
            angle: angle,
            cx: cx,
            cy: cy,
            xi: cx - width / 2,
            yi: cy - height / 2,
        }
    }

    this.reset = function (settings) {
        if (settings.shapeType.id != 'rectangle-shape')
            return;

        var parameters = _self.parameters(settings);
        _self.loadSectors(settings, parameters);
        _self._parent.redraw(settings);
    }

    this.redraw = function (settings, canvas) {
        if (settings.shapeType.id != 'rectangle-shape')
            return;

        var parameters = _self.parameters(settings);
        _self.drawSectors(canvas, settings, parameters);
    }

    this.setViewMode = function (settings, viewMode) {
        if (settings.shapeType.id != 'rectangle-shape')
            return;

        if (viewMode == 'teacher') {
            settings.rectangleShape.sectors.length = 0;
            for (var i = 0; i < settings.rectangleShape.teacherSectors.length; i++) {
                settings.rectangleShape.sectors.push({
                    uuid: settings.rectangleShape.teacherSectors[i].uuid,
                    label: settings.rectangleShape.teacherSectors[i].label,
                    order: settings.rectangleShape.teacherSectors[i].order,
                    value: settings.rectangleShape.teacherSectors[i].value,
                    path: settings.rectangleShape.teacherSectors[i].path,
                    selected: settings.rectangleShape.teacherSectors[i].selected
                });
            }
            
            _self._parent.redraw(settings);
        } else {
            settings.rectangleShape.teacherSectors.length = 0;
            for (var i = 0; i < settings.rectangleShape.sectors.length; i++) {
                settings.rectangleShape.teacherSectors.push({
                    uuid: settings.rectangleShape.sectors[i].uuid,
                    label: settings.rectangleShape.sectors[i].label,
                    order: settings.rectangleShape.sectors[i].order,
                    value: settings.rectangleShape.sectors[i].value,
                    selected: settings.rectangleShape.sectors[i].selected
                });
            }
            _self._parent.reset(settings);
        }
    }

    this.submitAnswerFromPreview = function (settings) {
        if (settings.shapeType.id != 'rectangle-shape')
            return;

        var parameters = _self.parameters(settings),
            teacherSectors = settings.rectangleShape.teacherSectors,
            studentSectors = settings.rectangleShape.sectors,
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
                        correctSectors = (parameters.rows * parameters.columns) - (selectedStudent - selectedTeacher);
                    } else {
                        correctSectors = (parameters.rows * parameters.columns) - selectedTeacher + selectedStudent;
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

        if (correctSectors == (parameters.rows * parameters.columns)) {
            gotWorth = parameters.worth;
        }

        var message = 'Correct Sectors: ' + correctSectors + ' / ' + (parameters.rows * parameters.columns) + '\n';
        message += 'Worth: ' + gotWorth + '\n';
        alert(message);
    }

    this.drawSectors = function (canvas, settings, parameters) {
        var sectors = settings.rectangleShape.sectors;
        if (sectors.length == 0)
            return;

        var x = parameters.xi;
        var y = parameters.yi;
        var width = parameters.sector_width;
        var height = parameters.sector_height;
        var array = [];
        var group = null;
       
        var isDiagonal = parameters.divisionType.id == _self._parent.scope.divisionTypes[1].id;
        if (isDiagonal) {
            group = _self.buildClipping(canvas, parameters);
        }
        
        settings.rectangleShape.grid.length = 0;
        for (var i = 0; i < sectors.length; i++) {
            if (i != 0 && i % parameters.columns == 0) {
                settings.rectangleShape.grid.push(array);
                array = [];
                x = parameters.xi;
                y += parameters.sector_height;
            }

            if (!isDiagonal) {
                array.push(_self.drawSector(canvas, parameters, sectors[i], i, x, y, width, height, false));
            } else {
                if (parameters.quantity == 1) {
                    var sec = _self.drawSector(canvas, parameters, sectors[i], i, x, y, width, height, false);
                    if (group != null) group.appendChild(sec.rect.node);
                    array.push(sec);
                } else {
                    var sec = _self.drawSector(canvas, parameters, sectors[i], i, x, y, width, height, true);
                    if (group != null) group.appendChild(sec.rect.node);
                    array.push(sec);
                }
            }
            x += parameters.sector_width;
        }
        settings.rectangleShape.grid.push(array);
    }

    this.drawSector = function (canvas, parameters, sector, i, x, y, width, height, diagonal) {
        sector.rect = canvas.rect(x, y, width, height)
            .attr({ fill: sector.selected ? _self.selectedColor : _self.defaultColor, cursor: 'pointer' })
            .click(_self.onClick);
        sector.rect.node.id = i;
        sector.rect.node.selected = sector.selected;
        if (diagonal) {
            _self.skewer(canvas, sector.rect[0], 90 - parameters.angle, x, y, 0.5, 0.5, width, height);
        }
        return sector;
    }
        
    this.loadSectors = function (settings, parameters) {
        // save 
        var buffer = [];
        for (var i = 0; i < settings.rectangleShape.sectors.length ; i++) {
            buffer.push(settings.rectangleShape.sectors[i].selected);
        }

        settings.rectangleShape.sectors.length = 0;
        for (var i = 0; i < parameters.quantity; i++) {
            settings.rectangleShape.sectors.push({
                uuid: Helpers.getUUID(),
                order: i + 1,
                label: 'Sector ' + (i + 1),
                value: i + 1,
                selected: buffer[i]
            });
        }
    }
    
    this.getPlotArea = function (settings) {
        return {
            top: settings.rectangleShape.plotAreaPadding.top + 5,
            left: settings.rectangleShape.plotAreaPadding.left,
            bottom: settings.container.height - settings.rectangleShape.plotAreaPadding.bottom,
            right: settings.container.width - settings.rectangleShape.plotAreaPadding.right - 5,
        }
    }
    
    this.defaultSizeValue = function (value, defaultValue) {
        return value > defaultValue ? defaultValue : value;
    }

    this.defaultSectorsQuantity = function (size, value, minSize) {
        value = size / value < minSize ? Math.round(size / minSize) : value;
        return value == 0 ? 1 : value;
    }

    this.skewer = function (canvas, element, angle, xi, yi, x, y, width, height) {
        var box, radians, svg, transform;
        x = x * width + xi;
        y = y * height + yi;
        radians = angle * Math.PI / 180.0;
        transform = canvas.canvas.createSVGTransform();
        transform.matrix.e = x;
        transform.matrix.f = y;
        element.transform.baseVal.appendItem(transform);
        transform = canvas.canvas.createSVGTransform();
        transform.matrix.c = Math.tan(radians);
        element.transform.baseVal.appendItem(transform);
        transform = canvas.canvas.createSVGTransform();
        transform.matrix.e = -x;
        transform.matrix.f = -y;
        element.transform.baseVal.appendItem(transform);
    };

    this.buildClipping = function (canvas, parameters) {
        var paper = canvas.canvas,
            svgns = paper.getAttribute("xmlns"),
            defs = _self.createOn(svgns, paper, 'defs'),
            clipPathTag = _self.createOn(svgns, defs, 'clipPath', { id: 'clipper' });

        var mainRect = _self.createOn(svgns, clipPathTag, 'rect', {
            x: parameters.xi,
            y: parameters.yi,
            width: parameters.width,
            height: parameters.height
        });

        var group = _self.createOn(svgns, paper, 'g', {
            'clip-path': 'url(#clipper)'
        });

        canvas.rect(parameters.xi, parameters.yi, parameters.width, parameters.height);
        return group;
    }

    this.createOn = function (svgNS, root, name, prop) {
        var el = document.createElementNS(svgNS, name);
        for (var a in prop) if (prop.hasOwnProperty(a)) el.setAttribute(a, prop[a]);
        return root.appendChild(el);
    }
    
    this.onClick = function (path) {
        var index = path.target.id,
            selected = path.target.selected,
            settings = _self._parent.settings;

        if (selected) {
            settings.rectangleShape.sectors[index].selected = false;
        } else {
            settings.rectangleShape.sectors[index].selected = true;
        }

        _self._parent.redraw(settings);
        _self._parent.scope.$apply();
    }

    this.exportJson = function (rectangleShape) {
        var result = {
            width: rectangleShape.width,
            height: rectangleShape.height,
            columns: rectangleShape.columns,
            rows: rectangleShape.rows,
            worth: rectangleShape.worth,
            answerMode: rectangleShape.answerMode,
            divisionType: rectangleShape.divisionType,
            plotAreaPadding: rectangleShape.plotAreaPadding,
            sectors: [],
            grid: []
        };
        for (var i = 0; i < rectangleShape.sectors.length; i++) {
            result.sectors.push({ selected: rectangleShape.sectors[i].selected });
        }
        return result;
    }
}