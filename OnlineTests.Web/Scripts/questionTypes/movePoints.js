$(function () {
    var settings = {
        minValue: -5,
        maxValue: 5,
        majorScale: 1,
        minorScale: 0.5,
        intervals: []
    };

    if (typeof globalSettings !== 'undefined') {
        settings = globalSettings;

        $("#movePointsInALine_MinValue").val(settings.minValue);
        $("#movePointsInALine_MaxValue").val(settings.maxValue);
        $("#movePointsInALine_MajorScale").val(settings.majorScale);
        $("#movePointsInALine_MinorScale").val(settings.minorScale);

    }

    var container = $("#movingPointsContainer");
    mp = new MovePoints(container, settings);
    var mpPreview = {};

    //$( window ).resize(function() {
    //	mp.setPaper();
    //	mp.draw();
    //});

    $(".btn-add-interval")
        .click(function () {
            var tokens = $(this).attr("data-val").split(':');
            var interval = null;
            if (tokens[0] === 'singlePoint') {
                var initialValue = ((mp.settings.maxValue - mp.settings.minValue) / 2) + mp.settings.minValue;
                interval = mp.addPoint(initialValue);
                classIcon = 'icon-btn-9';
            } else if (tokens[0] === 'boxAndWhisker') {
                interval = mp.addBoxAndWhisker(mp.settings.minValue);
                classIcon = 'icon-btn-10';
            } else {
                interval = mp.addInterval(0, 1, tokens[0], tokens[1]);
                var classIcon;

                var intervalType = interval.minValueType + '-' + interval.maxValueType;
                if (intervalType == 'open-open')
                    classIcon = 'icon-btn-4';
                else if (intervalType == 'closed-closed')
                    classIcon = 'icon-btn-1';
                else if (intervalType == 'closed-open')
                    classIcon = 'icon-btn-2';
                else if (intervalType == 'open-closed')
                    classIcon = 'icon-btn-3';
                else if (intervalType == 'minus-infinite-open')
                    classIcon = 'icon-btn-5';
                else if (intervalType == 'minus-infinite-closed')
                    classIcon = 'icon-btn-6';
                else if (intervalType == 'open-plus-infinite')
                    classIcon = 'icon-btn-7';
                else if (intervalType == 'closed-plus-infinite')
                    classIcon = 'icon-btn-8';
                else if (intervalType == 'single-point')
                    classIcon = 'icon-btn-9';
                else if (intervalType == 'box-and-whiskers')
                    classIcon = 'icon-btn-10';
                else
                    classIcon = 'icon-btn1';
            }

            var btnRemove = '<button data-val="' + interval.id + '" class="btn btn-remove-interval btn-sample-c ' + classIcon + '"/>';

            $("#removeIntervalsContainer").html($("#removeIntervalsContainer").html() + btnRemove);
            $(".btn-remove-interval")
               .on('click', function () {
                   mp.removeInterval($(this).attr("data-val"));
                   this.remove();
               });
        });


    $("#movePointsInALine_ResetGraph").click(function () {
        var minValue = $("#movePointsInALine_MinValue").val(),
            maxValue = $("#movePointsInALine_MaxValue").val(),
            minorScale = $("#movePointsInALine_MinorScale").val(),
            majorScale = $("#movePointsInALine_MajorScale").val();

        var newSettings = {
            minValue: Number(minValue),
            maxValue: Number(maxValue),
            majorScale: Number(majorScale),
            minorScale: Number(minorScale),
            intervals: []
        };
        $("#removeIntervalsContainer").html("");

        //validations
        $('#ErrorLine').text('');
        if (minValue > maxValue) {
            $('#ErrorLine').text("Minimum Value can not be greater than Maximum  Value");
            return false;
        }

        if (majorScale <= minorScale) {
            $('#ErrorLine').text("Minor Scale can not be greater than or equal to Major Scale");
            return false;
        }

        mp.init(mp.container, newSettings);
    });

    $("#bntMovePointsInALine_Save").click(function () {
        hfQBody.value = hfQBody.value || '.';
        if (!validateEmptyQuestionText(hfQBody.value))
            return;

        // read intervals from mp
        mp.settings.intervals = [];
        for (var i = 0; i < mp.intervals.length; i++) {
            mp.settings.intervals.push({
                id: mp.intervals[i].id,
                minValue: mp.intervals[i].minValue || 0,
                maxValue: mp.intervals[i].maxValue || 0,
                minValueType: mp.intervals[i].minValueType || 0,
                maxValueType: mp.intervals[i].maxValueType || 0,
                shapeType: mp.intervals[i].shapeType,
                value: mp.intervals[i].value || 0,
                label: mp.intervals[i].label || '',
                q1Value: mp.intervals[i].q1Value || 0,
                q2Value: mp.intervals[i].q2Value || 0,
                q3Value: mp.intervals[i].q3Value || 0
            });
        }
        var request = {
            id: typeof (globalQuestionId) === 'undefined' ? 0 : globalQuestionId,
            subjectId: null,
            gradeLevel: null,
            questionTypeId: 20,
            questionText: specialTrim(hfQBody.value),
            passageId: null,
            complexity: null,
            difficulty: null,
            userId: null,
            minScore: null,
            maxScore: null,
            targ: null,
            courseId: null,
            notes: $('#movePointsInALine_Notes').val(),
            statusId: 1,
            approveUser: null,

            minValue: mp.settings.minValue,
            maxValue: mp.settings.maxValue,
            majorScale: mp.settings.majorScale,
            minorScale: mp.settings.minorScale,
            intervals: mp.settings.intervals
        };
        $.post(
            "home/MovePointsInALine_Save",
            $.toDictionary(request),
            function (data, textStatus, jqXHR) {
                window.parent.postMessage(data.data + ',20', '*');
                console.log(data);
                //BootstrapDialog.show({
                //    type: BootstrapDialog.TYPE_SUCCESS,
                //    title: 'Information',
                //    message: 'The Question was saved successfully! The Question ID is : ' + data.data,
                //    buttons: [{
                //        label: 'Ok',
                //        action: function (dialogItself) {
                //            dialogItself.close();
                //        }
                //    }]
                //});
            },
            'json');
    });

    $("#btnMovePointsInALine_Preview").click(function () {
        // read intervals from mp
        mp.settings.intervals = [];
        for (var i = 0; i < mp.intervals.length; i++) {
            mp.settings.intervals.push({
                id: mp.intervals[i].id,
                minValue: mp.intervals[i].minValue,
                maxValue: mp.intervals[i].maxValue,
                minValueType: mp.intervals[i].minValueType,
                maxValueType: mp.intervals[i].maxValueType,
                shapeType: mp.intervals[i].shapeType,
                value: mp.intervals[i].value
            });
        }

        var mpPreviewSettings = JSON.parse(JSON.stringify(mp.settings));
        mpPreviewSettings.intervals = [];

        var editor = hfQBody.value;

        $('#movePointsInALine_questionContainer').html(editor);
        $("#movePointsInALine_result").html('');
        $("#removeIntervalsContainerPreview").html('');

        mpPreview = new MovePoints($('#movePointsInALine_previewContainer'), mpPreviewSettings);
    });

    $(".btn-add-interval-preview").click(function () {
        var tokens = $(this).attr("data-val").split(':');
        var classIcon;
        if (tokens[0] === 'singlePoint') {
            var initialValue = ((mp.settings.maxValue - mp.settings.minValue) / 2) + mp.settings.minValue;
            interval = mpPreview.addPoint(initialValue);
            classIcon = 'icon-btn-9';
        } else if (tokens[0] === 'boxAndWhisker') {
            interval = mpPreview.addBoxAndWhisker(mp.settings.minValue);
            classIcon = 'icon-btn-10';
        } else {
            interval = mpPreview.addInterval(0, 1, tokens[0], tokens[1]);

            var intervalType = interval.minValueType + '-' + interval.maxValueType;
            if (intervalType == 'open-open')
                classIcon = 'icon-btn-4';
            else if (intervalType == 'closed-closed')
                classIcon = 'icon-btn-1';
            else if (intervalType == 'closed-open')
                classIcon = 'icon-btn-2';
            else if (intervalType == 'open-closed')
                classIcon = 'icon-btn-3';
            else if (intervalType == 'minus-infinite-open')
                classIcon = 'icon-btn-5';
            else if (intervalType == 'minus-infinite-closed')
                classIcon = 'icon-btn-6';
            else if (intervalType == 'open-plus-infinite')
                classIcon = 'icon-btn-7';
            else if (intervalType == 'closed-plus-infinite')
                classIcon = 'icon-btn-8';
            else
                classIcon = 'icon-btn1';
        }

        var btnRemove = '<button data-val="' + interval.id + '" class="btn btn-remove-interval-preview btn-sample-c ' + classIcon + '"/>';

        $("#removeIntervalsContainerPreview").html($("#removeIntervalsContainerPreview").html() + btnRemove);
        $(".btn-remove-interval-preview")
           .on('click', function () {
               mpPreview.removeInterval($(this).attr("data-val"));
               this.remove();
           });
    });

    $("#movePointsInALine_submitAnswer").click(function () {
        mpPreview.settings.intervals = [];
        for (var i = 0; i < mpPreview.intervals.length; i++) {
            mpPreview.settings.intervals.push({
                id: mpPreview.intervals[i].id,
                minValue: mpPreview.intervals[i].minValue,
                maxValue: mpPreview.intervals[i].maxValue,
                minValueType: mpPreview.intervals[i].minValueType,
                maxValueType: mpPreview.intervals[i].maxValueType,
                shapeType: mpPreview.intervals[i].shapeType,
                value: mpPreview.intervals[i].value,
                label: mpPreview.intervals[i].label
            });
        }
        var result = compareResults(mp, mpPreview);

        if (result)
            $('#movePointsInALine_result').html('<img src="../Content/images/win.png" width="50" height="50"/>')
        else
            $('#movePointsInALine_result').html('<img src="../Content/images/lose.png" width="50" height="50"/>')
    });

    $("#movePointsInALine_closeModal").on('click', function () {
        $('#movePointsInALine_Preview').modal('hide');
    });

    addSelectedIntervals();
});


function addSelectedIntervals() {
    for (var i = 0; i < mp.intervals.length; i++) {
        if (mp.intervals[i].shapeType == 'point') {
            classIcon = 'icon-btn-9';
        } else if (mp.intervals[i].shapeType == 'boxAndWhisker') {
                classIcon = 'icon-btn-10';
        } else {
            switch (mp.intervals[i].minValueType + '-' + mp.intervals[i].maxValueType) {
                case 'open-open':
                    classIcon = 'icon-btn-4';
                    break;
                case 'closed-closed':
                    classIcon = 'icon-btn-1';
                    break;
                case 'closed-open':
                    classIcon = 'icon-btn-2';
                    break;
                case 'open-closed':
                    classIcon = 'icon-btn-3';
                    break;
                case 'minus-infinite-open':
                    classIcon = 'icon-btn-5';
                    break;
                case 'minus-infinite-closed':
                    classIcon = 'icon-btn-6';
                    break;
                case 'open-plus-infinite':
                    classIcon = 'icon-btn-7';
                    break;
                case 'closed-plus-infinite':
                    classIcon = 'icon-btn-8';
                    break;
                default:
                    classIcon = 'icon-btn1';
            }
        }

        var btnRemove = '<button data-val="' + mp.intervals[i].id + '" class="btn btn-remove-interval btn-sample-c ' + classIcon + '"/>';

        $("#removeIntervalsContainer").html($("#removeIntervalsContainer").html() + btnRemove);
        $(".btn-remove-interval")
           .on('click', function () {
               mp.removeInterval($(this).attr("data-val"));
               this.remove();
           });
    }
}

function compareResults(mp, mpPreview) {
    if (mp.intervals.length !== mpPreview.intervals.length)
        return false;

    var correctValues = 0;
    for (var i = 0; i < mp.intervals.length; i++) {
        for (var j = 0; j < mpPreview.intervals.length; j++) {
            if (mp.intervals[i].shapeType === mpPreview.intervals[j].shapeType &&
                mp.intervals[i].minValueType === mpPreview.intervals[j].minValueType &&
                mp.intervals[i].minValue === mpPreview.intervals[j].minValue &&
                mp.intervals[i].maxValueType === mpPreview.intervals[j].maxValueType &&
                mp.intervals[i].maxValue === mpPreview.intervals[j].maxValue &&
                mp.intervals[i].value === mpPreview.intervals[j].value &&
                mp.intervals[i].label === mpPreview.intervals[j].label &&
                mp.intervals[i].q1Value === mpPreview.intervals[j].q1Value &&
                mp.intervals[i].q2Value === mpPreview.intervals[j].q2Value &&
                mp.intervals[i].q3Value === mpPreview.intervals[j].q3Value) {
                correctValues++;
            }
        }
    }

    return correctValues === mp.intervals.length;
}
function MovePoints(container, settings) {
    this.init(container, settings);
};

MovePoints.prototype.init = function (container, settings) {
    this.createPaper(container);
    this.settings = settings;
    this.client = new MovePointsClient(this);
    this.ruler = new MovePointsRuler(this);

    this.intervals = [];
    var self = this;
    $.each(this.settings.intervals, function (index, value) {
        if (value.shapeType === 'interval') {
            self.intervals.push(new MovePointsInterval(self, value));
        } else if (value.shapeType === 'point') {
            self.intervals.push(new MovePoint(self, value));
        } else if (value.shapeType === 'boxAndWhisker') {
            self.intervals.push(new MoveBoxAndWhisker(self, value));
        }

    });
    this.ruler.draw();
};

MovePoints.prototype.createPaper = function (container) {
    if (this.paper) {
        var paperDom = this.paper.canvas;
        paperDom.parentNode.removeChild(paperDom);
        delete this.paper;
    }

    container.html('');
    this.container = container;
    this.paper = Raphael(container.get(0), container.width(), container.height());
};

MovePoints.prototype.setup = function (settings) {
    if (!this.paper)
        return "Error";  //TODO: figureout what to do in case of error

    this.settings = settings;
    this.ruler = new MovePointsRuler(this);
    this.ruler.draw();
    initIntervals();
};

MovePoints.prototype.addInterval = function (minValue, maxValue, minValueType, maxValueType) {
    var interval = {
        id: Math.round(Math.random() * 100000 + 1),
        shapeType: 'interval',
        minValueType: minValueType,
        maxValueType: maxValueType,
        minValue: minValue,
        maxValue: maxValue
    };
    var newInterval = new MovePointsInterval(this, interval);
    this.intervals.push(newInterval);
    return newInterval;
};

MovePoints.prototype.addPoint = function (value) {
    var point = {
        id: Math.round(Math.random() * 100000 + 1),
        shapeType: 'point',
        value: value
    };
    var newInterval = new MovePoint(this, point);
    this.intervals.push(newInterval);
    return newInterval;
};

MovePoints.prototype.addBoxAndWhisker = function (value) {
    var box = {
        id: Math.round(Math.random() * 100000 + 1),
        shapeType: 'boxAndWhisker',
        minValue: value,
        q1Value: value + 1,
        q2Value: value + 2,
        q3Value: value + 3,
        maxValue: value + 4,
        
    };
    var newInterval = new MoveBoxAndWhisker(this, box);
    this.intervals.push(newInterval);
    return newInterval;
};

MovePoints.prototype.removeInterval = function (id) {
    for (var i = 0; i < this.intervals.length; i++) {
        if (this.intervals[i].id == id) {
            if (this.intervals[i].shapeType == 'point') {
                this.intervals[i].point.remove();
                if (this.intervals[i].labelElement != null) {
                    this.intervals[i].labelElement.remove();
                }
            } else if (this.intervals[i].shapeType == 'boxAndWhisker') {
                this.intervals[i].shape.minValue.remove();
                this.intervals[i].shape.maxValue.remove();
                this.intervals[i].shape.lineMinQ1.remove();
                this.intervals[i].shape.rectQ1Q2.remove();
                this.intervals[i].shape.rectQ2Q3.remove();
                this.intervals[i].shape.lineQ3Max.remove();
                this.intervals[i].shape.q1Dragger.remove();
                this.intervals[i].shape.q2Dragger.remove();
                this.intervals[i].shape.q3Dragger.remove();
            } else {
                if (this.intervals[i].minCircle)
                    this.intervals[i].minCircle.remove();

                if (this.intervals[i].maxCircle)
                    this.intervals[i].maxCircle.remove();

                if (this.intervals[i].innerMinCircle)
                    this.intervals[i].innerMinCircle.remove();

                if (this.intervals[i].innerMaxCircle)
                    this.intervals[i].innerMaxCircle.remove();

                if (this.intervals[i].connectorLine)
                    this.intervals[i].connectorLine.remove();

                if (this.intervals[i].minusInfiniteArrow)
                    this.intervals[i].minusInfiniteArrow.remove();

                if (this.intervals[i].plusInfiniteArrow)
                    this.intervals[i].plusInfiniteArrow.remove();
            }
            this.intervals.splice(i, 1);
        }
    }
};

// Handles the client coordinates
MovePointsClient = function (parent) {
    // it mainly contains the client related (physical) properties
    this.parent = parent;
    this.container = parent.container;
    this.paper = parent.paper;
    this.padding = 40;
    this.baseline = 100;   // in which y-coord will the mainline be shown
    this.radius = 30;
    this.singlePointRadius = 15;

    this.full = {};
    this.full.left = 0;
    this.full.right = this.container.width();
    this.full.width = this.full.right - this.full.left;

    this.ruler = {};
    this.ruler.left = this.padding;
    this.ruler.right = this.full.right - this.padding;
    this.ruler.width = this.ruler.right - this.ruler.left;

    this.majorGap = this.ruler.width / ((this.parent.settings.maxValue - this.parent.settings.minValue) / this.parent.settings.majorScale);
    this.minorGap = this.ruler.width / ((this.parent.settings.maxValue - this.parent.settings.minValue) / this.parent.settings.minorScale);
};

MovePointsClient.prototype.pointToClient = function (point) {
    var settings = this.parent.settings;
    for (var i = settings.minValue, j = 0; i <= settings.maxValue; i += settings.minorScale, j++) {
        if (i === point) {
            return this.minorGap * j + this.padding;
        }
    }
    return NaN;
};

MovePointsClient.prototype.pointToClientNoSnap = function (point) {
    var settings = this.parent.settings;

    var domain = settings.maxValue - settings.minValue;
    var ratio = this.ruler.width / domain;
    return (point * ratio - (settings.minValue * ratio) + this.padding);
};

MovePointsClient.prototype.clientToPoint = function (cx) {
    var settings = this.parent.settings;
    return (((cx - this.padding) * (settings.maxValue - settings.minValue)) / this.ruler.width) + settings.minValue;
};

// MovePointsRuler
MovePointsRuler = function (parent) {
    this.parent = parent;
};

MovePointsRuler.prototype.draw = function () {
    var client = this.parent.client;
    var settings = this.parent.settings;
    var paper = this.parent.paper;

    for (var i = settings.minValue, j = 0; i <= settings.maxValue; i += settings.majorScale, j++) {
        var col = client.majorGap * j + client.padding;
        var pathMajorScale = "M" + col + " " + (client.baseline - 15) + "V" + (client.baseline + 15);
        paper.path(pathMajorScale);
        var legend = paper.text(col, 125, i);
        $('tspan', legend.node).attr('dy', 0);
    }

    for (var i = settings.minValue, j = 0; i <= settings.maxValue; i += settings.minorScale, j++) {
        var col = client.minorGap * j + client.padding;
        var pathMinorScale = "M" + col + " " + (client.baseline - 10) + "V" + (client.baseline + 10);
        paper.path(pathMinorScale);
    }

    var mainLinePath = "M0 " + client.baseline + "H" + client.full.width;
    paper.path(mainLinePath);

    var leftArrow = "M20" + " " + (client.baseline - 10) + "L0 " + client.baseline + "L20" + " " + (client.baseline + 10);
    paper.path(leftArrow);

    var rightArrow = "M" + (client.full.right - 20) + " " + (client.baseline - 10) + " " + client.full.right + " " + client.baseline + "L" + (client.full.right - 20) + " " + (client.baseline + 10);
    paper.path(rightArrow);
};


// MovePointsInterval
MovePointsInterval = function (parent, interval) {
    this.parent = parent;

    var client = this.parent.client;
    var settings = this.parent.settings;
    var paper = this.parent.paper;

    this.id = interval.id;
    this.shapeType = interval.shapeType;
    this.minValue = interval.minValue;
    this.maxValue = interval.maxValue;

    this.minPoint = client.pointToClient(interval.minValue);
    this.maxPoint = client.pointToClient(interval.maxValue);

    this.minValueType = interval.minValueType;
    this.maxValueType = interval.maxValueType;

    var minPoint = this.minPoint;
    var maxPoint = this.maxPoint;

    this.draggingCircle = null;

    if (this.minValueType === 'minus-infinite') {
        var leftArrow = "M20" + " " + (client.baseline - 10) + "L0 " + client.baseline + "L20" + " " + (client.baseline + 10);
        this.minusInfiniteArrow = paper.path(leftArrow).attr({ stroke: "#00f", "stroke-width": 4 });
        minPoint = 0;
    } else {
        this.minCircle = this.createCircle(this.minPoint, client.baseline, client.radius, { "fill": "#00f", stroke: "none", "fill-opacity": 0.2 });
        this.innerMinCircle = this.createCircle(this.minPoint, client.baseline, client.radius / 3, this.getAttrs('minValue'));
    }

    if (this.maxValueType === 'plus-infinite') {
        var rightArrow = "M" + (client.full.right - 20) + " " + (client.baseline - 10) + " " + client.full.right + " " + client.baseline + "L" + (client.full.right - 20) + " " + (client.baseline + 10);
        this.plusInfiniteArrow = paper.path(rightArrow).attr({ stroke: "#00f", "stroke-width": 4 });
        maxPoint = client.full.width;
    } else {
        this.maxCircle = this.createCircle(this.maxPoint, client.baseline, client.radius, { "fill": "#00f", stroke: "none", "fill-opacity": 0.2 });
        this.innerMaxCircle = this.createCircle(this.maxPoint, client.baseline, client.radius / 3, this.getAttrs('maxValue'));
    }

    this.connectorLine = paper.rect(minPoint, client.baseline - 2, maxPoint - minPoint, 4, 0)
        .attr({ fill: "#00f", stroke: "#00f", "fill-opacity": 1 });

};

MovePointsInterval.prototype.createCircle = function (cx, cy, radius, attrs) {
    var circle = this.parent.paper.circle(cx, cy, radius).attr(attrs);
    circle.interval = this;
    circle.drag(this.dragMove, this.dragStart, this.dragEnd);
    return circle;
}

MovePointsInterval.prototype.dragStart = function () {
    var interval = this.interval;

    this.ox = this.attr("cx");
    this.oy = this.attr("cy");
    this.draggingCircle = this.ox === interval.minPoint ? 'minCircle' : 'maxCircle';
};

MovePointsInterval.prototype.dragMove = function (dx, dy) {
    var client = this.interval.parent.client;
    var interval = this.interval;

    var minLimit = this.draggingCircle === 'minCircle' ? client.ruler.left : interval.minPoint + 1;
    var maxLimit = this.draggingCircle === 'minCircle' ? interval.maxPoint - 1 : client.ruler.right;

    if (interval.minValueType == 'minus-infinite' || interval.maxValueType == 'plus-infinite') {
        minLimit = client.ruler.left;
        maxLimit = client.ruler.right;
    }

    var newcx = this.ox + dx;
    // check upper / lower limit
    newcx = Math.max(newcx, minLimit);
    newcx = Math.min(newcx, maxLimit);

    var adjust = interval.minValueType == 'minus-infinite' || interval.maxValueType == 'plus-infinite' ? client.padding : 0;
    if (this.draggingCircle === 'minCircle') {
        interval.connectorLine.attr({ "x": newcx, "width": (maxLimit - newcx) + adjust });
        interval.innerMinCircle.attr({ cx: newcx });
        interval.minCircle.attr({ cx: newcx });
    } else {
        interval.connectorLine.attr({ "width": (newcx - minLimit) + adjust });
        interval.innerMaxCircle.attr({ cx: newcx });
        interval.maxCircle.attr({ cx: newcx });
    }
};

MovePointsInterval.prototype.dragEnd = function () {
    var client = this.interval.parent.client;
    var interval = this.interval;
    var settings = interval.parent.settings;

    var currentValue = client.clientToPoint(this.attrs["cx"]);
    var minimum = 999999999;
    var value = 9999999999;

    for (var i = settings.minValue; i <= settings.maxValue; i += settings.minorScale) {
        var diff = Math.abs(currentValue - i);
        if (diff < minimum) {
            minimum = diff;
            value = i;
        }
    }

    if (this.draggingCircle === 'minCircle') {
        interval.minValue = value;
        interval.minPoint = client.pointToClient(value);
        interval.minCircle.attr({ cx: interval.minPoint });
        interval.innerMinCircle.attr({ cx: interval.minPoint });
    } else {
        interval.maxValue = value;
        interval.maxPoint = client.pointToClient(value);
        interval.maxCircle.attr({ cx: interval.maxPoint });
        interval.innerMaxCircle.attr({ cx: interval.maxPoint });
    }

    interval.drawConnector();
    this.draggingCircle = null;
};

MovePointsInterval.prototype.drawConnector = function () {
    var interval = this;
    var client = interval.parent.client;
    var settings = interval.parent.settings;

    var min = 0;
    var max = client.full.right;

    if (interval.minValueType !== 'minus-infinite')
        min = interval.minPoint;

    if (interval.maxValueType !== 'plus-infinite')
        max = interval.maxPoint;

    interval.connectorLine.attr({ "x": min, "width": max - min });
};

// MovePoint
MovePoint = function (parent, point) {
    this.parent = parent;

    var client = this.parent.client;
    var settings = this.parent.settings;
    var paper = this.parent.paper;

    this.id = point.id;
    this.value = point.value;
    this.shapeType = point.shapeType;
    this.label = point.label;

    this.valuePoint = client.pointToClientNoSnap(point.value);

    this.draggingCircle = null

    this.point = this.createPoint(this.valuePoint, client.baseline, client.singlePointRadius, { "fill": "#f00", stroke: "none", "fill-opacity": 0.75 });
    if (this.label != null) {
        var cy = this.point.attrs["cy"] - this.point.attrs["r"] - 10
        this.labelElement = this.parent.paper.text(this.point.attrs["cx"], cy, this.label);
    }
};

MovePoint.prototype.createPoint = function (cx, cy, radius, attrs) {
    var circle = this.parent.paper.circle(cx, cy, radius).attr(attrs);
    circle.interval = this;
    circle.drag(this.dragMove, this.dragStart, this.dragEnd);
    circle.dblclick(function () {
        var interval = this.interval;
        var label = prompt("Enter Label", interval.label);
        interval.label = label;
        if ((typeof interval.label != 'undefined') && interval.label != null && interval.label != '') {
            if ((typeof interval.labelElement == 'undefined') || interval.labelElement == null) {
                var cy = this.attrs["cy"] - this.attrs["r"] - 10
                interval.labelElement = this.interval.parent.paper.text(circle.attrs["cx"], cy, label);
            }
            else {
                interval.labelElement.attr("text", label);
            }
        }
    });
    return circle;
}

MovePoint.prototype.dragStart = function () {
    var point = this.point;

    this.ox = this.attr("cx");
    this.oy = this.attr("cy");
};

MovePoint.prototype.dragMove = function (dx, dy) {
    var client = this.interval.parent.client;
    var point = this.interval;

    var minLimit = client.ruler.left;
    var maxLimit = client.ruler.right;

    var newcx = this.ox + dx;
    // check upper / lower limit
    newcx = Math.max(newcx, minLimit);
    newcx = Math.min(newcx, maxLimit);

    point.point.attr({ cx: newcx });
    if (point.labelElement != null) {
        point.labelElement.attr('x', newcx);
    }
};

MovePoint.prototype.dragEnd = function () {
    var client = this.interval.parent.client;
    var interval = this.interval;
    var settings = interval.parent.settings;

    var currentValue = client.clientToPoint(this.attrs["cx"]);

    interval.value = currentValue;
    interval.valuePoint = client.pointToClient(currentValue);

    this.draggingCircle = null;
};

// MoveBoxAndWhisker
MoveBoxAndWhisker = function (parent, box) {
    this.parent = parent;

    var client = this.parent.client;
    var settings = this.parent.settings;
    var paper = this.parent.paper;

    this.id = box.id;
    this.minValue = box.minValue;
    this.maxValue = box.maxValue;
    this.q1Value = box.q1Value;
    this.q2Value = box.q2Value;
    this.q3Value = box.q3Value;
    this.shapeType = box.shapeType;
    this.label = box.label;

    this.draggingCircle = null

    this.shape = this.drawShape(client);
};

MoveBoxAndWhisker.prototype.drawShape = function () {
    var client = this.parent.client;
    var result = {};
    result.minValue = this.createCircle(client.pointToClient(this.minValue), client.baseline, 7, { "fill": "#f00", stroke: "none", "fill-opacity": 0.5 }, "minValue");
    result.lineMinQ1 = this.createLine(client.pointToClient(this.minValue), client.pointToClient(this.q1Value), client.baseline, { "fill": "#f00", stroke: "#f00", "fill-opacity": 1, 'stroke-width': 3 }, "lineMinQ1");
    result.rectQ1Q2 = this.createRectangle(client.pointToClient(this.q1Value), client.pointToClient(this.q2Value), client.baseline, { "fill": "#fff", 'stroke': "#f00", "fill-opacity": 0.7, 'stroke-width': 3 }, "rectQ1Q2");
    result.rectQ2Q3 = this.createRectangle(client.pointToClient(this.q2Value), client.pointToClient(this.q3Value), client.baseline, { "fill": "#fff", 'stroke': "#f00", "fill-opacity": 0.7, 'stroke-width': 3 }, "rectQ2Q3");
    result.lineQ3Max = this.createLine(client.pointToClient(this.q3Value), client.pointToClient(this.maxValue), client.baseline, { "fill": "#f00", stroke: "#f00", "fill-opacity": 1, 'stroke-width': 3 }, "lineQ3Max");
    result.maxValue = this.createCircle(client.pointToClient(this.maxValue), client.baseline, 7, { "fill": "#f00", stroke: "none", "fill-opacity": 0.9 }, "maxValue");

    result.q1Dragger = this.createCircle(client.pointToClient(this.q1Value), client.baseline, 5, { "fill": "#00f", stroke: "none", "fill-opacity": 0.5 }, "q1Dragger");
    result.q2Dragger = this.createCircle(client.pointToClient(this.q2Value), client.baseline, 5, { "fill": "#00f", stroke: "none", "fill-opacity": 0.5 }, "q2Dragger");
    result.q3Dragger = this.createCircle(client.pointToClient(this.q3Value), client.baseline, 5, { "fill": "#00f", stroke: "none", "fill-opacity": 0.5 }, "q3Dragger");
    return result;
}

MoveBoxAndWhisker.prototype.createCircle = function (cx, cy, radius, attrs, shapeIdentifier) {
    var circle = this.parent.paper.circle(cx, cy, radius).attr(attrs);
    circle.interval = this;
    circle.shapeIdentifier = shapeIdentifier;
    circle.drag(this.dragMove, this.dragStart, this.dragEnd);
    return circle;
}

MoveBoxAndWhisker.prototype.createLine = function (start, end, cy, attrs, shapeIdentifier) {
    var line = this.parent.paper.path(["M", start, cy, "L", end, cy]).attr(attrs);
    line.interval = this;
    line.shapeIdentifier = shapeIdentifier;
    return line;
}

MoveBoxAndWhisker.prototype.createRectangle = function (start, end, cy, attrs, shapeIdentifier) {
    var rectangle = this.parent.paper.rect(start, cy-8, end-start, 16).attr(attrs);
    rectangle.interval = this;
    rectangle.shapeIdentifier = shapeIdentifier;
    return rectangle;
}

MoveBoxAndWhisker.prototype.dragStart = function () {
    var shape = eval("this.interval.shape." + this.shapeIdentifier);
    if (true || this.shapeIdentifier == 'minValue' || this.shapeIdentifier == 'maxValue') {
        this.ox = this.attr("cx");
        this.oy = this.attr("cy");
    }
};

MoveBoxAndWhisker.prototype.dragMove = function (dx, dy) {
    var shape = eval("this.interval.shape." + this.shapeIdentifier);
    var client = this.interval.parent.client;

    var minLimit = client.ruler.left;
    var maxLimit = client.ruler.right;

    switch (this.shapeIdentifier) {
        case 'minValue':
            maxLimit = client.pointToClient(this.interval.q1Value);
            break;
        case 'q1Dragger':
            minLimit = client.pointToClient(this.interval.minValue);
            maxLimit = client.pointToClient(this.interval.q2Value);
            break;
        case 'q2Dragger':
            minLimit = client.pointToClient(this.interval.q1Value);
            maxLimit = client.pointToClient(this.interval.q3Value);
            break;
        case 'q3Dragger':
            minLimit = client.pointToClient(this.interval.q2Value);
            maxLimit = client.pointToClient(this.interval.maxValue);
            break;
        case 'maxValue':
            minLimit = client.pointToClient(this.interval.q3Value);
            break;
    }

    var newcx = this.ox + dx;
    // check upper / lower limit
    newcx = Math.max(newcx, minLimit);
    newcx = Math.min(newcx, maxLimit);

    shape.attr({ cx: newcx });
};

MoveBoxAndWhisker.prototype.dragEnd = function () {
    var client = this.interval.parent.client;
    var interval = this.interval;
    var settings = interval.parent.settings;

    var currentValue = client.clientToPoint(this.attrs["cx"]);
    var minimum = 999999999;
    var value = 9999999999;

    for (var i = settings.minValue; i <= settings.maxValue; i += settings.minorScale) {
        var diff = Math.abs(currentValue - i);
        if (diff < minimum) {
            minimum = diff;
            value = i;
        }
    }

    console.info(this.shapeIdentifier);
    switch (this.shapeIdentifier) {
        case 'minValue':
            this.interval.minValue = value;
            break;
        case 'q1Dragger':
            this.interval.q1Value = value;
            break;
        case 'q2Dragger':
            this.interval.q2Value = value;
            break;
        case 'q3Dragger':
            this.interval.q3Value = value;
            break;
        case 'maxValue':
            this.interval.maxValue = value;
            break;
    }

    this.draggingCircle = null;
    this.interval.redraw();
};

MoveBoxAndWhisker.prototype.redraw = function () {
    var client = this.parent.client;
    var shape = this.shape;
    shape.minValue.attr('cx', client.pointToClient(this.minValue));

    var q1Path = ["M", client.pointToClient(this.minValue), client.baseline, "L", client.pointToClient(this.q1Value), client.baseline];
    shape.lineMinQ1.attr('path', q1Path);
    shape.q1Dragger.attr('cx', client.pointToClient(this.q1Value));

    shape.rectQ1Q2.attr({ 'x': client.pointToClient(this.q1Value), 'width': client.pointToClient(this.q2Value) - client.pointToClient(this.q1Value) });
    shape.q2Dragger.attr('cx', client.pointToClient(this.q2Value));

    shape.rectQ2Q3.attr({ 'x': client.pointToClient(this.q2Value), 'width': client.pointToClient(this.q3Value) - client.pointToClient(this.q2Value) });
    shape.q3Dragger.attr('cx', client.pointToClient(this.q3Value));

    var q3Path = ["M", client.pointToClient(this.q3Value), client.baseline, "L", client.pointToClient(this.maxValue), client.baseline];
    shape.lineQ3Max.attr('path', q3Path);

    shape.maxValue.attr('cx', client.pointToClient(this.maxValue));
};


MovePointsInterval.prototype.getAttrs = function (minmax) {
    if (minmax === 'minValue') {
        if (this.minValueType === 'closed')
            return { "fill": "#000", "fill-opacity": 1 };
        else if (this.minValueType === 'open')
            return { "fill": "#fff", "fill-opacity": 1 };
    } else {
        if (this.maxValueType === 'closed')
            return { "fill": "#000", "fill-opacity": 1 };
        else if (this.maxValueType === 'open')
            return { "fill": "#fff", "fill-opacity": 1 };
    }
};

