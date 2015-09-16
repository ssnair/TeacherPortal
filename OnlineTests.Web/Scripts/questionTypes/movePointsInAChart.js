// MovePointsInAChart
// mtroncoso
// 2014-06

$(function () {
    
    var settings = {
       
        grid: {
            domain: 10,
            majorScale: 1,
            minorScale: 0.5,
            chartType: 0,
            answerType: 1
        },
        centerPoint: { x: 0, y: 0 },
        minMaxPoint: { x: 1, y: 1 }
    };
   
    if (typeof globalSettings !== 'undefined') {
        
        settings = globalSettings;
    }
    var mpic = new MovePointsInAChart($("#movingPointsInAChartContainer"), settings);
    var mpicPreview = {};

    $("#movePointsInAChart_ResetGraph").click(function () {
       
        var domain = $("#movePointsInAChart_Domain").val(),
            minorScale = $("#movePointsInAChart_MinorScale").val(),
            majorScale = $("#movePointsInAChart_MajorScale").val(),
            chartType = $("#movePointsInAChart_Function").val(),
            answerType = $("#movePointsInAChart_AnswerType").val();

        var centerX = 0;
        var centerY = 0;
        var minMaxPointX = 1;
        var minMaxPointY = 1;
  
        var newSettings = {
                grid: {
                    domain: domain,
                    minValue: -Number(domain),
                    maxValue: Number(domain),
                    majorScale: Number(majorScale),
                    minorScale: Number(minorScale),
                    chartType: Number(chartType),
                    answerType: Number(answerType)
                },
            
                centerPoint: { x: centerX, y: centerY },
                minMaxPoint: { x: minMaxPointX, y: minMaxPointY }
        };
        
        mpic.initialize(mpic.container, newSettings);
    });

    $("#btnMovePointsInAChart_Preview").click(function () {
        // read points from mpic
        var centerX = 0;
        var centerY = 0;
        var minMaxPointX = 1;
        var minMaxPointY = 1;
       
        var previewSettings =  {
            grid: {
                domain: mpic.settings.grid.domain,
                minValue: mpic.settings.grid.minValue,
                maxValue: mpic.settings.grid.maxValue,
                majorScale: mpic.settings.grid.majorScale,
                minorScale: mpic.settings.grid.minorScale,
                chartType: mpic.settings.grid.chartType,
                answerType: mpic.settings.grid.answerType
            },
            centerPoint: { x: centerX, y: centerY },
            minMaxPoint: { x: minMaxPointX, y: minMaxPointY },
            tgtCenterSpot: { valueX: mpic.centerSpot.valueX, valueY: mpic.centerSpot.valueY },
            tgtMinMaxSpot: { valueX: mpic.minMaxSpot.valueX, valueY: mpic.minMaxSpot.valueY },
        };
        var mpPreviewSettings = JSON.parse(JSON.stringify(mpic.settings));
        var editor = hfQBody.value;

        $('#movePointsInAChart_questionContainer').html(editor);
        $("#movePointsInAChart_result").html('');

        mpicPreview = new MovePointsInAChart($('#movePointsInAChart_previewContainer'), previewSettings);
    });

    $("#movePointsInAChart_submitAnswer").click(function () {
        var qFunction = $('#movePointsInAChart_Function').val();
        var qAnswerType = $('#movePointsInAChart_AnswerType').val();
        var result = false;
        if (qFunction == '3' && qAnswerType == '2') {
            result = (mpicPreview.settings.tgtCenterSpot.valueX == mpicPreview.centerSpot.valueX &&
                     mpicPreview.settings.tgtCenterSpot.valueY == mpicPreview.centerSpot.valueY &&
                     mpicPreview.settings.tgtMinMaxSpot.valueX == mpicPreview.minMaxSpot.valueX &&
                     mpicPreview.settings.tgtMinMaxSpot.valueY == mpicPreview.minMaxSpot.valueY) ||
                    (mpicPreview.settings.tgtCenterSpot.valueX == mpicPreview.minMaxSpot.valueX &&
                     mpicPreview.settings.tgtCenterSpot.valueY == mpicPreview.minMaxSpot.valueY &&
                     mpicPreview.settings.tgtMinMaxSpot.valueX == mpicPreview.centerSpot.valueX &&
                     mpicPreview.settings.tgtMinMaxSpot.valueY == mpicPreview.centerSpot.valueY);
        } else {
           result = mpicPreview.settings.tgtCenterSpot.valueX == mpicPreview.centerSpot.valueX &&
                    mpicPreview.settings.tgtCenterSpot.valueY == mpicPreview.centerSpot.valueY &&
                    mpicPreview.settings.tgtMinMaxSpot.valueX == mpicPreview.minMaxSpot.valueX &&
                    mpicPreview.settings.tgtMinMaxSpot.valueY == mpicPreview.minMaxSpot.valueY;
        }
        if (result)
            $('#movePointsInAChart_result').html('<img src="/Content/images/win.png" width="50" height="50"/>')
        else
            $('#movePointsInAChart_result').html('<img src="/Content/images/lose.png" width="50" height="50"/>')
    });

    $("#movePointsInAChart_closeModal").on('click', function () {
        $('#movePointsInAChart_Preview').modal('hide');
    });

    $("#bntMovePointsInAChart_Save").click(function () {
        if (!validateEmptyQuestionText(hfQBody.value))
            return;

        var mpc = {
            domain: mpic.settings.grid.domain,
            majorScale: mpic.settings.grid.majorScale,
            minorScale: mpic.settings.grid.minorScale,
            centerSpot: { x: mpic.centerSpot.valueX, y: mpic.centerSpot.valueY },
            minMaxSpot: { x: mpic.minMaxSpot.valueX, y: mpic.minMaxSpot.valueY }
        };


        var request = {
            id: typeof(globalQuestionId) === 'undefined' ? 0 : globalQuestionId,
            subjectId: null,
            gradeLevel: null,
            questionTypeId: 10,
            questionText: specialTrim(hfQBody.value),
            passageId: null,
            complexity: null,
            difficulty: null,
            userId: null,
            minScore: null,
            maxScore: null,
            targ: null,
            courseId: null,
            notes: $("#movePointsInAChart_Notes").val(),
            statusId: 1,
            approveUser: null,
            domain: mpic.settings.grid.domain,
            chartType : $("#movePointsInAChart_Function").val(),
            majorScale: mpic.settings.grid.majorScale,
            minorScale: mpic.settings.grid.minorScale,
            centerSpot: { "x": mpic.centerSpot.valueX, "y": mpic.centerSpot.valueY },
            minMaxSpot: { "x": mpic.minMaxSpot.valueX, "y": mpic.minMaxSpot.valueY },
            answerType : $("#movePointsInAChart_AnswerType").val()           
        };

        $.post(
            "/home/MovePointsInAChart_Save",    //TODO:Restore /OnlineDW pref fix
            $.toDictionary(request),
            function (data, textStatus, jqXHR) {
                window.parent.postMessage(data.data + ',10', '*');
                //BootstrapDialog.show({
                //    type:  BootstrapDialog.TYPE_SUCCESS,
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

    $("#movePointsInAChart_Function").change(function () {
        if (this.value === '3') {
            $('.answer-type').removeClass('hidden');
        } else {
            $('.answer-type').addClass('hidden');
        }
        console.info("change.this", this);
    });
});

MovePointsInAChart = function (container, settings) {
    this.initialize = function (container, settings) {
        settings.grid.minValue = -settings.grid.domain;
        settings.grid.maxValue = settings.grid.domain;
        $("#movePointsInAChart_Domain").val(settings.grid.domain);
        $("#movePointsInAChart_MinorScale").val(settings.grid.minorScale);
        $("#movePointsInAChart_MajorScale").val(settings.grid.majorScale);

        this.createPaper(container);
        this.settings = settings;
        this.client = new MovePointsInAChartClient(this);
        this.grid = new MovePointsGrid(this);
        this.centerSpot = new MovePointsInAChartSpot(this, settings.centerPoint);
        this.minMaxSpot = new MovePointsInAChartSpot(this, settings.minMaxPoint); 

        if (this.settings.grid.chartType == 3) {  // Linear
            $('#movePointsInAChart_AnswerType').val(this.settings.grid.answerType);
            $('.answer-type').removeClass('hidden');
        } else {
            $('.answer-type').addClass('hidden');
        }

        var self = this;
        this.grid.draw();
        this.centerSpot.draw();
        this.minMaxSpot.draw();
        if (this.settings.grid.chartType == 1) {
            this.plotFnSin();
        }
        else if (this.settings.grid.chartType == 2) {
            this.plotFnCos();
        }
        else if (this.settings.grid.chartType == 3) {
            if ($('#movePointsInAChart_AnswerType').val() == '1') {
                this.plotFnLinear();
            } else {
                this.plotLine();
            }
        }
        else if (this.settings.grid.chartType == 4) {
            this.plotFnQuad();
        }
        
        else { this.plotFnQuad(); }

    };

    this.createPaper = function (container) {
        if (this.paper) {
            var paperDom = this.paper.canvas;
            paperDom.parentNode.removeChild(paperDom);
            delete this.paper;
        }

        container.html('');
        this.container = container;
        this.paper = Raphael(container.get(0), container.width(), container.height());
    };

    this.plotFnSin = function () {
        var A = this.minMaxSpot.valueY - this.centerSpot.valueY;   // amplitude
        var B = (1.5705)/(this.minMaxSpot.valueX - this.centerSpot.valueX);
        var C = this.centerSpot.valueX;
        var D = this.centerSpot.valueY;

        var initialPoint = this.client.pointToClient(this.settings.grid.minValue, (A * Math.sin(B * (this.settings.grid.minValue - C)) + D));
        var path = "M " + initialPoint.x + " " + initialPoint.y;
        for (var x = this.settings.grid.minValue; x <= this.settings.grid.maxValue; x+=this.settings.grid.minorScale/2) {
            var y = A * Math.sin(B * (x - C)) + D;
            var pt = this.client.pointToClient(x, y);
            path += " L " + pt.x + " " + pt.y;
        }
        if (this.plot)
            this.plot.remove();
        this.plot = this.paper.path(path).attr({stroke: "#00f", "stroke-width": 3});
    };
    this.plotFnCos = function () {
        var A = this.minMaxSpot.valueY - this.centerSpot.valueY;   // amplitude
        var B = (1.5705) / (this.minMaxSpot.valueX - this.centerSpot.valueX);
        var C = this.centerSpot.valueX;
        var D = this.centerSpot.valueY;

        var initialPoint = this.client.pointToClient(this.settings.grid.minValue, (A * Math.cos(B * (this.settings.grid.minValue - C)) + D));
        var path = "M " + initialPoint.x + " " + initialPoint.y;
        for (var x = this.settings.grid.minValue; x <= this.settings.grid.maxValue; x += this.settings.grid.minorScale / 2) {
            var y = A * Math.cos(B * (x - C)) + D;
            var pt = this.client.pointToClient(x, y);
            path += " L " + pt.x + " " + pt.y;
        }
        if (this.plot)
            this.plot.remove();
        this.plot = this.paper.path(path).attr({ stroke: "#00f", "stroke-width": 3 });
    };
    this.plotFnQuad = function () {
        var A = this.minMaxSpot.valueY - this.centerSpot.valueY;   // amplitude
        var B = (1.5705) / (this.minMaxSpot.valueX - this.centerSpot.valueX);
        var C = this.centerSpot.valueX;
        var D = this.centerSpot.valueY;

        var initialPoint = this.client.pointToClient(this.settings.grid.minValue,   (this.settings.grid.minValue - C) *   (this.settings.grid.minValue - C)  );
        var path = "M " + initialPoint.x + " " + initialPoint.y;
        for (var x = this.settings.grid.minValue; x <= this.settings.grid.maxValue; x += this.settings.grid.minorScale / 2) {
            var y = (x - C) * (x - C);
            var pt = this.client.pointToClient(x, y);
            path += " L " + pt.x + " " + pt.y;
        }
        if (this.plot)
            this.plot.remove();
        this.plot = this.paper.path(path).attr({ stroke: "#00f", "stroke-width": 3 });
    };
    this.plotFnLinear = function () {
        var A = this.minMaxSpot.valueY - this.centerSpot.valueY;   // amplitude
        var B = (1.5705) / (this.minMaxSpot.valueX - this.centerSpot.valueX);
        var M = A / (this.minMaxSpot.valueX - this.centerSpot.valueX);
        var C = this.minMaxSpot.valueY - M * this.minMaxSpot.valueX;
        var D = this.centerSpot.valueY;
        
        var initialPoint = this.client.pointToClient(this.settings.grid.minValue, (M * this.settings.grid.minValue + C));
        var path = "M " + initialPoint.x + " " + initialPoint.y;
        for (var x = this.settings.grid.minValue; x <= this.settings.grid.maxValue; x += this.settings.grid.minorScale / 2) {
            var y = M * x + C;
            var pt = this.client.pointToClient(x, y);
            path += " L " + pt.x + " " + pt.y;
            
        }
        if (this.plot)
            this.plot.remove();
        this.plot = this.paper.path(path).attr({ stroke: "#00f", "stroke-width": 3 });
    };

    this.plotLine = function () {
        var point1 = this.client.pointToClient(this.minMaxSpot.valueX, this.minMaxSpot.valueY);
        var point2 = this.client.pointToClient(this.centerSpot.valueX, this.centerSpot.valueY);

        var path = ["M", point1.x, point1.y, "L", point2.x, point2.y];
        if (this.plot)
            this.plot.remove();
        this.plot = this.paper.path(path).attr({ stroke: "#00f", "stroke-width": 3 });
    };

    // run
    settings = settings || {
        grid: {
            domain: 10,
            majorScale: 1,
            minorScale: 0.5,
            fn: 0,
        },
        centerPoint: { x: 0, y: 0 },
        minMaxPoint: { x: 1, y: 1 }
    };

    this.initialize(container, settings);
};

// Handles the client coordinates
MovePointsInAChartClient = function (parent) {
    // it mainly contains the client related (physical) properties
    this.parent = parent;
    this.container = parent.container;
    this.paper = parent.paper;
    this.padding = 40;
    this.baseline = 0;   // in which y-coord will the mainline be shown
    this.radius = 30;

    this.full = {};
    this.full.left = 0;
    this.full.right = this.container.width();
    this.full.width = this.full.right - this.full.left;
    this.full.top = 0;
    this.full.bottom = this.container.height();
    this.full.height = this.full.bottom - this.full.top;

    this.grid = {};
    this.grid.left = this.padding;
    this.grid.right = this.full.right - this.padding;
    this.grid.width = this.grid.right - this.grid.left;

    this.grid.top = this.padding;
    this.grid.bottom = this.full.bottom - this.padding;
    this.grid.height = this.grid.bottom - this.grid.top;

    this.majorGap = this.grid.width / ((this.parent.settings.grid.maxValue - this.parent.settings.grid.minValue) / this.parent.settings.grid.majorScale);
    this.minorGap = this.grid.width / ((this.parent.settings.grid.maxValue - this.parent.settings.grid.minValue) / this.parent.settings.grid.minorScale);
    this.cartesianToScreenFactorX = this.grid.width / (this.parent.settings.grid.maxValue - this.parent.settings.grid.minValue);
    this.cartesianToScreenFactorY = this.grid.height/ (this.parent.settings.grid.maxValue - this.parent.settings.grid.minValue);

    this.pointToClient = function (x, y) {
        var cx = (this.grid.width / 2) + (x * this.cartesianToScreenFactorX);
        var cy = (this.grid.height / 2) - (y * this.cartesianToScreenFactorY);
        return { x: cx + this.padding, y: cy + this.padding };
    };

    this.clientToPoint = function (x, y) {
        var cx = ((x-this.padding) - (this.grid.width / 2)) / this.cartesianToScreenFactorX;
        var cy = ((this.grid.height / 2) - (y - this.padding)) / this.cartesianToScreenFactorY;
        return { x: cx, y: cy };
    };
};

// MovePointsGrid
MovePointsGrid = function (parent) {
    this.parent = parent;
    
    this.draw = function () {
        var client = this.parent.client;
        var settings = this.parent.settings;
        var paper = this.parent.paper;

        // draw border
        var border = "M " + client.full.left + " " + client.full.top;
        border = border + " L " + client.full.right + " " + client.full.top;
        border = border + " L " + client.full.right + " " + client.full.bottom;
        border = border + " L " + client.full.left + " " + client.full.bottom + " z";
        paper.path(border).attr({"stroke-width": 2});
        var point = client.pointToClient(0, 0);

        // rows & cols
        for (var i = settings.grid.minValue - (2 * settings.grid.majorScale), j = 0; i <= settings.grid.maxValue + (2 * settings.grid.majorScale) ; i += settings.grid.majorScale, j++) {
            var iPoint = client.pointToClient(i, i);

            if (i == 0) {   // Axis
                var row = client.majorGap * j;

                var pathGridRow = "M" + client.full.left + " " + point.y + " H " + (client.full.right);
                paper.path(pathGridRow).attr({ "stroke": "#000", "stroke-width": 2 });

                var col = client.majorGap * j;
                var pathGridCol = "M" + point.x + " " + (client.full.top + client.majorGap) + " V " + (client.full.height - client.majorGap);
                paper.path(pathGridCol).attr({ "stroke": "#000", "stroke-width": 2 });
            } else {
                var row = client.majorGap * j;

                var pathGridRow = "M" + (client.full.left) + " " + iPoint.y + " H " + (client.full.right);
                paper.path(pathGridRow).attr({ "stroke": "#aaa" });

                var col = client.majorGap * j;
                var pathGridCol = "M" + iPoint.x + " " + client.full.top + " V " + (client.full.height);
                paper.path(pathGridCol).attr({ "stroke": "#aaa" });
            }

            // draw arrows
            var arrow = "M" + (point.x - 5) + " " + (client.full.top + client.majorGap) + " H" + (point.x + 10) + " L" + (point.x+2) + " " + (client.full.top + 2) + " z";
            paper.path(arrow).attr({ "fill": "#000" });

            arrow = "M" + (point.x - 5) + " " + (client.full.bottom - client.majorGap) + " H" + (point.x + 10) + " L" + (point.x + 2) + " " + (client.full.bottom - 2) + " z";
            paper.path(arrow).attr({ "fill": "#000" });

            arrow = "M" + (client.full.right - client.majorGap) + " " + (point.y - 5) + " V" + (point.y + 10) + " L" + (client.full.right - 2) + " " + (point.y + 2) + " z";
            paper.path(arrow).attr({ "fill": "#000" });

            arrow = "M" + (client.full.left + client.majorGap) + " " + (point.y - 5) + " V" + (point.y + 10) + " L" + (client.full.left + 2) + " " + (point.y + 2) + " z";
            paper.path(arrow).attr({ "fill": "#000" });

            // draw scale numbers
            if (-i >= settings.grid.minValue && -i <= settings.grid.maxValue) {
                if (i != 0) {
                    var xAxisLabel = paper.text(point.x - 10, row + 2, -i).attr({ "font-size": 12, "font-family": "Arial, Helvetica, sans-serif" });
                    $('tspan', xAxisLabel.node).attr('dy', 0);
                }
                var yAxisLabel = paper.text(col, point.y + 14, i).attr({ "font-size": 12, "font-family": "Arial, Helvetica, sans-serif" });
                $('tspan', yAxisLabel.node).attr('dy', 0);
            }
        }
    };
};

MovePointsInAChartSpot = function (parent, coordinates) {
    this.parent = parent;
    this.client = parent.client;

    this.valueX = coordinates.x;
    this.valueY = coordinates.y;
    var pt = this.client.pointToClient(this.valueX, this.valueY);
    
    this.cx = pt.x;
    this.cy = pt.y;
    this.radius = 30;

    this.draw = function () {
        var client = this.parent.client;
        this.circle = this.createCircle(this.cx, this.cy, this.radius, { "fill": "#00f", stroke: "none", "fill-opacity": 0.2 });
        this.innerCircle = this.createCircle(this.cx, this.cy, this.radius / 4, { "fill": "#00f", "fill-opacity": 1 });
    };

    this.createCircle = function (cx, cy, radius, attrs) {
        var circle = this.parent.paper.circle(cx, cy, radius).attr(attrs);
        circle.parent = this;
        circle.drag(this.dragMove, this.dragStart, this.dragEnd);
        return circle;
    }

    this.setValue = function(x, y) {
        var client = this.parent.client;
        this.valueX = x;
        this.valueY = y;
        var pt = client.pointToClient(x, y);
        this.setCoordinates( pt.x, pt.y);
    };
    
    this.setCoordinates = function (x, y) {
        this.circle.attr({ cx: x, cy: y });
        this.innerCircle.attr({ cx: x, cy: y });
    };

    this.dragStart = function () {
        this.ox = this.attr("cx");
        this.oy = this.attr("cy");
    };

    this.dragMove = function (dx, dy) {
        var client = this.parent.client;

        var minLimitX = client.grid.left;
        var maxLimitX = client.grid.right;
        var minLimitY = client.grid.top;
        var maxLimitY = client.grid.bottom;

        var newcx = this.ox + dx;
        var newcy = this.oy + dy;
        // check upper / lower limit
        newcx = Math.max(newcx, minLimitX);
        newcx = Math.min(newcx, maxLimitX);

        newcy = Math.max(newcy, minLimitY);
        newcy = Math.min(newcy, maxLimitY);

        this.parent.setCoordinates(newcx, newcy);
    };

    this.dragEnd = function () {
        var spot = this.parent;
        var client = spot.parent.client;
        var settings = spot.parent.settings;

        var minimum = 999999999;
        var valueX = 9999999999;

        var currentValue = client.clientToPoint(this.attrs["cx"], this.attrs["cy"]);
        for (var i = settings.grid.minValue; i <= settings.grid.maxValue; i += settings.grid.minorScale) {
            var diff = Math.abs(currentValue.x - i);
            if (diff < minimum) {
                minimum = diff;
                valueX = i;
            }
        }

        minimum = 999999999;
        var valueY = 9999999999;

        for (var i = settings.grid.minValue; i <= settings.grid.maxValue; i += settings.grid.minorScale) {
            var diff = Math.abs(currentValue.y - i);
            if (diff < minimum) {
                minimum = diff;
                valueY = i;
            }
        }

        spot.setValue(valueX, valueY);
        if (settings.grid.chartType == 1) {
            spot.parent.plotFnSin();
        }
        else if (settings.grid.chartType == 2) {
            spot.parent.plotFnCos();
        }
        else if (settings.grid.chartType == 3) {
            if ($('#movePointsInAChart_AnswerType').val() == '1') {
                spot.parent.plotFnLinear();
            } else {
                spot.parent.plotLine();
            }
        }
        else if (settings.grid.chartType == 4) {
            spot.parent.plotFnQuad();
        }
        
    };
};
