// ShapesOverImage/shapesOverImage.js
//require('../Helpers.js');

ShapesOverImage = function (Raphael, container, settings, scope) {
    var _self = this;
    this.container = container;
    this.settings = settings;
    this.scope = scope;
    this.currentPolygonShape = null;
    var studentMarker = 'student-marker'

    this.canvas = Raphael(container, settings.container.width, settings.container.height),

    this.redraw = function (settings) {
        this.canvas.clear();
        this.drawShapes(settings);
    }

    this.setViewMode = function (settings, viewMode) {
        settings.viewMode = viewMode;
        if (viewMode == "teacher") {
            this.setupTeacherViewMode(settings);
        } else {
            this.setupStudentViewMode(settings);
        }
        this.redraw(settings);
    }

    this.setupTeacherViewMode = function (settings) {
        settings.shapes.length = 0;
        for (var i = 0; i < settings.teacherShapes.length; i++) {
            var newShape = {
                uuid: settings.teacherShapes[i].uuid,
                shapeType: settings.teacherShapes[i].shapeType,
                position: settings.teacherShapes[i].position,
                size: settings.teacherShapes[i].size,
                worth: settings.teacherShapes[i].worth,
                threshold: settings.teacherShapes[i].threshold,
                selected: false,
                handlers: []
            }

            if (settings.teacherShapes[i].shapeType === 'polygon') {
                newShape.points = settings.teacherShapes[i].points;
                newShape.connectors = settings.teacherShapes[i].connectors;
                newShape.open = settings.teacherShapes[i].open;
            }

            settings.shapes.push(newShape);
        }

        $('.shapes-over-images--drawing-area').unbind("click");
        if (settings.currentAction === 'add-polygon') {
            $('.shapes-over-images--drawing-area').click(_self.addPolygonPoint);
        }
    }

    this.setupStudentViewMode = function (settings) {
        settings.teacherShapes.length = 0;
        for (var i = 0; i < settings.shapes.length; i++) {
            settings.teacherShapes.push({
                uuid: settings.shapes[i].uuid,
                shapeType: settings.shapes[i].shapeType,
                position: settings.shapes[i].position,
                size: settings.shapes[i].size,
                worth: settings.shapes[i].worth,
                threshold: settings.shapes[i].threshold
            });

            if (settings.shapes[i].shapeType === 'polygon') {
                settings.teacherShapes[i].points = settings.shapes[i].points;
                settings.teacherShapes[i].connectors = settings.shapes[i].connectors;
                settings.teacherShapes[i].open = settings.shapes[i].open;
            }
        }
        settings.shapes.length = 0;

        $('.shapes-over-images--drawing-area').unbind("click");
        if (settings.answerType.id == "click-inside-shapes") {
            $('.shapes-over-images--drawing-area').click(
                function (e) {
                    console.log('marker');
                    var posX = $(this).offset().left,
                        posY = $(this).offset().top;
                    _self.addMarker(_self.settings, e.pageX - posX, e.pageY - posY);
                });
        } else if (settings.currentAction === 'add-polygon') {
            $('.shapes-over-images--drawing-area').click(_self.addPolygonPoint);
        }
    }

    this.submitAnswerFromPreview = function (settings) {
        this.processAnswer(settings);
    }

    this.processAnswer = function (settings) {
        var teacherShapes = settings.teacherShapes,
            studentShapes = settings.shapes,
            totalWorth = 0,
            correctShapes = 0,
            gotWorth = 0;

        for (var i = 0; i < teacherShapes.length; i++) {
            totalWorth += Number(teacherShapes[i].worth);
        }
        if (settings.answerType.id === 'click-inside-shapes') {
            if (settings.teacherShapes.length === settings.shapes.length) {
                // Reset matched flag to allow only one marker per shape
                for (var i = 0; i < settings.teacherShapes.length; i++) {
                    settings.teacherShapes[i].matched = false;
                }

                for (var i = 0; i < settings.shapes.length; i++) {
                    var marker = settings.shapes[i];
                    var center = { x: marker.position.x + marker.size.width / 2, y: marker.position.y + marker.size.height / 2 };
                    for (var j = 0; j < settings.teacherShapes.length; j++) {
                        var shape = settings.teacherShapes[j];
                        if (shape.matched == false) {
                            if (center.x >= shape.position.x - shape.threshold &&
                                center.y >= shape.position.y - shape.threshold &&
                                center.x <= shape.position.x + shape.size.width + shape.threshold &&
                                center.y <= shape.position.y + shape.size.height + shape.threshold) {
                                gotWorth += Number(shape.worth);
                                correctShapes += 1;
                                shape.matched = true;
                                break;
                            }
                        }
                    }
                }
            }
        } else {
            for (var i = 0; i < studentShapes.length; i++) {
                var matchedShape = null;
                if (settings.answerType.id === 'position-must-match') {
                    var matchedShape = this.matchPosition(teacherShapes, studentShapes[i]);
                }

                if (settings.answerType.id === 'area-must-match') {
                    var matchedShape = this.matchArea(teacherShapes, studentShapes[i]);
                }

                if (settings.answerType.id === 'position-and-area-must-match') {
                    var matchedPosition = this.matchPosition(teacherShapes, studentShapes[i]);
                    var matchedArea = this.matchArea(teacherShapes, studentShapes[i]);
                    if (matchedPosition != null && matchedArea != null && matchedPosition.id === matchedArea.id) {
                        matchedShape = matchedPosition;
                    }
                }

                if (matchedShape != null) {
                    correctShapes++;
                    gotWorth += Number(matchedShape.worth);
                }
            }
        }

        var message = "Correct shapes: " + correctShapes + "\n";
        message += "Worth: " + gotWorth + " / " + totalWorth;
        alert(message);
    }

    this.drawShapes = function (settings) {
        for (var i = 0; i < settings.shapes.length; i++) {
            this.drawShape(settings, settings.shapes[i]);
        }
    }

    this.drawShape = function (settings, shape) {
        switch (shape.shapeType) {
            case 'ellipse':
                this.drawRectangle(settings, shape);
                break;
            case 'rectangle':
                this.drawRectangle(settings, shape);
                break;
            case 'polygon':
                this.drawPolygon(settings, shape);
                break;
            case studentMarker:
                this.drawRectangle(settings, shape);
                break;
            default:
                break;
        }
    }

    this.drawRectangle = function (settings, shape) {
        var devicePoint = shape.position;
        var rx = Math.round(shape.size.width / 2),
            ry = Math.round(shape.size.height / 2);
        var roundCornerRadius = shape.shapeType == 'rectangle' ? 0 : 360;

        var ellipse = this.canvas.rect(devicePoint.x, devicePoint.y, shape.size.width, shape.size.height, roundCornerRadius)
            .attr('fill', shape.shapeType !== studentMarker ? '#f00' : '#00f');
        if (shape.ellipse != null) {
            shape.ellipse.remove();
        }
        shape.ellipse = ellipse;
        ellipse.parent = shape;
        if (shape.shapeType === studentMarker) {
            ellipse.click(function (e) {
                _self.deleteMarker(_self.settings, this.parent);
                e.preventDefault();
                e.stopPropagation();
            });
        } else {
            if (shape.selected === true) {
                shape.handlers = this.drawSelectedEllipse(settings, shape).slice();
                ellipse.drag(this.onMoveShape, this.onStartShape, this.onEndShape);

            } else {
                ellipse.click(function (e) { _self.selectShape(_self.settings, this.parent); });
            }
        }
    };

    this.drawPolygon = function (settings, shape) {
        shape.open = false;
        var selectedColor = shape.selected ? '#aaaaaa' : '#f00';
        for (var index = 0; index < shape.points.length; index++) {
            var point = shape.points[index];
            if (point.circle != null) {
                point.circle.remove();
            }
            point.circle = _self.canvas.circle(point.x, point.y, 6)
                .attr({ stroke: selectedColor, fill: selectedColor })
                .data({ 'shapeId': shape.uuid, 'pointId': point.uuid })
                .click(_self.selectPolygon)
                .drag(_self.onMovePoint, _self.onStartPoint, _self.onEndPoint);
        }
        _self.drawConnectorsPolygon(shape);
        _self.toFront(shape);
    }

    this.drawConnectorsPolygon = function (shape) {
        if (shape.connectors != null) {
            for (var index = 0; index < shape.connectors.length; index++) {
                if (shape.connectors[index].path != null) {
                    shape.connectors[index].path.remove();
                }
            }
        }

        shape.connectors = [];
        for (var index = 0; index < shape.points.length; index++) {
            var point = shape.points[index];
            if (index > 0) {
                var point2 = shape.points[index - 1];
                var path = _self.canvas.path(['M', point.x, point.y, 'L', point2.x, point2.y])
                    .attr({ 'stroke-width': 2, stroke: '#f00' });
                shape.connectors.push({
                    uuid: Helpers.getUUID(),
                    path: path,
                    point1: point,
                    point2: point2
                });
            }
        }

        if (!shape.open && shape.points.length > 2) {
            var point1 = shape.points[shape.points.length - 1];
            var point2 = shape.points[0];
            var path = _self.canvas.path(['M', point1.x, point1.y, 'L', point2.x, point2.y])
                    .attr({ 'stroke-width': 2, stroke: '#f00' });
            shape.connectors.push({
                uuid: Helpers.getUUID(),
                path: path,
                point1: point1,
                point2: point2
            });
        }
    }

    this.drawSelectedEllipse = function (settings, shape) {
        var handlerPositions = ['left-top', 'middle-top', 'right-top', 'left-middle', 'right-middle', 'left-bottom', 'middle-bottom', 'right-bottom'];
        var handlers = [];
        for (var i = 0; i < handlerPositions.length; i++) {
            handlers.push(this.drawHandler(settings, shape, handlerPositions[i]));
        }
        return handlers;
    };

    this.drawHandler = function (settings, shape, handlerPosition) {
        var mapX = { 'left': 0, 'middle': Math.round(shape.size.width / 2), 'right': shape.size.width };
        var mapY = { 'top': 0, 'middle': Math.round(shape.size.height / 2), 'bottom': shape.size.height };

        var handlerPositionTokens = handlerPosition.split('-');
        var x = shape.position.x + mapX[handlerPositionTokens[0]] - 4;
        var y = shape.position.y + mapY[handlerPositionTokens[1]] - 4;
        var handler = this.canvas.rect(x, y, 8, 8)
            .attr("fill", "#aaa")
            .attr("stroke", "#aaa")
            .drag(this.onMoveHandler, this.onStartHandler, this.onEndHandler);

        handler.handlerPosition = handlerPosition;
        handler.shape = shape;
        return handler;
    }

    this.setAction = function (settings) {
        _self.updateShapeStatus(settings);
        switch (settings.currentAction) {
            case 'add-ellipse':
                this.addEllipse(_self.settings);
                break;
            case 'add-rectangle':
                this.addRectangle(_self.settings);
                break;
            case 'add-polygon':
                $('.shapes-over-images--drawing-area').click(_self.addPolygonPoint);
                break;
            case 'delete':
                this.deleteShape(_self.settings);
                break;
            default:
                break;
        }
    };

    this.addEllipse = function (settings) {
        var newEllipse = {
            uuid: Helpers.getUUID(),
            shapeType: 'ellipse',
            position: { x: 100, y: 100 },
            size: { height: 100, width: 100 },
            worth: 0,
            threshold: 5,
            selected: false,
            handlers: []
        };
        settings.shapes.push(newEllipse);
        this.drawShape(settings, newEllipse);
        //this.selectShape(settings, newEllipse);
        return newEllipse;
    }

    this.addRectangle = function (settings, x, y) {
        var newRectangle = {
            uuid: Helpers.getUUID(),
            shapeType: 'rectangle',
            position: { x: 100, y: 100 },
            size: { height: 100, width: 100 },
            worth: 0,
            threshold: 5,
            selected: false,
            handlers: []
        };
        settings.shapes.push(newRectangle);
        this.drawShape(settings, newRectangle);
        //this.selectShape(settings, newEllipse);
        return newRectangle;
    }

    this.addPolygon = function (settings) {
        var newPolygon = {
            uuid: Helpers.getUUID(),
            shapeType: 'polygon',
            position: { x: 0, y: 0 },
            size: { height: 0, width: 0 },
            worth: 0,
            threshold: 5,
            handlers: [],
            points: [],
            connectors: [],
            selected: false,
            open: true
        };
        settings.shapes.push(newPolygon);
        _self.currentPolygonShape = newPolygon;
    }

    this.addMarker = function (settings, x, y) {
        var newMarker = {
            uuid: Helpers.getUUID(),
            shapeType: studentMarker,
            position: { x: x - 10, y: y - 10 },
            size: { height: 20, width: 20 },
            worth: 0,
            threshold: 5,
            selected: false,
            handlers: []
        };
        settings.shapes.push(newMarker);
        this.drawShape(settings, newMarker);
        return newMarker;
    }

    this.selectShape = function (settings, shape) {
        for (var i = 0; i < settings.shapes.length; i++) {
            if (settings.shapes[i].uuid === shape.uuid) {
                if (settings.shapes[i].selected === false) {
                    settings.shapes[i].selected = true;
                    this.drawShape(settings, shape);
                    _self.updateShapeStatus(settings);
                }
            } else {
                if (settings.shapes[i].selected === true) {
                    settings.shapes[i].selected = false;
                    for (var j = 0; j < settings.shapes[i].handlers.length; j++) {
                        settings.shapes[i].handlers[j].remove();
                    }
                    settings.shapes[i].handlers.length = 0;
                    this.drawShape(settings, settings.shapes[i]);
                    _self.updateShapeStatus(settings);
                }
            }
        }
    }

    this.selectPolygon = function (event) {
        var shapeId = this.data('shapeId'),
            shape = _self.getPointById(_self.settings.shapes, shapeId),
            point = _self.getPointForCircle(shape, this);

        if (!shape.selected && !shape.open) {
            _self.selectShape(_self.settings, shape);
        }

        if (shape.open && shape.points.length > 2) {
            var firstPoint = shape.points[0];
            if (point.uuid === firstPoint.uuid) {
                _self.closePolygon(shape);
                _self.currentPolygonShape = null;
                _self.scope.$apply();
            }
        }
    }

    this.deleteShape = function (settings) {
        for (var i = 0; i < settings.shapes.length; i++) {
            if (settings.shapes[i].selected === true) {
                switch (settings.shapes[i].shapeType) {
                    case 'ellipse':
                        _self.deleteRectangle(settings.shapes, settings.shapes[i], i);
                        break;
                    case 'rectangle':
                        _self.deleteRectangle(settings.shapes, settings.shapes[i], i);
                        break;
                    case 'polygon':
                        _self.deletePolygon(settings.shapes, settings.shapes[i], i);
                        break;
                    default:
                        break;
                }
                break;
            }
        }
    }

    this.deleteRectangle = function (shapes, shape, i) {
        shape.ellipse.remove();
        for (var j = 0; j < shape.handlers.length; j++) {
            shape.handlers[j].remove();
        }
        shape.handlers.length = 0;
        shapes.splice(i, 1);
    }

    this.deletePolygon = function (shapes, shape, i) {
        for (var index = 0; index < shape.connectors.length; index++) {
            shape.connectors[index].path.remove();
        }
        for (var index = 0; index < shape.points.length; index++) {
            shape.points[index].circle.remove();
        }
        shapes.splice(i, 1);
    }

    this.deleteMarker = function (settings, marker) {
        for (var i = 0; i < settings.shapes.length; i++) {
            if (settings.shapes[i].uuid === marker.uuid) {
                settings.shapes[i].ellipse.remove();
                settings.shapes.splice(i, 1);
                break;
            }
        }
    };

    this.updateShapeStatus = function (settings) {
        if (settings.currentAction !== 'add-polygon') {
            var shape = _self.currentPolygonShape;
            if (shape != null && shape.open) {
                if (shape.points.length < 3) {
                    for (var i = 0; i < settings.shapes.length; i++) {
                        if (settings.shapes[i].uuid === shape.uuid) {
                            _self.deletePolygon(settings.shapes, shape, i);
                            break;
                        }
                    }
                } else {
                    _self.closePolygon(shape);
                }
            }
            _self.currentPolygonShape = null;
            $('.shapes-over-images--drawing-area').unbind("click");
        } else {
            for (var i = 0; i < settings.shapes.length; i++) {
                if (settings.shapes[i].shapeType === 'polygon' && settings.shapes[i].open) {
                    if (settings.shapes[i].points.length < 3) {
                        _self.deletePolygon(settings.shapes, settings.shapes[i], i);
                        _self.currentPolygonShape = null;
                        _self.scope.$apply();
                        break;
                    } else {
                        _self.closePolygon(settings.shapes[i]);
                        _self.scope.$apply();
                        break;
                    }
                }
            }
        }
    }

    this.addPolygonPoint = function (event) {
        if (_self.settings.currentAction === 'add-polygon' && event.target.tagName === 'svg') {
            if (_self.currentPolygonShape == null ||
                (_self.currentPolygonShape != null && !_self.currentPolygonShape.open)) {
                _self.addPolygon(_self.settings);
            }

            var shape = _self.currentPolygonShape;
            if (shape != null) {
                var x = event.offsetX;
                var y = event.offsetY;
                var point = {
                    uuid: Helpers.getUUID(),
                    shapeId: shape.uuid,
                    x: x,
                    y: y
                };

                if (shape.points.length > 0) {
                    var lastPoint = shape.points[shape.points.length - 1];
                    var path = _self.canvas.path(['M', lastPoint.x, lastPoint.y, 'L', point.x, point.y])
                        .attr({ 'stroke-width': 2, stroke: '#f00' });
                    shape.connectors.push({
                        uuid: Helpers.getUUID(),
                        path: path,
                        point1: lastPoint,
                        point2: point
                    });
                }

                point.circle = _self.canvas.circle(point.x, point.y, 6)
                    .attr({ stroke: '#f00', fill: '#f00' })
                    .data({ 'shapeId': shape.uuid, 'pointId': point.uuid })
                    .click(_self.selectPolygon)
                    .drag(_self.onMovePoint, _self.onStartPoint, _self.onEndPoint);

                shape.points.push(point);
                _self.toFront(shape);
                _self.scope.$apply();
            }
        }
        event.stopImmediatePropagation();
    }

    this.closePolygon = function (shape) {
        var point1 = shape.points[0];
        var point2 = shape.points[shape.points.length - 1];
        var path = _self.canvas.path(['M', point1.x, point1.y, 'L', point2.x, point2.y]).attr({ 'stroke-width': 2, stroke: '#f00' });
        shape.connectors.push({
            uuid: Helpers.getUUID(),
            path: path,
            point1: point1,
            point2: point2
        });
        shape.open = false;
        shape.selected = false;
        _self.polygonDimension(shape);
        _self.toFront(shape);
    }

    this.polygonDimension = function (shape) {
        if (shape != null) {
            var xAxisArray = _self.getArrayOfIntegers(shape, 'x').sort(_self.sortNumber);
            var yAxisArray = _self.getArrayOfIntegers(shape, 'y').sort(_self.sortNumber);
            var width = Math.round(xAxisArray[xAxisArray.length - 1] - xAxisArray[0]);
            var height = Math.round(yAxisArray[yAxisArray.length - 1] - yAxisArray[0]);
            shape.position = { x: xAxisArray[0], y: yAxisArray[0] };
            shape.size = { height: height, width: width };
        }
    }

    this.getArrayOfIntegers = function (shape, axis) {
        var array = new Array();
        for (var index = 0; index < shape.points.length; index++) {
            if (axis === 'x')
                array.push(shape.points[index].x);
            else
                array.push(shape.points[index].y);
        }
        return array;
    }

    this.isInPolygon = function (shape, point) {
        if (shape.shapeType === 'polygon') {
            return _self.insidePolygon(shape.points, point);
        }
        return false;
    }

    this.insidePolygon = function (pointList, p) {
        var counter = 0;
        var xinters;
        var p1 = { x: 0, y: 0 };
        var p2 = { x: 0, y: 0 };
        var n = pointList.length;
        p1 = pointList[0];

        for (var i = 1; i <= n; i++) {
            p2 = pointList[i % n];
            if (p.y > Math.min(p1.y, p2.y)) {
                if (p.y <= Math.max(p1.y, p2.y)) {
                    if (p.x <= Math.max(p1.x, p2.x)) {
                        if (p1.y != p2.y) {
                            xinters = (p.y - p1.y) * (p2.x - p1.x) / (p2.y - p1.y) + p1.x;
                            if (p1.x == p2.x || p.x <= xinters)
                                counter++;
                        }
                    }
                }
            }
            p1 = p2;
        }
        if (counter % 2 == 0) {
            return false;
        }
        return true;
    }

    this.getPointForCircle = function (shape, circle) {
        var points = shape.points;
        for (var i = 0; i < points.length; i++) {
            if (points[i].circle.data('pointId') == circle.data('pointId')) {
                return points[i];
            }
        }
        return null;
    }

    this.getPointConnectors = function (shape, point) {
        var result = [];
        var connectors = shape.connectors;
        for (var i = 0; i < connectors.length; i++) {
            if (connectors[i].point1.uuid == point.uuid || connectors[i].point2.uuid == point.uuid) {
                result.push(connectors[i]);
            }
        }
        return result;
    }

    this.toFront = function (shape) {
        for (var i = 0; i < shape.points.length; i++) {
            shape.points[i].circle.toFront();
        }
    }

    this.sortNumber = function (a, b) {
        return a - b;
    }

    this.matchPosition = function (teacherShapes, studentShape) {
        for (var i = 0; i < teacherShapes.length; i++) {
            if (studentShape.shapeType === teacherShapes[i].shapeType &&
                Math.abs(teacherShapes[i].position.x - studentShape.position.x) <= teacherShapes[i].threshold &&
                Math.abs(teacherShapes[i].position.y - studentShape.position.y) <= teacherShapes[i].threshold) {
                return teacherShapes[i];
            }
        }
        return null;
    }

    this.matchArea = function (teacherShapes, studentShape) {
        for (var i = 0; i < teacherShapes.length; i++) {
            if (studentShape.shapeType === teacherShapes[i].shapeType &&
                Math.abs(teacherShapes[i].size.width - studentShape.size.width) <= teacherShapes[i].threshold &&
                Math.abs(teacherShapes[i].size.height - studentShape.size.height) <= teacherShapes[i].threshold) {
                return teacherShapes[i];
            }
        }
        return null;
    }

    this.getRatioX = function (settings) {
        return (settings.container.width - (settings.plotAreaPadding.left + settings.plotAreaPadding.right)) / settings.grid.width;
    }

    this.getRatioY = function (settings) {
        return (settings.container.height - (settings.plotAreaPadding.top + settings.plotAreaPadding.bottom)) / settings.grid.height;
    }

    this.mapToGridCoordinates = function (settings, containerPosition) {
        return {
            x: Math.round((containerPosition.x - settings.plotAreaPadding.left) / this.getRatioX(settings)),
            y: Math.round((containerPosition.y - settings.plotAreaPadding.top) / this.getRatioY(settings))
        };
    };

    this.mapToDeviceCoordinates = function (settings, point) {
        return {
            x: Math.round(point.x * this.getRatioX(settings)) + settings.plotAreaPadding.left,
            y: Math.round(point.y * this.getRatioY(settings)) + settings.plotAreaPadding.top
        };
    };

    this.snapToGrid = function (point) {
        var gridCoordinates = _self.mapToGridCoordinates(settings, point);
        return _self.mapToDeviceCoordinates(settings, gridCoordinates);
    }

    this.getPointById = function (points, uuid) {
        for (var i = 0; i < points.length; i++) {
            if (points[i].uuid == uuid) {
                return points[i];
            }
        }
        return null;
    }

    this.getArea = function (shape) {
        if (shape.shapeType == 'rectangle') {
            return shape.size.width * shape.size.height;
        } else if (shape.shapeType == 'ellipse') {
            return Math.PI * (shape.size.width * shape.size.height) / 4;
        } else if (shape.shapeType == 'polygon') {
            var p1, p2;
            for (var area = 0, len = shape.points.length, i = 0; i < len; ++i) {
                p1 = shape.points[i];
                p2 = shape.points[(i - 1 + len) % len];
                area += (p2.x + p1.x) * (p2.y - p1.y);
            }
            return Math.abs(area / 2);
        }
    }

    /************************ Handler Drag and Drop ************************/
    this.startX = 0;
    this.startY = 0;
    this.onStartHandler = function () {
        _self.startX = this.attr('x');
        _self.startY = this.attr('y');
        this.attr('fill', 'black');
    }

    this.onEndHandler = function () {
        _self.updateUI(this)
        this.attr('fill', '#aaa');
        _self.scope.$apply();
    }

    this.onMoveHandler = function (dx, dy) {
        var position = { x: Math.round(_self.startX + dx), y: Math.round(_self.startY + dy) };
        position.x = Math.max(position.x, _self.settings.plotAreaPadding.left);
        position.y = Math.max(position.y, _self.settings.plotAreaPadding.top);

        position.x = Math.min(position.x, settings.container.width - _self.settings.plotAreaPadding.right);
        position.y = Math.min(position.y, settings.container.height - _self.settings.plotAreaPadding.bottom);

        var handlerPositionTokens = this.handlerPosition.split('-');
        if (handlerPositionTokens[0] != 'middle') {
            this.attr('x', position.x);
        }

        if (handlerPositionTokens[1] != 'middle') {
            this.attr('y', position.y);
        }

        _self.updateUIOnMove(this);
    }

    /************************ Shape Drag and Drop ************************/
    this.onStartShape = function () {
        _self.startX = this.attr('x');
        _self.startY = this.attr('y');
        this.attr('fill', 'black');
    }

    this.onEndShape = function () {
        _self.updateUI(this)
        this.attr('fill', '#f00');
        _self.scope.$apply();
    }

    this.onMoveShape = function (dx, dy) {
        var shape = this.parent;
        var pt = { x: Math.round(_self.startX + dx), y: Math.round(_self.startY + dy) };
        var position = pt;
        position.x = Math.max(position.x, _self.settings.plotAreaPadding.left);
        position.y = Math.max(position.y, _self.settings.plotAreaPadding.top);

        position.x = Math.min(position.x, settings.container.width - _self.settings.plotAreaPadding.right);
        position.y = Math.min(position.y, settings.container.height - _self.settings.plotAreaPadding.bottom);

        shape.position = { x: position.x, y: position.y };
        this.attr({ x: position.x, y: position.y });

        /// update handlers
        var mapX = { 'left': 0, 'middle': Math.round(shape.size.width / 2), 'right': shape.size.width };
        var mapY = { 'top': 0, 'middle': Math.round(shape.size.height / 2), 'bottom': shape.size.height };

        for (var i = 0; i < shape.handlers.length; i++) {
            var handler = shape.handlers[i];
            var handlerPositionTokens = handler.handlerPosition.split('-');
            var x = shape.position.x + mapX[handlerPositionTokens[0]] - 4;
            var y = shape.position.y + mapY[handlerPositionTokens[1]] - 4;
            handler.attr('x', x);
            handler.attr('y', y);
        }
        //_self.updateUIOnMove(this);
    }

    this.updateUI = function (sender) {
        this.scope.$apply();
    }

    this.updateUIOnMove = function (sender) {
        var settings = _self.settings;
        var handlerPositionTokens = sender.handlerPosition.split('-');

        if (handlerPositionTokens[0] == 'left') {
            var oldX = sender.shape.position.x;
            sender.shape.position.x = sender.attrs['x'] + 4;
            sender.shape.size.width = sender.shape.size.width + (oldX - sender.shape.position.x);
            sender.shape.ellipse.attr('x', sender.shape.position.x);
            sender.shape.ellipse.attr('width', sender.shape.size.width);
        } else if (handlerPositionTokens[0] == 'right') {
            var deltaWidth = (sender.shape.position.x + sender.shape.size.width) - sender.attr('x');
            sender.shape.size.width = sender.shape.size.width - deltaWidth + 4;
            sender.shape.ellipse.attr('width', sender.shape.size.width);
        }

        if (handlerPositionTokens[1] == 'top') {
            var oldY = sender.shape.position.y;
            sender.shape.position.y = sender.attrs['y'] + 4;
            sender.shape.ellipse.attr('y', sender.shape.position.y);
            sender.shape.size.height = sender.shape.size.height + (oldY - sender.shape.position.y);
            sender.shape.ellipse.attr('height', sender.shape.size.height);
        } else if (handlerPositionTokens[1] == 'bottom') {
            var deltaHeight = (sender.shape.position.y + sender.shape.size.height) - sender.attr('y');
            sender.shape.size.height = sender.shape.size.height - deltaHeight + 4;
            sender.shape.ellipse.attr('height', sender.shape.size.height);
        }
        this.updateHandlers(sender.shape, sender);
    }

    this.updateHandlers = function (shape, sender) {
        var senderTokens = sender.handlerPosition.split('-');
        var midX = Math.round(shape.size.width / 2) + shape.position.x,
            midY = Math.round(shape.size.height / 2) + shape.position.y;

        for (var i = 0; i < shape.handlers.length; i++) {
            if (shape.handlers[i].id != sender.id) {
                var targetTokens = shape.handlers[i].handlerPosition.split('-');
                if (senderTokens[0] == targetTokens[0]) {
                    shape.handlers[i].attr('x', sender.attr('x'));
                }
                if (senderTokens[1] == targetTokens[1]) {
                    shape.handlers[i].attr('y', sender.attr('y'));
                }

                if (targetTokens[0] == 'middle') {
                    shape.handlers[i].attr('x', midX);
                }
                if (targetTokens[1] == 'middle') {
                    shape.handlers[i].attr('y', midY);
                }
            }
        }
    }

    /************************ Polygon Drag and Drop ************************/
    this.offset = null;
    this.onStartPoint = function () {
        var shapeId = this.data('shapeId');
        var shape = _self.getPointById(_self.settings.shapes, shapeId);
        if (shape.selected) {
            _self.startX = this.attr('cx');
            _self.startY = this.attr('cy');
            _self.offset = $('.shapes-over-images--drawing-area').offset();
            if (!shape.open) {
                this.attr('fill', 'black');
            }
        }
    }

    this.onEndPoint = function () {
        var shapeId = this.data('shapeId'),
            shape = _self.getPointById(_self.settings.shapes, shapeId);
        if (shape.selected) {
            var point = _self.getPointForCircle(shape, this),
                position = { x: point.circle.attrs['cx'], y: point.circle.attrs['cy'] };
            point.x = position.x;
            point.y = position.y;

            if (!shape.open) {
                this.attr('fill', '#aaaaaa');
            }
            _self.polygonDimension(shape);
            _self.scope.$apply();
        }
    }

    this.onMovePoint = function (dx, dy, x, y) {
        var shapeId = this.data('shapeId');
        var shape = _self.getPointById(_self.settings.shapes, shapeId);

        if (shape.selected) {
            var width = _self.settings.container.width;
            var height = _self.settings.container.height;

            var x = x - _self.offset.left;
            var y = y - _self.offset.top;
            x = x < 5 ? 5 : x > width - 5 ? width - 5 : x;
            y = y < 5 ? 5 : y > height - 5 ? height - 5 : y;

            this.attr({
                cx: Math.round(x),
                cy: Math.round(y)
            });

            var point = _self.getPointForCircle(shape, this);
            var connectors = _self.getPointConnectors(shape, point);
            for (var i = 0; i < connectors.length; i++) {
                var c = connectors[i];
                var path = [];
                if (c.point1.uuid == point.uuid) {
                    path = ['M', point.circle.attrs['cx'], point.circle.attrs['cy'], 'L', c.point2.circle.attrs['cx'], c.point2.circle.attrs['cy']];
                } else {
                    path = ['M', c.point1.circle.attrs['cx'], c.point1.circle.attrs['cy'], 'L', point.circle.attrs['cx'], point.circle.attrs['cy']];
                }
                c.path.attr('path', path);
            }
        }
    }

    /************************ Drag and Drop ************************/

    this.performAction = function (settings, x, y) {
        var gridPosition = this.mapToGridCoordinates(settings, { x: x, y: y });
        switch (settings.currentAction) {
            case 'add-rectangle':
                this.addRectangle(settings, gridPosition);
                break;
            case 'add-ellipse':
                this.addEllipse(settings, gridPosition);
                break;
            case 'add-cube':
                this.addCube(settings, gridPosition);
                break;
            case 'delete':
                this.deleteElement(settings, gridPosition);
                break;
            case 'move':
                this.selectElement(settings, x, y);
                break;
            case 'student-click-inside-shape':
                this.addClickMarker(settings, x, y);
                break;
            default:
                break;
        }
        _self.scope.$apply();
    }

    this.selectElement = function (settings, x, y) {

    }

    this.exportJson = function (settings) {
        var shapesOverImage = {
            shapeType: settings.shapeType,
            container: settings.container,
            shapes: [],
            plotAreaPadding: settings.plotAreaPadding,
            answerType: { id: settings.answerType.id },
            image: settings.image
        };

        for (var i = 0; i < settings.shapes.length; i++) {
            var shape = {
                uuid: settings.shapes[i].uuid,
                shapeType: settings.shapes[i].shapeType,
                position: settings.shapes[i].position,
                size: settings.shapes[i].size,
                worth: settings.shapes[i].worth,
                threshold: settings.shapes[i].threshold,
                points: []
            };
            if (shape.shapeType === 'polygon') {
                for (var p = 0; p < settings.shapes[i].points.length; p++) {
                    shape.points.push({
                        uuid: settings.shapes[i].points[p].uuid,
                        x: settings.shapes[i].points[p].x,
                        y: settings.shapes[i].points[p].y
                    });
                }
            }
            shapesOverImage.shapes.push(shape);
        }

        var result = {
            id: settings.id,
            questionType: 'ShapesOverImage',
            questionText: scope.questionText,
            questionNotes: scope.questionNotes,
            shapesOverImage: JSON.stringify(shapesOverImage)
        };

        return result;
    };

}