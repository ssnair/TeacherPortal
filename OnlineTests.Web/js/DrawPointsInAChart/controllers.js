onlineTestsApp.controller("DrawLinesInAChartCtrl", function ($scope) {
    $scope.layoutOptions = [
      { id: 'grid', name: 'Grid' },
      { id: 'cartesian', name: 'Cartesian' }
    ];

    $scope.objectTypes = [
      { id: 'select', name: 'Select', action: 'select' },
      { id: 'delete', name: 'Delete', action: 'delete' },
      { id: 'point', name: 'Point', action: 'add-point' },
      { id: 'line', name: 'Line', action: 'add-line' },
      { id: 'arrow', name: 'Arrow', action: 'add-arrow' }
      //{ id: 'rectangle', name: 'Rectangle', action: 'add-rectangle' }
    ];

    $scope.title = "Draw Lines In A Chart";
    $scope.questionType = "draw-lines-in-a-chart";

    $scope.setContainer = function (elem) {
        $scope.container = elem;
    };

    $scope.getEngine = function (settings) {
        $scope.engine = new DrawLinesInAChart(Raphael, $scope.container, settings);
        $scope.engine.redraw();
    };

    $scope.setAction = function (action) {
        if ($scope.settings.currentAction == action) {
            $scope.settings.currentAction = "select"
        } else {
            $scope.settings.currentAction = action;
        }
    };

    $scope.settings = {
        layout: { id: 'grid', name: 'Grid' },
        container: { width: 500, height: 300 },
        grid: { width: 10, height: 10 },
        drawScale: true,
        plotAreaPadding: { top: 10, left: 20, right: 10, bottom: 20 }
    };
});