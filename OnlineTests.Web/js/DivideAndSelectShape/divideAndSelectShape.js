
DivideAndSelectShape = function (Raphael, container, settings, scope) {
    var _self = this;
    container = Helpers.clearContainer(container);
    this.canvas = Raphael(container, settings.container.width, settings.container.height);
    this.settings = settings;
    this.parent = parent;
    this.scope = scope;

    this.polygonShape = new PolygonShape(this);
    this.circleShape = new CircleShape(this);
    this.rectangleShape = new RectangleShape(this);
    this.starShape = new StarShape(this);

    this.redraw = function (settings) {
        _self.canvas.clear();
        _self.canvas.rect(0, 0, settings.container.width, settings.container.height);
        _self.polygonShape.redraw(settings, this.canvas);
        _self.circleShape.redraw(settings, this.canvas);
        _self.rectangleShape.redraw(settings, this.canvas);
        _self.starShape.redraw(settings, this.canvas);
    }

    this.setViewMode = function (viewMode) {
        _self.polygonShape.setViewMode(settings, viewMode);
        _self.circleShape.setViewMode(settings, viewMode);
        _self.rectangleShape.setViewMode(settings, viewMode);
        _self.starShape.setViewMode(settings, viewMode);
    }

    this.submitAnswerFromPreview = function () {
        _self.polygonShape.submitAnswerFromPreview(settings);
        _self.circleShape.submitAnswerFromPreview(settings);
        _self.rectangleShape.submitAnswerFromPreview(settings);
        _self.starShape.submitAnswerFromPreview(settings);
    }

    this.reset = function (settings) {
        _self.polygonShape.reset(settings);
        _self.circleShape.reset(settings);
        _self.rectangleShape.reset(settings);
        _self.starShape.reset(settings);
    }

    this.save = function () {
        alert("sav from engine");
        alert(scope.questionText);
    }

    this.exportJson = function (settings) {
        var result = {
            //questionId: scope.questionId,
            id: settings.id,
            questionType: 'DivideAndSelectShape',
            questionText: scope.questionText,
            questionNotes: scope.questionNotes,
            divideAndSelectShape: JSON.stringify({
                shapeType: settings.shapeType,
                container: settings.container,
                polygonShape: _self.polygonShape.exportJson(settings.polygonShape),
                circleShape: _self.circleShape.exportJson(settings.circleShape),
                rectangleShape: _self.rectangleShape.exportJson(settings.rectangleShape),
                starShape: _self.starShape.exportJson(settings.starShape),
            })
        };
        return result;
    }

}