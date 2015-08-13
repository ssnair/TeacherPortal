$(function () {
    var settings = settings || {
        targets: [],
        answers: [],
        containerSettings: []
    };

    var shapeSelected = "circle";
    var selectedOptionContainer = "#MultipleDragAndDropExpresionOptionsA";
    var selectedOptionContainerLabelBorder = true;
    optionContainers = [];

    if (typeof globalSettings !== 'undefined') {
        settings = globalSettings;
        if (typeof settings.containerSettings !== 'undefined') {
            loadContainerSettings(settings.containerSettings)
        }
    }

    if (typeof globalPageType !== 'undefined') {
        globalPageType = "create";
    }

    var multipleDragAndDropExpresion = new MultipleDragAndDropExpresion(globalPageType, settings);
    var multipleDragAndDropExpresionPreview = null;

    $("#multipleDragAndDropExpresion_AddAnswer").click(function () {
        if (!validateEmptyQuestionText(hfOptionEditor.value))
            return;

        var answer = hfOptionEditor.value;

        multipleDragAndDropExpresion.addAnswer(answer);
        //ckEditor462.setData('');

        $("#divOptionEditor").html('<span>Click to edit...</span>');
        $("#divOptionEditor").next().val('<span>Click to edit...</span>');

    });

    $("#multipleDragAndDropExpresion_AddOption").click(function () {
        if (!$("#divShapes input:checked").length > 0)
            return;

        var option = "";

        multipleDragAndDropExpresion.addOption(option, shapeSelected, selectedOptionContainer);

    });

    $("#btnMultipleDragAndDropExpresion_Preview").click(function () {
        var settings = {
            answers: [],
            targets: [],
            expectedAnswers: []
        }

        var targetContainer;
        var addContainerLabel;
        var containerBorder;
        var containerPosition;

        for (var i = 0; i < multipleDragAndDropExpresion.targets.length; i++) {
            targetContainer = "A";
            addContainerLabel = true;
            containerBorder = true;
            containerPosition = "all";

            // let's get the container settings
            if ($("#" + multipleDragAndDropExpresion.targets[i].id + "").parent().parent().attr("id") === "MultipleDragAndDropExpresionOptionsB") {
                targetContainer = "B";
            };
            if ($("#" + multipleDragAndDropExpresion.targets[i].id + "").parent().parent().attr("id") === "MultipleDragAndDropExpresionOptionsC") {
                targetContainer = "C";
            };

            for (var j = 0; j < optionContainers.length; j++) {
                if (targetContainer === optionContainers[j].container) {
                    addContainerLabel = optionContainers[j].containerLabel;
                    containerBorder = optionContainers[j].containerBorder;
                    containerPosition = optionContainers[j].containerPosition;
                    break;
                }
            };

            // create targets (options)
            settings.targets.push({
                text: multipleDragAndDropExpresion.targets[i].text,
                id: multipleDragAndDropExpresion.targets[i].id,
                //answerId: multipleDragAndDropExpresion.targets[i].answerId,
                answerText: multipleDragAndDropExpresion.targets[i].answerText,
                shape: multipleDragAndDropExpresion.targets[i].shape,
                container: targetContainer,
                containerLabel: addContainerLabel,
                containerBorder: containerBorder,
                containerPosition: containerPosition
            });
            settings.expectedAnswers.push({
                optionId: multipleDragAndDropExpresion.targets[i].id,
                answerId: multipleDragAndDropExpresion.targets[i].answerId
            });
        };

        // craete answers
        for (var i = 0; i < multipleDragAndDropExpresion.answers.length; i++) {
            settings.answers.push({
                text: multipleDragAndDropExpresion.answers[i].text,
                id: multipleDragAndDropExpresion.answers[i].id
            });
        };

        multipleDragAndDropExpresionPreview = new MultipleDragAndDropExpresion('preview', settings);

        var editor = hfQBody.value;

        $('#multipleDragAndDropExpresion_questionContainer').html(editor);
        $("#multipleDragAndDropExpresion_result").html('');

    });

    $("#multipleDragAndDropExpresion_submitAnswer").click(function () {
        var result = true;
        for (var i = 0; i < multipleDragAndDropExpresionPreview.targets.length; i++) {
            var option = multipleDragAndDropExpresionPreview.targets[i];
            if (option.shape === "#shapeHrLinePreview" || option.shape === "#shapeSquareNotDropablePreview"
                || option.shape === "#shapeSquareTransparentPreview") {
                // these shapes are an exception since no answer is dropped into them (always have the correct answers).
                result = true;
            }
            else {
                // verify that the dropped answer is correct.
                for (var i = 0; i < multipleDragAndDropExpresionPreview.settings.expectedAnswers.length; i++) {
                    if (multipleDragAndDropExpresionPreview.settings.expectedAnswers[i].optionId == option.id) {
                        result = option.answerId === multipleDragAndDropExpresionPreview.settings.expectedAnswers[i].answerId;
                        break;
                    }
                }
                   if (!result) {
                    break;
                   }       
            }
        }

        if (result)
            $('#multipleDragAndDropExpresion_result').html('<img src="/onlinedw/Content/images/win.png" width="50" height="50"/>')
        else
            $('#multipleDragAndDropExpresion_result').html('<img src="/onlinedw/Content/images/lose.png" width="50" height="50"/>')
    });

    $("#multipleDragAndDropExpresion_closeModal").on('click', function () {
        $('#multipleDragAndDropExpresion_Preview').modal('hide');
        // make the drap and drop work
        multipleDragAndDropExpresion.redraw();
    });

    $("#bntmultipleDragAndDropExpresion_Save").click(function () {
        if (!validateEmptyQuestionText(hfQBody.value))
            return;
        
        var answers = [];
        for (i = 0; i < multipleDragAndDropExpresion.answers.length; i++) {
            answers.push({ id: i + 1, text: multipleDragAndDropExpresion.answers[i].text });
        }

        targets = [];
        //TODO-IL: modify this if more shapes are added
        var targetShape;
        var targetContainer;
        var answerIndex;
        var answerText;
        for (i = 0; i < multipleDragAndDropExpresion.targets.length; i++) {
            if (typeof multipleDragAndDropExpresion.targets[i].answerText === "undefined" || multipleDragAndDropExpresion.targets[i].answerText === "") {
                BootstrapDialog.show({
                    type: BootstrapDialog.TYPE_DANGER,
                    title: 'Information',
                    message: 'An answer shape is empty.<br>Please delete it or add an answer.',
                    buttons: [{
                        label: 'Ok',
                        action: function (dialogItself) {
                            dialogItself.close();
                        }
                    }]
                });
                return;
            }
            answerIndex = -1;
            targetShape = "square";
            targetContainer = "A";
            answerText = "";
            answerId = 0;
            // shapeHrLine is an spececial case. no answer is dropped into it, so the answerId is empty.
            //if ($("#" + multipleDragAndDropExpresion.targets[i].id + "").attr("class").toLowerCase().indexOf("hrline") > 0) {
            if (multipleDragAndDropExpresion.targets[i].shape.toLowerCase().indexOf("hrline") > 0) {
                answerIndex = answers.length + i;
                answerText = "hrLine";
                targetShape = "hrLine";
                // determine the container
                //if ($("#" + multipleDragAndDropExpresion.targets[i].id + "").parent().parent().attr("id") === "MultipleDragAndDropExpresionOptionsB") {
                if (multipleDragAndDropExpresion.targets[i].container.toLowerCase().indexOf("multipledraganddropexpresionoptionsb") > 0) {
                    targetContainer = "B"
                };
                //if ($("#" + multipleDragAndDropExpresion.targets[i].id + "").parent().parent().attr("id") === "MultipleDragAndDropExpresionOptionsC") {
                if (multipleDragAndDropExpresion.targets[i].container.toLowerCase().indexOf("multipledraganddropexpresionoptionsc") > 0) {
                    targetContainer = "C"
                };
            }
            else {
                // regular shapes. the answer is droppped into them, have the answerId set.
                for (var j = 0; j < answers.length; j++) {
                    if (multipleDragAndDropExpresion.answers[j].id === multipleDragAndDropExpresion.targets[i].answerId) {
                        answerIndex = j;
                        // determine the shape type
                        //if ($("#" + multipleDragAndDropExpresion.targets[i].id + "").attr("class").toLowerCase().indexOf("circle") > 0) {
                        if (multipleDragAndDropExpresion.targets[i].shape.toLowerCase().indexOf("circle") > 0) {
                            targetShape = "circle";
                        };
                        //if ($("#" + multipleDragAndDropExpresion.targets[i].id + "").attr("class").toLowerCase().indexOf("squaretransparent") > 0) {
                        if (multipleDragAndDropExpresion.targets[i].shape.toLowerCase().indexOf("squaretransparent") > 0) {
                            targetShape = "squareTransparent";
                        };
                        //if ($("#" + multipleDragAndDropExpresion.targets[i].id + "").attr("class").toLowerCase().indexOf("squarenotdropable") > 0) {
                        if (multipleDragAndDropExpresion.targets[i].shape.toLowerCase().indexOf("squarenotdropable") > 0) {
                            targetShape = "squareNotDropable";
                        };
                        // determine the container
                        //if ($("#" + multipleDragAndDropExpresion.targets[i].id + "").parent().parent().attr("id") === "MultipleDragAndDropExpresionOptionsB") {
                        if (multipleDragAndDropExpresion.targets[i].container.toLowerCase().indexOf("multipledraganddropexpresionoptionsb") > 0) {
                            targetContainer = "B";
                        };
                        //if ($("#" + multipleDragAndDropExpresion.targets[i].id + "").parent().parent().attr("id") === "MultipleDragAndDropExpresionOptionsC") {
                        if (multipleDragAndDropExpresion.targets[i].container.toLowerCase().indexOf("multipledraganddropexpresionoptionsc") > 0) {
                            targetContainer = "C";
                        };
                        answerText = answers[answerIndex].text;
                        answerId = answers[answerIndex].id;
                        break;
                    }
                }
            };

            // get the container settings 
            var addContainerLabel;
            var containerBorder;
            var containerPosition;

            for (var k = 0; k < optionContainers.length; k++) {
                if (targetContainer === optionContainers[k].container) {
                    addContainerLabel = optionContainers[k].containerLabel;
                    containerBorder = optionContainers[k].containerBorder;
                    containerPosition = optionContainers[k].containerPosition;
                    break;
                }
            };

            targets.push({
                id: i + 1, text: answerIndex == -1 ? '' : answerText, answerId: answerIndex == -1 ? 0 : answerId,
                answerText: answerIndex == -1 ? '' : answerText, container: targetContainer, shape: targetShape,
                containerLabel: addContainerLabel, containerBorder: containerBorder, containerPosition: containerPosition
            });
        }

        var request = {
            id: typeof (globalQuestionId) === 'undefined' ? 0 : globalQuestionId,
            subjectId: null,
            gradeLevel: null,
            questionTypeId: 46,   // Multiple drag and drop Expression
            questionText: specialTrim(hfQBody.value),
            passageId: null,
            complexity: null,
            difficulty: null,
            userId: null,
            minScore: null,
            maxScore: null,
            targ: null,
            courseId: null,
            notes: $("#commentsQuestionMDDE").val(),
            statusId: 1,
            approveUser: null,
            answers: answers,
            targets: targets
        };

        $.post(
            "/OnlineDW/home/MultipleDragAndDropExpression_Save",
            $.toDictionary(request),
            function (data, textStatus, jqXHR) {
                window.parent.postMessage(data.data + ',46', '*');
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

    // set the option containers Label
    $("#optionContainerLabel").on('change', function () {
        setOptionContainerSettings('edit', true);
    });

    // set the option containers Border
    $("#optionContainerBorder").on('change', function () {
        setOptionContainerSettings('edit', true);
    });

    // set the option containers Position
    $("#optionContainerPosition").on('change', function () {
        setOptionContainerSettings('edit', true);
    });

    // set selectedOptionContainer and selectedOptionContainerLabelBorder
    $("#answerContainer input").change(function () {
        // handle selectedOptionContainerLabelBorder
        if (this.id === "optionContainerLabel" || this.id === "optionContainerBorder") {
            selectedOptionContainerLabelBorder = false;
            if (this.checked) {
                selectedOptionContainerLabelBorder = true;
            }
            // reset the checked flag
            $("#" + this.id).prop('checked', selectedOptionContainerLabelBorder);
        }

        // handle selectedOptionContainer
        if (this.id === "optionContainerA" || this.id === "optionContainerB"
                || this.id === "optionContainerC") {
            if (this.checked) {
                switch (this.id) {
                    case "optionContainerA":
                        selectedOptionContainer = "#MultipleDragAndDropExpresionOptionsA"; break;
                    case "optionContainerB":
                        selectedOptionContainer = "#MultipleDragAndDropExpresionOptionsB"; break;
                    case "optionContainerC":
                        selectedOptionContainer = "#MultipleDragAndDropExpresionOptionsC"; break;
                }
                // reset the checked flag for optionContainers (only one can be selected) 
                //$("#answerContainer input").prop('checked', false);
                $("#optionContainerA").prop('checked', false);
                $("#optionContainerB").prop('checked', false);
                $("#optionContainerC").prop('checked', false);
                $("#" + this.id).prop('checked', true);
            }
            else if (!$("#optionContainerA").checked && !$("#optionContainerB").checked && !$("#optionContainerC").checked) {
                BootstrapDialog.show({
                    type: BootstrapDialog.TYPE_DANGER,
                    title: 'Information',
                    message: 'Container is required.',
                    buttons: [{
                        label: 'Ok',
                        action: function (dialogItself) {
                            dialogItself.close();
                        }
                    }]
                });
                $("#" + this.id).prop('checked', true);
            }
        }
        setOptionContainerSettings('edit', true);
    });

    // set shapeSelected
    $("#divShapes input").change(function () {
        if (this.checked) {
            switch (this.name) {
                case "cbShapeCircle":
                    shapeSelected = "#shapeCircle"; break;
                case "cbShapeSquare":
                    shapeSelected = "#shapeSquare"; break;
                case "cbShapeSquareTransparente":
                    shapeSelected = "#shapeSquareTransparent"; break;
                case "cbShapeHrLine":
                    shapeSelected = "#shapeHrLine"; break;
                case "cbShapeSquareNotDropable":
                    shapeSelected = "#shapeSquareNotDropable"; break;
            }
            // reset the checked flag (only one can be selected)
            $("#divShapes input").prop('checked', false);
            $($("[name='" + this.name + "']")).prop('checked', true);
        }
    });

    // allow the Answers to be re-ordered
    var optionContainerId = "";
    var optionContainerFirstId = 0;
    //var originalId = 0;
    $(".optionContainerSortable").sortable({
        connectWith: ".optionContainerSortable",
        stop: function (event, ui) {
            // get parent container and id of first element on that container
            optionContainerId = "#" + this.id;
            for (var i = 0; i < multipleDragAndDropExpresion.targets.length; i++) {
                if (multipleDragAndDropExpresion.targets[i].container === optionContainerId) {
                    optionContainerFirstId = multipleDragAndDropExpresion.targets[i].id;
                    break;
                }
            }

            // change id of the targets to match new positions after the user changed the order of the target containers
            $(optionContainerId + " .optionShapeSortable").each(function (index) {
                for (var i = 0; i < multipleDragAndDropExpresion.targets.length; i++) {
                    if (multipleDragAndDropExpresion.targets[i].oid === parseInt(this.id)) {
                        //originalId = multipleDragAndDropExpresion.targets[i].oid;
                        multipleDragAndDropExpresion.targets[i].id = optionContainerFirstId + index;
                        //multipleDragAndDropExpresion.targets[i].shape = multipleDragAndDropExpresion.targets[originalId].shape;
                        break;
                    }
                }
            });

            // sort multipleDragAndDropExpresion.targets by new ids
            multipleDragAndDropExpresion.targets.sort(function (a, b) {
                var a1 = a.id, b1 = b.id;
                if (a1 == b1) return 0;
                return a1 > b1 ? 1 : -1;
            });

            // update settings.targets array id with sorted multipleDragAndDropExpresion array id (correct order)
            for (var i = 0; i < multipleDragAndDropExpresion.targets.length; i++) {
                for (var j = 0; j < settings.targets.length; j++) {
                    if (multipleDragAndDropExpresion.targets[i].oid === settings.targets[j].oid) {
                        settings.targets[j].id = multipleDragAndDropExpresion.targets[i].id;
                        //settings.targets[j].shape = multipleDragAndDropExpresion.targets[i].shape;
                        break;
                    }
                }
            }

            // sort settings.targets by new ids
            settings.targets.sort(function (a, b) {
                var a1 = a.id, b1 = b.id;
                if (a1 == b1) return 0;
                return a1 > b1 ? 1 : -1;
            });

        }
    }).disableSelection();

});

MultipleDragAndDropExpresion = function (mode, settings) {
    settings = settings || {
        targets: [],
        answers: []
    };

    this.mode = mode;

    this.settings = JSON.parse(JSON.stringify(settings));

    this.targets = [];
    this.answers = [];

    var selectedOptionsContainers = "";

    for (var i = 0; i < settings.targets.length; i++) {
        var shape = getShape(settings.targets[i].shape, mode);
        var container = getContainer(settings.targets[i].container, mode);
        switch (settings.targets[i].container) {
            case "A": case "B": case "C":
                if (selectedOptionsContainers.indexOf("A") < 0) {
                    selectedOptionsContainers += "A";
                }
                if (selectedOptionsContainers.indexOf("B") < 0) {
                    selectedOptionsContainers += "B";
                }
                if (selectedOptionsContainers.indexOf("C") < 0) {
                    selectedOptionsContainers += "C";
                }
        };

        var option = new MultipleDragAndDropExpresionOption(this, settings.targets[i].text, shape, container);
        option.id = settings.targets[i].id;
        settings.targets[i].oid = option.id;
        option.oid = option.id;
        option.answerId = settings.targets[i].answerId;
        option.answerText = settings.targets[i].answerText;
        if (shape === "#shapeHrLine") {
            // special case where the answer is not dropped on to the target.
            option.answerText = "shapeHrLine";
        }
        else {
            option.answerText = settings.targets[i].answerText;
        }
        option.shape = shape;
        option.container = container;

        this.targets.push(option);
    }

    for (var i = 0; i < settings.answers.length; i++) {
        var answer = new MultipleDragAndDropExpresionAnswer(this, settings.answers[i].text);
        answer.id = settings.answers[i].id;
        this.answers.push(answer);
    }

    if (mode.toLowerCase() === 'edit' || mode.toLowerCase() === 'create') {
        this.answersContainer = $("#MultipleDragAndDropExpresionAnswers");
        this.optionsContainerA = $("#MultipleDragAndDropExpresionOptionsA");
        this.optionsContainerB = $("#MultipleDragAndDropExpresionOptionsB");
        this.optionsContainerC = $("#MultipleDragAndDropExpresionOptionsC");
    } else if (mode.toLowerCase() === 'preview') {
        this.answersContainer = $("#MultipleDragAndDropExpresionPreviewAnswers");
        this.optionsContainerA = $("#MultipleDragAndDropExpresionOptionsPreviewA");
        this.optionsContainerB = $("#MultipleDragAndDropExpresionOptionsPreviewB");
        this.optionsContainerC = $("#MultipleDragAndDropExpresionOptionsPreviewC");
    }

    // set the option containers settings
    setOptionContainerSettings(mode, false);

    this.addAnswer = function (answer) {
        var newAnswer = new MultipleDragAndDropExpresionAnswer(this, answer);
        this.answers.push(newAnswer);
        this.redraw();
    };

    this.addOption = function (option, shape, optionContainer) {
        var newOption = new MultipleDragAndDropExpresionOption(this, option, shape, optionContainer);
        this.targets.push(newOption);
        this.redraw();
    };

    this.deleteOption = function (id) {
        for (var i = 0; i < this.targets.length; i++) {
            if (this.targets[i].id === id) {
                this.targets.splice(i, 1);
                //this.redraw("targets");
                this.redraw();
                break;
            };
        }
    };

    this.deleteAnswer = function (id) {
        for (var i = 0; i < this.answers.length; i++) {
            if (this.answers[i].id === id) {
                this.answers.splice(i, 1);
                this.redraw();
                break;
            };
        }
        // if the answer was used in an option, delete it
        for (var i = 0; i < this.targets.length; i++) {
            if (this.targets[i].answerId === id) {
                this.targets[i].parent.deleteOption(parseInt(this.targets[i].id));
                this.redraw();
                break;
            };
        }
    };

    this.redraw = function () {
        this.clearContainer();

        for (var i = 0; i < this.targets.length; i++) {
            this.targets[i].draw();
        }

        for (var i = 0; i < this.answers.length; i++) {
            this.answers[i].draw();
        }

        reloadAllMathJax();
        this.addLabelOptionContainer();
    };

    this.clearContainer = function () {
        this.optionsContainerA.html("");
        this.optionsContainerB.html("");
        this.optionsContainerC.html("");
        this.answersContainer.html("");
    };

    this.addLabelOptionContainer = function () {
        if (mode.toLowerCase() === 'edit' ||  mode.toLowerCase() === 'create') {
            this.optionsContainerA.prepend("<span style='font-weight:bold'>A.</span><br>");
            this.optionsContainerB.prepend("<span style='font-weight:bold'>B.</span><br>");
            this.optionsContainerC.prepend("<span style='font-weight:bold'>C.</span><br>");
        }
    };

    this.redraw();

};

var MultipleDragAndDropExpresionOption = function (parent, option, shape, selectedContainer) {
    this.parent = parent;
    this.id = Math.floor((Math.random() * 999999) + 1);
    this.oid = this.id;
    this.text = option;
    this.shape = getShape(shape, parent.mode);
    this.container = selectedContainer;
    if (shape === "#shapeHrLine") {
        // special case where the answer is not dropped on to the target.
        this.answerText = "shapeHrLine";
    }

    this.draw = function () {
        var self = this;
        var template = $(shape).html();
        template = template.replace("{{option}}", this.text);
        switch (shape) {
            case "#shapeCircle": // edit mode shapes ++++++++++++++++++++++
                template = template.replace("{{idc}}", this.id); break;
            case "#shapeSquare":
                template = template.replace("{{ids}}", this.id); break;
            case "#shapeSquareTransparent":
                template = template.replace("{{idst}}", this.id); break;
            case "#shapeHrLine":
                template = template.replace("{{idshrl}}", this.id); break;
            case "#shapeSquareNotDropable":
                template = template.replace("{{idsnd}}", this.id); break;
            case "#shapeCirclePreview": // preview mode shapes ++++++++++++++
                template = template.replace("{{idcp}}", this.id); break;
            case "#shapeSquarePreview":
                template = template.replace("{{idsp}}", this.id); break;
            case "#shapeSquareTransparentPreview":
                template = template.replace("{{idstp}}", this.id); break;
            case "#shapeHrLinePreview":
                template = template.replace("{{idshrlp}}", this.id); break;
            case "#shapeSquareNotDropablePreview":
                template = template.replace("{{idsndp}}", this.id); break;
        }
        // this is needed three times to replace the id on all elements
        template = template.replace("{{id}}", this.id);
        template = template.replace("{{id}}", this.id);
        template = template.replace("{{id}}", this.id);
        var divId = (this.parent.mode.toLowerCase() === "edit" || this.parent.mode.toLowerCase() === "create") ? this.id : 100 + this.id;
        template = template.replace("{{div_id}}", 'do' + divId);
        // IL - fix bug when adding an option erases the contents of the answers.
        if (this.parent.mode.toLowerCase() === "edit" || this.parent.mode.toLowerCase() === "create") {
            // add the answer text in Edit mode.
            template = template.replace("id=\"" + this.id + "\">", "id=\"" + this.id + "\">" + this.text);
        }
        else {
            // leave the answer text blank in preview mode, except for the shapes that don't allow drop.
            switch (shape) {
                case "#shapeSquareTransparentPreview": case "#shapeSquareNotDropablePreview":
                    template = template.replace("id=\"" + this.id + "\">", "id=\"" + this.id + "\">" + this.text); break;
            }
        }

        switch (selectedContainer) {
            case "#MultipleDragAndDropExpresionOptionsA": case  "#MultipleDragAndDropExpresionOptionsPreviewA":
                this.parent.optionsContainerA.html(this.parent.optionsContainerA.html() + template); break;
            case "#MultipleDragAndDropExpresionOptionsB": case "#MultipleDragAndDropExpresionOptionsPreviewB":
                this.parent.optionsContainerB.html(this.parent.optionsContainerB.html() + template); break;
            case "#MultipleDragAndDropExpresionOptionsC": case "#MultipleDragAndDropExpresionOptionsPreviewC":
                this.parent.optionsContainerC.html(this.parent.optionsContainerC.html() + template); break;
        }

        $(".multipleDragAndDropExpresion_DeleteTarget").click(function (event) {
            var id = $(this).attr('data-val');
            self.parent.deleteOption(parseInt(id));
        });

        $(selectedContainer + " .qeditor-answer" + " input").css('display', 'none');
        $(selectedContainer + " .qeditor-answer" + " a").css('visibility', 'visible');
        $(selectedContainer + " .qeditor-answer").show();
    };
};

var MultipleDragAndDropExpresionAnswer = function (parent, answer) {
    this.parent = parent;
    this.id = Math.floor((Math.random() * 999999) + 1);
    this.text = answer;

    this.draw = function () {
        var self = this;
        var template = (this.parent.mode.toLowerCase() === 'edit' || this.parent.mode.toLowerCase() === 'create') ? $("#shapeSquare_AnswerTemplate").html() : $("#shapeSquare_PreviewAnswerTemplate").html();
        template = template.replace("{{answer}}", this.text);
        // this is needed twice to replace the id on the first and second elements
        template = template.replace("{{id}}", this.id);
        template = template.replace("{{id}}", this.id);

        this.parent.answersContainer.html(this.parent.answersContainer.html() + template);

        $(".multipleDragAndDropExpresion_DeleteShapeSquare").click(function () {
            var id = $(this).attr('data-val');
            self.parent.deleteAnswer(parseInt(id));
        });

        var appendTo = (this.parent.mode.toLowerCase() === 'edit' || this.parent.mode.toLowerCase() === 'create') ? "body" : "#multipleDragAndDropExpresion_Preview";
        $(".draggable-answer").draggable({
            appendTo: appendTo,
            helper: "clone",
        });

        $(".droppable-option").droppable({
            accept: ".draggable-answer",
            activeClass: "ui-state-hover",
            hoverClass: "ui-state-active",
            drop: function (event, ui) {
                var srcId = Number(ui.draggable[0].attributes["data-val"].nodeValue);
                var tgtId = Number(event.target.attributes["data-val"].nodeValue);
                var tgtDivId = event.target.attributes["id"].nodeValue;

                var src = null;
                for (var i = 0; i < self.parent.answers.length; i++) {
                    if (self.parent.answers[i].id === srcId) {
                        src = self.parent.answers[i];
                        break;
                    }
                }

                var tgt = null;
                for (var i = 0; i < self.parent.targets.length; i++) {
                    if (self.parent.targets[i].id === tgtId) {
                        tgt = self.parent.targets[i];
                        break;
                    }
                }

                tgt.answerId = srcId;
                tgt.answerText = src.text;
                tgt.text = src.text;
                $(event.target).html(src.text);
            }
        });

        if (parent.mode.toLowerCase === 'edit' || parent.mode.toLowerCase === 'create') {
            $("#MultipleDragAndDropExpresionAnswers " + ".qeditor-answer" + " input").css('display', 'none');
            $("#MultipleDragAndDropExpresionAnswers " + ".qeditor-answer" + " a").css('visibility', 'visible');
            $("#MultipleDragAndDropExpresionAnswers " + ".qeditor-answer").show();
        }
        else if (parent.mode.toLowerCase === 'preview') {
            $("#MultipleDragAndDropExpresionPreviewAnswers " + ".qeditor-answer").show();
        }
    };
};

function setOptionContainerSettings(mode, userAction) {
    var selectedContainer = "#MultipleDragAndDropExpresionOptionsA";
    var selectedContainerLabel = "A";
    var addLabel = false;
    var addBorder = false;
    var borderPosition = "all";
    var borderStyle = { "border": "0" };

    if (mode.toLowerCase() === 'edit' || mode.toLowerCase() === 'create') {
        if (!userAction && typeof optionContainers !== 'undefined' && optionContainers.length > 0) {
            // load saved container settings (page load)
            $("#optionContainerA").prop('checked', false);
            for (var i = 0; i < optionContainers.length; i++) {
                // get selectedContainer and selectedContainerLabel
                switch (optionContainers[i].container) {
                    case "A":
                        selectedContainer = "#optionContainerA"; break;
                    case "B":
                        selectedContainer = "#optionContainerB"; break;
                    case "C":
                        selectedContainer = "#optionContainerC"; break;
                }
                if (i === optionContainers.length - 1) {
                    // only one optionContainer can be selected (the last one)
                    $(selectedContainer).prop('checked', true);
                }
                $("#optionContainerLabel").prop('checked', optionContainers[i].containerLabel);
                $("#optionContainerBorder").prop('checked', optionContainers[i].containerBorder);
                $("#optionContainerPosition option[value=" + optionContainers[i].containerPosition + "]").attr('selected', 'selected');
            }
        }
        else {
            // the user selected a container or a container option (label, border, etc.)
            $("#answerContainer input").each(function (index) {
                if (this.checked) {
                    // get selectedContainer, addLabel and addBorder
                    switch (this.id) {
                        case "optionContainerA":
                            selectedContainer = "#MultipleDragAndDropExpresionOptionsA"; selectedContainerLabel = "A"; break;
                        case "optionContainerB":
                            selectedContainer = "#MultipleDragAndDropExpresionOptionsB"; selectedContainerLabel = "B"; break;
                        case "optionContainerC":
                            selectedContainer = "#MultipleDragAndDropExpresionOptionsC"; selectedContainerLabel = "C"; break;
                        case "optionContainerLabel":
                            addLabel = true; break;
                        case "optionContainerBorder":
                            addBorder = true; break;
                    }
                }
            });

            // borderStyle
            if (addBorder) {
                borderPosition = $("#optionContainerPosition option:selected").val();
                switch (borderPosition) {
                    case "all":
                        borderStyle = { "border-color": "grey", "border-style": "dotted", "border-width": "thin" }; break;
                    case "top":
                        borderStyle = { "border-top-color": "grey", "border-top-style": "dotted", "border-top-width": "thin" }; break;
                    case "right":
                        borderStyle = { "border-right-color": "grey", "border-right-style": "dotted", "border-right-width": "thin" }; break;
                    case "bottom":
                        borderStyle = { "border-bottom-color": "grey", "border-bottom-style": "dotted", "border-bottom-width": "thin" }; break;
                    case "left":
                        borderStyle = { "border-left-color": "grey", "border-left-style": "dotted", "border-left-width": "thin" }; break;
                }
            }

            //// add label
            //if (addLabel) {
            //    $(selectedContainer).prepend("<span style='font-weight:bold'>" + selectedContainerLabel + "</span>");
            //}
            //else {
            //    $(selectedContainer).children("span").remove()
            //}

            // add border
            $(selectedContainer).css(borderStyle);

            // save settings
            // remove container if it exists on the array
            for (var i = 0; i < optionContainers.length; i++) {
                if (selectedContainerLabel === optionContainers[i].container) {
                    optionContainers = $.grep(optionContainers, function (item, index) {
                        return item != optionContainers[i];
                    });
                }
                //alert("Updated Array = " + optionContainers); //Display updated Array
            }

            // add container settings
            optionContainers.push({ container: selectedContainerLabel, containerLabel: addLabel, containerBorder: addBorder, containerPosition: borderPosition });
        }
    }
    else if (mode.toLowerCase() === 'preview') {
        for (var i = 0; i < optionContainers.length; i++) {
            // get selectedContainer and selectedContainerLabel
            switch (optionContainers[i].container) {
                case "A":
                    selectedContainer = "#MultipleDragAndDropExpresionOptionsPreviewA"; break;
                case "B":
                    selectedContainer = "#MultipleDragAndDropExpresionOptionsPreviewB"; break;
                case "C":
                    selectedContainer = "#MultipleDragAndDropExpresionOptionsPreviewC"; break;
            }

            // get borderStyle
            switch (optionContainers[i].containerPosition) {
                case "all":
                    borderStyle = {"border-color": "black", "border-style": "solid", "border-width": "thin" }; break;
                case "top":
                    borderStyle = {"border-top-color": "black", "border-top-style": "solid", "border-top-width": "thin" }; break;
                case "right":
                    borderStyle = { "border-right-color": "black", "border-right-style": "solid", "border-right-width": "thin" }; break;
                case "bottom":
                    borderStyle = { "border-bottom-color": "black", "border-bottom-style": "solid", "border-bottom-width": "thin" }; break;
                case "left":
                    borderStyle = { "border-left-color": "black", "border-left-style": "solid", "border-left-width": "thin" }; break;
                default:
                    borderStyle = {"border": "none" }; break;
            }

            if (optionContainers[i].containerBorder) {
                // add border
                $(selectedContainer).css(borderStyle);
            }

            $(selectedContainer).removeClass("hidden");
        };
    }  // end  else if (mode.toLowerCase() === 'preview')
}

function getShape(shape, mode) {
    var shape;
    if (mode.toLowerCase() === 'edit' || mode.toLowerCase() === 'create') {
        switch (shape) {
            case "circle": case "#shapeCircle":
                shape = "#shapeCircle"; break;
            case "squareTransparent": case "#shapeSquareTransparent":
                shape = "#shapeSquareTransparent"; break;
            case "hrLine": case  "#shapeHrLine":
                shape = "#shapeHrLine"; break;
            case "squareNotDropable": case "#shapeSquareNotDropable":
                shape = "#shapeSquareNotDropable"; break;
            default:
                shape = "#shapeSquare"; break;
        }
    }
    else if (mode.toLowerCase() === 'preview') {
        switch (shape) {
            case "circle": case "#shapeCircle":  case "#shapeCirclePreview":
                shape = "#shapeCirclePreview"; break;
            case "squareTransparent": case "#shapeSquareTransparent":  case "#shapeSquareTransparentPreview":
                shape = "#shapeSquareTransparentPreview"; break;
            case "hrLine": case "#shapeHrLine": case "#shapeHrLinePreview":
                shape = "#shapeHrLinePreview"; break;
            case "squareNotDropable": case "#shapeSquareNotDropable": case "#shapeSquareNotDropablePreview":
                shape = "#shapeSquareNotDropablePreview"; break;
            default:
                shape = "#shapeSquarePreview"; break;
        }
    }

    return shape;
}

function getContainer(container, mode) {
    var container;
    if (mode.toLowerCase() === 'edit' || mode.toLowerCase() === 'create') {
        switch (container) {
            case "B": case "#MultipleDragAndDropExpresionOptionsB": case "#MultipleDragAndDropExpresionOptionsPreviewB":
                container = "#MultipleDragAndDropExpresionOptionsB"; break;
            case "C": case "#MultipleDragAndDropExpresionOptionsC": case "#MultipleDragAndDropExpresionOptionsPreviewC":
                container = "#MultipleDragAndDropExpresionOptionsC"; break;
            default:
                container = "#MultipleDragAndDropExpresionOptionsA"; break;
        }
    }
    else if (mode.toLowerCase() === 'preview') {
        switch (container) {
            case "B": case "#MultipleDragAndDropExpresionOptionsB": case "#MultipleDragAndDropExpresionOptionsPreviewB":
                container = "#MultipleDragAndDropExpresionOptionsPreviewB"; break;
            case "C": case "#MultipleDragAndDropExpresionOptionsC": case "#MultipleDragAndDropExpresionOptionsPreviewc":
                container = "#MultipleDragAndDropExpresionOptionsPreviewC"; break;
            default:
                container = "#MultipleDragAndDropExpresionOptionsPreviewA"; break;
        }
    }

    return container;
}

function loadContainerSettings(containerSettings) {
    for (var i = 0; i < containerSettings.length; i++) {
        optionContainers.push({
            container: containerSettings[i].container,
            containerLabel: containerSettings[i].containerLabel,
            containerBorder: containerSettings[i].containerBorder,
            containerPosition: containerSettings[i].containerPosition
        });
        //optionContainers[i].container = containerSettings[i].container,
        //optionContainers[i].containerLabel = containerSettings[i].containerLabel,
        //optionContainers[i].containerBorder = containerSettings[i].containerBorder,
        //optionContainers[i].containerPosition = containerSettings[i].containerPosition
    }
}