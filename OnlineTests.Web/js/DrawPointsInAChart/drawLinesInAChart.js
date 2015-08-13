// DrawLinesInAChart/drawLinesInAChart.js
//require('../Helpers.js');

DrawLinesInAChart = function (Raphael, container, settings, scope) {
    var _self = this;
    this.container = container;
    this.settings = settings;
    this.teacherPoints = [];
    this.teacherConnections = [];
    this.scope = scope;

    this.canvas = Raphael(container, settings.container.width, settings.container.height);
    // Interface
    this.redraw = function (settings) {
        this.canvas.clear();
        this.drawGrid(settings);

        //if (settings.layout.id == 'grid') {
        //} else if (settings.layout.id == 'cartesian') {
        //    this.drawCartesian(settings);
        //}
        this.drawPoints(settings);
        this.drawConnections(settings);
    }

    this.setViewMode = function (settings, viewMode) {
        if (viewMode == "teacher") {
            this.setupTeacherViewMode(settings);
        } else {
            this.setupStudentViewMode(settings);
        }
        settings.viewMode = viewMode;
        this.redraw(settings);
    }

    // Interface

    // add accessors to settings
    this.getRatioX = function (settings) {
        return (settings.container.width - (settings.plotAreaPadding.left + settings.plotAreaPadding.right)) / settings.grid.width;
    }

    this.getRatioY = function (settings) {
        return (settings.container.height - (settings.plotAreaPadding.top + settings.plotAreaPadding.bottom)) / settings.grid.height;
    }

    this.drawGrid = function (settings) {
        for (var i = 0; i <= settings.grid.width; i++) {
            var p1 = this.mapToDeviceCoordinates(settings, { x: i, y: 0 });
            var p2 = this.mapToDeviceCoordinates(settings, { x: i, y: settings.grid.height });
            var strPath = ["M", p1.x, p1.y, "L", p2.x, p2.y];
            this.canvas.path(strPath)
                .attr("stroke", "#555");
        }

        for (var i = 0; i <= settings.grid.height; i++) {
            var p1 = this.mapToDeviceCoordinates(settings, { x: 0, y: i });
            var p2 = this.mapToDeviceCoordinates(settings, { x: settings.grid.width, y: i });
            var strPath = ["M", p1.x, p1.y, "L", p2.x, p2.y];
            this.canvas.path(strPath)
                .attr("stroke", "#555");
        }

        if (settings.scaleMode.id === 'scale') {
            this.drawScale(settings);
        } else if (settings.scaleMode.id === 'cartesian') {
            this.drawCartesian(settings);
        }

        // draw rectangle over the whole thing to capture clicks
        var cover = this.canvas.rect(0, 0, settings.container.width, settings.container.height);
        cover.attr({ fill: "#555", "fill-opacity" : 0.0 });
        cover.node.onclick = function (event, a, b) {
            var bnds = event.target.getBoundingClientRect();
            var fx = (event.clientX - bnds.left) / bnds.width * cover.attrs.width;
            var fy = (event.clientY - bnds.top) / bnds.height * cover.attrs.height;
            _self.performAction(settings, fx, fy);
        };
    };

    this.drawPoints = function (settings) {
        for (var i = 0; i < settings.points.length; i++) {
            this.drawPoint(settings, settings.points[i]);
        }
    }

    this.drawPoint = function (settings, point) {
        var radius = Number(settings.dot.radius) < 1 ? 1 : Number(settings.dot.radius);
        settings.dot.radius = radius;
        var devicePoint = this.mapToDeviceCoordinates(settings, point.gridPosition);
        var circle = this.canvas.circle(devicePoint.x, devicePoint.y, radius);
        circle.attr('fill', '#f00');
        circle.drag(this.onMove, this.onStart, this.onEnd);
        circle.click(this.circleClickHandler);
        point.circle = circle;
    }
        
    this.drawConnections = function (settings) {
        for (var c = 0; c < settings.connections.length; c++) {
            this.drawConnection(settings, settings.connections[c]);
        }
    }

    this.drawConnection = function (settings, connection) {
        var p1 = this.mapToDeviceCoordinates(settings, connection.point1.gridPosition);
        var p2 = this.mapToDeviceCoordinates(settings, connection.point2.gridPosition);
        if (connection.connectionType !== 'fixed-line' || settings.viewMode != 'student') {
            this.setConnectionPadding(settings,  p1, p2);
        }
        var path = ["M", p1.x, p1.y, "L", p2.x, p2.y];
        if (connection.path != null) {
            connection.path.remove();
        }
        connection.path = this.canvas.path(path)
            .attr("stroke-width", "3");
        if (connection.connectionType ===  'arrow') {
            connection.path.attr("arrow-end", "classic-wide-long");
        }
        if (connection.connectionType === 'double-arrow') {
            connection.path.attr("arrow-start", "classic-wide-long");
            connection.path.attr("arrow-end", "classic-wide-long");
        }
        if (connection.connectionType === 'fixed-line') {
            connection.path.attr("stroke", "black");
        } else {
            connection.path.attr("stroke", "blue");
        }
        connection.path.click(this.clickConnection);
    }

    this.drawScale = function (settings) {
        for (var i = 0; i <= settings.grid.width; i++) {
            var p1 = this.mapToDeviceCoordinates(settings, { x: i, y: settings.grid.height });
            this.canvas.text(p1.x, p1.y + 7, i.toString())
                .attr("fill", "blue")
                .attr("font-size", 12);
        }

        for (var i = 0; i < settings.grid.height; i++) {
            var p1 = this.mapToDeviceCoordinates(settings, { x: 0, y: i });
            this.canvas.text(p1.x - 7, p1.y, (settings.grid.height - i).toString())
                .attr("fill", "blue")
                .attr("font-size", 12);
        }
    }

    this.drawCartesian = function (settings) {
        var midX = Math.floor(settings.grid.width / 2);
        var midY = Math.floor(settings.grid.height / 2);
        for (var i = 0; i <= settings.grid.width ; i++) {
            if (i - midX == 0)
                continue;
            var p1 = this.mapToDeviceCoordinates(settings, { x: i, y: midY });
            this.canvas.text(p1.x, p1.y + 7, (i - midX).toString())
                .attr("fill", "blue")
                .attr("font-size", 12);
        }

        for (var i = 0; i <= settings.grid.height; i++) {
            var p1 = this.mapToDeviceCoordinates(settings, { x: midX, y: i });
            this.canvas.text(p1.x - 7, p1.y, (settings.grid.height - i - midY).toString())
            .attr("fill", "blue")
            .attr("font-size", 12);
        }

        var p1 = this.mapToDeviceCoordinates(settings, { x: 0, y: midY });
        var p2 = this.mapToDeviceCoordinates(settings, { x: settings.grid.width, y: midY });

        this.canvas.path(["M", p1.x, p1.y, "L", p2.x, p2.y])
            .attr("stroke", "blue")
            .attr('stroke-width', 2)
            .attr("arrow-start", "classic-wide-long")
            .attr("arrow-end", "classic-wide-long");

        p1 = this.mapToDeviceCoordinates(settings, { x: midX, y: 0 });
        p2 = this.mapToDeviceCoordinates(settings, { x: midX, y: settings.grid.height });
        this.canvas.path(["M", p1.x, p1.y, "L", p2.x, p2.y])
            .attr("stroke", "blue")
            .attr('stroke-width', 2)
            .attr("arrow-start", "classic-wide-long")
            .attr("arrow-end", "classic-wide-long");

    }

    this.clickConnection = function (event) {
        var settings = _self.settings;
        if (settings.currentAction == 'delete') {
            for (var i = 0; i < settings.connections.length; i++) {
                if (settings.connections[i].path.id === this.id) {
                    settings.connections.splice(i, 1);
                    this.remove();
                }
            }
        }
    }

    this.setupTeacherViewMode = function (settings) {
        settings.points.length = 0;
        for (var i = 0; i < settings.teacherPoints.length; i++) {
            var newPoint = {
                uuid: settings.teacherPoints[i].uuid,
                gridPosition: settings.teacherPoints[i].gridPosition,
                worth: settings.teacherPoints[i].worth
                }
            settings.points.push(newPoint);
        }

        settings.connections.length = 0;
        for (var i = 0; i < this.teacherConnections.length; i++) {
            settings.connections.push({
                uuid: this.teacherConnections[i].uuid,
                point1: this.getPointById(settings.points, this.teacherConnections[i].point1.uuid),
                point2: this.getPointById(settings.points, this.teacherConnections[i].point2.uuid),
                connectionType: this.teacherConnections[i].connectionType,
                worth: this.teacherConnections[i].worth,
                path: null
            });
        }
    }

    this.setupStudentViewMode = function (settings) {
        settings.teacherPoints.length = 0;
        for (var i = 0; i < settings.points.length; i++) {
            settings.teacherPoints.push({
                uuid: settings.points[i].uuid,
                gridPosition: settings.points[i].gridPosition,
                worth: settings.points[i].worth
            });
        }
        settings.points.length = 0;

        this.teacherConnections.length = 0;
        for (var i = 0; i < settings.connections.length; i++) {
            this.teacherConnections.push({
                uuid: settings.connections[i].uuid,
                point1: settings.connections[i].point1,
                point2: settings.connections[i].point2,
                connectionType: settings.connections[i].connectionType,
                path: null
            });
        }
        settings.connections.length = 0;

        // restore fixed connections
        for (var i = 0; i < this.teacherConnections.length; i++) {
            if (this.teacherConnections[i].connectionType == 'fixed-line') {
                settings.connections.push({
                    uuid: this.teacherConnections[i].uuid,
                    point1: this.teacherConnections[i].point1,
                    point2: this.teacherConnections[i].point2,
                    connectionType: this.teacherConnections[i].connectionType,
                    path: null
                });
            }
        }
    }   

    this.submitAnswerFromPreview = function (settings) {
        if (settings.answerType.id === 'points-in-the-same-position') {
            this.processAnswer_pointsIntheSamePosition(settings);
        } else if (settings.answerType.id === 'distance-between-two-points') {
            this.processAnswer_distanceBetweenTwoPoints(settings);
        }
    }

    this.processAnswer_pointsIntheSamePosition = function(settings) {
        var teacherPoints = settings.teacherPoints,
            studentPoints = settings.points,
            totalWorth = 0,
            correctPoints = 0,
            gotWorth = 0;

        for (var i = 0; i < teacherPoints.length; i++) {
            totalWorth += Number(teacherPoints[i].worth);

            if (this.getPointAt(teacherPoints[i].gridPosition, studentPoints) != null) {
                correctPoints++;
                gotWorth += Number(teacherPoints[i].worth);
            }
        }

        if (settings.strictPunctuation) {
            correctPoints = correctPoints == teacherPoints.length ? correctPoints : 0;
            gotWorth = correctPoints == teacherPoints.length ? gotWorth : 0;
        }

        var message = "Correct points: " + correctPoints + "\n";
        message += "Worth: " + gotWorth + " / " + totalWorth;
        alert(message);
    }

    this.processAnswer_distanceBetweenTwoPoints = function (settings) {
        var studentPoints = settings.points,
            totalWorth = settings.distanceBetweenTwoPoints.worth,
            gotWorth = 0,
            isCorrect = false,
            correctPoints = 0;

        if (studentPoints.length == 2) {
            var p1 = studentPoints[0].gridPosition,
                p2 = studentPoints[1].gridPosition;

            var distance = Math.sqrt(Math.pow(Math.abs(p1.x - p2.x), 2) + Math.pow(Math.abs(p1.y - p2.y), 2));
            if (distance == settings.distanceBetweenTwoPoints.distance) {
                if (settings.distanceBetweenTwoPoints.distanceType.id == 'horizontal') {
                    isCorrect = p1.y == p2.y;
                } else if (settings.distanceBetweenTwoPoints.distanceType.id == 'vertical') {
                    isCorrect = p1.x == p2.x;
                } else if (settings.distanceBetweenTwoPoints.distanceType.id == 'horizontal-or-vertical') {
                    isCorrect = p1.x == p2.x || p1.y == p2.y;
                } else if (settings.distanceBetweenTwoPoints.distanceType.id == 'diagonal') {
                    isCorrect = p1.x != p2.x && p1.y != p2.y;
                } else if (settings.distanceBetweenTwoPoints.distanceType.id == 'any') {
                    isCorrect = true;
                }
            }
        }

        if (isCorrect) {
            gotWorth = settings.distanceBetweenTwoPoints.worth;
            correctPoints = 2;
        }

        var message = "Correct points: " + correctPoints + "\n";
        message += "Worth: " + gotWorth + " / " + totalWorth;
        alert(message);

    }


    // vvvvvvvvvvvvvvv  Drag and drop   vvvvvvvvvvvvvvvvvv
    this.startX = 0;
    this.startY = 0;
    this.onStart = function () {
        _self.startX = this.attr('cx');
        _self.startY = this.attr('cy');
        this.attr('fill', 'pink');
        var snappedPosition = _self.snapToGrid({ x: _self.startX, y: _self.startY });
        var point = _self.getPointAt(_self.mapToGridCoordinates(settings, snappedPosition), _self.settings.points);
    }

    this.onEnd = function () {
        _self.updateUI(this)
        this.attr('fill', '#f00');
        _self.scope.$apply();
    }

    this.onMove = function (dx, dy) {
        var pt = { x: _self.startX + dx, y: _self.startY + dy };
        var position = _self.snapToGrid(pt);
        position.x = Math.max(position.x, _self.settings.plotAreaPadding.left);
        position.y = Math.max(position.y, _self.settings.plotAreaPadding.top);

        position.x = Math.min(position.x, settings.container.width - _self.settings.plotAreaPadding.right);
        position.y = Math.min(position.y, settings.container.height - _self.settings.plotAreaPadding.bottom);

        this.attr({
            cx: position.x,
            cy: position.y
        });
        _self.updateUIOnMove(this);
    }

    this.updateUI = function (sender) {
        var settings = _self.settings;
        for (var i = 0; i < settings.points.length; i++) {
            var point = settings.points[i];
            if (point.circle.id == sender.id) {
                var gridCoordinates = _self.mapToGridCoordinates(settings, { x: sender.attrs['cx'], y: sender.attrs['cy'] });
                if (gridCoordinates.x === point.gridPosition.x && gridCoordinates.y === point.gridPosition.y) {
                    var connections = _self.getPointConnections(_self.settings.connections, point);
                    _self.drawConnections(settings, connections);
                }

                var pointsInTheSameLocation = _self.getPointsAt(settings, gridCoordinates);
                if (pointsInTheSameLocation.length > 1) {
                    _self.mergePoints(settings, pointsInTheSameLocation[0], pointsInTheSameLocation[1]);
                }
                point.gridPosition = gridCoordinates;
                var connections = _self.getPointConnections(settings.connections, point);
                _self.drawConnections(settings);
                break;
            }
        }
    }

    this.updateUIOnMove = function (sender) {
        var settings = _self.settings;
        for (var i = 0; i < settings.points.length; i++) {
            var point = settings.points[i];
            if (point.circle.id == sender.id) {
                var gridCoordinates = _self.mapToGridCoordinates(settings, { x: sender.attrs['cx'], y: sender.attrs['cy'] });
                if (gridCoordinates.x === point.gridPosition.x && gridCoordinates.y === point.gridPosition.y) {
                    _self.drawConnections(settings);
                    break;
                }

                point.gridPosition = gridCoordinates;
                _self.drawConnections(settings);
                break;
            }
        }
    }


    // ^^^^^^^^^^    Drag and drop   ^^^^^^^^^^

    this.performAction = function (settings, x, y) {
        var gridPosition = this.mapToGridCoordinates(settings, { x: x, y: y });
        switch (settings.currentAction) {
            case 'add-point':
                this.addPoint(settings, gridPosition);
                break;
            case 'add-line':
                this.addLine(settings, x, y);
                break;
            case 'add-arrow':
                this.addArrow(settings, x, y);
                break;
            case 'add-double-arrow':
                this.addDoubleArrow(settings, x, y);
                break;
            case 'add-rectangle':
                this.addRectangle(settings, x, y);
                break;
            case 'delete':
                this.deleteElement(settings, gridPosition);
                break;
            case 'select':
                this.selectElement(settings, x, y);
                break;
            case 'add-fixed-line':
                this.addFixedLine(settings, x, y);
                break;
            default:
                break;
        }
        _self.scope.$apply();
    }

    this.addPoint = function (settings, gridPosition) {
        for (var i = 0; i < settings.points.length; i++) {
            if (settings.points[i].gridPosition.x == gridPosition.x && settings.points[i].gridPosition.y == gridPosition.y) {
                return settings.points[i];
            }
        }
        var newPoint = {
            uuid: Helpers.getUUID(),
            gridPosition: gridPosition,
            worth: 0
        };
        settings.points.push(newPoint);
        this.drawPoint(settings, newPoint);
        return newPoint;
    }

    this.addLine = function (settings, x, y) {
        var gridPosition = this.mapToGridCoordinates(settings, { x: x, y: y });
        if (settings.actionInProgress == null) {
            var point1 = this.getPointAt(gridPosition, settings.points) || this.addPoint(settings, gridPosition);

            settings.actionInProgress = {
                action: 'add-line',
                point1: point1
            };
        } else {
            var point2 = this.getPointAt(gridPosition, settings.points) || this.addPoint(settings, gridPosition);
            if (settings.actionInProgress.point1.uuid != point2.uuid) {
                this.addConnection(settings.actionInProgress.point1, point2, 'line');
                this.drawConnections(settings);
            }
            settings.actionInProgress = null;
        }
    }

    this.addFixedLine = function (settings, x, y) {
        var gridPosition = this.mapToGridCoordinates(settings, { x: x, y: y });
        if (settings.actionInProgress == null) {
            var point1 = this.getPointAt(gridPosition, settings.points) || this.addPoint(settings, gridPosition);

            settings.actionInProgress = {
                action: 'add-fixed-line',
                point1: point1,
            };
        } else {
            var point2 = this.getPointAt(gridPosition, settings.points) || this.addPoint(settings, gridPosition);
            if (settings.actionInProgress.point1.uuid != point2.uuid) {
                this.addConnection(settings.actionInProgress.point1, point2, 'fixed-line');
                this.drawConnections(settings);
            }
            settings.actionInProgress = null;
        }
    }

    this.addRectangle = function (settings, x, y) {
        alert("addRectangle");
    }

    this.setAction = function (settings) {
        for (var i = 0; i < settings.points.length; i++) {
            settings.points[i].circle.undrag();
            settings.points[i].circle.unclick(this.circleClickHandler);

            if (settings.currentAction != 'select') {
                settings.points[i].circle.click(this.circleClickHandler);
            } else {
                settings.points[i].circle.drag(this.onMove, this.onStart, this.onEnd);
            }
        }
        settings.actionInProgress = null;
    };

    this.circleClickHandler = function (e) {
        console.log(e);
        _self.performAction(settings, e.offsetX, e.offsetY);
    }

    this.addArrow = function (settings, x, y) {
        var gridPosition = this.mapToGridCoordinates(settings, { x: x, y: y });
        if (settings.actionInProgress == null) {
            var point1 = this.getPointAt(gridPosition, settings.points) || this.addPoint(settings, gridPosition);
            settings.actionInProgress = {
                action: 'add-arrow',
                point1: point1,
            };
        } else {
            var point2 = this.getPointAt(gridPosition, settings.points) || this.addPoint(settings, gridPosition);
            if (settings.actionInProgress.point1.uuid != point2.uuid) {
                this.addConnection(settings.actionInProgress.point1, point2, 'arrow');
                this.drawConnections(settings);
            }
            settings.actionInProgress = null;
        }
    }

    this.addDoubleArrow = function (settings, x, y) {
        var gridPosition = this.mapToGridCoordinates(settings, { x: x, y: y });
        if (settings.actionInProgress == null) {
            var point1 = this.getPointAt(gridPosition, settings.points) || this.addPoint(settings, gridPosition);
            settings.actionInProgress = {
                action: 'add-double-arrow',
                point1: point1,
            };
        } else {
            var point2 = this.getPointAt(gridPosition, settings.points) || this.addPoint(settings, gridPosition);
            if (settings.actionInProgress.point1.uuid != point2.uuid) {
                this.addConnection(settings.actionInProgress.point1, point2, 'double-arrow');
                this.drawConnections(settings);
            }
            settings.actionInProgress = null;
        }
    }

    this.deleteElement = function (settings, point) {
        var point = this.getPointAt(point, settings.points);
        if (point != null) {
            this.deletePoint(settings.connections, point);
        }
    }

    this.deleteConnection = function (connection) {
        connection.path.remove();
        for (var i = 0; i < settings.connections.length; i++) {
            if (settings.connections[i].uuid === connection.uuid) {
                settings.connections.splice(i, 1);
            }
        }
    }

    this.selectElement = function (settings, x, y) {

    }

    this.getPointAt = function (gridPosition, points) {
        for (var i = 0; i < points.length; i++) {
            if (points[i].gridPosition.x == gridPosition.x && points[i].gridPosition.y == gridPosition.y) {
                return points[i];
            }
        }
        return null;
    }

    this.getPointsAt = function (settings, gridPosition) {
        var result = [];
        for (var i = 0; i < settings.points.length; i++) {
            if (settings.points[i].gridPosition.x == gridPosition.x && settings.points[i].gridPosition.y == gridPosition.y) {
                result.push(settings.points[i]);
            }
        }
        return result;
    }

    this.addConnection = function (point1, point2, connectionType) {
        if (point1 === null || point2 === null) {
            return false;
        }

        this.settings.connections.push({
            uuid: Helpers.getUUID(),
            point1: point1,
            point2: point2,
            connectionType: connectionType,
            path: null
        });
        return true;
    }

    this.movePoint = function(source, target) {
        var pointSource = this.getPointAt(source, this.settings.points);
        if (pointSource === null) {
            return false;
        }

        var pointTarget = this.getPointAt(target, this.settings.points);
        if (pointTarget !== null) {
            for (var i = 0; i < pointTarget.connections.length; i++) {
                var connectedPoint = this.getPointAt(pointTarget.connections[i].gridPosition, this.settings.points);
                for (var j = 0; j < connectedPoint.connections.length; i++) {
                    if (connectedPoint.connections[i].uuid == pointTarget.uuid) {
                        connectedPoint.connections[i] = pointSource;
                        break;
                    }
                    pointSource.connections.push(pointTarget.connections[i]);
                }
                pointSource.connections.push(pointTarget.connections[i]);
            }
            this.deletePoint(_self.connections, pointTarget);
        }

        pointSource.gridPosition = target;
        return true;
    };

    this.deletePoint = function (connections, point) {
        if (point === null) {
            return false;
        }
        var pointConnections = this.getPointConnections(connections, point);
        for (var i = 0; i < pointConnections.length; i++) {
            pointConnections[i].path.remove();
            connections.splice(connections.indexOf(pointConnections[i]), 1);
        }
        point.circle.remove();
        settings.points.splice(settings.points.indexOf(point), 1);
        return true;
    }

    this.getPointConnections = function(connections, point) {
        var result = [];
        for (var i = 0; i < connections.length; i++) {
            if (connections[i].point1.circle.id == point.circle.id || connections[i].point2.circle.id == point.circle.id) {
                result.push(connections[i]);
            }
        }
        return result;
    }

    this.mergePoints = function(settings, point1, point2) {
        var otherConnections = _self.getPointConnections(settings.connections, point2);
        for (var j = 0; j < otherConnections.length; j++) {
            var connection = otherConnections[j];
            if (connection.point1.uuid === point2.uuid) {
                connection.point1 = point1;
            } else {
                connection.point2 = point1;
            }
            if (connection.point1.uuid == connection.point2.uuid) {
                this.deleteConnection(connection);
            }
        }
        var circle = _self.canvas.getById(point2.circle.id);
        circle.remove();
        var index = settings.points.indexOf(point2);
        settings.points.splice(index, 1);
    }

    this.mapToGridCoordinates = function(settings, containerPosition) {
        return { x: Math.round((containerPosition.x - settings.plotAreaPadding.left) / this.getRatioX(settings)), 
            y: Math.round((containerPosition.y - settings.plotAreaPadding.top) / this.getRatioY(settings)) };
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

    this.setConnectionPadding = function (settings, p1, p2) {
        var radius = settings.dot.radius;
        var factorX = p1.x > p2.x ? -1 : 1;
        var factorY = p1.y > p2.y ? -1 : 1;
        var p1Grid = this.mapToGridCoordinates(settings, p1);
        var p2Grid = this.mapToGridCoordinates(settings, p2);
        var radius1 = this.getPointAt(p1Grid, settings.points) !== null ? radius : 1;
        var radius2 = this.getPointAt(p2Grid, settings.points) !== null ? radius : 1;

        if (p1Grid.x == p2Grid.x) {
            p1.y += radius1 * factorY;
            p2.y -= radius2 * factorY;
        } else {
            var m = Math.abs((p1.y - p2.y) / (p1.x - p2.x));
            var angle = Math.atan(m);
            p1.x += Math.round(radius1 * Math.cos(angle)) * factorX;
            p1.y += Math.round(radius1 * Math.sin(angle)) * factorY;

            p2.x -= Math.round(radius2 * Math.cos(angle)) * factorX;
            p2.y -= Math.round(radius2 * Math.sin(angle)) * factorY;
        }
    }

    this.getPointById = function (points, uuid) {
        for (var i = 0; i < points.length; i++) {
            if (points[i].uuid == uuid) {
                return points[i];
            }
        }
        return null;
    }

    this.exportJson = function (settings) {
        var drawLinesInAChart = {
            shapeType: settings.shapeType,
            container: settings.container,
            grid: settings.grid,
            points: [],
            connections: [],
            dot: settings.dot,
            strictPunctuation: settings.strictPunctuation,
            scaleMode: settings.scaleMode,
            plotAreaPadding: settings.plotAreaPadding,
            answerType: settings.answerType,
            distanceBetweenTwoPoints: {
                distanceType: settings.distanceBetweenTwoPoints.distanceType,
                distance: settings.distanceBetweenTwoPoints.distance,
                worth: settings.distanceBetweenTwoPoints.worth
            }
        };

        for (var i = 0; i < settings.points.length; i++) {
            drawLinesInAChart.points.push({
                uuid: settings.points[i].uuid,
                gridPosition: settings.points[i].gridPosition,
                worth: settings.points[i].worth
            });
        };

        for (var i = 0; i < settings.connections.length; i++) {
            drawLinesInAChart.connections.push({
                uuid: settings.connections[i].uuid,
                point1: settings.connections[i].point1.uuid,
                point2: settings.connections[i].point2.uuid,
                connectionType: settings.connections[i].connectionType
            });
        }

        var result = {
            id: settings.id,
            //questionId: scope.questionId,
            questionType: 'DrawPointsInAChart',
            questionText: scope.questionText,
            questionNotes: scope.questionNotes,
            drawPointsInAChart: JSON.stringify(drawLinesInAChart)
        };

        return result;
    }
}
