onlineTestsApp.service("drawLinesInAChartSrvc", function () {
    return {
        buildQuestion: function(loadedData) {
            var question = this.getEmptyQuestion();
            return question;
        },
        getEmptyQuestion: function () {
            return {
                viewMode: 'teacher',
                container: { width: 400, height: 400 },
                dot: { radius: 10 },
                grid: { width: 10, height: 10 },
                strictPunctuation: false,
                points: [],
                connections: [],
                scaleMode: {id: 'none'},
                plotAreaPadding: { top: 10, left: 20, right: 10, bottom: 20 },
                answerType: {id: 'points-in-the-same-position'},
                distanceBetweenTwoPoints: { 
                    distanceType: { id: 'horizontal-or-vertical' },
                    distance: 0,
                    worth : 0
                }
            };
        },
        completeSettings: function (settings) {
            for (var i = 0; i < settings.connections.length; i++) {
                for (var j = 0; j < settings.points.length; j++) {
                    if (settings.points[j].uuid === settings.connections[i].point1) {
                        settings.connections[i].point1 = settings.points[j];
                    }
                    if (settings.points[j].uuid === settings.connections[i].point2) {
                        settings.connections[i].point2 = settings.points[j];
                    }
                }
            }
            settings.teacherPoints = [];
            settings.teacherConnections = [];
            settings.displayPointPosition = function (point) {
                if (this.scaleMode.id === 'cartesian') {
                    var midX = Math.floor(this.grid.width / 2);
                    var midY = Math.floor(this.grid.height / 2);
                    return { x: point.gridPosition.x - midX, y: this.grid.height - point.gridPosition.y - midY };
                }
                else {
                    return { x: point.gridPosition.x, y: this.grid.height - point.gridPosition.y };
                }
            }
        }
    }
});