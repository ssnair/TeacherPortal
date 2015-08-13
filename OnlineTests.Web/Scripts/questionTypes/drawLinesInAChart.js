$(function () {
    var settings = {
        id: null,
        grid: {
            domain: 10,
            majorScale: 1,
            minorScale: 0.5,
            fn: 'none',
        }
        //centerPoint: { x: 0, y: 0 },
        //minMaxPoint: { x: 1, y: 1 }
    };

    if (typeof globalSettings !== 'undefined') {
        settings = globalSettings;
    }

    var mpic = new DrawLinesInAChart($("#drawLinesInAChartContainer"), settings);
    var mpicPreview = {};

    $("#drawLinesInAChart_ResetGraph").click(function () {
        var domain = $("#drawLinesInAChart_Domain").val(),
            minorScale = $("#drawLinesInAChart_MinorScale").val(),
            majorScale = $("#drawLinesInAChart_MajorScale").val(),
            fn = $("#drawLinesInAChart_Function").val();

        var newSettings = {
            grid: {
                domain: domain,
                minValue: -Number(domain),
                maxValue: Number(domain),
                majorScale: Number(majorScale),
                minorScale: Number(minorScale),
                fn: fn
            }
            //centerPoint: { x: 0, y: 0 },
            //minMaxPoint: { x: 1, y: 1 }
        };
        mpic.initialize(mpic.container, newSettings);
    });

    $("#btnDrawLinesInAChart_Preview").click(function () {
        // read points from mpic

        var previewSettings =  {
            grid: {
                domain: mpic.settings.grid.domain,
                minValue: mpic.settings.grid.minValue,
                maxValue: mpic.settings.grid.maxValue,
                majorScale: mpic.settings.grid.majorScale,
                minorScale: mpic.settings.grid.minorScale,
                fn: mpic.settings.grid.fn
            },
            centerPoint: { x: 0, y: 0 },
            minMaxPoint: { x: 1, y: 1 }
            //tgtCenterSpot: { valueX: mpic.centerSpot.valueX, valueY: mpic.centerSpot.valueY },
            //tgtMinMaxSpot: { valueX: mpic.minMaxSpot.valueX, valueY: mpic.minMaxSpot.valueY },
        };
        var mpPreviewSettings = JSON.parse(JSON.stringify(mpic.settings));
        var editor = hfQBody.value;

        $('#drawLinesInAChart_questionContainer').html(editor);
        $("#drawLinesInAChart_result").html('');

        reloadMathJax('drawLinesInAChart_questionContainer');

        mpicPreview = new DrawLinesInAChart($('#drawLinesInAChart_previewContainer'), previewSettings);
    });

    $("#drawLinesInAChart_submitAnswer").click(function () {
        var result = false;

        // read the lines value and type from the QUESTION
        var axisValue = [];
        $("#drawLinesInAChart_inputsContainer .added .axisValue").each(function (index, elm) {
            axisValue[index] = $(elm).val()
        });

        var axisType = [];
        $("#drawLinesInAChart_inputsContainer .added .axisType").each(function (index, elm) {
            axisType[index] = $(elm).val()
        });

        //create answers array
        var answers = [];
        var i = 0;
        for (i = 0; i < axisValue.length; i++) {
            answers.push({ axisValue: axisValue[i], axisType: axisType[i] });
        }

        // read the lines value and type from the PREVIEW
        var axisValuePreview = [];
        $("#drawLinesInAChartPreview_inputsContainer .added .axisValue").each(function (index, elm) {
            axisValuePreview[index] = $(elm).val()
        });

        var axisTypePreview = [];
        $("#drawLinesInAChartPreview_inputsContainer .added .axisType").each(function (index, elm) {
            axisTypePreview[index] = $(elm).val()
        });

        //create answers array
        var answersPreview = [];
        var i = 0;
        for (i = 0; i < axisValuePreview.length; i++) {
            answersPreview.push({ axisValue: axisValuePreview[i], axisType: axisTypePreview[i] });
        }

        // compare lines from the question window and the preview window
        if (answers.length == answersPreview.length) {
            answers.sortOn("axisValue");
            answersPreview.sortOn("axisValue");
            for (i = 0; i < answers.length; i++) {
                if (answers[i].axisValue == answersPreview[i].axisValue && answers[i].axisType == answersPreview[i].axisType) {
                    result = true;
                }
                else {
                    result = false;
                    break;
                }
            }
        }

        if (result)
            $('#drawLinesInAChart_result').html('<img src="/onlinedw/Content/images/win.png" width="50" height="50"/>')
        else
            $('#drawLinesInAChart_result').html('<img src="/onlinedw/Content/images/lose.png" width="50" height="50"/>')
    });

    $("#drawLinesInAChart_closeModal").on('click', function () {
        $('#drawLinesInAChart_Preview').modal('hide');
    });

    //Add Line definition (line value and line type)
    $("#drawLinesInAChart_btnAddNewLine").on('click', function () {
        var template = $("#drawLinesInAChart_LineTemplate").html();

        var lineValue_id = Math.floor((Math.random() * 999999) + 1);
        template = template.replace("{{lineValue_id}}", lineValue_id);

        var lineType_id = Math.floor((Math.random() * 999999) + 1);
        template = template.replace("{{lineType_id}}", lineType_id);

        var deleteLine_id = Math.floor((Math.random() * 999999) + 1);
        template = template.replace("{{deleteLine_id}}", deleteLine_id);

        // add new template to container
        $("#drawLinesInAChart_inputsContainer").append(template);
    });

    //Remove Line 
    $("body").on("click", ".drawLinesInAChart_deleteColumnValue", function (e) { 
        $(this).parent().parent().parent().remove();
        // remove line from chart
        $("#drawLinesInAChart_btnDrawLines").trigger("click");
        return false;
    });

    // draw lines
    $("#drawLinesInAChart_btnDrawLines").click(function () {
        var axisValue = [];
        var axisType = [];
        var i;

        $("#drawLinesInAChart_inputsContainer .added .axisValue").each(function (index, elm) {
            if ($(elm).val() == '') {
                displayWarning('Line Value is required!');
                return;
            }
            axisValue[index] = $(elm).val()
        });
        $("#drawLinesInAChart_inputsContainer .added .axisType").each(function (index, elm) {
            if ($(elm).val() == '') {
                displayWarning('Line Type is required!');
                return;
            }
            axisType[index] = $(elm).val()
        });
            
        if (axisValue.length == 0) {
            // remove pending line
            mpic.removeLines();
        }
        else {
            // plot the lines
            for (i = 0; i < axisValue.length; i++)
            {
                // TODO: add validation to make sure the points are inside the chart
                if (i == 0) {
                    // clear 'paper' and draw line
                    mpic.plotLine(axisValue[i], axisType[i], true);
                }
                else {
                    // draw line (keep previous lines)
                    mpic.plotLine(axisValue[i], axisType[i], false);
                }
            }
        }
    });

    //Add Line definition to the preview modal window (line value and line type)
    $("#drawLinesInAChartPreview_btnAddNewLine").on('click', function () {
        var template = $("#drawLinesInAChartPreview_LineTemplate").html();

        var lineValue_id = Math.floor((Math.random() * 999999) + 1);
        template = template.replace("{{lineValue_id}}", lineValue_id);

        var lineType_id = Math.floor((Math.random() * 999999) + 1);
        template = template.replace("{{lineType_id}}", lineType_id);

        var deleteLine_id = Math.floor((Math.random() * 999999) + 1);
        template = template.replace("{{deleteLine_id}}", deleteLine_id);

        // add new template to container
        $("#drawLinesInAChartPreview_inputsContainer").append(template);
    });

    // draw lines on the preview modal window
    $("#drawLinesInAChartPreview_btnDrawLines").click(function () {
        var axisValue = [];
        var axisType = [];
        var i;

        $("#drawLinesInAChartPreview_inputsContainer .added .axisValue").each(function (index, elm) {
            axisValue[index] = $(elm).val()
        });
        $("#drawLinesInAChartPreview_inputsContainer .added .axisType").each(function (index, elm) {
            axisType[index] = $(elm).val()
        });

        if (axisValue.length == 0) {
            // remove pending line
            mpicPreview.removeLines();
        }
        else {
            // plot the lines
            for (i = 0; i < axisValue.length; i++) {
                // TODO: add validation to make sure the points are inside the chart
                if (i == 0) {
                    // clear 'paper' and draw line
                    mpicPreview.plotLine(axisValue[i], axisType[i], true);
                }
                else {
                    // draw line (keep previous lines)
                    mpicPreview.plotLine(axisValue[i], axisType[i], false);
                }
            }
        }
    });

    //Remove Line on the Preview windows 
    $("body").on("click", ".drawLinesInAChartPreview_deleteColumnValue", function (e) {
        $(this).parent().parent().parent().remove();
        // remove line from chart
        $("#drawLinesInAChartPreview_btnDrawLines").trigger("click");
        return false;
    });

    $("#bntDrawLinesInAChart_Save").click(function () {
        if (!validateEmptyQuestionText(hfQBody.value))
            return;

        var axisValue = [];
        // read the lines value and type
        $("#drawLinesInAChart_inputsContainer .added .axisValue").each(function (index, elm) {
            axisValue[index] = $(elm).val()
        });

        var axisType = [];
        $("#drawLinesInAChart_inputsContainer .added .axisType").each(function (index, elm) {
            axisType[index] = $(elm).val()
        });

        //create answers array
        var answers = [];
        var i = 0;
        for (i = 0; i < axisValue.length; i++) {
            answers.push({ axisValue: axisValue[i], axisType: axisType[i] });
        }
        if (answers.length == 0) {
            displayWarning('A Line is required!');
            return;
        }

        var request = {
            id: typeof (globalQuestionId) === 'undefined' ? 0 : globalQuestionId,
            subjectId: null,
            gradeLevel: null,
            questionTypeId: 12,
            questionText: specialTrim(hfQBody.value),
            passageId: null,
            complexity: null,
            difficulty: null,
            userId: null,
            minScore: null,
            maxScore: null,
            targ: null,
            courseId: null,
            notes: $("#drawLinesInAChart_Notes").val(),
            statusId: 1,
            approveUser: null,
            domain: mpic.settings.grid.domain,
            majorScale: mpic.settings.grid.majorScale,
            minorScale: mpic.settings.grid.minorScale,
            answers: answers
        };

        $.post(
            "/onlinedw/home/DrawLinesInAChart_Save",
            $.toDictionary(request),
            function (data, textStatus, jqXHR) {
                window.parent.postMessage(data.data + ',12', '*');
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
            'json')
            .fail(function (data, textStatus, jqXHR) {
                BootstrapDialog.show({
                    type: BootstrapDialog.TYPE_DANGER,
                    title: 'Information',
                    message: 'An error has occured trying to save your Question<br>Please try again!',
                    buttons: [{
                        label: 'Ok',
                        action: function (dialogItself) {
                            dialogItself.close();
                        }
                    }]
                });
            });
    });

    // let's create and draw the lines (page edit)...this needs to be after $("#drawLinesInAChart_btnAddNewLine").on('click',)
    createLines();

});

DrawLinesInAChart = function (container, settings) {
    this.initialize = function (container, settings) {
        settings.grid.minValue = -settings.grid.domain;
        settings.grid.maxValue = settings.grid.domain;
        $("#drawLinesInAChart_Domain").val(settings.grid.domain);
        $("#drawLinesInAChart_MinorScale").val(settings.grid.minorScale);
        $("#drawLinesInAChart_MajorScale").val(settings.grid.majorScale);

        this.createPaper(container);
        this.settings = settings;
        this.client = new DrawLinesInAChartClient(this);
        this.grid = new DrawLinesGrid(this);
        //this.centerSpot = new DrawLinesInAChartSpot(this, settings.centerPoint);
        //this.minMaxSpot = new DrawLinesInAChartSpot(this, settings.minMaxPoint); 

        var self = this;
        this.grid.draw();
        //this.centerSpot.draw();
        //this.minMaxSpot.draw();
        if (this.settings.fn != 'none') {
            //this.plotLine();
        }
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

    this.plotLine = function (axisValue, axisType, blnRemoveLines) {
        // draws a line on the chart. current version does horizontal and vertical lines.
        var client = this.client;
        var paper = this.paper;
        var path = '';
        var lineIds;
        var centerPoint = client.pointToClient(0, 0);
        var i;

        if (blnRemoveLines) {
            // remove lines
            this.removeLines();
        }

        if (axisType == 'x') {
            path = "M" + (client.full.left) + " " + Number(centerPoint.x + (client.majorGap * - (axisValue / this.settings.grid.majorScale))) + " H " + (client.full.right);
        }
        else {
            path = "M" + Number(centerPoint.y + (client.majorGap * (axisValue / this.settings.grid.majorScale))) + " " + client.full.top + " V " + (client.full.height);
        }

        this.plot = paper.path(path).attr({ stroke: "#00f", "stroke-width": 3 });
        arrLineIds.push(this.plot.id);
    }

    this.removeLines = function () {
        var paper = this.paper;

        // remove lines
        for (i = 0; i < arrLineIds.length; i++) {
            if (paper.getById(arrLineIds[i]) != null) {
                paper.getById(arrLineIds[i]).remove();
            }
        }
        // reset line array
        arrLineIds.length = 0
    }

    // run
    settings = settings || {
        grid: {
            domain: 10,
            majorScale: 1,
            minorScale: 0.5,
            fn: 'none',
        }
        //centerPoint: { x: 0, y: 0 },
        //minMaxPoint: { x: 1, y: 1 }
    };

    this.initialize(container, settings);

    var arrLineIds = [];
};

// Handles the client coordinates 
DrawLinesInAChartClient = function (parent) {
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

// DrawLinesGrid
DrawLinesGrid = function (parent) {
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
                // zero coordinate (x = 0 and y = 0)...draw the line darker
                //var row = client.majorGap * j;
                var row = iPoint.y;

                var pathGridRow = "M" + client.full.left + " " + point.y + " H " + (client.full.right);
                paper.path(pathGridRow).attr({ "stroke": "#000", "stroke-width": 2 });

                //var col = client.majorGap * j;
                var col = iPoint.x;
                var pathGridCol = "M" + point.x + " " + (client.full.top + client.majorGap) + " V " + (client.full.height - client.majorGap);
                paper.path(pathGridCol).attr({ "stroke": "#000", "stroke-width": 2 });
            } else {
                //var row = client.majorGap * j;
                var row = iPoint.y;

                var pathGridRow = "M" + (client.full.left) + " " + iPoint.y + " H " + (client.full.right);
                paper.path(pathGridRow).attr({ "stroke": "#aaa" });

                //var col = client.majorGap * j;
                var col = iPoint.x;
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
                    // do not draw the number zero (0) for the Ys (only for the Xx)
                    var yAxisLabel = paper.text(point.x - 10, row + 2, i).attr({ "font-size": 12, "font-family": "Arial, Helvetica, sans-serif" });
                    $('tspan', yAxisLabel.node).attr('dy', 0);
                }
                var xAxisLabel = paper.text(col, point.y + 14, i).attr({ "font-size": 12, "font-family": "Arial, Helvetica, sans-serif" });
                $('tspan', xAxisLabel.node).attr('dy', 0);
            }
        }
    };
};

DrawLinesInAChartSpot = function (parent, coordinates) {
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
        spot.parent.plotLine();
    };
};

// creates and draws the lines
function createLines()
{
    if (typeof globalSettings !== 'undefined') {

        if (typeof globalPageType !== 'undefined' && (globalPageType == "Edit" || globalPageType == "View")) {
            // create lines
            for (var i = 0; i < globalSettings.answers.length; i++) {
                $("#drawLinesInAChart_btnAddNewLine").trigger('click');
            }

            // set the lines value and type
            $("#drawLinesInAChart_inputsContainer .added .axisValue").each(function (index, elm) {
                $(elm).val(globalSettings.answers[index].axisValue);
            });

            var axisType = [];
            $("#drawLinesInAChart_inputsContainer .added .axisType").each(function (index, elm) {
                $(elm).val(globalSettings.answers[index].axisType);
            });

            // draw lines
            $("#drawLinesInAChart_btnDrawLines").trigger('click');
        }
    }
}

// sort array of objects by key
Array.prototype.sortOn = function (key) {
    this.sort(function (a, b) {
        if (a[key] < b[key]) {
            return -1;
        } else if (a[key] > b[key]) {
            return 1;
        }
        return 0;
    });
}

